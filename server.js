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
    console.log(`🔍 Procesando archivo PHP: ${filePath}`);
    console.log(`🔍 Método: ${req.method}`);
    console.log(`🔍 Content-Type: ${req.headers['content-type']}`);
    
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
        CONTENT_TYPE: req.headers['content-type'] || 'multipart/form-data',
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
        GATEWAY_INTERFACE: 'CGI/1.1',
        SCRIPT_NAME: filePath,
        SCRIPT_FILENAME: filePath,
        DOCUMENT_ROOT: path.dirname(filePath)
      };
      
      console.log(`🔍 Variables de entorno para PHP:`);
      console.log(`  REQUEST_METHOD: ${env.REQUEST_METHOD}`);
      console.log(`  CONTENT_TYPE: ${env.CONTENT_TYPE}`);
      console.log(`  CONTENT_LENGTH: ${env.CONTENT_LENGTH}`);
      console.log(`  SCRIPT_NAME: ${env.SCRIPT_NAME}`);

      // Usar spawn en lugar de exec para mejor control
      console.log(`🔍 Ejecutando PHP: php ${filePath}`);
      const phpProcess = spawn('php', [filePath], { 
        env,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      console.log(`🔍 Proceso PHP iniciado con PID: ${phpProcess.pid}`);
      
      // Agregar timeout para evitar que PHP se cuelgue
      const timeout = setTimeout(() => {
        console.log(`⏰ Timeout alcanzado para PHP PID: ${phpProcess.pid}`);
        phpProcess.kill('SIGKILL');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Timeout del servidor PHP',
          details: 'El proceso PHP tardó demasiado en responder'
        }));
      }, 30000); // 30 segundos

      let stdout = '';
      let stderr = '';

      phpProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(`📥 PHP stdout chunk: ${data.toString().substring(0, 100)}...`);
      });

      phpProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log(`⚠️ PHP stderr: ${data}`);
      });

      phpProcess.on('close', (code) => {
        // Limpiar timeout
        clearTimeout(timeout);
        
        if (code !== 0) {
          console.log(`❌ Error ejecutando PHP: código de salida ${code}`);
          console.log(`❌ PHP stderr: ${stderr}`);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Error interno del servidor PHP',
            details: `Código de salida: ${code}`,
            stderr: stderr
          }));
          return;
        }

        console.log(`✅ Archivo PHP ejecutado exitosamente: ${filePath}`);
        console.log(`📤 Respuesta PHP: ${stdout}`);
        
        // Configurar headers CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(stdout);
      });

      // Si es POST, enviar el body al stdin de PHP
      if (req.method === 'POST' && body) {
        console.log(`📤 Enviando body POST a PHP: ${body}`);
        
        // Asegurar que PHP reciba el body completo
        phpProcess.stdin.write(body, 'utf8');
        phpProcess.stdin.end();
        
        console.log(`📤 Body enviado a PHP, longitud: ${body.length}`);
        console.log(`📤 Body enviado a PHP, primeros 200 chars: ${body.substring(0, 200)}`);
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
