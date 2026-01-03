1. WebSocket Controller nhận message từ client
2. Service publish message lên Redis channel
3. Redis Subscriber nghe Redis channel
4. Redis Subscriber forward message xuống WebSocket clients