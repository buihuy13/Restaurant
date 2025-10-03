package com.CNTTK18.restaurant_service.controller;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CNTTK18.restaurant_service.dto.productSize.request.ProductSizeCreate;
import com.CNTTK18.restaurant_service.dto.productSize.request.productSizeRequest;
import com.CNTTK18.restaurant_service.dto.response.MessageResponse;
import com.CNTTK18.restaurant_service.model.ProductSize;
import com.CNTTK18.restaurant_service.service.productSizeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/productsize")
public class ProductSizeController {
    private productSizeService productSizeService;

    public ProductSizeController(productSizeService productSizeService) {
        this.productSizeService = productSizeService;
    }

    @Tag(name = "Get")
    @Operation(summary = "Get product size by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProductSize> getProductSizeById(@PathVariable String id) {
        return ResponseEntity.ok(productSizeService.getProductSizeById(id));
    }

    @Tag(name = "Post")
    @Operation(summary = "Create new product size")
    @PostMapping("")
    public ResponseEntity<ProductSize> createProductSize(@RequestBody @Valid ProductSizeCreate productSizeCreate) {
        return new ResponseEntity<>(productSizeService.createProductSize(productSizeCreate), HttpStatusCode.valueOf(201));
    }

    @Tag(name = "Put") 
    @Operation(summary = "Update a product size")
    @PutMapping("/{id}")
    public ResponseEntity<ProductSize> updateProductSize(@RequestBody @Valid productSizeRequest productSizeRequest, 
                                                    @PathVariable String id) {
        return ResponseEntity.ok(productSizeService.updateProductSize(id, productSizeRequest));
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete a product size")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteProductSize(@PathVariable String id) {
        productSizeService.deleteProductSize(id);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }
}
