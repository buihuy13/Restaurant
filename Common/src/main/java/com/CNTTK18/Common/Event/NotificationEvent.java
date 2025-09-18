package com.CNTTK18.Common.Event;

public class NotificationEvent {
    private String email;
    private boolean success;

    public NotificationEvent(String email, boolean success) {
        this.email = email;
        this.success = success;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }
}
