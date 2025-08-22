const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Mapeo de extensiones a tipos MIME
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.php': 'application/x-httpd-php'
};

const server = http.createServer((req, res) => {
  console.log(`Solicitud recibida: ${req.url}`);
  
  let filePath;
  
  // Manejar la ruta raíz
  if (req.url === '/') {
    filePath = path.join(__dirname, 'src', 'pages', 'index.html');
  } else {
    // Para otras rutas, agregar 'src' al inicio
    filePath = path.join(__dirname, 'src', req.url);
  }
  
  console.log(`Archivo buscado: ${filePath}`);
  
  // Obtener la extensión del archivo
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';
  
  // Manejar archivos PHP
  if (ext === '.php') {
    // Ejecutar archivo PHP
    exec(`php "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error ejecutando PHP: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Error interno del servidor PHP',
          details: error.message
        }));
        return;
      }
      
      if (stderr) {
        console.log(`PHP stderr: ${stderr}`);
      }
      
      console.log(`Archivo PHP ejecutado exitosamente: ${filePath}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(stdout);
    });
    return;
  }
  
  // Leer el archivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Archivo no encontrado
        console.log(`404 - Archivo no encontrado: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Archivo no encontrado</h1>');
      } else {
        // Error del servidor
        console.log(`Error del servidor: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Error interno del servidor</h1>');
      }
    } else {
      // Archivo encontrado, enviar respuesta
      console.log(`Archivo servido exitosamente: ${filePath}`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor funcionando en http://127.0.0.1:${PORT}`);
  console.log(`Página principal: http://127.0.0.1:${PORT}/`);
  console.log('Presiona Ctrl+C para detener el servidor');
});
