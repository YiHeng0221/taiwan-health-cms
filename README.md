# Taiwan Health CMS

A headless CMS for **Taiwan Health Management** (a healthcare company), built as a production-ready monorepo with Next.js, NestJS, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | pnpm workspaces + Turborepo |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Tiptap rich-text editor, Zustand, TanStack Query v5, React Hook Form, Zod |
| **Backend** | NestJS 10, Prisma 5, PostgreSQL, Passport.js JWT, bcryptjs, class-validator, Helmet |
| **Storage** | Supabase Storage (image uploads) |
| **Deployment** | Railway (API + PostgreSQL), Vercel (Frontend) |
| **Testing** | Jest, ts-jest |
| **Code Quality** | ESLint, Prettier |

## Project Structure

```
taiwan-health-cms/
├── apps/
│   ├── api/                        # NestJS backend API
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   └── seed.ts             # Seed data
│   │   ├── src/
│   │   │   ├── common/             # Decorators, filters, interceptors
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # Authentication (JWT + HttpOnly cookies)
│   │   │   │   ├── users/          # User management
│   │   │   │   ├── articles/       # Articles with Tiptap JSON content
│   │   │   │   ├── tags/           # Article tags
│   │   │   │   ├── events/         # Event highlights with image galleries
│   │   │   │   ├── services/       # Service items
│   │   │   │   ├── faq/            # FAQ management
│   │   │   │   ├── home-sections/  # CMS-driven homepage sections
│   │   │   │   ├── contact/        # Contact form submissions
│   │   │   │   ├── settings/       # Global site settings
│   │   │   │   └── upload/         # Image upload via Supabase
│   │   │   └── prisma/             # Prisma service
│   │   └── Dockerfile
│   │
│   └── web/                        # Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── (public)/       # Public-facing pages
│           │   └── admin/          # Admin dashboard
│           ├── components/         # React components
│           ├── hooks/              # Custom hooks
│           ├── lib/                # Utilities
│           └── stores/             # Zustand stores
│
└── packages/
    └── shared-types/               # Shared TypeScript type definitions
```

## Features

- **Articles** -- Rich-text articles with Tiptap editor, slug-based routing, cover images, SEO meta descriptions, publish/draft workflow
- **Tags** -- Categorize articles with a many-to-many tag system
- **Events** -- Event highlights with date, location, and multi-image galleries
- **Services** -- Service item management with icons, descriptions, and feature lists
- **FAQ** -- Frequently asked questions with drag-and-drop reordering
- **Home Sections CMS** -- Configurable homepage sections (banner, carousel, features, services, CTA) with drag-and-drop ordering
- **Contact Form** -- Public contact form with rate limiting; admin inbox with read/unread status
- **Site Settings** -- Global configuration for site name, logo, favicon, footer, social links, and contact info
- **Authentication** -- JWT-based auth with HttpOnly cookies, role-based access control (ADMIN / EDITOR)
- **File Upload** -- Single and batch image upload to Supabase Storage
- **User Management** -- Admin-only user creation and listing

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ (or a Supabase project)
- Supabase account (for image storage)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd taiwan-health-cms

# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies
pnpm install

# Build the shared-types package
pnpm --filter @taiwan-health/shared-types build
```

### Environment Setup

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Edit each `.env` file with your values. See the [Environment Variables](#environment-variables) section below.

### Database Setup

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed with sample data
pnpm db:seed
```

### Run Development Servers

```bash
# Start both frontend and backend simultaneously
pnpm dev
```

Or start them individually:

```bash
# Backend API on port 4000
pnpm --filter api dev

# Frontend on port 3000
pnpm --filter web dev
```

Once running:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000/api |
| Admin Dashboard | http://localhost:3000/admin |

## Environment Variables

### API (`apps/api/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (used by Prisma) |
| `DIRECT_URL` | Direct PostgreSQL connection string (bypasses connection pooler; required by Supabase) |
| `JWT_SECRET` | Secret key for signing JWT tokens (min 32 characters in production) |
| `JWT_EXPIRES_IN` | JWT token expiration duration (e.g. `7d`) |
| `PORT` | API server port (default: `4000`) |
| `NODE_ENV` | Environment: `development` or `production` |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated (e.g. `https://yourdomain.com`) |
| `SUPABASE_URL` | Supabase project URL (for image storage) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for server-side storage operations) |

### Frontend (`apps/web/.env`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:4000`) |
| `NEXT_PUBLIC_SITE_NAME` | Site display name |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |

## Database

All Prisma commands can be run from the project root:

```bash
# Generate Prisma Client after schema changes
pnpm db:generate

# Push schema to database (no migration history)
pnpm db:push

# Create a migration (generates SQL migration files)
pnpm db:migrate

# Seed the database
pnpm db:seed

# Open Prisma Studio (visual database browser)
pnpm --filter api npx prisma studio
```

### Data Models

| Model | Description |
|-------|-------------|
| `User` | Admin/Editor accounts with bcrypt-hashed passwords |
| `Article` | Rich-text articles with Tiptap JSON content, slug, SEO fields |
| `Tag` | Article categories (many-to-many via `ArticleTag`) |
| `Faq` | FAQ entries with ordering |
| `HomeSection` | CMS-driven homepage sections with JSON config |
| `Service` | Service items with icon, features list, ordering |
| `Event` | Event highlights with date, location, image gallery |
| `ContactSubmission` | Visitor contact form submissions |
| `SiteSettings` | Global site configuration (singleton) |

## Deployment

### Backend -- Railway

1. Create a new Railway project.
2. Add a **PostgreSQL** service and note the connection string.
3. Add a new service from your Git repository, point it to the `apps/api` directory (or use the root Dockerfile at `apps/api/Dockerfile`).
4. Set environment variables in Railway:
   - `DATABASE_URL`, `DIRECT_URL` (from the PostgreSQL service)
   - `JWT_SECRET` (strong random string, 32+ characters)
   - `JWT_EXPIRES_IN` (e.g. `7d`)
   - `FRONTEND_URL` (your Vercel deployment URL)
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`
5. Railway will build using the Dockerfile (multi-stage, Node 20 slim).

### Frontend -- Vercel

1. Import the repository into Vercel.
2. Set the **Root Directory** to `apps/web`.
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` -- your Railway API URL (e.g. `https://your-api.railway.app`)
   - `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL`
4. The `next.config.js` rewrites `/api/*` requests to the backend, so the frontend calls `/api/...` as a relative path and the rewrite proxies to the actual backend URL.

## API Endpoints

All endpoints are prefixed with `/api`. Routes marked **Public** do not require authentication. All other routes require a valid JWT (sent as an HttpOnly cookie or `Authorization: Bearer <token>` header).

### Auth (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/login` | Public | Login and receive JWT cookie |
| `POST` | `/auth/logout` | Auth | Clear JWT cookie |
| `GET` | `/auth/me` | Auth | Get current user |
| `POST` | `/auth/refresh` | Auth | Refresh JWT token |

### Articles (`/api/articles`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/articles` | Public | List published articles (paginated) |
| `GET` | `/articles/slug/:slug` | Public | Get published article by slug |
| `GET` | `/articles/admin` | Admin/Editor | List all articles (including drafts) |
| `GET` | `/articles/admin/:id` | Admin/Editor | Get article by ID |
| `POST` | `/articles` | Admin/Editor | Create article |
| `PUT` | `/articles/:id` | Admin/Editor | Update article |
| `PATCH` | `/articles/:id/publish` | Admin | Toggle publish status |
| `DELETE` | `/articles/:id` | Admin | Delete article |

### Tags (`/api/tags`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/tags` | Public | List all tags |
| `POST` | `/tags` | Admin | Create tag |
| `PUT` | `/tags/:id` | Admin | Update tag |
| `DELETE` | `/tags/:id` | Admin | Delete tag |

### Events (`/api/events`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/events` | Public | List published events (paginated) |
| `GET` | `/events/:slug` | Public | Get event by slug |
| `GET` | `/events/admin` | Admin/Editor | List all events (paginated) |
| `GET` | `/events/admin/:id` | Admin/Editor | Get event by ID |
| `POST` | `/events` | Admin/Editor | Create event |
| `PUT` | `/events/:id` | Admin/Editor | Update event |
| `DELETE` | `/events/:id` | Admin | Delete event |

### Services (`/api/services`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/services` | Public | List active services |
| `GET` | `/services/admin` | Admin | List all services (paginated) |
| `GET` | `/services/admin/:id` | Admin | Get service by ID |
| `POST` | `/services/admin` | Admin | Create service |
| `PUT` | `/services/admin/:id` | Admin | Update service |
| `DELETE` | `/services/admin/:id` | Admin | Delete service |

### FAQ (`/api/faq`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/faq` | Public | List active FAQs (ordered) |
| `GET` | `/faq/admin` | Admin | List all FAQs |
| `GET` | `/faq/admin/:id` | Admin | Get FAQ by ID |
| `POST` | `/faq` | Admin | Create FAQ |
| `PUT` | `/faq/:id` | Admin | Update FAQ |
| `PATCH` | `/faq/reorder` | Admin | Reorder FAQs |
| `DELETE` | `/faq/:id` | Admin | Delete FAQ |

### Home Sections (`/api/home-sections`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/home-sections` | Public | List active sections (ordered) |
| `GET` | `/home-sections/admin` | Admin | List all sections |
| `GET` | `/home-sections/admin/:id` | Admin | Get section by ID |
| `POST` | `/home-sections` | Admin | Create section |
| `PUT` | `/home-sections/:id` | Admin | Update section |
| `PATCH` | `/home-sections/reorder` | Admin | Reorder sections |
| `DELETE` | `/home-sections/:id` | Admin | Delete section |

### Contact (`/api/contact`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/contact` | Public | Submit contact form (rate limited) |
| `GET` | `/contact` | Admin | List all submissions (paginated) |
| `PATCH` | `/contact/:id/read` | Admin | Mark as read |
| `DELETE` | `/contact/:id` | Admin | Delete submission |

### Settings (`/api/settings`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/settings` | Public | Get site settings |
| `PUT` | `/settings` | Admin | Update site settings |

### Users (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/users` | Admin | List all users |
| `POST` | `/users` | Admin | Create user |

### Upload (`/api/upload`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/upload/image?folder=<name>` | Admin/Editor | Upload single image |
| `POST` | `/upload/images?folder=<name>` | Admin/Editor | Upload multiple images (max 10) |
| `DELETE` | `/upload/image` | Admin/Editor | Delete image by URL |

Allowed folders: `articles`, `events`, `settings`, `services`, `home-sections`.

## Testing

```bash
# Run all tests
pnpm --filter api test

# Run tests with coverage
pnpm --filter api test:cov

# Run a specific test file
pnpm --filter api test -- --testPathPattern=articles
```

Tests use Jest with ts-jest. Test files are co-located with the source code using the `*.spec.ts` naming convention.

## License

MIT
