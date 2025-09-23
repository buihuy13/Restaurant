package com.CNTTK18.restaurant_service.dto.review.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class reviewRequest {
    @NotBlank(message = "userId is required")
    private String userId;
    @NotBlank(message = "Id of restaurant or product is required")
    private String reviewId;
    @NotBlank(message = "Type should be PRODUCT or RESTAURANT")
    private String reviewType;
    @NotBlank(message = "Title is required")
    @Size(max = 100)
    private String title;
    @NotBlank(message = "Content is required")
    private String content;
    @NotNull(message = "Rating is required")
    private float rating;
}
