package com.CNTTK18.restaurant_service.dto.distance.request;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class distanceRequest {
    @JsonProperty("locations")
    private List<List<Double>> coordinates;
    @JsonProperty("metrics")
    private List<String> metrics;
    @JsonProperty("sources")
    private List<Integer> sources;
    @JsonProperty("destinations")
    private List<Integer> destinations;

    public distanceRequest(List<List<Double>> coordinates) {
        this.coordinates = coordinates;
        this.metrics = List.of("distance", "duration");
        this.sources = List.of(0);
        this.destinations = IntStream.range(1, coordinates.size()).boxed().collect(Collectors.toList());
    }
}
