# Portfolio Frontend — React + Vite

## Requirements
- Node.js 18+
- npm or yarn

## Setup

```bash
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## Environment
The Vite dev server proxies `/api/*` to `http://localhost:8000`.
No `.env` needed for local dev — just make sure Laravel is running.

## Build for Production
```bash
npm run build
# Output in /dist — deploy to any static host or serve via Laravel public/
```

## Routes
| Path | Description |
|------|-------------|
| `/` | Homepage with hero, featured projects, skills, testimonials |
| `/projects` | All projects with search & filter |
| `/projects/:slug` | Single project detail |
| `/about` | Full about page with skills & experience |
| `/contact` | Contact form |
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard (protected) |
| `/admin/projects` | Manage projects |
| `/admin/skills` | Manage skills |
| `/admin/experiences` | Manage work history |
| `/admin/testimonials` | Manage testimonials |
| `/admin/contacts` | View contact messages |
| `/admin/about` | Edit about info |
| `/admin/settings` | Site settings |
