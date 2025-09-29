package com.CNTTK18.restaurant_service.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.CNTTK18.restaurant_service.dto.response.MessageResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.request.resRequest;
import com.CNTTK18.restaurant_service.dto.restaurant.request.updateRes;
import com.CNTTK18.restaurant_service.model.restaurants;
import com.CNTTK18.restaurant_service.service.resService;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/restaurant")
public class resController {
    private resService resService;

    public resController(resService resService) {
        this.resService = resService;
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all restaurants")
    @GetMapping()
    public ResponseEntity<List<restaurants>> getAllRestaurants() {
        return ResponseEntity.ok(resService.getAllRestaurants());
    }

    @Tag(name = "Get")
    @Operation(summary = "Get restaurant by ID")
    @GetMapping("/{id}")
    public ResponseEntity<restaurants> getRestaurantById(@PathVariable String id) {
        return ResponseEntity.ok(resService.getRestaurantById(id));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update restaurant")
    @PutMapping("/{id}")
    public ResponseEntity<restaurants> updateRestaurant(@PathVariable String id, 
                    @RequestPart(value = "restaurant", required = true) @Valid updateRes updateRes,
                    @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return ResponseEntity.ok(resService.updateRestaurant(id, updateRes, imageFile));
    }

    @Tag(name = "Post")
    @Operation(summary = "Create new restaurant")
    @PostMapping()
    @CircuitBreaker(name = "create", fallbackMethod = "fallbackMethod")
    @TimeLimiter(name = "create")
    @Retry(name = "create")
    public CompletableFuture<ResponseEntity<restaurants>> createRestaurant(@RequestPart(value = "restaurant", required = true) @Valid resRequest resRequest,
                    @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return CompletableFuture.supplyAsync(() -> ResponseEntity.ok(resService.createRestaurant(resRequest, imageFile)));
    }

    public CompletableFuture<String> fallbackMethod(resRequest resRequest, 
        MultipartFile imageFile, Throwable ex)
    {
        System.out.println("Lỗi khi gọi createRestaurant, kích hoạt fallback. Lỗi: " + ex.getMessage());
        return CompletableFuture.supplyAsync(() -> "Oops! Something went wrong, please wait for 5 more minutes~");
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete a restaurant")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteRes(@PathVariable String id) {
        resService.deleteRestaurant(id);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }

    //method này của role admin
    @Tag(name = "Put")
    @Operation(summary = "Update restaurant enabled status")
    @PutMapping("/enable/{id}")
    public ResponseEntity<MessageResponse> updateRestaurantEnable(@PathVariable String id) {
        resService.changeResStatus(id);
        return ResponseEntity.ok(new MessageResponse("Update status successfully"));
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete restaurant image")
    @DeleteMapping("/image/{id}")
    public ResponseEntity<MessageResponse> deleteResImage(@PathVariable String id) {
        resService.deleteImage(id);
        return ResponseEntity.ok(new MessageResponse("Delete image successfully"));
    }
}
