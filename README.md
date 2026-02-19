# 台灣健康管理公司官方網站

Production-ready monorepo 專案，使用 Next.js + NestJS + PostgreSQL 建構的 CMS 系統。

## 📁 專案結構

```
taiwan-health-cms/
├── apps/
│   ├── api/                    # NestJS 後端 API
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # 資料庫 Schema
│   │   │   └── seed.ts         # 種子資料
│   │   └── src/
│   │       ├── common/         # 共用裝飾器、過濾器、攔截器
│   │       ├── modules/        # 功能模組
│   │       │   ├── auth/       # 認證模組 (JWT)
│   │       │   ├── users/      # 使用者模組
│   │       │   ├── articles/   # 文章模組
│   │       │   ├── home-sections/  # 首頁區塊模組
│   │       │   ├── events/     # 活動模組
│   │       │   └── contact/    # 聯絡表單模組
│   │       └── prisma/         # Prisma 服務
│   │
│   └── web/                    # Next.js 前端
│       └── src/
│           ├── app/            # App Router 頁面
│           │   ├── (public)/   # 公開頁面
│           │   └── admin/      # 管理後台
│           ├── components/     # React 元件
│           ├── hooks/          # Custom Hooks
│           ├── lib/            # 工具函式
│           └── stores/         # Zustand Stores
│
└── packages/
    └── shared-types/           # 共用 TypeScript 型別
```

## 🛠 技術棧

### 前端 (apps/web)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **State Management**: 
  - TanStack Query v5 (Server State)
  - Zustand 4.5 (Client State)
- **Forms**: React Hook Form + Zod
- **Rich Text Editor**: Tiptap 2.2
- **Icons**: Lucide React

### 後端 (apps/api)
- **Framework**: NestJS 10.3
- **Language**: TypeScript 5.4
- **Database**: PostgreSQL
- **ORM**: Prisma 5.10
- **Authentication**: JWT (Passport.js)
- **Validation**: class-validator

### 工具
- **Monorepo**: pnpm Workspace + Turborepo
- **Code Quality**: ESLint + Prettier
- **Build**: tsup (shared-types)

## 🚀 快速開始

### 先決條件

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+

### 安裝

```bash
# Clone 專案
git clone <repository-url>
cd taiwan-health-cms

# 安裝依賴
pnpm install

# 複製環境變數檔案
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 編輯 apps/api/.env 設定資料庫連線
# DATABASE_URL="postgresql://user:password@localhost:5432/taiwan_health"
```

### 資料庫設定

```bash
# 產生 Prisma Client
cd apps/api
pnpm prisma generate

# 執行資料庫遷移
pnpm prisma migrate dev

# 執行種子資料
pnpm prisma db seed
```

### 啟動開發伺服器

```bash
# 在專案根目錄
pnpm dev
```

這會同時啟動：
- 前端: http://localhost:3000
- 後端: http://localhost:4000

### 建構專案

```bash
# 建構所有應用程式
pnpm build

# 只建構特定應用
pnpm --filter @taiwan-health/api build
pnpm --filter @taiwan-health/web build
```

## 🔐 認證系統

### 認證流程

1. 使用者送出 email/password 到 `/api/auth/login`
2. 後端驗證後產生 JWT Token
3. Token 以 HttpOnly Cookie 儲存（防止 XSS）
4. 後續請求自動帶上 Cookie
5. 後端從 Cookie 或 Authorization Header 提取 Token

### 預設管理員帳號

```
Email: admin@taiwanhealth.com
Password: admin123
```

### JWT 設定

- 有效期限: 7 天
- Cookie 設定:
  - HttpOnly: true
  - SameSite: 'lax'
  - Secure: true (production)

### 權限控制

- `@Public()` - 標記公開 API
- `@Roles(UserRole.ADMIN)` - 限制管理員存取
- `JwtAuthGuard` - 全域 JWT 驗證
- `RolesGuard` - 角色權限驗證

## 📝 API 端點

### 認證 `/api/auth`
- `POST /login` - 登入
- `POST /logout` - 登出
- `GET /me` - 取得當前使用者

### 文章 `/api/articles`
- `GET /` - 文章列表（公開）
- `GET /:slug` - 文章詳情（公開）
- `GET /admin/all` - 所有文章（需認證）
- `POST /` - 建立文章
- `PATCH /:id` - 更新文章
- `DELETE /:id` - 刪除文章

### 首頁區塊 `/api/home-sections`
- `GET /` - 公開區塊
- `GET /admin` - 所有區塊
- `POST /` - 建立區塊
- `PATCH /:id` - 更新區塊
- `DELETE /:id` - 刪除區塊
- `PATCH /reorder` - 重新排序

### 活動 `/api/events`
- `GET /` - 活動列表
- `POST /` - 建立活動
- `PATCH /:id` - 更新活動
- `DELETE /:id` - 刪除活動

### 聯絡表單 `/api/contact`
- `POST /` - 送出聯絡表單（公開）
- `GET /` - 查看所有表單（需認證）

## 🗃 資料庫 Schema

### User
- 使用者帳號，支援 ADMIN/EDITOR/VIEWER 角色

### Article
- 文章，支援 Tiptap JSON 格式內容
- 自動產生 slug，支援 SEO 設定

### HomeSection
- 首頁區塊，可自訂類型（banner, carousel, services, cta）
- 支援拖曳排序

### Event
- 活動花絮，支援圖片庫

### ContactSubmission
- 訪客聯絡表單

## 🚢 部署策略

### Docker Compose (推薦)

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: taiwan_health
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: taiwan_health
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: ./apps/api
    environment:
      DATABASE_URL: postgresql://taiwan_health:your_password@postgres:5432/taiwan_health
      JWT_SECRET: your_jwt_secret
    depends_on:
      - postgres

  web:
    build: ./apps/web
    environment:
      NEXT_PUBLIC_API_URL: https://api.yourdomain.com
    depends_on:
      - api

volumes:
  postgres_data:
```

### 雲端部署選項

1. **Vercel + Railway**
   - 前端部署至 Vercel
   - 後端 + PostgreSQL 部署至 Railway

2. **AWS**
   - 前端: S3 + CloudFront
   - 後端: ECS Fargate 或 Lambda
   - 資料庫: RDS PostgreSQL

3. **Google Cloud**
   - 前端: Cloud Run
   - 後端: Cloud Run
   - 資料庫: Cloud SQL

### 環境變數

#### API (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
PORT=4000
CORS_ORIGIN=https://yourdomain.com
```

#### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 📜 腳本說明

```bash
# 開發
pnpm dev          # 啟動所有開發伺服器
pnpm build        # 建構所有應用
pnpm lint         # 執行 ESLint

# Prisma
pnpm --filter @taiwan-health/api prisma generate    # 產生 Client
pnpm --filter @taiwan-health/api prisma migrate dev # 遷移資料庫
pnpm --filter @taiwan-health/api prisma studio      # 開啟 Prisma Studio

# 單獨啟動
pnpm --filter @taiwan-health/api dev   # 只啟動後端
pnpm --filter @taiwan-health/web dev   # 只啟動前端
```

## 🎨 設計系統

### 顏色

- Primary: `#0066CC` (藍色)
- Secondary: `#00A651` (綠色)
- Accent: `#FF6B00` (橘色)

### 字體

- 標題: Noto Sans TC Bold
- 內文: Noto Sans TC Regular

## 📄 授權

MIT License
