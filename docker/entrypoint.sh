#!/bin/sh

set -eu

cd /var/www/html

echo ""
echo "=========================================="
echo "       ECOLE LES SAVANTS - STARTUP"
echo "=========================================="

# =====================================================
# 1. CONFIGURE RENDER PORT
# =====================================================

PORT="${PORT:-10000}"

case "$PORT" in
    ''|*[!0-9]*)
        echo "ERROR: Invalid PORT."
        exit 1
        ;;
esac

echo "Configuring Apache on port ${PORT}..."

sed -i "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf

sed -i "s/:80>/:${PORT}>/" \
    /etc/apache2/sites-available/000-default.conf


# =====================================================
# 2. VERIFY VITE MANIFEST
# =====================================================

echo "Checking Vite manifest..."

if [ ! -f public/build/manifest.json ]; then
    echo "ERROR: Vite manifest not found!"
    echo "Expected: /var/www/html/public/build/manifest.json"

    ls -lah public/

    if [ -d public/build ]; then
        ls -lah public/build/
    fi

    exit 1
fi

echo "Vite manifest found successfully."


# =====================================================
# 3. CHECK LARAVEL DIRECTORIES
# =====================================================

mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache

echo "Laravel directories ready."


# =====================================================
# 4. STORAGE LINK
# =====================================================

echo "Creating storage link..."

if [ ! -L public/storage ]; then
    php artisan storage:link
fi


# =====================================================
# 5. DATABASE MIGRATIONS
# =====================================================

case "${RUN_MIGRATIONS:-false}" in
    true)
        echo "Running database migrations..."

        su -s /bin/sh www-data -c \
            'php artisan migrate --force'
        ;;

    false)
        echo "Database migrations skipped."
        ;;

    *)
        echo "ERROR: RUN_MIGRATIONS must be true or false."
        exit 1
        ;;
esac


# =====================================================
# 6. LARAVEL CONFIGURATION CACHE
# =====================================================

echo "Caching Laravel configuration..."

su -s /bin/sh www-data -c \
    'php artisan config:cache'


# =====================================================
# 7. LARAVEL ROUTES CACHE
# =====================================================

echo "Caching Laravel routes..."

su -s /bin/sh www-data -c \
    'php artisan route:cache'


# =====================================================
# 8. VERIFY APPLICATION
# =====================================================

echo ""
echo "=========================================="
echo "       APPLICATION READY"
echo "=========================================="

echo "Port: ${PORT}"
echo "Vite: OK"
echo "Laravel: OK"
echo "Apache: Starting..."
echo ""

# =====================================================
# 9. START APACHE
# =====================================================

exec apache2-foreground
