# UTP-Service Website

Sitio web profesional para UTP-Service, empresa especializada en servicios tecnológicos, soporte técnico y cableado estructurado.

## 🌟 Características

- **Diseño Moderno y Responsivo**: Adaptado para todos los dispositivos
- **Navegación Suave**: Scroll suave entre secciones
- **Animaciones Interactivas**: Efectos visuales atractivos
- **Formulario de Contacto**: Validación y notificaciones en tiempo real
- **Filtros de Proyectos**: Categorización por tipo de proyecto
- **Integración WhatsApp**: Contacto directo con clientes
- **Optimización SEO**: Meta tags y estructura semántica
- **PWA Ready**: Preparado para Progressive Web App

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Diseño responsive con Grid y Flexbox
- **JavaScript ES6+**: Funcionalidad interactiva
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Tipografía Inter para mejor legibilidad

## 📁 Estructura del Proyecto

```
uptservices/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos principales
├── js/
│   └── main.js        # Funcionalidad JavaScript
└── README.md          # Este archivo
```

## 🛠️ Instalación y Configuración

### 1. Clonar o Descargar el Proyecto

```bash
# Si usas Git
git clone [URL_DEL_REPOSITORIO]
cd uptservices

# O simplemente descarga los archivos en una carpeta
```

### 2. Configurar el Servidor Web

#### Opción A: Servidor Local (Desarrollo)

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx serve .

# Con PHP
php -S localhost:8000
```

#### Opción B: Servidor Web (Producción)

Sube los archivos a tu servidor web (Apache, Nginx, etc.) en la carpeta raíz del dominio.

### 3. Personalización

#### Información de Contacto

Edita `index.html` y actualiza:
- Números de teléfono
- Dirección de email
- Información de ubicación
- Enlaces de redes sociales

#### Colores y Estilo

Modifica `css/style.css`:
- Paleta de colores principal
- Tipografías
- Espaciados y tamaños

#### Funcionalidad

Personaliza `js/main.js`:
- Validaciones del formulario
- Integración con WhatsApp
- Animaciones personalizadas

## 🌐 Configuración de Subdominios

Para implementar la arquitectura de subdominios mencionada en el proyecto:

### 1. Tienda Online
- **Subdominio**: `tienda.utpservice.live`
- **Plataforma**: WooCommerce (WordPress)
- **Funcionalidad**: E-commerce completo

### 2. Plataforma de Cursos
- **Subdominio**: `cursos.utpservice.live`
- **Plataforma**: Moodle o LMS personalizado
- **Funcionalidad**: Cursos online y certificaciones

### 3. Sistema de Tickets
- **Subdominio**: `tickets.utpservice.live`
- **Plataforma**: Sistema personalizado o Zendesk
- **Funcionalidad**: Soporte técnico y atención al cliente

### 4. Zona de Clientes
- **Subdominio**: `clientes.utpservice.live`
- **Plataforma**: CRM personalizado o SuiteCRM
- **Funcionalidad**: Gestión de clientes y proyectos

## 📱 Características Responsivas

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 480px, 768px, 1200px
- **Navegación**: Menú hamburguesa para móviles
- **Touch Friendly**: Elementos táctiles optimizados

## 🔧 Funcionalidades JavaScript

### Navegación
- Menú móvil responsive
- Scroll suave entre secciones
- Header con efecto de transparencia

### Formularios
- Validación en tiempo real
- Notificaciones de éxito/error
- Integración con WhatsApp

### Animaciones
- Contadores animados
- Efectos de aparición
- Transiciones suaves

### Filtros
- Categorización de proyectos
- Animaciones de filtrado
- Estado activo visual

## 📊 SEO y Rendimiento

### Meta Tags
- Título optimizado
- Descripción atractiva
- Palabras clave relevantes

### Rendimiento
- Lazy loading de imágenes
- CSS y JS optimizados
- Compresión de archivos

### Accesibilidad
- Navegación por teclado
- Contraste adecuado
- Textos alternativos

## 🚀 Despliegue en Producción

### 1. Optimización
```bash
# Comprimir CSS
npm install -g css-minify
css-minify css/style.css

# Comprimir JavaScript
npm install -g uglify-js
uglify-js js/main.js -o js/main.min.js
```

### 2. Configuración del Servidor
- Habilitar compresión GZIP
- Configurar caché de navegador
- Implementar HTTPS

### 3. Monitoreo
- Google Analytics
- Google Search Console
- Monitoreo de rendimiento

## 🔒 Seguridad

- Validación de formularios
- Sanitización de inputs
- Headers de seguridad
- Protección CSRF

## 📈 Analytics y Tracking

El sitio está preparado para integrar:
- Google Analytics 4
- Google Tag Manager
- Facebook Pixel
- LinkedIn Insight Tag

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama para nueva funcionalidad
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo LICENSE para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: info@utpservice.live
- **WhatsApp**: +593 XX XXX XXXX
- **Sitio Web**: https://utpservice.live

## 🎯 Roadmap

### Versión 1.1
- [ ] Blog integrado
- [ ] Galería de proyectos
- [ ] Testimonios dinámicos

### Versión 1.2
- [ ] Panel de administración
- [ ] Sistema de noticias
- [ ] Integración con CRM

### Versión 2.0
- [ ] PWA completa
- [ ] Offline functionality
- [ ] Push notifications

---

**Desarrollado con ❤️ para UTP-Service**

*Conectamos tu negocio con la tecnología del futuro*
