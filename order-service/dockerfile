FROM node:20-alpine

WORKDIR /app

# Chỉ copy file package.json (để cache npm install)
COPY package*.json ./

RUN npm install

# Copy phần code còn lại (sau khi cài dependencies)
COPY . .

EXPOSE 8082

CMD ["npm", "start"]
