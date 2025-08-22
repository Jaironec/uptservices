#!/bin/bash

# UPT Services - Script Post-Instalación
# ======================================

echo "⚙️ Ejecutando configuración post-instalación..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "Error: Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

# Instalar dependencias Node.js
if command -v npm &> /dev/null; then
    print_header "Instalando dependencias Node.js..."
    npm install
    print_status "Dependencias Node.js instaladas"
else
    print_warning "NPM no encontrado. Instala Node.js para usar las herramientas de desarrollo."
fi

# Instalar dependencias PHP si Composer está disponible
if command -v composer &> /dev/null; then
    print_header "Instalando dependencias PHP..."
    composer install
    print_status "Dependencias PHP instaladas"
else
    print_warning "Composer no encontrado. Instálalo para gestión de dependencias PHP."
fi

# Configurar permisos de ejecución
print_header "Configurando permisos..."
chmod +x scripts/*.sh
chmod +x init-project.sh

# Crear directorios necesarios
print_header "Creando directorios..."
mkdir -p src/api/logs
mkdir -p public/assets
mkdir -p backups
mkdir -p logs

# Configurar permisos de directorios
chmod 755 src/api/logs
chmod 755 public
chmod 755 backups

# Crear archivos .gitkeep para mantener directorios vacíos
touch src/api/logs/.gitkeep
touch backups/.gitkeep
touch logs/.gitkeep

# Configurar Git (si es un repositorio)
if [ -d ".git" ]; then
    print_header "Configurando Git..."
    
    # Configurar .gitignore
    cat >> .gitignore << 'EOF'

# UPT Services - Archivos a ignorar
*.log
.env.local
/vendor/
/node_modules/
/public/api/logs/*.txt
/backups/*.tar.gz
.DS_Store
Thumbs.db
EOF

    print_status "Git configurado"
fi

# Verificar configuración del servidor web
print_header "Verificando servidor web..."

if command -v apache2 &> /dev/null; then
    print_status "Apache encontrado"
    
    # Verificar módulos necesarios
    if apache2ctl -M | grep -q rewrite; then
        print_status "Módulo rewrite habilitado"
    else
        print_warning "Módulo rewrite no habilitado. Ejecuta: sudo a2enmod rewrite"
    fi
    
elif command -v nginx &> /dev/null; then
    print_status "Nginx encontrado"
    
elif command -v php &> /dev/null; then
    print_status "PHP encontrado - Puedes usar servidor incorporado"
    
else
    print_warning "No se encontró servidor web. Instala Apache, Nginx o usa PHP incorporado"
fi

# Crear configuración de ejemplo
if [ ! -f ".env" ]; then
    print_header "Creando configuración de ejemplo..."
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
# UPT Services - Configuración
ENVIRONMENT=development
DEBUG=true
ADMIN_EMAIL=16cardenas16@gmail.com
WEBSITE_URL=https://utpservice.online
COMPANY_NAME=UPT Services
EOF
    print_status "Archivo .env creado"
fi

# Ejecutar pruebas básicas
print_header "Ejecutando pruebas básicas..."

# Verificar sintaxis PHP
if command -v php &> /dev/null; then
    find src/api -name "*.php" -exec php -l {} \; > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status "Sintaxis PHP válida"
    else
        print_warning "Errores de sintaxis PHP encontrados"
    fi
fi

echo ""
echo "🎉 ¡Post-instalación completada!"
echo "================================"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Editar .env con tu configuración"
echo "   2. Para desarrollo: npm run dev"
echo "   3. Para producción: npm run deploy:ubuntu"
echo ""
echo "🔧 Comandos útiles:"
echo "   npm run dev         # Servidor de desarrollo"
echo "   npm run test:php    # Verificar sintaxis PHP"
echo "   npm run logs        # Ver logs en tiempo real"
echo "   npm run monitor     # Estado del sistema"
echo ""
echo "📖 Documentación: docs/ubuntu-deployment.md"
