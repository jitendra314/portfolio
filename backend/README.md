# Portfolio Backend — Laravel 11

## Requirements
- PHP 8.2+
- Composer
- MySQL 8+

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
# Edit .env with your DB credentials
php artisan migrate --seed
php artisan serve
```

## Default Admin Credentials
- Email: admin@portfolio.dev
- Password: admin123

## API Base URL
`http://localhost:8000/api`

## Auth
JWT-based. Login → get token → pass as `Authorization: Bearer <token>`.
