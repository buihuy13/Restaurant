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
import com.CNTTK18.Common.Util.SlugGenerator;
import com.CNTTK18.restaurant_service.data.ReviewType;
import com.CNTTK18.restaurant_service.dto.product.request.ProductRequest;
import com.CNTTK18.restaurant_service.dto.product.request.SizePrice;
import com.CNTTK18.restaurant_service.model.ProductSize;
import com.CNTTK18.restaurant_service.model.Categories;
import com.CNTTK18.restaurant_service.model.Products;
import com.CNTTK18.restaurant_service.model.Restaurants;
import com.CNTTK18.restaurant_service.model.Reviews;
import com.CNTTK18.restaurant_service.model.Size;
import com.CNTTK18.restaurant_service.repository.CateRepository;
import com.CNTTK18.restaurant_service.repository.ProductRepository;
import com.CNTTK18.restaurant_service.repository.ResRepository;
import com.CNTTK18.restaurant_service.repository.ReviewRepository;
import com.CNTTK18.restaurant_service.repository.SizeRepository;
import com.CNTTK18.restaurant_service.util.ProductUtil;
import com.CNTTK18.restaurant_service.util.ResUtil;

import jakarta.transaction.Transactional;
import reactor.core.publisher.Mono;

import com.CNTTK18.restaurant_service.dto.product.request.UpdateProduct;
import com.CNTTK18.restaurant_service.dto.product.response.ProductResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.request.Coordinates;
import com.CNTTK18.restaurant_service.dto.restaurant.response.ResResponse;
import com.CNTTK18.restaurant_service.exception.ForbiddenException;

@Service
public class ProductService {
    private ProductRepository productRepo;
    private CateRepository cateRepository;
    private ResRepository resRepository;
    private SizeRepository sizeRepository;
    private ImageHandleService imageFileService;
    private ReviewRepository reviewRepository;
    private DistanceService distanceService;

    public ProductService(ProductRepository productRepo, CateRepository cateRepository, 
                            ResRepository resRepository, SizeRepository sizeRepository, ImageHandleService imageFileService,
                            ReviewRepository reviewRepository, DistanceService distanceService) {
        this.productRepo = productRepo;
        this.cateRepository = cateRepository;
        this.resRepository = resRepository;
        this.sizeRepository = sizeRepository;
        this.imageFileService = imageFileService;
        this.reviewRepository = reviewRepository;
        this.distanceService = distanceService;
    }

    public Mono<List<ProductResponse>> getAllProducts(String rating, String category, BigDecimal minPrice, 
                                BigDecimal maxPrice, String order, String locationsorted, String search, 
                                Integer nearby, Coordinates location) {
        List<Products> products = productRepo.findAll();
        if (search != null && !search.isEmpty()) {
            products = products.stream().filter(p -> p.getProductName().toLowerCase().contains(search.toLowerCase())).toList();
        }
        if (category != null && !category.isEmpty()) {
            List<String> categoryNames = Arrays.asList(category.split(",")).stream().map(c -> c.toLowerCase()).toList();
            products = products.stream().filter(p -> categoryNames.contains(p.getCategory().getCateName().toLowerCase())).toList();
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
                products = products.stream().sorted(Comparator.comparing(com.CNTTK18.restaurant_service.model.Products::getRating)).toList();
            } 
            else if (rating.equals("desc")) {
                products = products.stream().sorted(Comparator.comparing(com.CNTTK18.restaurant_service.model.Products::getRating).reversed())
                                            .toList();
            }
        }
        if (order != null) {
            if (order.equals("asc")) {
                products = products.stream().sorted(Comparator.comparing(com.CNTTK18.restaurant_service.model.Products::getVolume)).toList();
            }
            else if (order.equals("desc")) {
                products = products.stream().sorted(Comparator.comparing(com.CNTTK18.restaurant_service.model.Products::getVolume).reversed())
                                            .toList();
            }
        }
        if (location == null) {
            return Mono.just(products.stream().map(ProductUtil::mapProductToProductResponseWitoutResParam).toList());
        }

        List<Restaurants> res = products.stream().map(r -> r.getRestaurant()).distinct().toList();
        
        // Lấy các res trong bán kính nearby (theo đường chim bay)
        res = res.stream().filter(
            r -> {
                Double distance = distanceService.calculateHaversineDistance(location.getLongitude(), location.getLatitude(),
                                                                            r.getLongitude(), r.getLatitude());
                if (nearby == null || nearby > 20000) {
                    return distance <= 20000;
                }                                         
                return distance <= nearby;
            }
        ).toList();

        if (res.isEmpty()) {
            return Mono.just(Collections.emptyList());
        }
        final List<Restaurants> filteredRes = res;

        List<Double> startingPoints = List.of(location.getLongitude(), location.getLatitude());
        List<List<Double>> endPoints = res.stream().map(r -> List.of(r.getLongitude(), r.getLatitude())).toList();
        final List<Products> filteredProducts = products;

        return distanceService.getDistanceAndDurationInList(startingPoints, endPoints)
                    .map(response -> {
                        List<Double> durations = response.getDurations().get(0);
                        List<Double> distances = response.getDistances().get(0);

                        Map<String,ResResponse> listResResponse =  IntStream.range(0, filteredRes.size()).mapToObj(i -> {
                            Restaurants resIndex = filteredRes.get(i);

                            ResResponse resResponseIndex = ResUtil.mapResToResResponse(resIndex);
                            resResponseIndex.setDuration(durations.get(i));
                            resResponseIndex.setDistance(distances.get(i));
                            return resResponseIndex;
                        }).collect(Collectors.toMap(ResResponse::getId, Function.identity()));

                        List<ProductResponse> productResponses = filteredProducts.stream()
                                                                .map(p -> ProductUtil.mapProductToProductResponse(p, listResResponse.get(p.getRestaurant().getId()))) 
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

    public ProductResponse getProductById(String id) {
        Products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return ProductUtil.mapProductToProductResponseWitoutResParam(product);
    }

    public ProductResponse getProductBySlug(String slug) {
        Products product = productRepo.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return ProductUtil.mapProductToProductResponseWitoutResParam(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest productRequest, MultipartFile imageFile) {
        Categories cate = cateRepository.findById(productRequest.getCategoryId())
                                    .orElseThrow(() -> new ResourceNotFoundException("category not found"));

        Restaurants res = resRepository.findById(productRequest.getRestaurantId())
                                    .orElseThrow(() -> new ResourceNotFoundException("restaurant not found"));

        Products product = Products.builder()
                                .id(RandomIdGenerator.generate(254))
                                .productName(productRequest.getProductName())
                                .description(productRequest.getDescription())
                                .category(cate)
                                .restaurant(res)
                                .available(productRequest.isAvailable())
                                .volume(0)
                                .totalReview(0)
                                .rating(0)
                                .slug(SlugGenerator.generate(productRequest.getProductName()))
                                .build();
        //Check cate
        if (!res.getCategories().contains(cate)) {
            res.addCate(cate);
            resRepository.save(res);
        }
            
        if (productRequest.getSizeIds() != null) {
            for (SizePrice psDto : productRequest.getSizeIds()) {

                Size size = sizeRepository.findById(psDto.getSizeId())
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
        return ProductUtil.mapProductToProductResponseWitoutResParam(product);
    }

    @Transactional
    public ProductResponse updateProduct(UpdateProduct updateProduct, String id, MultipartFile imageFile, String userId) {
        Products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Categories cate = cateRepository.findById(updateProduct.getCategoryId())
                                    .orElseThrow(() -> new ResourceNotFoundException("category not found"));

        Restaurants res = resRepository.findById(product.getRestaurant().getId())
                                    .orElseThrow(() -> new ResourceNotFoundException("restaurant not found"));
        
        if (userId == null || !userId.equals(res.getMerchantId())) {
            throw new ForbiddenException("You do not have permission to update this product.");
        }
        Categories oldCategory = product.getCategory();
        boolean categoryChanged = !oldCategory.getId().equals(cate.getId());

        if (categoryChanged) {
            Long count = productRepo.countProductWithCateIdWithInRes(product.getCategory().getId(), product.getRestaurant().getId());
            if (count == 1) {
                res.removeCate(product.getCategory());
            }
        }

        if (!product.getProductName().equals(updateProduct.getProductName())) {
            product.setProductName(updateProduct.getProductName());
            product.setSlug(updateProduct.getProductName());
        }
        
        product.setCategory(cate);
        product.setDescription(updateProduct.getDescription());

        if (!res.getCategories().contains(cate)) {
            res.addCate(cate);
        }

        resRepository.save(res);

        if (updateProduct.getSizeIds() != null) {

            product.clearAllProductSizes();            
            for (SizePrice psDto : updateProduct.getSizeIds()) {

                Size size = sizeRepository.findById(psDto.getSizeId())
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
        return ProductUtil.mapProductToProductResponseWitoutResParam(product);
    }

    @Transactional
    public void deleteProduct(String id, String userId) {
        Products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (userId == null || !userId.equals(product.getRestaurant().getMerchantId())) {
            throw new ForbiddenException("You do not have permission to update this product.");
        }
        List<Reviews> rv = reviewRepository.findByReviewId(id).stream()
                                .filter(r -> r.getReviewType().equals(ReviewType.PRODUCT.toString())).toList();
        if (product.getPublicID() != null && !product.getPublicID().isEmpty()) {
            imageFileService.deleteImage(product.getPublicID());
        }
        Long count = productRepo.countProductWithCateIdWithInRes(product.getCategory().getId(), product.getRestaurant().getId());
        if (count == 1) {
            Restaurants res = product.getRestaurant();
            Categories cate = product.getCategory();
            res.removeCate(cate);
            resRepository.save(res);
        }
        reviewRepository.deleteAll(rv);
        productRepo.delete(product);
    }

    @Transactional
    public void changeProductAvailability(String id, String userId) {
        Products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (userId == null || !userId.equals(product.getRestaurant().getMerchantId())) {
            throw new ForbiddenException("You do not have permission to update this product.");
        }
        product.setAvailable(!product.isAvailable());
        productRepo.save(product);
    }

    @Transactional
    public int increaseProductVolume(String id) {
        Products product = productRepo.findProductById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        int newVolume = product.getVolume() + 1;
        product.setVolume(newVolume);
        productRepo.save(product);
        return newVolume;
    }

    public void deleteImage(String productId, String userId) {
        Products product = productRepo.findById(productId)
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (userId == null || !userId.equals(product.getRestaurant().getMerchantId())) {
            throw new ForbiddenException("You do not have permission to update this product.");
        }
        imageFileService.deleteImage(product.getPublicID());
        product.setImageURL(null);
        product.setPublicID(null);
    }

    public Set<ProductSize> getAllProductSizeOfProduct(String id) {
        Products product = productRepo.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return product.getProductSizes();
    }

    public List<ProductResponse> getAllProductsByRestaurantId(String id) {
        Restaurants res = resRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cannot find restaurant"));

        Optional<List<Products>> products = productRepo.findProductsByRestaurant(res);

        if (!products.isPresent()) {
            return new ArrayList<>();
        }
        return products.get().stream().map(ProductUtil::mapProductToProductResponseWitoutResParam).toList();
    }

    public Restaurants getRestaurantByProductId(String id) {
        Products product = productRepo.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
                        
        return product.getRestaurant();
    }
}
