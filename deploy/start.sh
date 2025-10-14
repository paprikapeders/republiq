#!/bin/bash
set -e

# Set default PORT if not provided by Render
export PORT=${PORT:-10000}

echo "Starting deployment with PORT: $PORT"

# Replace PORT in nginx config
sed -i "s/listen 10000;/listen $PORT;/g" /etc/nginx/sites-available/default

# Force HTTPS URLs in Laravel for production
export ASSET_URL="https://${RENDER_EXTERNAL_HOSTNAME:-republiq.onrender.com}"
export APP_URL="https://${RENDER_EXTERNAL_HOSTNAME:-republiq.onrender.com}"
export FORCE_HTTPS=true
export HTTPS=on
export SERVER_PORT=443

# Set proxy trust headers for Laravel
export TRUSTED_PROXIES="*"

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# Ensure storage & cache folders are writable
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Clear and cache config
echo "Optimizing Laravel..."
php artisan config:cache
php artisan route:cache

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

echo "Starting services..."
# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf