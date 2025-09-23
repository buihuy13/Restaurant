package com.CNTTK18.restaurant_service.model;

import java.time.LocalTime;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categories")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class restaurants {
    @Id
    private String id;
    @Column(name = "resname", nullable = false)
    private String resName;
    private String address;
    private float rating;
    @Column(name = "openingtime", nullable = false)
    private LocalTime openingTime;
    @Column(name = "closingtime", nullable = false)
    private LocalTime closingTime;
    private String phone;

    @Column(name = "imageurl")
    private String imageURL;

    @Column(name = "publicid")
    private String publicID; // Cho việc xóa ảnh trong cloud
    @Column(name = "merchant_id", nullable = false)
    private String merchantId;

    private boolean enabled;

    @Column(name = "total_review")
    private int totalReview;

    @ManyToMany
    @JoinTable(
        name = "restaurant_categories",
        joinColumns = @jakarta.persistence.JoinColumn(name = "restaurant_id"),
        inverseJoinColumns = @jakarta.persistence.JoinColumn(name = "category_id")
    )
    private Set<categories> categories;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<products> products;

    public void addCate(categories cate) {
        this.categories.add(cate);
        cate.getRestaurants().add(this);
    }
}
