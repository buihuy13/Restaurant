package com.CNTTK18.Common.Event;

public class OrderEvent {
    private String userId;
    private String restaurantName;

    public OrderEvent() {}
    public OrderEvent(String userId, String restaurantName) {
        this.userId = userId;
        this.restaurantName = restaurantName;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getRestaurantName() {
        return restaurantName;
    }
    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
}
