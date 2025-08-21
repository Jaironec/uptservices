/**
 * UTP-Service Website - CSS Build Script
 * Script para construir y optimizar CSS
 */

const fs = require('fs');
const path = require('path');

console.log('Construyendo CSS...');

// Crear directorio dist si no existe
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copiar archivo CSS principal
const cssSource = path.join(__dirname, '..', 'src', 'styles', 'main.css');
const cssDest = path.join(distDir, 'main.css');

try {
    fs.copyFileSync(cssSource, cssDest);
    console.log('CSS construido exitosamente en dist/main.css');
} catch (error) {
    console.error('Error al construir CSS:', error);
    process.exit(1);
}
