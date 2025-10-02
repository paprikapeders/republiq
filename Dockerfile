# --- Stage 1: PHP dependencies ---
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress
COPY . .


# --- Stage 2: Node build ---
FROM node:22 AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
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

# Copy the rest of the app (controllers, routes, config, etc.)
COPY . .

# Expose PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
