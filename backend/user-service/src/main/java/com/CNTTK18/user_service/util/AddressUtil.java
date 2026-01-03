package com.CNTTK18.user_service.util;

import org.springframework.stereotype.Component;

import com.CNTTK18.user_service.dto.response.AddressResponse;
import com.CNTTK18.user_service.model.Address;
import com.CNTTK18.user_service.model.Users;

@Component
public class AddressUtil {
    public static AddressResponse mapAddressToAddressResponse(Address address, Users user) {
        return new AddressResponse(address.getId(),address.getLocation(),address.getLongitude(),
                                    address.getLatitude(), UserUtil.mapUsersToUserResponse(user));
    }
    public static AddressResponse mapAddressToAddressResponseWithUserNull(Address address) {
        return new AddressResponse(address.getId(),address.getLocation(),address.getLongitude(),
                                    address.getLatitude(), null);
    }
}
