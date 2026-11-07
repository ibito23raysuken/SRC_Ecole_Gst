
# =====================================================
# 1. FRONTEND BUILD : NODE + REACT + VITE
# =====================================================
FROM node:22-alpine AS frontend

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./

RUN npm ci

# Copy application source
COPY . .

# Compile React and Vite
RUN npm run build

# Verify Vite manifest
RUN test -f /app/public/build/manifest.json \
    || (echo "ERROR: Vite manifest not generated!" && exit 1)


# =====================================================
# 2. BACKEND : PHP + APACHE + LARAVEL
# =====================================================
FROM php:8.3-apache AS app

# Install system dependencies and PostgreSQL extension
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        unzip \
    && docker-php-ext-install pdo_pgsql \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html


# =====================================================
# 3. COPY LARAVEL APPLICATION
# =====================================================
COPY . .


# =====================================================
# 4. INSTALL PHP DEPENDENCIES
# =====================================================
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader


# =====================================================
# 5. APACHE CONFIGURATION
# =====================================================
RUN sed -ri \
        -e 's!/var/www/html!/var/www/html/public!g' \
        -e 's!<Directory /var/www/>!<Directory /var/www/html/public>!' \
        -e 's!AllowOverride None!AllowOverride All!' \
        /etc/apache2/sites-available/000-default.conf \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf


# =====================================================
# 6. LARAVEL DIRECTORIES AND PERMISSIONS
# =====================================================
RUN mkdir -p \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data \
        storage \
        bootstrap/cache


# =====================================================
# 7. COPY COMPILED VITE FILES
# =====================================================
COPY --from=frontend /app/public/build ./public/build

# Verify manifest in FINAL image
RUN test -f /var/www/html/public/build/manifest.json \
    || (echo "ERROR: Manifest missing in production image!" && exit 1)


# =====================================================
# 8. DOCKER ENTRYPOINT
# =====================================================
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint

# Normalize script format
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint \
    && sed -i '1s/^\xEF\xBB\xBF//' /usr/local/bin/docker-entrypoint \
    && chmod 755 /usr/local/bin/docker-entrypoint


# =====================================================
# 9. PRODUCTION
# =====================================================
EXPOSE 10000

# Explicit shell execution prevents exec format errors
ENTRYPOINT ["/bin/sh", "/usr/local/bin/docker-entrypoint"]
