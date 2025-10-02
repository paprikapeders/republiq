#!/bin/bash
set -e

# Set default PORT if not provided by Render
export PORT=${PORT:-10000}

echo "Starting deployment with PORT: $PORT"

# Replace PORT in nginx config
sed -i "s/listen 10000;/listen $PORT;/g" /etc/nginx/sites-available/default

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi


# Clear and cache config
echo "Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

echo "Starting services..."
# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.confnerate application key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf