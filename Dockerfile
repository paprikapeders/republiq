# --- Stage 1: PHP dependencies ---
FROM composer:2 AS vendor

# Install system deps for PHP extensions needed by Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl \
    && docker-php-ext-install zip pcntl bcmath

WORKDIR /app

# Copy composer files first (better cache)
COPY app/composer.json app/composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Copy rest of the Laravel app
COPY app ./


# --- Stage 2: Node build (for Inertia/Vite) ---
FROM node:22 AS frontend
WORKDIR /app
COPY app/package.json app/package-lock.json ./
RUN npm ci
COPY app ./
RUN npm run build


# --- Stage 3: Final runtime image ---
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip libzip-dev zip \
    && docker-php-ext-install pdo pdo_mysql zip bcmath pcntl

WORKDIR /var/www/html

# Copy vendor deps from composer stage
COPY --from=vendor /app/vendor ./vendor

# Copy built frontend assets from node stage
COPY --from=frontend /app/public/build ./public/build

# Copy the rest of the Laravel app
COPY app ./

# Expose PHP-FPM (Render routes traffic here via internal proxy)
EXPOSE 9000

# Laravel optimization for prod
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

CMD ["php-fpm"]
