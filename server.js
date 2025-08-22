const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  
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
  
  // Manejar archivos PHP con variables de entorno correctas
  if (ext === '.php') {
    // Leer el body de la solicitud si es POST
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      // Preparar variables de entorno para PHP
      const env = {
        ...process.env,
        REQUEST_METHOD: req.method,
        REQUEST_URI: req.url,
        QUERY_STRING: req.url.split('?')[1] || '',
        CONTENT_TYPE: req.headers['content-type'] || '',
        CONTENT_LENGTH: body.length.toString(),
        HTTP_USER_AGENT: req.headers['user-agent'] || '',
        HTTP_ACCEPT: req.headers['accept'] || '',
        HTTP_ACCEPT_LANGUAGE: req.headers['accept-language'] || '',
        HTTP_ACCEPT_ENCODING: req.headers['accept-encoding'] || '',
        HTTP_CONNECTION: req.headers['connection'] || '',
        HTTP_HOST: req.headers['host'] || '',
        REMOTE_ADDR: req.connection.remoteAddress || '',
        REMOTE_PORT: req.connection.remotePort.toString(),
        SERVER_NAME: 'localhost',
        SERVER_PORT: '3000',
        SERVER_PROTOCOL: 'HTTP/1.1',
        GATEWAY_INTERFACE: 'CGI/1.1'
      };

      // Usar spawn en lugar de exec para mejor control
      const phpProcess = spawn('php', [filePath], { 
        env,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      phpProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      phpProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log(`PHP stderr: ${data}`);
      });

      phpProcess.on('close', (code) => {
        if (code !== 0) {
          console.log(`Error ejecutando PHP: código de salida ${code}`);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Error interno del servidor PHP',
            details: `Código de salida: ${code}`,
            stderr: stderr
          }));
          return;
        }

        console.log(`Archivo PHP ejecutado exitosamente: ${filePath}`);
        
        // Configurar headers CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(stdout);
      });

      // Si es POST, enviar el body al stdin de PHP
      if (req.method === 'POST' && body) {
        phpProcess.stdin.write(body);
        phpProcess.stdin.end();
      } else {
        phpProcess.stdin.end();
      }
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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor funcionando en http://0.0.0.0:${PORT}`);
  console.log(`Página principal: http://0.0.0.0:${PORT}/`);
  console.log('Presiona Ctrl+C para detener el servidor');
});
