package com.CNTTK18.restaurant_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categories")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class categories {
    @Id private String id;

    @Column(name = "catename", nullable = false, unique = true)
    private String cateName;

    public categories(String id, String cateName) {
        this.id = id;
        this.cateName = cateName;
    }

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private Set<restaurants> restaurants;
}
