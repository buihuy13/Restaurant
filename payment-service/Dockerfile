# Stage 1: Build
FROM node:20-alpine AS builder

# Tạo thư mục ứng dụng
WORKDIR /usr/src/app

# Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài dependencies
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Expose port
EXPOSE 3004

# Set NODE_ENV để tối ưu
ENV NODE_ENV=production

# Start app
CMD ["npm", "start"]
