#!/bin/sh
set -e

echo "=== Running migrations ==="
php artisan migrate --force

echo "=== Seeding (skip if already seeded) ==="
php artisan db:seed --force 2>/dev/null || echo "Seeding skipped (already done)"

echo "=== Caching config for production ==="
php artisan config:cache
php artisan route:cache

echo "=== Linking storage ==="
php artisan storage:link 2>/dev/null || true

echo "=== Starting services ==="
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
