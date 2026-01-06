# Hướng dẫn Thanh toán trong Group Order

## Tổng quan
Hệ thống hỗ trợ **2 phương thức thanh toán** linh hoạt:
1. **Thanh toán riêng** - Mỗi người tự trả phần của mình
2. **Thanh toán toàn bộ** - Một người (thường là creator) trả hết cho cả nhóm

## 1. Thanh toán Riêng (Individual Payment)

### Cách hoạt động
- Mỗi participant có `paymentStatus`: pending, processing, completed, failed
- Mỗi participant có `paymentMethod` riêng: cash, card, wallet
- Hệ thống theo dõi `paidAmount` và `paidAt` của từng người

### 2. Tính toán số tiền
Khi participant thanh toán, hệ thống tính:
```javascript
participantShare = participantTotal / groupTotal
participantDeliveryFee = groupDeliveryFee × participantShare
participantTax = participantTotal × 10%
totalToPay = participantTotal + participantDeliveryFee + participantTax
```

**Ví dụ:**
- Group order tổng cộng: 300,000 VND
- Phí giao hàng: 30,000 VND
- Alice đặt món: 100,000 VND (33.3% của tổng)
- Bob đặt món: 150,000 VND (50%)
- Carol đặt món: 50,000 VND (16.7%)

**Alice phải trả:**
- Món ăn: 100,000
- Phí ship (33.3%): 10,000
- Thuế (10%): 10,000
- **Tổng: 120,000 VND**

## API Endpoints

### 1. Thanh toán riêng (từng người tự trả)
```http
POST /api/group-orders/{shareToken}/pay
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "success": true,
    "amountPaid": 120000,
    "participant": {
      "userId": "user123",
      "userName": "Alice",
      "paymentStatus": "completed",
      "paidAmount": 120000,
      "paidAt": "2026-01-06T10:30:00.000Z"
    }
  }
}
```

### 2. Thanh toán toàn bộ (một người trả hết)
```http
POST /api/group-orders/{shareToken}/pay-all
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Full payment processed successfully",
  "data": {
    "success": true,
    "amountPaid": 360000,
    "message": "Full payment completed successfully",
    "paymentResult": {
      "transactionId": "TXN1234567890"
    }
  }
}
```

**Note:** Khi thanh toán toàn bộ, tất cả participants sẽ được đánh dấu là đã thanh toán.

### 3. Kiểm tra trạng thái thanh toán
```http
POST /api/group-orders/{shareToken}/pay
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentMethod": "card"
}
```

**Response khi thành công:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "success": true,
    "amountPaid": 120000,
    "participant": {
      "userId": "user123",
      "userName": "Alice",
      "paymentStatus": "completed",
      "paidAmount": 120000,
      "paidAt": "2026-01-06T10:30:00.000Z"
    },
    "paymentResult": {
      "transactionId": "TXN1234567890",
      "success": true
    }
  }
}
```

**Response khi thất bại:**
```json
{
  "success": false,
  "message": "Payment processing failed: Insufficient funds"
}
```

### 2. Kiểm tra trạng thái thanh toán
```http
GET /api/group-orders/{shareToken}/payment-status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "allPaid": false,
    "totalParticipants": 3,
    "paidParticipants": 2,
    "pendingParticipants": 1,
    "participants": [
      {
        "userId": "alice123",
        "userName": "Alice",
        "paymentStatus": "completed",
        "paidAmount": 120000,
        "totalAmount": 100000
      },
      {
        "userId": "bob456",
        "userName": "Bob",
        "paymentStatus": "completed",
        "paidAmount": 180000,
        "totalAmount": 150000
      },
      {
        "userId": "carol789",
        "userName": "Carol",
        "paymentStatus": "pending",
        "paidAmount": 0,
        "totalAmount": 50000
      }
    ]
  }
}
```

## Payment Status

| Status | Mô tả |
|--------|-------|
| `pending` | Chưa thanh toán |
| `processing` | Đang xử lý thanh toán |
| `completed` | Đã thanh toán thành công |
| `failed` | Thanh toán thất bại |

## Payment Methods

| Method | Mô tả |
|--------|-------|
| `cash` | Tiền mặt (tự động chấp nhận) |
| `card` | Thẻ tín dụng/ghi nợ |
| `wallet` | Ví điện tử |

## Flow sử dụng

### Scenario 1: Mỗi người tự thanh toán

1. **Alice tạo group order**:
   ```http
   POST /api/group-orders
   {
     "restaurantId": "RES123",
     "allowIndividualPayment": true,
     "paymentMethod": "split"
   }
   ```

2. **Bob, Carol tham gia**:
   ```http
   POST /api/group-orders/{shareToken}/join
   ```

3. **Alice thanh toán phần của mình**:
   ```http
   POST /api/group-orders/{shareToken}/pay
   { "paymentMethod": "card" }
   ```
   → Alice trả: 120,000 VND

4. **Bob thanh toán**:
   ```http
   POST /api/group-orders/{shareToken}/pay
   { "paymentMethod": "wallet" }
   ```
   → Bob trả: 180,000 VND

5. **Carol thanh toán**:
   ```http
   POST /api/group-orders/{shareToken}/pay
   { "paymentMethod": "cash" }
   ```
   → Carol trả: 60,000 VND

6. **Confirm order**:
   ```http
   POST /api/group-orders/{shareToken}/confirm
   ```

### Scenario 2: Người tạo trả toàn bộ

1. **Alice tạo group order**:
   ```http
   POST /api/group-orders
   {
     "restaurantId": "RES123",
     "allowIndividualPayment": false  // Không cho thanh toán riêng
   }
   ```

2. **Bob, Carol tham gia** (chỉ thêm món, không cần thanh toán)

3. **Alice thanh toán toàn bộ**:
   ```http
   POST /api/group-orders/{shareToken}/pay-all
   { "paymentMethod": "card" }
   ```
   → Alice trả hết: 360,000 VND
   → Tất cả participants tự động được đánh dấu đã thanh toán

4. **Confirm order**:
   ```http
   POST /api/group-orders/{shareToken}/confirm
   ```

### Scenario 3: Linh hoạt (ai cũng có thể trả)

1. **Alice tạo group order** với `allowIndividualPayment: true`

2. **Bob, Carol, David tham gia**

3. **Alice quyết định trả cho tất cả** (vì đi công tác):
   ```http
   POST /api/group-orders/{shareToken}/pay-all
   { "paymentMethod": "card" }
   ```
   → Tất cả đã được thanh toán

4. **Confirm order**

### Scenario 4: Kết hợp (một số người trả, một người trả phần còn lại)

1. **Alice tạo**, **Bob, Carol, David tham gia**

2. **Bob và Carol thanh toán riêng**:
   ```http
   POST /api/group-orders/{shareToken}/pay
   ```

3. **Alice kiểm tra**:
   ```http
   GET /api/group-orders/{shareToken}/payment-status
   ```
   → Thấy David chưa trả

4. **Alice có thể**:
   - Chờ David trả, hoặc
   - Nhắc David thanh toán
   - Hoặc confirm luôn (không bắt buộc phải thanh toán hết)

## Ai có thể thanh toán?

### Thanh toán riêng (`/pay`)
- ✅ Bất kỳ participant nào đã tham gia
- ✅ Bao gồm cả creator (nếu creator cũng tham gia như participant)
- ❌ Người chưa tham gia group order

### Thanh toán toàn bộ (`/pay-all`)
- ✅ Bất kỳ ai (creator hoặc participant)
- ✅ Thường dùng khi một người muốn treat cả nhóm
- ✅ Hữu ích cho công tác, team building, v.v.

## So sánh 2 phương thức

| Tiêu chí | Thanh toán riêng (`/pay`) | Thanh toán toàn bộ (`/pay-all`) |
|----------|---------------------------|----------------------------------|
| Người trả | Mỗi người tự trả | Một người trả hết |
| Số tiền | Chỉ phần của mình | Toàn bộ group order |
| Use case | Chia tiền bình thường | Treat, công tác, reimbursement |
| Yêu cầu | Phải là participant | Bất kỳ ai |
| Kết quả | Đánh dấu 1 participant paid | Đánh dấu TẤT CẢ paid |

## Tích hợp Payment Service

### Request đến Payment Service
```http
POST http://payment-service:8084/api/payments/process
Content-Type: application/json

{
  "userId": "alice123",
  "amount": 120000,
  "paymentMethod": "card",
  "orderId": "GRP1234567890ABC",
  "description": "Payment for group order GRP1234567890ABC"
}
```

### Response từ Payment Service
```json
{
  "success": true,
  "transactionId": "TXN1234567890",
  "message": "Payment completed successfully"
}
```

### Xử lý khi Payment Service unavailable
- Nếu `paymentMethod = "cash"` → Tự động chấp nhận
- Nếu `paymentMethod = "card" | "wallet"` → Trả về lỗi

## Model Schema Updates

### GroupOrder Model
```javascript
{
  // ... existing fields
  allowIndividualPayment: Boolean,  // Cho phép thanh toán riêng
  totalPaidAmount: Number,          // Tổng đã thanh toán
  
  participants: [{
    // ... existing fields
    paymentStatus: enum,            // pending, processing, completed, failed
    paymentMethod: String,          // cash, card, wallet
    paymentTransactionId: String,   // ID giao dịch
    paidAmount: Number,             // Số tiền đã trả
    paidAt: Date                    // Thời gian thanh toán
  }]
}
```

## Validation & Business Rules

### 1. Khi thanh toán
- ✅ Phải là participant của group order
- ✅ Chưa thanh toán trước đó (paymentStatus !== 'completed')
- ✅ allowIndividualPayment = true
- ✅ Group order chưa cancelled

### 2. Khi confirm order
- ⚠️ Không bắt buộc tất cả phải thanh toán
- ℹ️ Creator có thể confirm bất cứ lúc nào
- ℹ️ Có thể check payment status trước khi confirm

### 3. Xử lý lỗi
```javascript
// Đã thanh toán rồi
{
  "success": false,
  "message": "You have already paid for this order"
}

// Group đã được thanh toán đầy đủ
{
  "success": false,
  "message": "This group order has been fully paid"
}

// Không cho phép thanh toán riêng (khi dùng /pay)
{
  "success": false,
  "message": "Individual payment is not allowed for this group order"
}

// Không phải participant (khi dùng /pay)
{
  "success": false,
  "message": "You are not a participant in this group order"
}

// Payment service lỗi
{
  "success": false,
  "message": "Payment processing failed: Connection timeout"
}
```

## Frontend Integration

### Hiển thị payment buttons
```javascript
const PaymentOptions = ({ shareToken, groupOrder, currentUser }) => {
  const myParticipant = groupOrder.participants.find(
    p => p.userId === currentUser.id
  );
  
  const handlePayIndividual = async () => {
    const response = await fetch(`/api/group-orders/${shareToken}/pay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentMethod: 'card' })
    });
    
    const data = await response.json();
    if (data.success) {
      alert(`Đã thanh toán: ${data.data.amountPaid} VND`);
    }
  };
  
  const handlePayAll = async () => {
    const confirmed = confirm(
      `Bạn sẽ thanh toán ${groupOrder.finalAmount} VND cho toàn bộ nhóm?`
    );
    
    if (!confirmed) return;
    
    const response = await fetch(`/api/group-orders/${shareToken}/pay-all`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentMethod: 'card' })
    });
    
    const data = await response.json();
    if (data.success) {
      alert('Đã thanh toán toàn bộ!');
    }
  };
  
  return (
    <div>
      {/* Nút thanh toán riêng - chỉ hiện nếu đã tham gia và chưa trả */}
      {myParticipant && myParticipant.paymentStatus !== 'completed' && (
        <button onClick={handlePayIndividual}>
          Thanh toán phần của tôi ({myParticipant.totalAmount} VND)
        </button>
      )}
      
      {/* Nút thanh toán toàn bộ - ai cũng có thể bấm */}
      {groupOrder.totalPaidAmount < groupOrder.finalAmount && (
        <button onClick={handlePayAll} className="premium">
          Tôi thanh toán cho cả nhóm ({groupOrder.finalAmount} VND)
        </button>
      )}
      
      {/* Hiển thị đã thanh toán */}
      {myParticipant?.paymentStatus === 'completed' && (
        <div className="paid-badge">
          ✅ Bạn đã thanh toán {myParticipant.paidAmount} VND
        </div>
      )}
    </div>
  );
};
```

### Hiển thị payment status
```javascript
const PaymentStatus = ({ shareToken }) => {
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    fetch(`/api/group-orders/${shareToken}/payment-status`)
      .then(res => res.json())
      .then(data => setStatus(data.data));
  }, [shareToken]);
  
  return (
    <div>
      <h3>Trạng thái thanh toán</h3>
      <p>Đã thanh toán: {status?.paidParticipants}/{status?.totalParticipants}</p>
      
      {status?.participants.map(p => (
        <div key={p.userId}>
          <span>{p.userName}</span>
          <span>{p.paymentStatus}</span>
          {p.paymentStatus === 'completed' && (
            <span>✅ {p.paidAmount.toLocaleString()} VND</span>
          )}
        </div>
      ))}
    </div>
  );
};
```

### Nút thanh toán với nhiều phương thức
```javascript
const PayButton = ({ shareToken, amount, type = 'individual' }) => {
  const [method, setMethod] = useState('card');
  
  const handlePay = async () => {
    const endpoint = type === 'all' ? 'pay-all' : 'pay';
    
    try {
      const response = await fetch(`/api/group-orders/${shareToken}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentMethod: method })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Thanh toán thành công: ${data.data.amountPaid} VND`);
      } else {
        alert(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };
  
  return (
    <div>
      <p>Số tiền: {amount.toLocaleString()} VND</p>
      
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="card">Thẻ</option>
        <option value="wallet">Ví điện tử</option>
        <option value="cash">Tiền mặt</option>
      </select>
      
      <button onClick={handlePay}>
        {type === 'all' ? 'Trả toàn bộ' : 'Thanh toán'}
      </button>
    </div>
  );
};
```

## Testing

### Test Case 1: Thanh toán riêng
```bash
# User tham gia
curl -X POST http://localhost:8082/api/group-orders/abc-123/join \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": "P1", "productName": "Pizza", "quantity": 1, "price": 100000}]}'

# User thanh toán phần của mình
curl -X POST http://localhost:8082/api/group-orders/abc-123/pay \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "card"}'
```

### Test Case 2: Thanh toán toàn bộ
```bash
# Creator (hoặc bất kỳ ai) thanh toán cho cả nhóm
curl -X POST http://localhost:8082/api/group-orders/abc-123/pay-all \
  -H "Authorization: Bearer CREATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "card"}'
```

### Test Case 3: Kiểm tra trạng thái
```bash
curl -X GET http://localhost:8082/api/group-orders/abc-123/payment-status
```

### Test Case 4: Thanh toán khi đã trả đầy đủ
```bash
# Lần 1: Thanh toán toàn bộ - Thành công
curl -X POST http://localhost:8082/api/group-orders/abc-123/pay-all \
  -H "Authorization: Bearer TOKEN" \
  -d '{"paymentMethod": "card"}'

# Lần 2: Thử thanh toán lại - Lỗi "fully paid"
curl -X POST http://localhost:8082/api/group-orders/abc-123/pay-all \
  -H "Authorization: Bearer TOKEN" \
  -d '{"paymentMethod": "card"}'
```

## Environment Variables

Thêm vào `.env`:
```env
PAYMENT_SERVICE_URL=http://localhost:8084
FRONTEND_URL=http://localhost:3000
```

## Mở rộng trong tương lai

- [ ] Cho phép một người trả cho người khác cụ thể
- [ ] Hỗ trợ refund khi hủy order
- [ ] Split bill theo tỷ lệ tùy chỉnh (không chỉ theo món)
- [ ] Nhắc nhở người chưa thanh toán qua notification/email
- [ ] Lịch sử giao dịch chi tiết cho từng participant
- [ ] Xuất hóa đơn riêng cho từng người
- [ ] Tích hợp nhiều payment gateway
- [ ] Giảm giá/coupon áp dụng riêng cho từng người
- [ ] Thanh toán một phần (ví dụ: trả 50% trước)
- [ ] Cho phép "góp tiền" vào một pot chung
