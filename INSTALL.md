# UPT Services - Guía de Instalación

## 🚀 Inicio Rápido

### **1. Clonar e Inicializar Proyecto**

```bash
# Clonar repositorio
git clone https://github.com/uptservices/website.git
cd website

# Inicializar proyecto (automático)
./init-project.sh

# O usando npm
npm run init
```

### **2. Instalar Dependencias**

```bash
# Instalar dependencias Node.js
npm install

# Instalar dependencias PHP (opcional)
composer install

# O todo junto con Make
make install
```

### **3. Configurar Entorno**

```bash
# Configurar desarrollo local
./scripts/dev-setup.sh

# Editar configuración
nano .env
```

### **4. Iniciar Servidor de Desarrollo**

```bash
# Opción 1: Servidor PHP incorporado
npm run dev
# O: make dev

# Opción 2: Servidor Node.js
npm run dev:node
# O: make dev-node

# El sitio estará disponible en:
# http://localhost:8000 (PHP)
# http://localhost:3000 (Node.js)
```

## 🖥️ **Comandos de Inicialización Disponibles**

### **NPM Scripts:**
```bash
npm run init              # Inicializar proyecto completo
npm run dev               # Servidor de desarrollo PHP
npm run dev:node          # Servidor de desarrollo Node.js
npm run test:php          # Verificar sintaxis PHP
npm run test:server       # Probar servidor
npm run setup:ubuntu      # Instalar dependencias Ubuntu
npm run deploy:ubuntu     # Desplegar en Ubuntu
npm run logs              # Ver logs en tiempo real
npm run monitor           # Estado del sistema
npm run backup            # Crear backup
```

### **Make Commands:**
```bash
make install              # Instalación completa
make dev                  # Servidor de desarrollo
make build                # Construir para producción
make test                 # Ejecutar pruebas
make deploy-ubuntu        # Desplegar en Ubuntu
make backup               # Crear backup
make clean                # Limpiar archivos temporales
make help                 # Ver todos los comandos
```

### **Scripts Directos:**
```bash
./init-project.sh         # Inicialización completa
./scripts/dev-setup.sh    # Configurar desarrollo
./scripts/post-install.sh # Post-instalación
./scripts/install-ubuntu.sh # Instalar en Ubuntu
```

## 📁 **Estructura del Proyecto**

```
uptservices/
├── init-project.sh       # Script de inicialización principal
├── package.json          # Dependencias Node.js y scripts
├── composer.json         # Dependencias PHP
├── Makefile              # Automatización con Make
├── .env                  # Configuración del entorno
├── src/                  # Código fuente
│   ├── api/              # Backend PHP
│   ├── pages/            # HTML
│   ├── styles/           # CSS
│   ├── scripts/          # JavaScript
│   └── assets/           # Recursos (imágenes, iconos)
├── public/               # Archivos públicos (se genera)
├── config/               # Configuraciones del servidor
├── scripts/              # Scripts de instalación
├── docs/                 # Documentación
└── backups/              # Backups automáticos
```

## 🔧 **Requisitos del Sistema**

### **Para Desarrollo:**
- **Node.js** 14+ (para herramientas de desarrollo)
- **PHP** 8.1+ (para backend)
- **Git** (para control de versiones)

### **Para Producción Ubuntu:**
- **Ubuntu** 20.04 LTS+
- **Apache** 2.4+ o **Nginx** 1.18+
- **PHP** 8.1+ con extensiones (curl, mbstring, xml)
- **Composer** (opcional, para dependencias PHP)

## 🌍 **Opciones de Despliegue**

### **Desarrollo Local:**
```bash
# Configurar y ejecutar
make install
make dev
# Abrir: http://localhost:8000
```

### **Producción Ubuntu:**
```bash
# Despliegue automático
make deploy-ubuntu
# O manual:
sudo ./scripts/install-ubuntu.sh
```

### **Servidor Compartido:**
```bash
# Construir archivos públicos
make build
# Subir carpeta public/ a tu hosting
```

## 🧪 **Verificación de la Instalación**

```bash
# Verificar sintaxis PHP
make test-php

# Probar servidor
make test-server

# Ver estado del sistema
make monitor

# Ver logs
make logs
```

## 🆘 **Solución de Problemas**

### **Error: "PHP not found"**
```bash
# Ubuntu/Debian
sudo apt install php8.1

# macOS
brew install php

# Verificar
php --version
```

### **Error: "Permission denied"**
```bash
# Dar permisos de ejecución
chmod +x init-project.sh
chmod +x scripts/*.sh
```

### **Error: "Port already in use"**
```bash
# Cambiar puerto en package.json o usar:
php -S localhost:8080 -t public
```

### **Problemas con dependencias:**
```bash
# Limpiar e instalar de nuevo
make clean
make install
```

## 📞 **Soporte**

- **Email:** 16cardenas16@gmail.com
- **Documentación:** [docs/ubuntu-deployment.md](docs/ubuntu-deployment.md)
- **Issues:** Crear issue en el repositorio

---

**¡Tu proyecto UPT Services está listo para funcionar! 🎉**
