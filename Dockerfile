
# Sử dụng một hình ảnh Node.js LTS nhưm làm hình ảnh cơ sở
FROM node:lts

# Tạo một thư mục làm việc cho ứng dụng NestJS
WORKDIR /app

COPY package*.json ./
RUN npm install --silent
EXPOSE 8081
COPY . .

CMD ["npm", "run", "start:prod"]