# Use official PHP with FPM
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip libpq-dev libzip-dev zip nginx supervisor \
    && docker-php-ext-install pdo pdo_mysql zip

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Install Node + build frontend (optional if you use Vite)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install && npm run build

# Configure permissions for storage and cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy Nginx config
COPY deploy/nginx.conf /etc/nginx/sites-available/default

# Copy Supervisor config to run php-fpm + nginx together
COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port Render expects
EXPOSE 10000

# Render sets $PORT, use it for Nginx
ENV PORT=10000

# Run supervisor (manages both Nginx + PHP-FPM)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
