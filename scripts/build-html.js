/**
 * UTP-Service Website - HTML Build Script
 * Script para construir y optimizar HTML
 */

const fs = require('fs');
const path = require('path');

console.log('Construyendo HTML...');

// Crear directorio dist si no existe
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copiar archivo HTML principal
const htmlSource = path.join(__dirname, '..', 'src', 'pages', 'index.html');
const htmlDest = path.join(distDir, 'index.html');

try {
    fs.copyFileSync(htmlSource, htmlDest);
    console.log('HTML construido exitosamente en dist/index.html');
} catch (error) {
    console.error('Error al construir HTML:', error);
    process.exit(1);
}
