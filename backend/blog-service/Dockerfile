# Dùng Node 20 chính thức, nhẹ và ổn định
FROM node:20-alpine

# Thư mục làm việc
WORKDIR /app

# Copy package trước để tận dụng cache
COPY package*.json ./

# Cài dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Copy toàn bộ code
COPY . .

# Tạo user non-root (tăng bảo mật)
RUN adduser --system --uid 1001 bloguser
USER bloguser

# Mở port (code của bạn đang dùng 8087)
EXPOSE 8087

# Chạy ứng dụng
CMD ["node", "src/server.js"]