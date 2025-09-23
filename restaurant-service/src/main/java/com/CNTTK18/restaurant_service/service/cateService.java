package com.CNTTK18.restaurant_service.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.restaurant_service.dto.cate.request.cateRequest;
import com.CNTTK18.restaurant_service.model.categories;
import com.CNTTK18.restaurant_service.repository.cateRepository;

@Service
public class cateService {
    private cateRepository cateRepository;

    public cateService(cateRepository cateRepository) {
        this.cateRepository = cateRepository;
    }

    public List<categories> getAllCategories() {
        return cateRepository.findAll();
    }

    public categories getCateById(String id) {
        categories cate = cateRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return cate;
    }

    public categories getCateByName(String name) {
        categories cate = cateRepository.findByCateName(name)
                            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return cate;
    }

    public categories createCate(cateRequest cateRequest) {
        categories cate = new categories(RandomIdGenerator.generate(10), cateRequest.getCateName(), new HashSet<>());
        return cateRepository.save(cate);
    }

    public categories updateCate(String id, cateRequest cateRequest) {
        categories cate = cateRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        cate.setCateName(cateRequest.getCateName());
        return cateRepository.save(cate);
    }

    public void deleteCate(String id) {
        categories cate = cateRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        
        cateRepository.delete(cate);
    }
}
