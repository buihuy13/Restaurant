package com.CNTTK18.Common.Event;

public class PaymentEvent {
    private String email;
    private String orderId;
    private double amount;
    private String transactionId;
    private String url;

    public PaymentEvent() {}

    public PaymentEvent(String email, String orderId, double amount, String transactionId, String url) {
        this.email = email;
        this.orderId = orderId;
        this.amount = amount;
        this.transactionId = transactionId;
        this.url = url;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
