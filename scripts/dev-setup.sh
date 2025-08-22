#!/bin/bash

# UPT Services - Configuración de Desarrollo Local
# ================================================

echo "🛠️ Configurando entorno de desarrollo..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Crear estructura básica
print_status "Creando estructura de directorios..."
mkdir -p public
mkdir -p src/api/logs
mkdir -p backups
mkdir -p logs

# Copiar archivos al directorio público
print_status "Preparando archivos públicos..."
if [ -f "src/pages/index.html" ]; then
    cp src/pages/index.html public/
fi

if [ -d "src/styles" ]; then
    cp -r src/styles public/
fi

if [ -d "src/scripts" ]; then
    cp -r src/scripts public/
fi

if [ -d "src/assets" ]; then
    cp -r src/assets public/
fi

if [ -d "src/api" ]; then
    cp -r src/api public/
fi

if [ -f "src/manifest.json" ]; then
    cp src/manifest.json public/
fi

# Configurar permisos
print_status "Configurando permisos..."
chmod 755 public
chmod 755 public/api
chmod 775 public/api/logs
chmod 755 src/api/logs

# Crear archivo .htaccess para desarrollo
print_status "Creando configuración de desarrollo..."
cat > public/.htaccess << 'EOF'
# Desarrollo local - UPT Services
RewriteEngine On

# CORS para desarrollo
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type"

# Handle OPTIONS preflight
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# PHP files
<Files "*.php">
    Require all granted
</Files>
EOF

# Verificar PHP
print_status "Verificando PHP..."
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -n 1)
    print_status "PHP encontrado: $PHP_VERSION"
else
    print_warning "PHP no está instalado. Instálalo para usar el backend."
    echo "Ubuntu/Debian: sudo apt install php8.1"
    echo "macOS: brew install php"
    echo "Windows: Descargar desde php.net"
fi

# Crear archivo de configuración local
cat > .env.local << 'EOF'
# Configuración de desarrollo local
ENVIRONMENT=development
DEBUG=true
LOCAL_SERVER=true
ADMIN_EMAIL=16cardenas16@gmail.com
EOF

print_status "Entorno de desarrollo configurado"
echo ""
echo "🚀 Para iniciar el servidor de desarrollo:"
echo "   npm run dev           # Servidor PHP incorporado"
echo "   npm run dev:node      # Servidor Node.js"
echo ""
echo "📁 Archivos públicos en: ./public/"
echo "🔧 Configuración: .env.local"
