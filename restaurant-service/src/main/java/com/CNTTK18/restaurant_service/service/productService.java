package com.CNTTK18.restaurant_service.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.restaurant_service.data.reviewType;
import com.CNTTK18.restaurant_service.dto.product.request.productRequest;
import com.CNTTK18.restaurant_service.dto.product.request.sizePrice;
import com.CNTTK18.restaurant_service.model.ProductSize;
import com.CNTTK18.restaurant_service.model.categories;
import com.CNTTK18.restaurant_service.model.products;
import com.CNTTK18.restaurant_service.model.restaurants;
import com.CNTTK18.restaurant_service.model.reviews;
import com.CNTTK18.restaurant_service.model.size;
import com.CNTTK18.restaurant_service.repository.cateRepository;
import com.CNTTK18.restaurant_service.repository.productRepository;
import com.CNTTK18.restaurant_service.repository.resRepository;
import com.CNTTK18.restaurant_service.repository.reviewRepository;
import com.CNTTK18.restaurant_service.repository.sizeRepository;
import com.CNTTK18.restaurant_service.util.productUtil;
import com.CNTTK18.restaurant_service.util.resUtil;

import jakarta.transaction.Transactional;
import reactor.core.publisher.Mono;

import com.CNTTK18.restaurant_service.dto.product.request.updateProduct;
import com.CNTTK18.restaurant_service.dto.product.response.productResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.request.Coordinates;
import com.CNTTK18.restaurant_service.dto.restaurant.response.resResponse;

@Service
public class productService {
    private productRepository productRepo;
    private cateRepository cateRepository;
    private resRepository resRepository;
    private sizeRepository sizeRepository;
    private ImageHandleService imageFileService;
    private reviewRepository reviewRepository;
    private DistanceService distanceService;

    public productService(productRepository productRepo, cateRepository cateRepository, 
                            resRepository resRepository, sizeRepository sizeRepository, ImageHandleService imageFileService,
                            reviewRepository reviewRepository, DistanceService distanceService) {
        this.productRepo = productRepo;
        this.cateRepository = cateRepository;
        this.resRepository = resRepository;
        this.sizeRepository = sizeRepository;
        this.imageFileService = imageFileService;
        this.reviewRepository = reviewRepository;
        this.distanceService = distanceService;
    }

    public Mono<List<productResponse>> getAllProducts(String rating, String category, BigDecimal minPrice, 
                                BigDecimal maxPrice, String order, String locationsorted, String search, 
                                Integer nearby, Coordinates location) {
        List<products> products = productRepo.findAll();
        if (search != null && !search.isEmpty()) {
            products = products.stream().filter(p -> p.getProductName().toLowerCase().contains(search.toLowerCase())).toList();
        }
        List<String> categoryNames = Arrays.asList(category.split(","));
        if (category != null) {
            products = products.stream().filter(p -> categoryNames.contains(p.getCategory().getCateName())).toList();
        }

        if (minPrice != null) {
            products = products.stream().filter(p -> p.getProductSizes().stream()
                                            .anyMatch(ps -> ps.getPrice().compareTo(minPrice) >= 0)).toList();
        }

        if (maxPrice != null) {
            products = products.stream().filter(p -> p.getProductSizes().stream()
                                            .anyMatch(ps -> ps.getPrice().compareTo(maxPrice) <= 0)).toList();
        }
        if (rating != null) {
            if (rating.equals("asc")) {
                products = products.stream().sorted(Comparator.comparing(com.CNTTK18.restaurant_service.model.products::getRating)).toList();
            } 
            else if (rating.equals("desc")) {
                products = products.stream().sorted(Comparator.comparing(com.CNTTK18.restaurant_service.model.products::getRating).reversed())
                                            .toList();
            }
        }
        if (order != null) {
            if (order.equals("asc")) {
                products = products.stream().sorted(Comparator.comparing(com.CNTTK18.restaurant_service.model.products::getVolume)).toList();
            }
            else if (order.equals("desc")) {
                products = products.stream().sorted(Comparator.comparing(com.CNTTK18.restaurant_service.model.products::getVolume).reversed())
                                            .toList();
            }
        }

        List<restaurants> res = products.stream().map(r -> r.getRestaurant()).distinct().toList();

        // Lấy các res trong bán kính nearby (theo đường chim bay)
        if (nearby != null) {
            res = res.stream().filter(
                r -> {
                    Double distance = distanceService.calculateHaversineDistance(location.getLongitude(), location.getLatitude(),
                                                                                r.getLongitude(), r.getLatitude());
                                                                        
                    return distance <= nearby;
                }
            ).toList();
        }

        if (res.isEmpty()) {
            return Mono.just(Collections.emptyList());
        }
        final List<restaurants> filteredRes = res;

        List<Double> startingPoints = List.of(location.getLongitude(), location.getLatitude());
        List<List<Double>> endPoints = res.stream().map(r -> List.of(r.getLongitude(), r.getLatitude())).toList();
        final List<products> filteredProducts = products;

        return distanceService.getDistanceAndDurationInList(startingPoints, endPoints)
                    .map(response -> {
                        List<Double> durations = response.getDurations().get(0);
                        List<Double> distances = response.getDistances().get(0);

                        Map<String,resResponse> listResResponse =  IntStream.range(0, filteredRes.size()).mapToObj(i -> {
                            restaurants resIndex = filteredRes.get(i);

                            resResponse resResponseIndex = resUtil.mapResToResResponse(resIndex);
                            resResponseIndex.setDuration(durations.get(i));
                            resResponseIndex.setDistance(distances.get(i));
                            return resResponseIndex;
                        }).collect(Collectors.toMap(resResponse::getId, Function.identity()));

                        List<productResponse> productResponses = filteredProducts.stream()
                                                                .map(p -> productUtil.mapProductToProductResponse(p, listResResponse.get(p.getRestaurant().getId()))) 
                                                                .toList();
                        if (locationsorted != null) {
                            if (locationsorted.equals("asc")) {
                                productResponses = productResponses.stream()
                                                    .sorted((p1, p2) -> Double.compare(p1.getRestaurant().getDistance(), p2.getRestaurant().getDistance()))
                                                    .toList();
                            }
                            else if (locationsorted.equals("desc")) {
                                productResponses = productResponses.stream()
                                                    .sorted((p1, p2) -> Double.compare(p2.getRestaurant().getDistance(), p1.getRestaurant().getDistance()))
                                                    .toList();
                            }
                        }
                        return productResponses;
                    });
    }

    public productResponse getProductById(String id) {
        products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productUtil.mapProductToProductResponseWitoutResParam(product);
    }

    @Transactional
    public productResponse createProduct(productRequest productRequest, MultipartFile imageFile) {
        categories cate = cateRepository.findById(productRequest.getCategoryId())
                                    .orElseThrow(() -> new ResourceNotFoundException("category not found"));

        restaurants res = resRepository.findById(productRequest.getRestaurantId())
                                    .orElseThrow(() -> new ResourceNotFoundException("restaurant not found"));

        products product = products.builder()
                                .id(RandomIdGenerator.generate(254))
                                .productName(productRequest.getProductName())
                                .description(productRequest.getDescription())
                                .category(cate)
                                .restaurant(res)
                                .available(productRequest.isAvailable())
                                .volume(0)
                                .totalReview(0)
                                .rating(0)
                                .build();
        //Check cate
        if (!res.getCategories().contains(cate)) {
            res.addCate(cate);
            resRepository.save(res);
        }
            
        if (productRequest.getSizeIds() != null) {
            for (sizePrice psDto : productRequest.getSizeIds()) {

                size size = sizeRepository.findById(psDto.getSizeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Size not found: " + psDto.getSizeId()));
                
                ProductSize productSize = ProductSize.builder()
                    .id(RandomIdGenerator.generate(254))
                    .size(size)
                    .price(psDto.getPrice())
                    .build();
                
                product.addProductSize(productSize);
            }
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            Map<String, String> image = imageFileService.saveImageFile(imageFile);
            product.setImageURL(image.get("url"));
            product.setPublicID(image.get("public_id"));
        }

        productRepo.save(product);
        return productUtil.mapProductToProductResponseWitoutResParam(product);
    }

    @Transactional
    public productResponse updateProduct(updateProduct updateProduct, String id, MultipartFile imageFile) {
        products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        categories cate = cateRepository.findById(updateProduct.getCategoryId())
                                    .orElseThrow(() -> new ResourceNotFoundException("category not found"));

        restaurants res = resRepository.findById(product.getRestaurant().getId())
                                    .orElseThrow(() -> new ResourceNotFoundException("restaurant not found"));
        
        categories oldCategory = product.getCategory();
        boolean categoryChanged = !oldCategory.getId().equals(cate.getId());

        if (categoryChanged) {
            Long count = productRepo.countProductWithCateIdWithInRes(product.getCategory().getId(), product.getRestaurant().getId());
            if (count == 1) {
                res.removeCate(product.getCategory());
            }
        }

        product.setProductName(updateProduct.getProductName());
        product.setCategory(cate);
        product.setDescription(updateProduct.getDescription());

        if (!res.getCategories().contains(cate)) {
            res.addCate(cate);
        }

        resRepository.save(res);

        if (updateProduct.getSizeIds() != null) {

            product.clearAllProductSizes();            
            for (sizePrice psDto : updateProduct.getSizeIds()) {

                size size = sizeRepository.findById(psDto.getSizeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Size not found: " + psDto.getSizeId()));
                
                // Tạo ProductSize entity
                ProductSize productSize = ProductSize.builder()
                    .id(RandomIdGenerator.generate(254))
                    .size(size)
                    .price(psDto.getPrice())
                    .build();
                
                product.addProductSize(productSize);
            }
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            String oldPublicId = product.getPublicID();
            Map<String, String> image = imageFileService.saveImageFile(imageFile);
            product.setImageURL(image.get("url"));
            product.setPublicID(image.get("public_id"));

            if (oldPublicId != null && !oldPublicId.isEmpty()) {
                imageFileService.deleteImage(oldPublicId);
            }
        }
        productRepo.save(product);
        return productUtil.mapProductToProductResponseWitoutResParam(product);
    }

    @Transactional
    public void deleteProduct(String id) {
        products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        List<reviews> rv = reviewRepository.findByReviewId(id).stream()
                                .filter(r -> r.getReviewType().equals(reviewType.PRODUCT.toString())).toList();
        if (product.getPublicID() != null && !product.getPublicID().isEmpty()) {
            imageFileService.deleteImage(product.getPublicID());
        }
        Long count = productRepo.countProductWithCateIdWithInRes(product.getCategory().getId(), product.getRestaurant().getId());
        if (count == 1) {
            restaurants res = product.getRestaurant();
            categories cate = product.getCategory();
            res.removeCate(cate);
            resRepository.save(res);
        }
        reviewRepository.deleteAll(rv);
        productRepo.delete(product);
    }

    @Transactional
    public void changeProductAvailability(String id) {
        products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setAvailable(!product.isAvailable());
        productRepo.save(product);
    }

    @Transactional
    public int increaseProductVolume(String id) {
        products product = productRepo.findProductById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        int newVolume = product.getVolume() + 1;
        product.setVolume(newVolume);
        productRepo.save(product);
        return newVolume;
    }

    public void deleteImage(String productId) {
        products product = productRepo.findById(productId)
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        imageFileService.deleteImage(product.getPublicID());
        product.setImageURL(null);
        product.setPublicID(null);
    }

    public Set<ProductSize> getAllProductSizeOfProduct(String id) {
        products product = productRepo.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return product.getProductSizes();
    }

    public List<productResponse> getAllProductsByRestaurantId(String id) {
        restaurants res = resRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cannot find restaurant"));

        Optional<List<products>> products = productRepo.findProductsByRestaurant(res);

        if (!products.isPresent()) {
            return new ArrayList<>();
        }
        return products.get().stream().map(productUtil::mapProductToProductResponseWitoutResParam).toList();
    }
}
