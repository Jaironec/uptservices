# Instrucciones para el Logo UTP-Service

## Archivos de Logo Creados

### 1. `logo-utpservice.svg` - Logo Principal
- **Formato**: SVG (vectorial, escalable)
- **Colores**: Verde (#10b981) sobre fondo transparente
- **Elementos**: 
  - Letras "UP" en grande
  - Elemento de circuito estilizado arriba
  - Texto "SERVICES" 
  - Tagline "SIEMPRE HACIENDO LO MEJOR"

### 2. `favicon.svg` - Favicon del Sitio
- **Formato**: SVG para navegadores modernos
- **Tamaño**: 32x32 píxeles
- **Diseño**: Versión simplificada del logo principal

## Uso en el Sitio Web

### Header/Navegación
- **Ubicación**: `index.html` línea ~60
- **Clase CSS**: `.logo-img`
- **Tamaño**: 40px de altura

### Hero Section
- **Ubicación**: `index.html` línea ~120
- **Clase CSS**: `.hero-logo`
- **Tamaño**: Máximo 300px de ancho

### Sección About
- **Ubicación**: `index.html` línea ~200
- **Clase CSS**: `.about-logo`
- **Tamaño**: Máximo 250px de ancho

### Footer
- **Ubicación**: `index.html` línea ~580
- **Clase CSS**: `.footer-logo-img`
- **Tamaño**: 30px de altura

## Optimización del Logo

### Para Mejor Rendimiento
1. **Convertir a PNG** para navegadores antiguos:
   ```bash
   # Usar herramientas online como:
   # - convertio.co
   # - cloudconvert.com
   # - inkscape.org
   ```

2. **Crear versiones en diferentes tamaños**:
   - `logo-utpservice-32.png` (32x32)
   - `logo-utpservice-64.png` (64x64)
   - `logo-utpservice-128.png` (128x128)
   - `logo-utpservice-256.png` (256x256)

3. **Optimizar SVG**:
   - Remover metadatos innecesarios
   - Comprimir usando herramientas como SVGO

### Formatos Recomendados
- **SVG**: Para navegadores modernos (mejor calidad)
- **PNG**: Para compatibilidad universal
- **WebP**: Para navegadores modernos (mejor compresión)

## Personalización del Logo

### Cambiar Colores
En el archivo SVG, modificar el atributo `fill="#10b981"`:
- **Verde actual**: #10b981
- **Alternativas sugeridas**:
  - Azul: #3b82f6
  - Morado: #8b5cf6
  - Naranja: #f59e0b

### Cambiar Tipografía
Modificar el atributo `font-family` en el SVG:
- **Actual**: Arial, sans-serif
- **Alternativas**:
  - Inter, sans-serif
  - Roboto, sans-serif
  - Open Sans, sans-serif

## Implementación en Otros Archivos

### CSS
Los estilos están en `css/style.css`:
```css
.logo-img { height: 40px; width: auto; margin-right: 10px; }
.hero-logo { max-width: 300px; height: auto; }
.about-logo { max-width: 250px; height: auto; }
.footer-logo-img { height: 30px; width: auto; margin-right: 10px; }
```

### HTML
El logo se referencia en múltiples lugares:
```html
<img src="/logo-utpservice.svg" alt="UTP-Service Logo" class="logo-img">
```

## Notas Importantes

1. **El logo actual es transparente** - perfecto para cualquier fondo
2. **Formato SVG** - escalable sin pérdida de calidad
3. **Colores consistentes** con la paleta del sitio web
4. **Optimizado para web** - archivo ligero y rápido
5. **Compatible** con todos los navegadores modernos

## Próximos Pasos

1. ✅ Logo creado e integrado en el sitio
2. 🔄 Crear versiones PNG para compatibilidad
3. ⏳ Optimizar SVG para mejor rendimiento
4. ⏳ Crear variantes de color si es necesario
5. ⏳ Implementar en subdominios futuros
