package com.CNTTK18.restaurant_service.dto.productSize.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class productSizeRequest {
    private BigDecimal price;
}
