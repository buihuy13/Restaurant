package com.CNTTK18.restaurant_service.service;

import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.restaurant_service.dto.productSize.request.ProductSizeCreate;
import com.CNTTK18.restaurant_service.dto.productSize.request.productSizeRequest;
import com.CNTTK18.restaurant_service.model.ProductSize;
import com.CNTTK18.restaurant_service.model.products;
import com.CNTTK18.restaurant_service.model.size;
import com.CNTTK18.restaurant_service.repository.ProductSizeRepository;
import com.CNTTK18.restaurant_service.repository.productRepository;
import com.CNTTK18.restaurant_service.repository.sizeRepository;

@Service
public class productSizeService {
    private final ProductSizeRepository productSizeRepository;
    private final productRepository productRepository;
    private final sizeRepository sizeRepository;

    public productSizeService(ProductSizeRepository productSizeRepository, productRepository productRepository, 
                                sizeRepository sizeRepository) {
        this.productSizeRepository = productSizeRepository;
        this.productRepository = productRepository;
        this.sizeRepository = sizeRepository;
    }

    public ProductSize getProductSizeById(String id) {
        return productSizeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cannot find product details"));
    }

    public ProductSize updateProductSize(String id, productSizeRequest request) {
        ProductSize ps = productSizeRepository.findById(id)
                                    .orElseThrow(() -> new ResourceNotFoundException("Cannot find product details"));

        ps.setPrice(request.getPrice());
        return productSizeRepository.save(ps); 
    }

    public ProductSize createProductSize(ProductSizeCreate productSize) {
        size size = sizeRepository.findById(productSize.getSizeId())
                                    .orElseThrow(() -> new ResourceNotFoundException("Cannot find size"));

        products product = productRepository.findById(productSize.getProductId())
                                                .orElseThrow(() -> new ResourceNotFoundException("Cannot find product"));

        return productSizeRepository.save(new ProductSize(RandomIdGenerator.generate(254), product, size, productSize.getPrice()));
    }

    public void deleteProductSize(String id) {
        ProductSize ps = productSizeRepository.findById(id)
                                    .orElseThrow(() -> new ResourceNotFoundException("Cannot find product details"));

        productSizeRepository.delete(ps);
    }
}
