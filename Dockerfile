# Epilogue — Laravel + Inertia/Vite for Render (Docker runtime)
# https://render.com/docs/deploy-php-laravel-docker

# --- Frontend assets (Vite env must be set at build time on Render) ---
FROM node:20-bookworm AS assets
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY vite.config.js tsconfig.json ./
COPY resources ./resources
COPY public ./public
COPY contracts ./contracts

ARG VITE_BOT_CHAIN_ID=677
ARG VITE_BOT_CHAIN_RPC=https://rpc.botchain.ai
ARG VITE_EPILOGUE_CONTRACT=
ARG VITE_APP_NAME=Epilogue

ENV VITE_BOT_CHAIN_ID=${VITE_BOT_CHAIN_ID} \
    VITE_BOT_CHAIN_RPC=${VITE_BOT_CHAIN_RPC} \
    VITE_EPILOGUE_CONTRACT=${VITE_EPILOGUE_CONTRACT} \
    VITE_APP_NAME=${VITE_APP_NAME}

RUN npm run build

# --- PHP dependencies ---
FROM composer:2 AS vendor
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --no-autoloader \
    --prefer-dist

COPY . .
RUN composer dump-autoload --optimize --no-dev

# --- Production image (Nginx + PHP-FPM 8.4) ---
FROM ghcr.io/server-side-up/php:8.4-fpm-nginx

WORKDIR /var/www/html

ENV SSL_MODE=off \
    LOG_OUTPUT_LEVEL=info \
    AUTORUN_ENABLED=true \
    AUTORUN_LARAVEL_STORAGE_LINK=true \
    AUTORUN_LARAVEL_MIGRATION=true \
    AUTORUN_LARAVEL_CONFIG_CACHE=true \
    AUTORUN_LARAVEL_ROUTE_CACHE=true \
    AUTORUN_LARAVEL_VIEW_CACHE=true \
    AUTORUN_LARAVEL_EVENT_CACHE=true

COPY --from=vendor /app /var/www/html
COPY --from=assets /app/public/build /var/www/html/public/build

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache
