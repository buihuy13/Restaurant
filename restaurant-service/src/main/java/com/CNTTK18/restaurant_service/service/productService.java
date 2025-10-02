package com.CNTTK18.restaurant_service.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

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

import jakarta.transaction.Transactional;

import com.CNTTK18.restaurant_service.dto.product.request.updateProduct;
import com.CNTTK18.restaurant_service.dto.product.response.productResponse;

@Service
public class productService {
    private productRepository productRepo;
    private cateRepository cateRepository;
    private resRepository resRepository;
    private sizeRepository sizeRepository;
    private ImageHandleService imageFileService;
    private reviewRepository reviewRepository;

    public productService(productRepository productRepo, cateRepository cateRepository, 
                            resRepository resRepository, sizeRepository sizeRepository, ImageHandleService imageFileService,
                            reviewRepository reviewRepository) {
        this.productRepo = productRepo;
        this.cateRepository = cateRepository;
        this.resRepository = resRepository;
        this.sizeRepository = sizeRepository;
        this.imageFileService = imageFileService;
        this.reviewRepository = reviewRepository;
    }

    public List<productResponse> getAllProducts(String rating, String category, BigDecimal minPrice, 
                                BigDecimal maxPrice, String order, String locations, String search, Integer nearby) {
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
        if (locations != null) {
            
        }
        return products.stream().map(productUtil::mapProductToProductResponse).toList();
    }

    public productResponse getProductById(String id) {
        products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return productUtil.mapProductToProductResponse(product);
    }

    @Transactional
    public products createProduct(productRequest productRequest, MultipartFile imageFile) {
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

        if (imageFile != null) {
            Map<String, String> image = imageFileService.saveImageFile(imageFile);
            product.setImageURL(image.get("url"));
            product.setPublicID(image.get("public_id"));
        }

        return productRepo.save(product);
    }

    @Transactional
    public products updateProduct(updateProduct updateProduct, String id, MultipartFile imageFile) {
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

        if (imageFile != null) {
            String oldPublicId = product.getPublicID();
            Map<String, String> image = imageFileService.saveImageFile(imageFile);
            product.setImageURL(image.get("url"));
            product.setPublicID(image.get("public_id"));

            if (oldPublicId != null && !oldPublicId.isEmpty()) {
                imageFileService.deleteImage(oldPublicId);
            }
        }
        return productRepo.save(product);
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
}
