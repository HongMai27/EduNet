# Sử dụng Node.js để build React app
FROM node:14 as build

# Đặt thư mục làm việc
WORKDIR /app

# Cài đặt dependencies và build ứng dụng
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx để serve React build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Mở cổng Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
