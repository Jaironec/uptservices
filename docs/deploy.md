# 🚀 Guía de Despliegue - UTP-Service

## Preparación del Proyecto

### 1. Estructura de Archivos
```
uptservices/
├── index.html          # Página principal
├── css/style.css      # Estilos
├── js/main.js         # JavaScript
├── contact.php        # Manejador del formulario
├── .htaccess          # Configuración Apache
├── nginx.conf         # Configuración Nginx
├── README.md          # Documentación
└── deploy.md          # Esta guía
```

### 2. Personalización Previa
- Actualizar información de contacto en `index.html`
- Configurar emails en `contact.php`
- Ajustar colores y estilos en `css/style.css`
- Personalizar funcionalidades en `js/main.js`

## 🌐 Opciones de Hosting

### Opción A: Hosting Compartido (Recomendado para empezar)
**Proveedores recomendados:**
- Hostinger
- Namecheap
- GoDaddy
- Bluehost

**Ventajas:**
- Fácil de configurar
- Soporte técnico incluido
- SSL gratuito
- Panel de control intuitivo

**Pasos:**
1. Comprar hosting con dominio
2. Subir archivos via FTP/cPanel
3. Configurar base de datos (si es necesario)
4. Activar SSL

### Opción B: VPS/Dedicado
**Proveedores recomendados:**
- DigitalOcean
- Linode
- Vultr
- AWS Lightsail

**Ventajas:**
- Control total del servidor
- Mejor rendimiento
- Escalabilidad
- Personalización completa

**Pasos:**
1. Crear VPS
2. Configurar servidor web (Apache/Nginx)
3. Instalar PHP y MySQL
4. Configurar SSL con Let's Encrypt
5. Subir archivos

### Opción C: Plataformas Cloud
**Opciones:**
- Netlify (solo frontend)
- Vercel
- GitHub Pages
- Firebase Hosting

## 🔧 Configuración del Servidor

### Apache (Hosting Compartido)
1. Subir archivos al directorio raíz
2. El archivo `.htaccess` se configura automáticamente
3. Verificar que mod_rewrite esté habilitado

### Nginx (VPS/Dedicado)
1. Copiar contenido de `nginx.conf` al servidor
2. Ajustar rutas según tu configuración
3. Reiniciar Nginx: `sudo systemctl restart nginx`

### PHP Configuration
```ini
; php.ini optimizaciones
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 30
memory_limit = 256M
```

## 🔒 Configuración SSL

### Let's Encrypt (Gratuito)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d utpservice.live -d www.utpservice.live

# Renovar automáticamente
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### SSL Comercial
- Comprar certificado SSL
- Subir archivos al servidor
- Configurar en panel de control

## 📧 Configuración de Email

### 1. Configurar DNS
```
Tipo: MX
Nombre: @
Valor: mail.utpservice.live
Prioridad: 10
```

### 2. Configurar SPF
```
Tipo: TXT
Nombre: @
Valor: "v=spf1 include:_spf.google.com ~all"
```

### 3. Configurar DKIM
```
Tipo: TXT
Nombre: google._domainkey
Valor: [proporcionado por tu proveedor de email]
```

### 4. Configurar DMARC
```
Tipo: TXT
Nombre: _dmarc
Valor: "v=DMARC1; p=quarantine; rua=mailto:dmarc@utpservice.live"
```

## 🗄️ Base de Datos (Opcional)

### MySQL/MariaDB
```sql
-- Crear base de datos
CREATE DATABASE utpservice_db;

-- Crear usuario
CREATE USER 'utpservice_user'@'localhost' IDENTIFIED BY 'password_seguro';

-- Asignar permisos
GRANT ALL PRIVILEGES ON utpservice_db.* TO 'utpservice_user'@'localhost';
FLUSH PRIVILEGES;

-- Tabla para contactos
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    service VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Monitoreo y Analytics

### Google Analytics
1. Crear cuenta en Google Analytics
2. Obtener código de seguimiento
3. Agregar en `index.html` antes de `</head>`

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Google Search Console
1. Verificar propiedad en Google Search Console
2. Agregar sitemap.xml
3. Monitorear rendimiento SEO

## 🚀 Optimización de Rendimiento

### 1. Comprimir Archivos
```bash
# CSS
npm install -g css-minify
css-minify css/style.css

# JavaScript
npm install -g uglify-js
uglify-js js/main.js -o js/main.min.js
```

### 2. Optimizar Imágenes
```bash
# Instalar herramientas
sudo apt install imagemagick

# Comprimir imágenes
convert imagen.jpg -quality 85 imagen_opt.jpg
```

### 3. Cache del Navegador
- Configurar headers de expiración
- Implementar versionado de archivos
- Usar CDN para recursos estáticos

## 🔍 SEO y Marketing

### 1. Meta Tags
- Título optimizado
- Descripción atractiva
- Open Graph para redes sociales
- Twitter Cards

### 2. Sitemap
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://utpservice.live/</loc>
    <lastmod>2024-11-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 3. Robots.txt
```txt
User-agent: *
Allow: /
Disallow: /contact.php
Disallow: /contact_log.txt

Sitemap: https://utpservice.live/sitemap.xml
```

## 📱 PWA (Progressive Web App)

### 1. Manifest.json
```json
{
  "name": "UTP-Service",
  "short_name": "UTP-Service",
  "description": "Servicios tecnológicos profesionales",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 2. Service Worker
- Caché offline
- Notificaciones push
- Actualizaciones automáticas

## 🧪 Testing y Validación

### 1. Validación HTML
- [W3C Validator](https://validator.w3.org/)
- [HTML5 Validator](https://html5.validator.nu/)

### 2. Validación CSS
- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)

### 3. Testing de Rendimiento
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### 4. Testing de Responsividad
- [Responsive Design Checker](https://responsivedesignchecker.com/)
- Herramientas de desarrollador del navegador

## 🔄 Mantenimiento

### 1. Backups
- Archivos del sitio web
- Base de datos
- Configuraciones del servidor

### 2. Actualizaciones
- PHP y extensiones
- Servidor web
- Certificados SSL

### 3. Monitoreo
- Logs del servidor
- Rendimiento del sitio
- Errores 404/500

## 📞 Soporte Post-Despliegue

### Problemas Comunes

1. **Formulario no funciona**
   - Verificar configuración PHP
   - Revisar logs del servidor
   - Comprobar permisos de archivos

2. **Página no carga**
   - Verificar configuración del servidor web
   - Comprobar archivos .htaccess/nginx.conf
   - Revisar logs de error

3. **SSL no funciona**
   - Verificar certificado
   - Comprobar configuración del servidor
   - Verificar DNS

### Contacto para Soporte
- **Email**: info@utpservice.live
- **WhatsApp**: +593 XX XXX XXXX
- **Documentación**: README.md

---

**¡Tu sitio web UTP-Service está listo para conquistar el mundo digital! 🚀**
