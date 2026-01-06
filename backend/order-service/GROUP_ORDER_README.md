# Chức năng Đặt Món Chung (Group Order)

## Tổng quan
Chức năng cho phép nhiều người cùng đặt món từ một nhà hàng thông qua một link chia sẻ duy nhất. Người tạo có thể tạo một group order, chia sẻ link cho bạn bè/đồng nghiệp, và mọi người có thể thêm món của mình vào đơn hàng chung.

## Các tính năng chính

### 1. Tạo Group Order
- Người dùng tạo một group order mới cho một nhà hàng
- Hệ thống tạo một link chia sẻ duy nhất (shareToken)
- Có thể đặt thời gian hết hạn (mặc định 2 giờ)
- Chọn phương thức thanh toán: cash, card, wallet, hoặc split (chia đều)

### 2. Chia sẻ Link
- Người tạo nhận được link chia sẻ
- Link có dạng: `http://yourdomain.com/group-order/{shareToken}`
- Bất kỳ ai có link đều có thể xem và tham gia

### 3. Tham gia Group Order
- Người dùng truy cập link và đăng nhập
- Thêm các món ăn của mình
- Có thể cập nhật món đã chọn nhiều lần (khi group order còn ở trạng thái "open")

### 4. Quản lý Participants
- Người tạo có thể xóa bất kỳ participant nào
- Mỗi người có thể tự xóa món của mình
- Xem danh sách tất cả người tham gia và món của họ

### 5. Khóa và Xác nhận
- Người tạo có thể khóa group order (không nhận thêm người)
- Xác nhận để tạo order chính thức
- Hệ thống tổng hợp tất cả món từ các participants
- Tạo một order duy nhất gửi đến nhà hàng

## API Endpoints

### 1. Tạo Group Order
```http
POST /api/group-orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "restaurantId": "RES123456",
  "restaurantName": "Nhà hàng ABC",
  "deliveryAddress": {
    "street": "123 Đường XYZ",
    "city": "TP.HCM",
    "state": "HCM",
    "zipCode": "70000"
  },
  "groupNote": "Đặt chung cho team",
  "expiresInHours": 2,
  "paymentMethod": "split"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Group order created successfully",
  "data": {
    "groupOrderId": "GRP1234567890ABC",
    "shareToken": "uuid-here",
    "shareLink": "http://localhost:3000/group-order/uuid-here",
    "status": "open",
    "expiresAt": "2026-01-06T12:00:00.000Z",
    ...
  }
}
```

### 2. Xem thông tin Group Order (Public)
```http
GET /api/group-orders/{shareToken}
```

### 3. Tham gia và thêm món
```http
POST /api/group-orders/{shareToken}/join
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": "PROD123",
      "productName": "Phở bò",
      "quantity": 2,
      "price": 50000,
      "customizations": "Không hành"
    }
  ]
}
```

### 4. Xóa participant
```http
DELETE /api/group-orders/{shareToken}/participants/{userId}
Authorization: Bearer {token}
```

### 5. Khóa group order
```http
POST /api/group-orders/{shareToken}/lock
Authorization: Bearer {token}
```

### 6. Xác nhận và tạo order
```http
POST /api/group-orders/{shareToken}/confirm
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Group order confirmed and order created successfully",
  "data": {
    "groupOrder": { ... },
    "order": {
      "orderId": "ORD1234567890XYZ",
      ...
    }
  }
}
```

### 7. Hủy group order
```http
POST /api/group-orders/{shareToken}/cancel
Authorization: Bearer {token}
```

### 8. Lấy danh sách group orders của user
```http
GET /api/group-orders/my-orders?status=open&page=1&limit=20
Authorization: Bearer {token}
```

### 9. Thanh toán riêng (mỗi người tự trả)
```http
POST /api/group-orders/{shareToken}/pay
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "card"
}
```

### 10. Kiểm tra trạng thái thanh toán
```http
GET /api/group-orders/{shareToken}/payment-status
```

## Thanh toán riêng

Mỗi thành viên có thể thanh toán riêng phần của mình:

### Cách tính tiền cho mỗi người:
```
Phần trăm = Món của bạn / Tổng món
Phí ship của bạn = Tổng phí ship × Phần trăm
Thuế của bạn = Món của bạn × 10%
Tổng = Món + Phí ship + Thuế
```

**Ví dụ:**
- Tổng group: 300,000 VND
- Phí ship: 30,000 VND
- Alice đặt: 100,000 VND
- Alice trả: 100,000 + 10,000 (ship) + 10,000 (thuế) = **120,000 VND**

### Payment Status của mỗi người:
- `pending` - Chưa thanh toán
- `processing` - Đang xử lý
- `completed` - Đã thanh toán
- `failed` - Thất bại

📖 **Chi tiết:** Xem [INDIVIDUAL_PAYMENT_GUIDE.md](INDIVIDUAL_PAYMENT_GUIDE.md)

## Flow sử dụng

### Scenario 1: Đặt món chung cho team
1. **Người tạo (Alice)**:
   - POST `/api/group-orders` → Tạo group order cho "Nhà hàng ABC"
   - Nhận shareLink: `http://app.com/group-order/abc-123`
   - Chia sẻ link qua chat group

2. **Bob truy cập link**:
   - GET `/api/group-orders/abc-123` → Xem thông tin nhà hàng
   - Đăng nhập
   - POST `/api/group-orders/abc-123/join` → Thêm 2 phở bò

3. **Carol truy cập link**:
   - POST `/api/group-orders/abc-123/join` → Thêm 1 bún chả

4. **Alice xác nhận**:
   - POST `/api/group-orders/abc-123/lock` → Khóa, không cho thêm người
   - POST `/api/group-orders/abc-123/confirm` → Tạo order chính thức
   - Nhà hàng nhận order với: 2 phở bò + 1 bún chả

### Scenario 2: Cập nhật món
- Bob muốn thêm món: POST `/api/group-orders/abc-123/join` (ghi đè món cũ)
- Carol muốn hủy: DELETE `/api/group-orders/abc-123/participants/carol-id`

## Trạng thái Group Order

| Status | Mô tả |
|--------|-------|
| `open` | Đang mở, mọi người có thể tham gia thêm |
| `locked` | Đã khóa, không nhận thêm người nhưng chưa đặt |
| `ordered` | Đã đặt hàng chính thức |
| `cancelled` | Đã hủy |

## Model Schema

```javascript
GroupOrder {
  groupOrderId: String,      // GRP1234567890ABC
  shareToken: String,        // UUID duy nhất
  creatorId: String,
  creatorName: String,
  restaurantId: String,
  restaurantName: String,
  participants: [{
    userId: String,
    userName: String,
    items: [{
      productId: String,
      productName: String,
      quantity: Number,
      price: Number,
      customizations: String
    }],
    totalAmount: Number,
    joinedAt: Date
  }],
  deliveryAddress: Object,
  totalAmount: Number,
  deliveryFee: Number,
  tax: Number,
  finalAmount: Number,
  status: enum,
  finalOrderId: String,
  expiresAt: Date,
  groupNote: String,
  paymentMethod: String
}
```

## Lưu ý kỹ thuật

1. **Bảo mật**:
   - Routes tham gia, lock, confirm đều cần authentication
   - Chỉ creator mới có thể lock, confirm, cancel
   - User chỉ có thể xóa món của chính mình (trừ creator)

2. **Validation**:
   - Group order tự động expired sau thời gian đặt
   - Không thể confirm group order rỗng
   - Không thể tham gia group order đã locked/ordered

3. **Tính toán**:
   - Tổng tiền được tính lại mỗi khi có thay đổi participants
   - Tax = 10% của totalAmount
   - DeliveryFee được tính riêng

4. **Integration**:
   - Khi confirm, tạo Order thông qua orderService.createOrder()
   - Order note sẽ chứa thông tin về group order và danh sách participants

## Testing

Sử dụng Swagger UI tại: `http://localhost:8082/v3/api-docs/order-service`

Hoặc test với curl:
```bash
# 1. Tạo group order
curl -X POST http://localhost:8082/api/group-orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "RES123",
    "restaurantName": "Test Restaurant",
    "deliveryAddress": {
      "street": "123 Test St",
      "city": "City"
    }
  }'

# 2. Tham gia
curl -X POST http://localhost:8082/api/group-orders/SHARE_TOKEN/join \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "P1",
        "productName": "Pizza",
        "quantity": 1,
        "price": 100000
      }
    ]
  }'
```

## Ví dụ Frontend Integration

```javascript
// Tạo group order
const createGroupOrder = async () => {
  const response = await fetch('/api/group-orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      restaurantId: 'RES123',
      restaurantName: 'Nhà hàng ABC',
      deliveryAddress: { ... },
      expiresInHours: 2
    })
  });
  
  const data = await response.json();
  const shareLink = data.data.shareLink;
  
  // Copy link hoặc share qua QR code
  navigator.clipboard.writeText(shareLink);
};

// Tham gia group order
const joinGroupOrder = async (shareToken, items) => {
  const response = await fetch(`/api/group-orders/${shareToken}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items })
  });
  
  return response.json();
};

// Confirm order
const confirmOrder = async (shareToken) => {
  const response = await fetch(`/api/group-orders/${shareToken}/confirm`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

## Mở rộng trong tương lai

- [ ] Thông báo real-time khi có người tham gia (Socket.IO)
- [ ] Chat group trong group order
- [ ] Chia tiền tự động cho từng người
- [ ] Tích hợp payment gateway để thanh toán riêng
- [ ] QR code cho shareLink
- [ ] Giới hạn số người tham gia tối đa
- [ ] Vote cho nhà hàng trước khi tạo group order
