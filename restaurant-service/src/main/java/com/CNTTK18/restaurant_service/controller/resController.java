package com.CNTTK18.restaurant_service.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

import com.CNTTK18.restaurant_service.dto.response.MessageResponse;
import com.CNTTK18.restaurant_service.dto.restaurant.request.Coordinates;
import com.CNTTK18.restaurant_service.dto.restaurant.request.resRequest;
import com.CNTTK18.restaurant_service.dto.restaurant.request.updateRes;
import com.CNTTK18.restaurant_service.dto.restaurant.response.resResponseWithProduct;
import com.CNTTK18.restaurant_service.model.restaurants;
import com.CNTTK18.restaurant_service.service.resService;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/restaurant")
public class resController {
    private resService resService;
    private static final Logger log = org.slf4j.LoggerFactory.getLogger(resController.class);

    public resController(resService resService) {
        this.resService = resService;
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all restaurants")
    @GetMapping()
    public Mono<ResponseEntity<List<resResponseWithProduct>>> getAllRestaurants(@RequestParam(required = false) Double lat,
                                                               @RequestParam(required = false) Double lon,
                                                               @RequestParam(required = false) String search, 
                                                               @RequestParam(required = false) Integer nearby,
                                                               @RequestParam(required = false) String rating,
                                                               @RequestParam(required = false) String category) {

        Coordinates location = null;
        if (lon != null && lat != null) {
            location = new Coordinates(lon, lat);
        }
        return resService.getAllRestaurants(location, search, nearby, rating, category).map(
            resList -> ResponseEntity.ok(resList)
        );
    }

    @Tag(name = "Get")
    @Operation(summary = "Get restaurant by ID")
    @GetMapping("/admin/{id}")
    public Mono<ResponseEntity<resResponseWithProduct>> getRestaurantById(@PathVariable String id,
                                                        @RequestParam(required = false) Double lat,
                                                        @RequestParam(required = false) Double lon) {
        Coordinates location = null;
        if (lon != null && lat != null) {
            location = new Coordinates(lon, lat);
        }
        return resService.getRestaurantById(id,location).map(
            res -> ResponseEntity.ok(res)
        );
    }

    @Tag(name = "Get")
    @Operation(summary = "Get restaurant by Slug")
    @GetMapping("/{slug}")
    public ResponseEntity<resResponseWithProduct> getRestaurantBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(resService.getRestaurantBySlug(slug));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get restaurants by merchant id")
    @GetMapping("/merchant/{id}")
    public ResponseEntity<List<resResponseWithProduct>> getRestaurantByMerchantId(@PathVariable String id) {
        return ResponseEntity.ok(resService.getRestaurantsByMerchantId(id));
    }

    @Tag(name = "Put")
    @Operation(summary = "Update restaurant")
    @PutMapping("/{id}")
    public ResponseEntity<resResponseWithProduct> updateRestaurant(@PathVariable String id, 
                    @RequestPart(value = "restaurant", required = true) @Valid updateRes updateRes,
                    @RequestPart(value = "image", required = false) MultipartFile imageFile,
                    @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(resService.updateRestaurant(id, updateRes, imageFile, userId));
    }

    @Tag(name = "Post")
    @Operation(summary = "Create new restaurant")
    @PostMapping()
    @CircuitBreaker(name = "create", fallbackMethod = "fallbackMethod")
    @TimeLimiter(name = "create")
    @Retry(name = "create")
    public CompletableFuture<ResponseEntity<restaurants>> createRestaurant(@RequestPart(value = "restaurant", required = true) @Valid resRequest resRequest,
                    @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return resService.createRestaurant(resRequest, imageFile)
                        .map(savedRestaurant -> ResponseEntity.ok(savedRestaurant)).toFuture();
    }

    public CompletableFuture<ResponseEntity<MessageResponse>> fallbackMethod(resRequest resRequest, 
        MultipartFile imageFile, Throwable ex)
    {
        log.error("Lỗi khi gọi createRestaurant, kích hoạt fallback. Lỗi: " + ex.getMessage());
        return CompletableFuture.completedFuture(
            ResponseEntity.status(503).body(new MessageResponse(ex.getMessage()))
        );
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete a restaurant")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteRes(@PathVariable String id, 
                    @AuthenticationPrincipal String userId) {
        resService.deleteRestaurant(id, userId);
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
    public ResponseEntity<MessageResponse> deleteResImage(@PathVariable String id, 
                    @AuthenticationPrincipal String userId) {
        resService.deleteImage(id, userId);
        return ResponseEntity.ok(new MessageResponse("Delete image successfully"));
    }
}
