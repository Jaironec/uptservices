#!/bin/bash

# UPT Services - Ubuntu Installation Script
# ========================================

echo "🚀 Instalando UPT Services en Ubuntu..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "Este script no debe ejecutarse como root"
   exit 1
fi

# Update system
print_status "Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Instalando paquetes requeridos..."
sudo apt install -y apache2 php8.1 php8.1-fpm php8.1-mysql php8.1-curl php8.1-gd php8.1-mbstring php8.1-xml php8.1-zip php8.1-mail php8.1-cli unzip curl git

# Enable required Apache modules
print_status "Habilitando módulos de Apache..."
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod deflate
sudo a2enmod ssl
sudo a2enmod proxy_fcgi
sudo a2enmod setenvif

# Create project directory
PROJECT_DIR="/var/www/utpservice"
print_status "Creando directorio del proyecto: $PROJECT_DIR"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Copy project files
print_status "Copiando archivos del proyecto..."
cp -r src/* $PROJECT_DIR/
cp -r public/* $PROJECT_DIR/public/

# Set proper permissions
print_status "Configurando permisos..."
sudo chown -R www-data:www-data $PROJECT_DIR
sudo chmod -R 755 $PROJECT_DIR
sudo chmod -R 775 $PROJECT_DIR/api/logs

# Create logs directory
sudo mkdir -p $PROJECT_DIR/api/logs
sudo chown www-data:www-data $PROJECT_DIR/api/logs
sudo chmod 775 $PROJECT_DIR/api/logs

# Copy Apache configuration
print_status "Configurando Apache..."
sudo cp config/apache-vhost.conf /etc/apache2/sites-available/utpservice.conf
sudo a2ensite utpservice.conf

# Disable default site
sudo a2dissite 000-default.conf

# Test Apache configuration
print_status "Probando configuración de Apache..."
sudo apache2ctl configtest

if [ $? -eq 0 ]; then
    print_status "Configuración de Apache válida"
else
    print_error "Error en la configuración de Apache"
    exit 1
fi

# Restart Apache
print_status "Reiniciando Apache..."
sudo systemctl restart apache2

# Configure PHP
print_status "Configurando PHP..."
sudo sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 10M/' /etc/php/8.1/apache2/php.ini
sudo sed -i 's/post_max_size = 8M/post_max_size = 10M/' /etc/php/8.1/apache2/php.ini
sudo sed -i 's/max_execution_time = 30/max_execution_time = 60/' /etc/php/8.1/apache2/php.ini

# Configure mail (optional - for production)
print_status "Configurando sistema de correo..."
sudo apt install -y postfix
sudo systemctl enable postfix

# Install SSL certificate (Let's Encrypt)
print_status "Instalando certificado SSL..."
sudo apt install -y certbot python3-certbot-apache

# Create firewall rules
print_status "Configurando firewall..."
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw --force enable

# Create systemd service for monitoring
print_status "Creando servicio de monitoreo..."
sudo tee /etc/systemd/system/utpservice-monitor.service > /dev/null <<EOF
[Unit]
Description=UPT Services Monitor
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/php $PROJECT_DIR/api/monitor.php
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable utpservice-monitor
sudo systemctl start utpservice-monitor

# Create log rotation
print_status "Configurando rotación de logs..."
sudo tee /etc/logrotate.d/utpservice > /dev/null <<EOF
$PROJECT_DIR/api/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload apache2
    endscript
}
EOF

# Create backup script
print_status "Creando script de backup..."
sudo tee /usr/local/bin/utpservice-backup > /dev/null <<EOF
#!/bin/bash
BACKUP_DIR="/var/backups/utpservice"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR
tar -czf \$BACKUP_DIR/utpservice_\$DATE.tar.gz -C /var/www utpservice/
find \$BACKUP_DIR -name "utpservice_*.tar.gz" -mtime +30 -delete
echo "Backup completado: utpservice_\$DATE.tar.gz"
EOF

sudo chmod +x /usr/local/bin/utpservice-backup

# Create cron job for backup
echo "0 2 * * * /usr/local/bin/utpservice-backup" | sudo crontab -

# Final configuration
print_status "Configuración final..."
sudo systemctl reload apache2

# Test PHP
print_status "Probando PHP..."
php -v

# Test Apache
print_status "Probando Apache..."
curl -I http://localhost

echo ""
echo "🎉 ¡Instalación completada!"
echo "=========================="
echo ""
echo "📁 Directorio del proyecto: $PROJECT_DIR"
echo "🌐 URL del sitio: http://localhost"
echo "📧 Email configurado: 16cardenas16@gmail.com"
echo ""
echo "🔧 Comandos útiles:"
echo "  - Reiniciar Apache: sudo systemctl restart apache2"
echo "  - Ver logs: sudo tail -f /var/log/apache2/utpservice_error.log"
echo "  - Backup manual: sudo utpservice-backup"
echo "  - Estado del servicio: sudo systemctl status utpservice-monitor"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  1. Configura tu dominio en /etc/hosts o DNS"
echo "  2. Instala certificado SSL: sudo certbot --apache -d utpservice.online"
echo "  3. Revisa logs en: $PROJECT_DIR/api/logs/"
echo ""
echo "🚀 ¡Tu sitio UPT Services está listo!"
