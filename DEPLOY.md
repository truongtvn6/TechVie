# 🚀 Hướng Dẫn Deploy TechVie

## Tổng quan kiến trúc

```
[User Browser]
      │
      ▼
[Vercel] ─ Frontend (React + Vite)
      │  VITE_API_BASE_URL=https://techvie-backend.onrender.com
      │
      ▼
[Render] ─ Backend (Node.js + Docker)
      │  MongoDB Atlas | Cloudinary | Gmail SMTP | Google OAuth2
```

---

## Phần 1: Deploy Backend lên Render

### Bước 1: Đăng ký & kết nối GitHub

1. Truy cập [render.com](https://render.com) → đăng nhập bằng GitHub
2. **New +** → **Web Service**
3. Chọn repository `TechVie`

### Bước 2: Cấu hình service

| Trường | Giá trị |
|--------|---------|
| **Name** | `techvie-backend` |
| **Region** | Singapore |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | **Docker** |
| **Dockerfile Path** | `./Dockerfile` |
| **Plan** | Free (hoặc Starter để tránh cold start) |

### Bước 3: Thêm Environment Variables

Vào **Environment** tab và thêm các biến sau:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | *(MongoDB Atlas connection string)* |
| `JWT_SECRET` | *(secret key mạnh, random 32+ ký tự)* |
| `CLOUDINARY_CLOUD_NAME` | *(cloud name)* |
| `CLOUDINARY_API_KEY` | *(api key)* |
| `CLOUDINARY_API_SECRET` | *(api secret)* |
| `GOOGLE_CLIENT_ID` | *(google client id)* |
| `GOOGLE_CLIENT_SECRET` | *(google client secret)* |
| `GOOGLE_REDIRECT_URI` | `https://techvie-backend.onrender.com/api/auth/google/callback` |
| `EMAIL_SERVICE` | `gmail` |
| `EMAIL_USER` | *(gmail address)* |
| `EMAIL_PASS` | *(gmail app password)* |
| `FRONTEND_URL` | `https://techvie.vercel.app` *(điền sau khi có Vercel URL)* |

### Bước 4: Deploy

- Click **Create Web Service**
- Render sẽ build Docker image và deploy (~3-5 phút)
- Kiểm tra tại: `https://techvie-backend.onrender.com/`
- Kết quả mong đợi: `{"status":"success","message":"Chào bạn, Backend TechVie đã hoạt động ổn định!"}`

> ⚠️ **Lưu ý Google OAuth2:** Vào [Google Console](https://console.cloud.google.com) → Credentials → thêm `https://techvie-backend.onrender.com/api/auth/google/callback` vào **Authorized redirect URIs**

---

## Phần 2: Deploy Frontend lên Vercel

### Bước 1: Đăng ký & kết nối GitHub

1. Truy cập [vercel.com](https://vercel.com) → đăng nhập bằng GitHub
2. **Add New Project** → Import repository `TechVie`

### Bước 2: Cấu hình project

| Trường | Giá trị |
|--------|---------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `vite build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Bước 3: Thêm Environment Variables

Vào **Environment Variables** tab:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://techvie-backend.onrender.com` |

### Bước 4: Deploy

- Click **Deploy**
- Vercel tự động build và deploy (~2-3 phút)
- Kiểm tra URL Vercel (dạng `https://techvie-xxx.vercel.app`)

### Bước 5: Cập nhật FRONTEND_URL trên Render

Sau khi có URL Vercel thật, quay lại Render Dashboard:
- **Environment** → cập nhật `FRONTEND_URL` = URL Vercel thật
- **Manual Deploy** → Redeploy backend

---

## Phần 3: Chạy Local (Development)

### Backend

```bash
cd backend
# Đổi tên .env.local thành .env hoặc dùng dotenv-cli
cp .env.local .env    # Lần đầu setup
npm run dev           # nodemon server.js → http://localhost:5000
```

### Frontend

```bash
cd frontend
# .env.local đã được tạo sẵn với VITE_API_BASE_URL=http://localhost:5000
npm run dev           # tsx server.ts → http://localhost:3000
```

### Kiểm tra kết nối

```
Frontend (localhost:3000)
  └── /api/* → proxy → Backend (localhost:5000)  ← vite.config.ts
```

---

## Phần 4: Cấu trúc file Environment

```
TechVie/
├── backend/
│   ├── .env.local        ← Local dev (KHÔNG commit)
│   ├── .env.example      ← Template (commit được)
│   └── ...
├── frontend/
│   ├── .env.local        ← Local dev (KHÔNG commit)
│   ├── .env.example      ← Template (commit được)
│   └── ...
```

| File | Mục đích | Commit? |
|------|----------|---------|
| `.env.local` | Dev local | ❌ Không |
| `.env.example` | Template tham khảo | ✅ Có |
| Render Dashboard | Production backend | N/A |
| Vercel Dashboard | Production frontend | N/A |

---

## Phần 5: Checklist trước khi deploy

### Code Quality
- [ ] Không có `console.log` nhạy cảm
- [ ] Không hardcode secret trong source code
- [ ] `npm run build` chạy thành công ở frontend

### Security
- [ ] Tất cả secrets đã được chuyển sang env vars
- [ ] `.env.local` đã có trong `.gitignore`
- [ ] `FRONTEND_URL` đã được set đúng trên Render

### Functional
- [ ] Backend health check: `GET /` → 200 OK
- [ ] Database connected: `GET /test-db` → 200 OK
- [ ] Frontend load được và gọi API thành công
- [ ] Google OAuth redirect URI đã được cập nhật

---

## Phần 6: Rollback & Troubleshooting

### Backend (Render)
```
Render Dashboard → Deploys → chọn deploy cũ → Redeploy
```

### Frontend (Vercel)
```
Vercel Dashboard → Deployments → chọn deployment cũ → Promote to Production
```

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` trên Render có khớp với URL Vercel không
- Đảm bảo không có trailing slash: `https://techvie.vercel.app` ✅, `https://techvie.vercel.app/` ❌

### Backend cold start (free tier)
- Render free tier sẽ sleep sau 15 phút không hoạt động
- Lần đầu request sau khi sleep có thể mất ~30 giây
- Giải pháp: Nâng lên Starter plan ($7/tháng) hoặc dùng uptime monitor
