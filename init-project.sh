#!/bin/bash

# UPT Services - Script de Inicialización del Proyecto
# ====================================================

echo "🚀 Inicializando UPT Services Project..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git no está instalado. Instálalo primero."
    exit 1
fi

# Step 1: Clone repository (if not already cloned)
if [ ! -d ".git" ]; then
    print_header "Clonando repositorio..."
    git clone https://github.com/tuusuario/uptservices.git .
else
    print_status "Repositorio ya clonado. Actualizando..."
    git pull origin main
fi

# Step 2: Set permissions
print_header "Configurando permisos..."
chmod +x scripts/*.sh
chmod +x init-project.sh

# Step 3: Create necessary directories
print_header "Creando directorios necesarios..."
mkdir -p src/api/logs
mkdir -p public/assets/icons
mkdir -p logs
mkdir -p backups

# Step 4: Set proper permissions for directories
chmod 755 src/api/logs
chmod 755 public/assets/icons
chmod 755 logs

# Step 5: Copy files to proper locations
print_header "Organizando archivos..."
# Ensure all files are in correct locations
if [ -f "src/pages/index.html" ]; then
    cp src/pages/index.html public/index.html
fi

# Step 6: Initialize configuration
print_header "Inicializando configuración..."
if [ ! -f "src/api/logs/.gitkeep" ]; then
    touch src/api/logs/.gitkeep
fi

# Step 7: Check system requirements
print_header "Verificando requisitos del sistema..."

# Check if running on Ubuntu/Debian
if command -v apt &> /dev/null; then
    print_status "Sistema Ubuntu/Debian detectado"
    
    # Update package list
    print_status "Actualizando lista de paquetes..."
    sudo apt update
    
    # Install basic requirements
    print_status "Instalando dependencias básicas..."
    sudo apt install -y curl git unzip
    
    # Check if Apache/Nginx is needed
    if ! command -v apache2 &> /dev/null && ! command -v nginx &> /dev/null; then
        print_warning "No se detectó servidor web. ¿Quieres instalar Apache? (y/n)"
        read -r install_apache
        if [[ $install_apache =~ ^[Yy]$ ]]; then
            sudo apt install -y apache2 php8.1 php8.1-fpm php8.1-curl php8.1-mbstring php8.1-xml
            print_status "Apache y PHP instalados"
        fi
    fi
    
elif command -v yum &> /dev/null; then
    print_status "Sistema RedHat/CentOS detectado"
    sudo yum update -y
    sudo yum install -y curl git unzip
    
elif command -v brew &> /dev/null; then
    print_status "Sistema macOS detectado"
    brew update
    brew install curl git
    
else
    print_warning "Sistema no reconocido. Instala manualmente: curl, git, unzip"
fi

# Step 8: Initialize Git hooks (if needed)
print_header "Configurando Git hooks..."
if [ -d ".git" ]; then
    # Create pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# UPT Services pre-commit hook
echo "🔍 Ejecutando verificaciones pre-commit..."

# Check for PHP syntax errors
find src/api -name "*.php" -exec php -l {} \; | grep -v "No syntax errors"
if [ $? -eq 0 ]; then
    echo "❌ Errores de sintaxis PHP encontrados"
    exit 1
fi

echo "✅ Verificaciones pre-commit completadas"
EOF
    chmod +x .git/hooks/pre-commit
    print_status "Git hooks configurados"
fi

# Step 9: Create environment file
print_header "Creando archivo de entorno..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# UPT Services - Environment Configuration
ENVIRONMENT=development
DEBUG=true
ADMIN_EMAIL=16cardenas16@gmail.com
WEBSITE_URL=https://utpservice.online
COMPANY_NAME=UPT Services

# Database (if needed in future)
DB_HOST=localhost
DB_NAME=utpservice
DB_USER=utpservice_user
DB_PASS=secure_password

# Email Configuration
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Security
SECRET_KEY=generate_random_key_here
EOF
    print_status "Archivo .env creado"
else
    print_status "Archivo .env ya existe"
fi

# Step 10: Final setup
print_header "Configuración final..."

# Create README for quick start
cat > QUICK_START.md << 'EOF'
# UPT Services - Quick Start

## 🚀 Inicio Rápido

### Para Desarrollo Local:
```bash
# Instalar XAMPP/WAMP o usar servidor local
php -S localhost:8000 -t public
```

### Para Producción Ubuntu:
```bash
sudo ./scripts/install-ubuntu.sh
```

### Verificar Estado:
```bash
curl http://localhost/api/monitor.php
```

## 📞 Contacto
- Email: 16cardenas16@gmail.com
- Documentación: docs/ubuntu-deployment.md
EOF

print_status "Documentación de inicio rápido creada"

echo ""
echo "🎉 ¡Proyecto UPT Services inicializado correctamente!"
echo "=================================================="
echo ""
echo "📁 Estructura del proyecto:"
echo "   ├── src/          # Código fuente"
echo "   ├── public/       # Archivos públicos"
echo "   ├── config/       # Configuraciones"
echo "   ├── scripts/      # Scripts de instalación"
echo "   └── docs/         # Documentación"
echo ""
echo "🔧 Próximos pasos:"
echo "   1. Para desarrollo local: php -S localhost:8000 -t public"
echo "   2. Para producción Ubuntu: sudo ./scripts/install-ubuntu.sh"
echo "   3. Configurar dominio y SSL"
echo ""
echo "📖 Documentación completa: docs/ubuntu-deployment.md"
echo "🚀 ¡Tu proyecto está listo para usar!"
