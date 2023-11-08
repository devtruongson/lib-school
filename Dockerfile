# Sử dụng một hình ảnh Node.js LTS nhưm làm hình ảnh cơ sở
FROM node:lts

# Tạo một thư mục làm việc cho ứng dụng NestJS
WORKDIR /app

COPY package*.json ./
COPY dist/ ./dist/
RUN npm install --production
EXPOSE 8081

# Lệnh khởi chạy ứng dụng NestJS
CMD ["node", "dist/main.js"]
