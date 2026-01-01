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
@Table(name = "restaurants")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Restaurants {
    @Id
    private String id;
    @Column(name = "resname", nullable = false)
    private String resName;
    private String address;
    private double longitude; //kinh độ
    private double latitude; //vĩ độ
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
    private String slug;

    @ManyToMany
    @JoinTable(
        name = "restaurant_categories",
        joinColumns = @jakarta.persistence.JoinColumn(name = "restaurant_id"),
        inverseJoinColumns = @jakarta.persistence.JoinColumn(name = "category_id")
    )
    private Set<Categories> categories;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Products> products;

    public void addCate(Categories cate) {
        if (this.categories == null) {
            this.categories = new java.util.HashSet<>();
        }
        this.categories.add(cate);
        cate.getRestaurants().add(this);
    }

    public void removeCate(Categories cate) {
        this.categories.remove(cate);
        cate.getRestaurants().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Restaurants that = (Restaurants) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        // Các đối tượng bằng nhau phải có hashCode bằng nhau
        return id != null ? id.hashCode() : 0;
    }
}
