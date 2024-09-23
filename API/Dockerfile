# Sử dụng image Node.js
FROM node:18

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy file package.json và package-lock.json để cài đặt dependencies trước
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Cài đặt thêm ts-node và typescript global (nếu cần)
RUN npm install -g ts-node typescript

# Copy toàn bộ mã nguồn của dự án vào trong container
COPY . .

# Expose cổng để truy cập
EXPOSE 5000

# Khởi động ứng dụng bằng ts-node
CMD ["npm", "run", "dev"]
