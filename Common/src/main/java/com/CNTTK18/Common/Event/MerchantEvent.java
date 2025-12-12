package com.CNTTK18.Common.Event;

public class MerchantEvent {
    private String email;

    public MerchantEvent(String email, boolean success) {
        this.email = email;
        this.success = success;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private boolean success;

    public MerchantEvent() {}

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
