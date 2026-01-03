Sử dụng rate limiting (bucket4j):
Các request khi đi qua thì chỉ những request hợp lệ mới được lấy đi 1 token và đi qua. Nếu số token bị hết trong 1 khoảng thời gian và chưa được refill kịp thì các request sẽ bị bỏ đi

1. Bucket interface represents the token bucket with a maximum capacity. Nó cung cấp nhiều method như là: tryConsume hay là
tryConsumeAndReturnRemaining. Những method này trả về kết quả của việc dùng token là true nếu request thỏa mãn điều kiện
2. Bandwith class là thành phần chính của bucket, nó định nghĩa giới hạn của bucket. Ta có thể sử dụng nó để configure độ lớn của bucket và tốc độ nạp lại của nó
3. The refill class được sử dụng để định nghĩa tốc độ cố định mà token sẽ được thêm vào bucket. Chúng ta có thể config số token được thêm vào 1 khoảng thời gian nhất định
4. The tryConsumeAndReturnRemaining method return ConsumptionProbe, ConsumptionProbe chứa kết quả của consumption như là the status of bucket


Sử dụng redis rate limter (có sẵn trong spring cloud gateway) -> Dễ viết hơn nhưng kém linh hoạt hơn (distributed env sẵn rồi)