package com.CNTTK18.restaurant_service.controller;

import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.CNTTK18.restaurant_service.dto.cate.request.cateRequest;
import com.CNTTK18.restaurant_service.dto.response.MessageResponse;
import com.CNTTK18.restaurant_service.model.categories;
import com.CNTTK18.restaurant_service.service.cateService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/category")
public class cateController {
    private cateService cateService;
    public cateController(cateService cateService) {
        this.cateService = cateService;
    }

    @Tag(name = "Get")
    @Operation(summary = "Get all categories")
    @GetMapping("")
    public ResponseEntity<List<categories>> getAllCate() {
        return ResponseEntity.ok(cateService.getAllCategories());
    }

    @Tag(name = "Get")
    @Operation(summary = "Get category by ID")
    @GetMapping("/{id}")
    public ResponseEntity<categories> getCateById(@PathVariable String id) {
        return ResponseEntity.ok(cateService.getCateById(id));
    }

    @Tag(name = "Get")
    @Operation(summary = "Get category by cate's name")
    @GetMapping("/search")
    public ResponseEntity<categories> getCateByName(@RequestParam String name) {
        return ResponseEntity.ok(cateService.getCateByName(name));
    }

    @Tag(name = "Post")
    @Operation(summary = "Create new category")
    @PostMapping("")
    public ResponseEntity<categories> createCate(@RequestBody @Valid cateRequest cateRequest) {
        return new ResponseEntity<>(cateService.createCate(cateRequest), HttpStatusCode.valueOf(201));
    }

    @Tag(name = "Put") 
    @Operation(summary = "Update a category")
    @PutMapping("/{id}")
    public ResponseEntity<categories> updateCate(@RequestBody @Valid cateRequest cateRequest, @PathVariable String id) {
        return ResponseEntity.ok(cateService.updateCate(id, cateRequest));
    }

    @Tag(name = "Delete")
    @Operation(summary = "Delete a category")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCate(@PathVariable String id) {
        cateService.deleteCate(id);
        return ResponseEntity.ok(new MessageResponse("Delete Successfully"));
    }
}
