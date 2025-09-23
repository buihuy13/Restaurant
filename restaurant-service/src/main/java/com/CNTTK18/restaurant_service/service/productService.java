package com.CNTTK18.restaurant_service.service;

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

    public List<productResponse> getAllProducts() {
        return productRepo.findAll().stream().map(productUtil::mapProductToProductResponse).toList();
    }

    public productResponse getProductById(String id) {
        products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return productUtil.mapProductToProductResponse(product);
    }

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

    public products updateProduct(updateProduct updateProduct, String id, MultipartFile imageFile) {
        products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        categories cate = cateRepository.findById(updateProduct.getCategoryId())
                                    .orElseThrow(() -> new ResourceNotFoundException("category not found"));

        product.setProductName(updateProduct.getProductName());
        product.setCategory(cate);
        product.setDescription(updateProduct.getDescription());

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

        imageFileService.deleteImage(product.getPublicID());
        if (imageFile != null) {
            Map<String, String> image = imageFileService.saveImageFile(imageFile);
            product.setImageURL(image.get("url"));
            product.setPublicID(image.get("public_id"));
        }
        return productRepo.save(product);
    }

    public void deleteProduct(String id) {
        products product = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        List<reviews> rv = reviewRepository.findByReviewId(id).stream()
                                .filter(r -> r.getReviewType().equals(reviewType.PRODUCT.toString())).toList();
        imageFileService.deleteImage(product.getPublicID());
        reviewRepository.deleteAll(rv);
        productRepo.delete(product);
    }
}
