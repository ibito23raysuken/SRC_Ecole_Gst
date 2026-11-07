
#!/bin/sh
set -eu

cd /var/www/html

echo "======================================"
echo " Starting Laravel application"
echo "======================================"

# 1. Configuration du port Render
PORT="${PORT:-10000}"

case "$PORT" in
    ''|*[!0-9]*)
        echo "ERROR: PORT must be numeric." >&2
        exit 1
        ;;
esac

sed -i "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# 2. Vérification des fichiers Vite
echo "Checking Vite manifest..."

if [ ! -f public/build/manifest.json ]; then
    echo "ERROR: Vite manifest not found!"
    echo "Expected: /var/www/html/public/build/manifest.json"
    ls -lah public/
    ls -lah public/build/ 2>/dev/null || true
    exit 1
fi

echo "Vite manifest found successfully."

# 3. Vérification des permissions Laravel
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache

# 4. Lien symbolique pour les fichiers publics
php artisan storage:link

# 5. Migrations optionnelles
case "${RUN_MIGRATIONS:-false}" in
    true)
        echo "Running database migrations..."
        su -s /bin/sh www-data -c 'php artisan migrate --force'
        ;;
    false)
        echo "Database migrations skipped."
        ;;
    *)
        echo "ERROR: RUN_MIGRATIONS must be true or false." >&2
        exit 1
        ;;
esac

# 6. Cache Laravel
echo "Caching Laravel configuration..."

su -s /bin/sh www-data -c 'php artisan config:cache'
su -s /bin/sh www-data -c 'php artisan route:cache'

# 7. Démarrage Apache
echo "======================================"
echo " Laravel application ready"
echo "======================================"

exec apache2-foreground
