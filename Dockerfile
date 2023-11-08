# Sử dụng một hình ảnh Node.js LTS nhưm làm hình ảnh cơ sở
FROM node:lts

# Tạo một thư mục làm việc cho ứng dụng NestJS
WORKDIR /app

# Sao lưu tất cả các tệp cần thiết cho ứng dụng vào thư mục làm việc
COPY package*.json ./
COPY dist/ ./dist/

# Cài đặt các phụ thuộc cần thiết
RUN npm install --production
# Mở cổng mà ứng dụng sẽ lắng nghe trên (thường là cổng 3000)
EXPOSE 8081

# Lệnh khởi chạy ứng dụng NestJS
CMD ["node", "dist/main.js"]
