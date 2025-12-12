package com.CNTTK18.restaurant_service.dto.distance.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrsDirectionResponse {
    @JsonProperty("features")
    private List<Feature> features;
}
