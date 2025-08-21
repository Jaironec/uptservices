/**
 * UTP-Service Website - JavaScript Build Script
 * Script para construir y optimizar JavaScript
 */

const fs = require('fs');
const path = require('path');

console.log('Construyendo JavaScript...');

// Crear directorio dist si no existe
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copiar archivo JavaScript principal
const jsSource = path.join(__dirname, '..', 'src', 'scripts', 'main.js');
const jsDest = path.join(distDir, 'main.js');

try {
    fs.copyFileSync(jsSource, jsDest);
    console.log('JavaScript construido exitosamente en dist/main.js');
} catch (error) {
    console.error('Error al construir JavaScript:', error);
    process.exit(1);
}
