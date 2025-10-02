package com.CNTTK18.restaurant_service.dto.distance.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class distanceResponse {
    @JsonProperty("distances")
    private List<List<Double>> distances;
    @JsonProperty("durations")
    private List<List<Double>> durations;
}
