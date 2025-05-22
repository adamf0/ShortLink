# Menggunakan image PHP terbaru (PHP 8.2 FPM)
FROM php:8.2-fpm

# Install dependencies untuk Laravel dan Node.js (untuk React dan Inertia.js)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    git \
    unzip \
    libxrender1 \
    libxext6 \
    libxi6 \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip

# Install Node.js dan npm (untuk React dan build frontend)
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory untuk Laravel
WORKDIR /var/www

# Salin file composer.json dan install dependencies Laravel
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Salin seluruh proyek Laravel ke dalam container
COPY . .

# Set permission untuk file
RUN chown -R www-data:www-data /var/www

# Install dependencies frontend (React + Inertia.js)
WORKDIR /var/www/frontend
RUN npm install

# Build frontend React (Inertia.js)
RUN npm run build

# Kembali ke direktori Laravel
WORKDIR /var/www

# Expose port 9000 untuk PHP-FPM
EXPOSE 9000

# Expose port 3000 untuk React (dev server)
EXPOSE 3000

# Jalankan PHP-FPM
CMD ["php-fpm"]
