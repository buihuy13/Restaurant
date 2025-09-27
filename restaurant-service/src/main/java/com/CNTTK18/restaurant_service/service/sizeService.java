package com.CNTTK18.restaurant_service.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;

import com.CNTTK18.Common.Exception.ResourceNotFoundException;
import com.CNTTK18.Common.Util.RandomIdGenerator;
import com.CNTTK18.restaurant_service.dto.size.request.sizeRequest;
import com.CNTTK18.restaurant_service.model.size;
import com.CNTTK18.restaurant_service.repository.sizeRepository;

@Service
public class sizeService {
    private sizeRepository sizeRepo;
    public sizeService(sizeRepository sizeRepo) {
        this.sizeRepo = sizeRepo;
    }

    public List<size> getAllSize() {
        return sizeRepo.findAll();
    }

    public size getSizeById(String id) {
        size size = sizeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Size not found"));
        return size;
    }

    public size createSize(sizeRequest sizeRequest) {
        size size = new size(RandomIdGenerator.generate(5), sizeRequest.getName(), new HashSet<>());
        return sizeRepo.save(size);
    }

    public size updateSize(String id, sizeRequest sizeRequest) {
        size size = sizeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Size not found"));
        size.setName(sizeRequest.getName());
        return sizeRepo.save(size);
    }

    public void deleteSize(String id) {
        size size = sizeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Size not found"));
        sizeRepo.delete(size);
    }
}
