package com.CNTTK18.user_service.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {
    @Id
    private String id;
    @NotBlank(message = "Username is mandatory")
    private String username;
    @Email
    @NotBlank(message = "Email is mandatory")
    private String email;
    private String password;
    private boolean enabled;
    @Column(name = "verificationcode")
    private String verficationCode;
    private String role;
    private String phone;
    @Column(name = "authprovider")
    private String authProvider;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Address> addressList;

    public List<Address> getAddressList() {
        if (this.addressList == null) {
            this.addressList = new ArrayList<Address>();
        }
        return addressList;
    }

    public void setAddressList(List<Address> addressList) {
        if (addressList == null) {
            this.addressList = new ArrayList<Address>();
            return;
        }
        this.addressList = addressList;
    }

    public void addAddress(Address address) {
        if (this.addressList == null) {
            this.addressList = new ArrayList<Address>();
        }
        this.addressList.add(address);
        address.setUser(this);
    }
}
