# UPT Services - Guía de Despliegue en Ubuntu

## 🚀 Despliegue en Producción Ubuntu

### **📋 Requisitos del Sistema**

- **Ubuntu 20.04 LTS** o superior
- **Mínimo 2GB RAM**
- **Mínimo 20GB espacio en disco**
- **Acceso root/sudo**

### **🔧 Instalación Automática**

#### **Opción 1: Script de Instalación (Recomendado)**

```bash
# Clonar el proyecto
git clone https://github.com/tuusuario/uptservices.git
cd uptservices

# Dar permisos de ejecución
chmod +x scripts/install-ubuntu.sh

# Ejecutar instalación
./scripts/install-ubuntu.sh
```

#### **Opción 2: Instalación Manual**

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar paquetes requeridos
sudo apt install -y apache2 php8.1 php8.1-fpm php8.1-mysql php8.1-curl php8.1-gd php8.1-mbstring php8.1-xml php8.1-zip php8.1-mail php8.1-cli unzip curl git

# Habilitar módulos de Apache
sudo a2enmod rewrite headers expires deflate ssl proxy_fcgi setenvif
```

### **📁 Estructura del Proyecto en Ubuntu**

```
/var/www/utpservice/
├── public/                 # Directorio público (DocumentRoot)
│   ├── index.html         # Página principal
│   ├── .htaccess          # Configuración Apache
│   ├── styles/            # CSS
│   ├── scripts/           # JavaScript
│   └── assets/            # Imágenes, iconos, etc.
├── api/                   # Backend PHP
│   ├── contact.php        # Procesador de formularios
│   ├── config.php         # Configuración
│   ├── monitor.php        # Sistema de monitoreo
│   └── logs/              # Logs del sistema
└── config/                # Configuraciones del servidor
    ├── apache-vhost.conf  # Virtual Host Apache
    └── nginx.conf         # Configuración Nginx
```

### **🌐 Configuración del Servidor Web**

#### **Apache (Recomendado para principiantes)**

```bash
# Copiar configuración
sudo cp config/apache-vhost.conf /etc/apache2/sites-available/utpservice.conf

# Habilitar sitio
sudo a2ensite utpservice.conf

# Deshabilitar sitio por defecto
sudo a2dissite 000-default.conf

# Probar configuración
sudo apache2ctl configtest

# Reiniciar Apache
sudo systemctl restart apache2
```

#### **Nginx (Alternativa más rápida)**

```bash
# Instalar Nginx
sudo apt install -y nginx

# Copiar configuración
sudo cp config/nginx.conf /etc/nginx/sites-available/utpservice

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/utpservice /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### **📧 Configuración del Email**

#### **Postfix (Sistema de correo local)**

```bash
# Instalar Postfix
sudo apt install -y postfix

# Configurar durante la instalación
# Seleccionar "Internet Site"
# Configurar nombre del servidor

# Verificar estado
sudo systemctl status postfix
```

#### **Configuración de PHP para Email**

```bash
# Editar configuración de PHP
sudo nano /etc/php/8.1/apache2/php.ini

# Configurar parámetros de email
sendmail_path = /usr/sbin/sendmail -t -i
mail.add_x_header = On
```

### **🔒 Configuración de Seguridad**

#### **Firewall (UFW)**

```bash
# Habilitar firewall
sudo ufw enable

# Permitir puertos necesarios
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22

# Verificar estado
sudo ufw status
```

#### **SSL/TLS con Let's Encrypt**

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-apache

# Obtener certificado
sudo certbot --apache -d utpservice.online -d www.utpservice.online

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **📊 Monitoreo del Sistema**

#### **Servicio de Monitoreo**

```bash
# Verificar estado
sudo systemctl status utpservice-monitor

# Ver logs
sudo journalctl -u utpservice-monitor -f

# Reiniciar servicio
sudo systemctl restart utpservice-monitor
```

#### **Logs del Sistema**

```bash
# Logs de Apache
sudo tail -f /var/log/apache2/utpservice_error.log

# Logs de la aplicación
sudo tail -f /var/www/utpservice/api/logs/contact_log.txt

# Logs del monitor
sudo tail -f /var/www/utpservice/api/logs/monitor.log
```

### **💾 Backup y Mantenimiento**

#### **Backup Automático**

```bash
# Backup manual
sudo utpservice-backup

# Verificar backups
ls -la /var/backups/utpservice/

# Restaurar backup
sudo tar -xzf /var/backups/utpservice/utpservice_YYYYMMDD_HHMMSS.tar.gz -C /var/www/
```

#### **Rotación de Logs**

```bash
# Verificar configuración
sudo cat /etc/logrotate.d/utpservice

# Forzar rotación
sudo logrotate -f /etc/logrotate.d/utpservice
```

### **🚨 Solución de Problemas**

#### **Problemas Comunes**

1. **Error 500 - PHP no funciona**
   ```bash
   sudo systemctl status php8.1-fpm
   sudo systemctl restart php8.1-fpm
   ```

2. **Error 403 - Permisos**
   ```bash
   sudo chown -R www-data:www-data /var/www/utpservice
   sudo chmod -R 755 /var/www/utpservice
   ```

3. **Email no se envía**
   ```bash
   sudo systemctl status postfix
   sudo tail -f /var/log/mail.log
   ```

4. **Apache/Nginx no inicia**
   ```bash
   sudo systemctl status apache2
   sudo apache2ctl configtest
   ```

#### **Comandos de Diagnóstico**

```bash
# Estado de servicios
sudo systemctl status apache2 php8.1-fpm postfix

# Verificar puertos
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Verificar logs
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/nginx/error.log

# Verificar permisos
ls -la /var/www/utpservice/
```

### **📈 Optimización del Rendimiento**

#### **PHP-FPM**

```bash
# Editar configuración
sudo nano /etc/php/8.1/fpm/pool.d/www.conf

# Ajustar parámetros
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
```

#### **Apache MPM**

```bash
# Editar configuración
sudo nano /etc/apache2/mods-available/mpm_prefork.conf

# Ajustar parámetros
MaxRequestWorkers 150
MaxConnectionsPerChild 0
```

### **🔧 Mantenimiento Regular**

#### **Tareas Diarias**

```bash
# Verificar estado del sistema
sudo systemctl status utpservice-monitor

# Revisar logs de errores
sudo tail -n 50 /var/log/apache2/utpservice_error.log
```

#### **Tareas Semanales**

```bash
# Verificar espacio en disco
df -h

# Verificar uso de memoria
free -h

# Limpiar logs antiguos
sudo find /var/log -name "*.log" -mtime +7 -delete
```

#### **Tareas Mensuales**

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Verificar certificados SSL
sudo certbot certificates

# Revisar backups
ls -la /var/backups/utpservice/
```

### **📞 Soporte y Contacto**

- **Email:** 16cardenas16@gmail.com
- **Documentación:** docs/ubuntu-deployment.md
- **Logs del sistema:** /var/www/utpservice/api/logs/
- **Estado del servicio:** sudo systemctl status utpservice-monitor

---

**¡Tu sitio UPT Services está listo para producción en Ubuntu! 🎉**
