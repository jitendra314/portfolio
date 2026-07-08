# 🧑‍💻 Developer Portfolio — React + Laravel

A full-stack, production-style portfolio website with dark/light theming, a blog, and a complete admin panel — manage every piece of content without touching code.

---

## ✨ Features

**Public site**
- Animated hero, featured projects, skills, testimonials
- Projects gallery — search + category filter
- Project detail pages
- Blog with tags, search, featured post, reading time
- About page — skills breakdown, work history timeline
- Contact form with validation
- Dark / light theme toggle (persisted, no flash-of-wrong-theme)
- Smooth page transitions, scroll-to-top button, 404 page

**Admin panel**
- JWT-secured login
- Dashboard with live stats, greeting, quick actions, site health panel
- Projects — full CRUD, image upload, tag input, filter tabs
- Skills — grouped by category, proficiency sliders
- Experience — timeline manager
- Testimonials — star ratings
- Blog — HTML editor, cover image, tags, publish toggle
- Contacts inbox — search, read/unread filter, reply via email
- About — two-column editor (bio, stats, social links)
- Settings — SEO, analytics, maintenance mode
- Profile — change name/email/password
- Reusable confirm dialogs, drag-and-drop image upload, debounced search

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router v6, TanStack Query, React Hook Form, Lucide Icons |
| Styling | Pure CSS variables — dark/light theme, no framework |
| Backend | Laravel 11, JWT Auth (`tymon/jwt-auth`) |
| Database | MySQL 8 |
| Auth | JWT bearer tokens (localStorage) |

---

## Project Structure

```
portfolio/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── public/      Home, Projects, ProjectDetail, Blog, BlogDetail, About, Contact, NotFound
│       │   └── admin/       Dashboard, Projects, Skills, Experiences, Testimonials, Blog, Contacts, About, Settings, Profile, Login
│       ├── components/
│       │   ├── public/      PublicLayout (navbar/footer/theme toggle)
│       │   ├── admin/       AdminLayout (sidebar/topbar)
│       │   └── shared/      ImageUpload, TagInput, ConfirmDialog, ThemeToggle, PageTransition
│       ├── hooks/           useCrud (generic CRUD), useDebounce
│       ├── context/         AuthContext, ThemeContext
│       ├── utils/           api.js — all Axios calls
│       └── styles/          globals.css — design tokens, dark+light themes
│
└── backend/
    ├── app/
    │   ├── Http/Controllers/
    │   │   ├── Api/         Public: projects, skills, blog, contact…
    │   │   └── Admin/       Protected CRUD + dashboard + profile
    │   ├── Models/          User, Project, Skill, Experience, Testimonial, Contact, About, Setting, BlogPost
    │   └── Providers/
    ├── database/
    │   ├── migrations/      All table schemas
    │   └── seeders/         Demo data + admin user
    ├── routes/api.php
    └── config/              app, auth, cors, jwt, database, filesystems, logging
```

---

## Quick Start

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
# Edit .env → set DB_DATABASE, DB_USERNAME, DB_PASSWORD
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan storage:link
php artisan serve
# → http://localhost:8000
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 3. Admin Login

Visit **http://localhost:5173/admin/login**

```
Email:    admin@portfolio.dev
Password: admin123
```

---

## API Reference

### Public
```
GET  /api/v1/about
GET  /api/v1/projects
GET  /api/v1/projects/:slug
GET  /api/v1/skills
GET  /api/v1/experiences
GET  /api/v1/testimonials
GET  /api/v1/settings
GET  /api/v1/blog
GET  /api/v1/blog/:slug
POST /api/v1/contact
```

### Auth
```
POST /api/v1/auth/login
POST /api/v1/auth/logout   (protected)
GET  /api/v1/auth/me       (protected)
POST /api/v1/auth/refresh  (protected)
```

### Admin (Bearer token required)
```
GET/POST         /api/v1/admin/projects
GET/PUT/DELETE   /api/v1/admin/projects/:id
PATCH            /api/v1/admin/projects/:id/toggle
GET/POST         /api/v1/admin/skills
GET/PUT/DELETE   /api/v1/admin/skills/:id
GET/POST         /api/v1/admin/experiences
GET/POST         /api/v1/admin/testimonials
GET/POST         /api/v1/admin/blog
GET/PUT/DELETE   /api/v1/admin/blog/:id
GET/PATCH/DELETE /api/v1/admin/contacts/:id
GET/PUT          /api/v1/admin/about
GET/PUT          /api/v1/admin/settings
PUT              /api/v1/admin/profile
PUT              /api/v1/admin/profile/password
GET              /api/v1/admin/stats
POST             /api/v1/admin/upload
```

---

## Customisation

- **Colours / theme** — edit CSS variables in `frontend/src/styles/globals.css` (`:root`, `[data-theme="dark"]`, `[data-theme="light"]`)
- **Fonts** — swap the Google Fonts `<link>` in `index.html`
- **Add a page** — create in `pages/public/`, register `<Route>` in `App.jsx`
- **Add an API resource** — model + migration + controller (Api + Admin) + route in `routes/api.php` + helper in `utils/api.js`
- **Deploy** — `npm run build` outputs static files to `frontend/dist/`; host on Vercel/Netlify/S3 or serve via Laravel's `public/`. The API can run on any PHP 8.2+ host (Forge, Vapor, plain VPS, etc).

---

## Security notes for production

- Set `APP_DEBUG=false` and a strong, unique `JWT_SECRET`
- Restrict `config/cors.php` `allowed_origins` to your real frontend domain
- Run `php artisan config:cache` / `route:cache` after deploy
- Put the upload directory behind size/type validation (already enforced server-side in `MediaController`)
