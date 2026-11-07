#!/bin/sh
set -eu

cd /var/www/html

PORT="${PORT:-10000}"

case "$PORT" in
    ''|*[!0-9]*)
        echo "PORT must be a numeric TCP port." >&2
        exit 1
        ;;
esac

sed -i "s/^Listen 80$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf

php artisan storage:link

case "${RUN_MIGRATIONS:-false}" in
    true)
        su -s /bin/sh www-data -c 'php artisan migrate --force'
        ;;
    false)
        ;;
    *)
        echo "RUN_MIGRATIONS must be either true or false." >&2
        exit 1
        ;;
esac

su -s /bin/sh www-data -c 'php artisan config:cache'
su -s /bin/sh www-data -c 'php artisan route:cache'

exec apache2-foreground
