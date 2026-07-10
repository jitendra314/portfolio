FROM php:8.2-fpm-alpine

# Allow Composer to run as root inside Docker (safe in containers)
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    zip \
    unzip \
    git \
    mysql-client \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libwebp-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        gd \
        opcache \
        bcmath \
        exif \
        pcntl

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first (better layer caching)
COPY composer.json ./

# Install PHP dependencies
RUN composer install \
    --no-scripts \
    --no-autoloader \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress

# Copy rest of application
COPY . .

# Generate optimised autoloader
RUN composer dump-autoload --optimize --no-dev --no-interaction

# Set correct permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080

CMD ["sh", "/var/www/docker/start.sh"]