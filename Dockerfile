# --- Stage 1: PHP dependencies ---
FROM composer:2 AS vendor

WORKDIR /app

# Copy only composer files first (better caching)
COPY app/composer.json app/composer.lock ./

# Install PHP dependencies (skip artisan scripts here)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts

# Copy the rest of Laravel (for autoload)
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

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git curl unzip libzip-dev libpq-dev zip \
    && docker-php-ext-install pdo pdo_mysql bcmath pcntl zip

# Install Composer (from official composer image)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy vendor deps from composer stage
COPY --from=vendor /app/vendor ./vendor

# Copy built frontend assets from node stage
COPY --from=frontend /app/public/build ./public/build

# Copy the full Laravel app
COPY app ./

# Ensure storage & bootstrap/cache are writable
RUN chown -R www-data:www-data storage bootstrap/cache

# Run Laravel optimizations (now that PHP + extensions exist)
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && php artisan event:cache

# Expose PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
