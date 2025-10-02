# --- Stage 1: PHP dependencies ---
FROM composer:2 AS vendor
WORKDIR /app
COPY app/composer.json app/composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress
COPY app ./

# --- Stage 2: Node build ---
FROM node:22 AS frontend
WORKDIR /app
COPY app/package.json app/package-lock.json ./
RUN npm ci
COPY app ./
RUN npm run build

# --- Stage 3: Final image with PHP-FPM ---
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip libpq-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_mysql zip

WORKDIR /var/www/html

# Copy vendor deps from composer stage
COPY --from=vendor /app/vendor ./vendor

# Copy built frontend assets from node stage
COPY --from=frontend /app/public/build ./public/build

# Copy the rest of the Laravel app
COPY app ./

# Expose PHP-FPM
EXPOSE 9000

# Optimize Laravel for prod
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

CMD ["php-fpm"]
