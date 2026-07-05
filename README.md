<div align="center">
  <img width="800" alt="techvie" src="https://github.com/user-attachments/assets/e6a3438c-9264-4a3a-b909-6f705837ae86" />
  
  # TechVie - Cửa Hàng Phụ Kiện Công Nghệ
</div>

## 1. Giới thiệu
TechVie là một nền tảng thương mại điện tử hiện đại, chuyên cung cấp các sản phẩm phụ kiện công nghệ đa dạng và chất lượng. Hệ thống được thiết kế với mục tiêu mang lại trải nghiệm mua sắm mượt mà, tiện lợi cho người dùng thông qua giao diện trực quan, đồng thời cung cấp các công cụ quản lý mạnh mẽ và toàn diện cho quản trị viên. Từ việc duyệt sản phẩm, thêm vào giỏ hàng, cho đến thanh toán và theo dõi đơn hàng, TechVie hướng tới việc số hóa và tối ưu hóa toàn bộ quy trình vận hành của một cửa hàng bán lẻ đồ công nghệ.

## 2. Các tính năng chính
- **Khách hàng:** Tìm kiếm sản phẩm, xem chi tiết, thêm vào giỏ hàng, quản lý đơn hàng, thanh toán.
- **Thành viên:** Đăng nhập, đăng ký, xác thực bảo mật, quản lý tài khoản cá nhân.
- **Quản trị viên:** Quản lý sản phẩm (thêm, sửa, xóa), quản lý đơn hàng, theo dõi doanh thu và hoạt động của người dùng.

## 3. Công nghệ sử dụng

### Frontend
- **React 19:** Thư viện JavaScript xây dựng giao diện người dùng hiện đại.
- **Vite:** Công cụ build frontend nhanh và hiệu quả.
- **Tailwind CSS v4:** Framework CSS tiện lợi cho việc thiết kế giao diện linh hoạt.
- **React Router DOM:** Xử lý điều hướng trong ứng dụng một trang (SPA).
- **Framer Motion:** Tạo các hiệu ứng chuyển động mượt mà.
- **Lucide React:** Bộ thư viện icon phong phú và tối ưu.
- **React Hot Toast:** Hiển thị các thông báo nhanh gọn, đẹp mắt.

### Backend
- **Node.js & Express.js:** Nền tảng xây dựng API máy chủ mạnh mẽ.
- **MongoDB (Mongoose):** Cơ sở dữ liệu NoSQL lưu trữ thông tin sản phẩm, đơn hàng và người dùng.
- **JSON Web Token (JWT):** Quản lý phiên đăng nhập và bảo mật xác thực người dùng.
- **Bcryptjs:** Mã hóa mật khẩu người dùng trước khi lưu vào cơ sở dữ liệu.
- **Cloudinary & Multer:** Hỗ trợ upload và lưu trữ hình ảnh sản phẩm.
- **Nodemailer:** Gửi email thông báo, xác nhận tự động.

## 4. Cấu trúc thư mục

```text
techvie/
├── backend/          # Chứa mã nguồn Backend (Node.js, Express, MongoDB)
│   ├── package.json  # Khai báo các dependencies của Backend
│   └── ...
├── frontend/         # Chứa mã nguồn Frontend (React, Vite, Tailwind)
│   ├── src/          # Chứa mã nguồn UI, components, trang
│   ├── package.json  # Khai báo các dependencies của Frontend
│   └── ...
└── README.md         # File tài liệu mô tả dự án
```

## 5. Hướng dẫn cài đặt và chạy dự án

### 5.1. Yêu cầu hệ thống
- Node.js (phiên bản 18.x trở lên)
- Cơ sở dữ liệu MongoDB (cài đặt cục bộ hoặc sử dụng MongoDB Atlas)

### 5.2. Cài đặt và khởi chạy Backend
#### 5.2.1. Mở terminal, di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
#### 5.2.2. Cài đặt các gói thư viện cần thiết:
   ```bash
   npm install
   ```
#### 5.2.3. Tạo file `.env` ở thư mục gốc của backend và cấu hình các biến môi trường (MongoDB URI, JWT Secret, cấu hình Cloudinary, v.v.).
#### 5.2.4. Khởi chạy máy chủ backend:
   ```bash
   npm run dev
   ```

### 5.3. Cài đặt và khởi chạy Frontend
#### 5.3.1. Mở một terminal mới, di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
#### 5.3.2. Cài đặt các gói thư viện cần thiết:
   ```bash
   npm install
   ```
#### 5.3.3. Khởi chạy ứng dụng web:
   ```bash
   npm run dev
   ```
#### 5.3.4. Truy cập theo đường dẫn hiển thị trên terminal để sử dụng ứng dụng.

## 6. Các lỗi thường gặp và cách khắc phục

### 6.1. Lỗi cổng bị chiếm (Port is already in use)
- **Nguyên nhân**: Cổng mặc định của frontend hoặc backend đang được sử dụng bởi một ứng dụng khác.
- **Cách khắc phục**: Tắt tiến trình đang sử dụng cổng hoặc thay đổi cổng bằng cách cấu hình trong file `.env` hoặc `package.json`.

### 6.2. Lỗi không kết nối được MongoDB
- **Nguyên nhân**: MongoDB chưa được khởi chạy (nếu cài cục bộ) hoặc chuỗi kết nối URI trong `.env` không chính xác.
- **Cách khắc phục**: Đảm bảo dịch vụ MongoDB đang chạy. Nếu dùng MongoDB Atlas, hãy kiểm tra lại Network Access (đảm bảo cho phép IP hiện tại) và xác minh lại chuỗi URI.

### 6.3. Lỗi thiếu gói thư viện (Module not found)
- **Nguyên nhân**: Quên chạy lệnh cài đặt thư viện hoặc cài đặt bị lỗi gián đoạn.
- **Cách khắc phục**: Mở terminal, di chuyển vào đúng thư mục frontend/backend và chạy lại lệnh `npm install`. Nếu vẫn lỗi, thử xóa thư mục `node_modules` và chạy lại.

## 7. Thực hiện
- Trần Trung Nam 
- Huỳnh Nguyễn Quốc Bảo 
- Trần Võ Ngọc Trường
- Ban Ngọc Tuấn
- Trần Xuân Phát 
- Trương Thành Danh 
- Lê Đức Tài 

*Trường Đại học Giao thông Vận tải Thành phố Hồ Chí Minh*
