package com.CNTTK18.restaurant_service.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.CNTTK18.restaurant_service.dto.distance.request.distanceRequest;
import com.CNTTK18.restaurant_service.dto.distance.response.distanceResponse;

import reactor.core.publisher.Mono;

@Service
public class DistanceService {
    @Value("${OPENROUTESERVICE_API_KEY}")
    private String apiKey;

    @Value("${OPENROUTESERVICE_URL}")
    private String apiUrl;

    private WebClient.Builder webClientBuilder;

    public DistanceService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public Mono<distanceResponse> getDistanceAndDuration(List<Double> startingPoints, List<List<Double>> endPoints) {
        List<List<Double>> allPoints = new ArrayList<>();

        allPoints.add(startingPoints);
        allPoints.addAll(endPoints);

        distanceRequest distanceRequest = new distanceRequest(allPoints);

        return webClientBuilder.build()
                .post()
                .uri(apiUrl) // Endpoint của ORS Matrix API
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .header("Authorization", apiKey) // ORS yêu cầu API Key trong header
                .bodyValue(distanceRequest)
                .retrieve()
                .bodyToMono(distanceResponse.class);
    }
}
