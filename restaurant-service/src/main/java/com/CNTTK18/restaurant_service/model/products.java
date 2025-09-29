package com.CNTTK18.restaurant_service.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class products {
    @Id
    private String id;
    @Column(name = "product_name", nullable = false)
    private String productName;
    private String description;
    @Column(name = "imageurl")
    private String imageURL;
    @Column(name = "publicid")
    private String publicID; // Cho việc xóa ảnh trong cloud
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private categories category;
    private int volume;
    private boolean available;
    private float rating;

    @Column(name = "total_review")
    private int totalReview;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private restaurants restaurant;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductSize> productSizes;

    // Helper methods
    public void addProductSize(ProductSize productSize) {
        if (this.productSizes == null) {
            this.productSizes = new HashSet<>();
        }
        productSizes.add(productSize);
        productSize.setProduct(this);
    }
    
    public void removeProductSize(ProductSize productSize) {
        productSizes.remove(productSize);
        productSize.setProduct(null);
    }

    public void clearAllProductSizes() {
        Set<ProductSize> productSizesToRemove = new HashSet<>(this.productSizes);
        
        for (ProductSize productSize : productSizesToRemove) {
            removeProductSize(productSize);
        }
    }
}
