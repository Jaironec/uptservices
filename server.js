const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Función para parsear multipart/form-data
function parseMultipartFormData(body, contentType) {
  const boundary = contentType.match(/boundary=(.*)$/)?.[1];
  if (!boundary) return {};
  
  const parts = body.split('--' + boundary);
  const formData = {};
  
  parts.forEach((part, index) => {
    if (part === '--' || part === '') return;
    
    console.log(`🔍 Procesando parte ${index}:`, part.substring(0, 100) + '...');
    
    // Extraer nombre del campo
    const nameMatch = part.match(/name="([^"]+)"/);
    if (!nameMatch) return;
    
    const fieldName = nameMatch[1];
    console.log(`🔍 Nombre del campo: ${fieldName}`);
    
    // Extraer valor del campo (después de la línea vacía)
    const lines = part.split('\r\n');
    let value = '';
    let foundEmptyLine = false;
    
    for (let line of lines) {
      if (foundEmptyLine) {
        value += line + '\r\n';
      } else if (line.trim() === '') {
        foundEmptyLine = true;
      }
    }
    
    console.log(`🔍 Valor antes de limpiar: '${value}'`);
    
    // Limpiar el valor - remover headers y boundary
    value = value.trim();
    value = value.replace(/\r?\n--.*$/, ''); // Remover boundary final
    value = value.replace(/^Content-Disposition:.*\r?\n?/g, ''); // Remover header Content-Disposition
    value = value.replace(/^name="[^"]+"\r?\n?/g, ''); // Remover header name
    value = value.trim(); // Limpiar espacios extra
    
    console.log(`🔍 Valor después de limpiar: '${value}'`);
    
    formData[fieldName] = value;
  });
  
  return formData;
}

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
      
      // Logging específico de las variables POST_
      // Variable para almacenar los datos del formulario
      let formData = {};
      
      // Si es POST, procesar el body
      if (req.method === 'POST' && body) {
        console.log(`📤 Enviando body POST a PHP: ${body}`);
        
        // Parsear el body
        formData = parseMultipartFormData(body, req.headers['content-type']);
        console.log(`📤 FormData parseado:`, formData);
        
        // Agregar los campos del formulario a las variables de entorno
        Object.keys(formData).forEach(key => {
          env[`POST_${key.toUpperCase()}`] = formData[key];
          console.log(`📤 Variable de entorno creada: POST_${key.toUpperCase()} = '${formData[key]}'`);
        });
        
        // Agregar el body raw también
        env['RAW_POST_DATA'] = body;
        
        console.log(`📤 Variables de entorno POST agregadas`);
        console.log(`📤 Variables de entorno disponibles:`, Object.keys(env).filter(key => key.startsWith('POST_')));
      }
      
      // Logging de variables de entorno
      const postVars = Object.keys(env).filter(key => key.startsWith('POST_'));
      console.log(`🔍 Variables POST_ que se pasan a PHP:`, postVars);
      postVars.forEach(key => {
        console.log(`  ${key}: '${env[key]}'`);
      });

      // Usar exec con argumentos para pasar los datos directamente
      console.log(`🔍 Ejecutando PHP: php ${filePath}`);
      
      // Crear argumentos de línea de comandos para PHP
      const phpArgs = [filePath];
      
      // Agregar los campos como argumentos de línea de comandos
      Object.keys(formData).forEach(key => {
        phpArgs.push(`--${key}=${formData[key]}`);
      });
      
      console.log(`🔍 Argumentos PHP:`, phpArgs);
      
      const { exec } = require('child_process');
      const phpProcess = exec(`php ${phpArgs.join(' ')}`, { 
        env,
        maxBuffer: 1024 * 1024 // 1MB buffer
      }, (error, stdout, stderr) => {
        if (error) {
          console.log(`❌ Error ejecutando PHP:`, error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Error interno del servidor PHP',
            details: error.message
          }));
          return;
        }
        
        if (stderr) {
          console.log(`⚠️ PHP stderr: ${stderr}`);
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
