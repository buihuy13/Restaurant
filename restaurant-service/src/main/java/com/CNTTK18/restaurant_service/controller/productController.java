package com.CNTTK18.restaurant_service.controller;

import com.CNTTK18.restaurant_service.dto.product.request.productRequest;
import com.CNTTK18.restaurant_service.dto.product.request.updateProduct;
import com.CNTTK18.restaurant_service.dto.product.response.productResponse;
import com.CNTTK18.restaurant_service.dto.response.MessageResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.request.Coordinates;
import com.CNTTK18.restaurant_service.model.ProductSize;
import com.CNTTK18.restaurant_service.model.restaurants;
import com.CNTTK18.restaurant_service.service.productService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/products")
public class productController {
    private productService productService;

    public productController(productService productService) {
        this.productService = productService;
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all products")
    @GetMapping("")
    public Mono<ResponseEntity<List<productResponse>>> getAllProducts(
            @RequestParam(required = false) String rating,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String order,
            @RequestParam(required = false) String locationsorted,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer nearby,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        Coordinates location = null;
        if (lon != null && lat != null) {
            location = new Coordinates(lon, lat);
        }
        return productService
                .getAllProducts(
                        rating,
                        category,
                        minPrice,
                        maxPrice,
                        order,
                        locationsorted,
                        search,
                        nearby,
                        location)
                .map(productList -> ResponseEntity.ok(productList));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get product by ID")
    @GetMapping("/{id}")
    public ResponseEntity<productResponse> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @Tag(name = "Post")
    @Operation(summary = "Create new product")
    @PostMapping("")
    public ResponseEntity<productResponse> createProduct(
            @RequestPart(value = "product", required = true) @Valid productRequest productRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return new ResponseEntity<>(
                productService.createProduct(productRequest, imageFile),
                HttpStatusCode.valueOf(201));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update a product")
    @PutMapping("/{id}")
    public ResponseEntity<productResponse> updateProduct(
            @RequestPart(value = "product", required = true) @Valid updateProduct updateProduct,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            @PathVariable String id) {
        return ResponseEntity.ok(productService.updateProduct(updateProduct, id, imageFile));
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete a product")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update a product volume")
    @PutMapping("/volume/{id}")
    public ResponseEntity<Integer> updateVolumeproduct(@PathVariable String id) {
        return ResponseEntity.ok(productService.increaseProductVolume(id));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update a product available status")
    @PutMapping("/availability/{id}")
    public ResponseEntity<MessageResponse> updateProductAvailability(@PathVariable String id) {
        productService.changeProductAvailability(id);
        return ResponseEntity.ok(new MessageResponse("Update availability successfully"));
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete product image")
    @DeleteMapping("/image/{id}")
    public ResponseEntity<MessageResponse> deleteProductImage(@PathVariable String id) {
        productService.deleteImage(id);
        return ResponseEntity.ok(new MessageResponse("Delete image successfully"));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all product sizes of a product")
    @GetMapping("/productsize/{id}")
    public ResponseEntity<Set<ProductSize>> getProductSizesOfAProduct(@PathVariable String id) {
        return ResponseEntity.ok(productService.getAllProductSizeOfProduct(id));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all product by restaurant id")
    @GetMapping("/restaurant/{id}")
    public ResponseEntity<List<productResponse>> getProductsByRestaurantId(
            @PathVariable String id) {
        return ResponseEntity.ok(productService.getAllProductsByRestaurantId(id));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get restaurant by product id")
    @GetMapping("/res/{id}")
    public ResponseEntity<restaurants> getRestaurantByProductId(@PathVariable String id) {
        return ResponseEntity.ok(productService.getRestaurantByProductId(id));
    }
}
