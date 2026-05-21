# syntax=docker/dockerfile:1
# Laravel 13 + PHP 8.3 production image for Render / Fly.io / any container host.

FROM php:8.3-cli-alpine AS base

# System dependencies + PHP extensions Laravel needs
RUN apk add --no-cache \
        git curl bash libzip-dev oniguruma-dev sqlite-dev icu-dev \
        libpng-dev libjpeg-turbo-dev freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo pdo_mysql pdo_sqlite mbstring zip exif pcntl bcmath gd intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP dependencies (cache layer).
# We INCLUDE dev deps because the DatabaseSeeder uses faker (a dev dep) to
# generate demo data on first boot. For a true production deploy without
# seeding, switch back to --no-dev.
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist --no-interaction

# Copy the rest of the app
COPY . .

# Optimize autoloader + run framework discovery
RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi || true

# SQLite database lives under /app/database — create the file if it doesn't exist
RUN mkdir -p /app/database \
    && touch /app/database/database.sqlite \
    && chown -R www-data:www-data /app/storage /app/bootstrap/cache /app/database

# Render provides $PORT — bind to it. Run migrations + seed on every boot.
ENV PORT=8000
EXPOSE 8000

CMD php artisan migrate --force --no-interaction \
    && php artisan db:seed --force --no-interaction \
    && php artisan config:cache \
    && php artisan route:cache \
    && php -S 0.0.0.0:${PORT} -t public
