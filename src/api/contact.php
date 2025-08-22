<?php
// Habilitar logging de errores
ini_set('log_errors', 1);
ini_set('error_log', '/tmp/uptservices_php_error.log');
error_log("🚀 Script PHP iniciado - " . date('Y-m-d H:i:s'));
// Incluir configuración
require_once 'config.php';

// Configuración de headers para CORS y JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Obtener datos del formulario
$input = $_POST;

// Debug: Log del input recibido
error_log("🔍 Input recibido desde \$_POST: " . print_r($input, true));
error_log("🔍 Raw input: " . file_get_contents('php://input'));
error_log("🔍 Content-Type: " . $_SERVER['CONTENT_TYPE'] ?? 'No definido');
error_log("🔍 Request Method: " . $_SERVER['REQUEST_METHOD'] ?? 'No definido');
error_log("🔍 \$_SERVER completo: " . print_r($_SERVER, true));
error_log("🔍 \$_POST completo: " . print_r($_POST, true));
error_log("🔍 \$_FILES completo: " . print_r($_FILES, true));

// Validar datos requeridos
$required_fields = ['nombre', 'email', 'servicio', 'mensaje'];
$missing_fields = [];

error_log("🔍 Validando campos requeridos: " . implode(', ', $required_fields));
error_log("🔍 Campos disponibles en input: " . implode(', ', array_keys($input)));

foreach ($required_fields as $field) {
    error_log("🔍 Verificando campo '$field': " . (isset($input[$field]) ? $input[$field] : 'NO EXISTE'));
    if (empty($input[$field])) {
        $missing_fields[] = $field;
        error_log("❌ Campo '$field' está vacío o no existe");
    } else {
        error_log("✅ Campo '$field' tiene valor: " . $input[$field]);
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Campos requeridos faltantes',
        'missing_fields' => $missing_fields
    ]);
    exit;
}

// Validar email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit;
}

// Sanitizar datos
$nombre = htmlspecialchars(trim($input['nombre']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$telefono = isset($input['telefono']) ? htmlspecialchars(trim($input['telefono'])) : 'No proporcionado';
$servicio = htmlspecialchars(trim($input['servicio']));
$mensaje = htmlspecialchars(trim($input['mensaje']));

// Verificar rate limiting
if (!checkRateLimit($email)) {
    http_response_code(429);
    echo json_encode([
        'error' => 'Has enviado demasiadas solicitudes. Por favor, espera antes de enviar otra.',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// Configurar email
$to = ADMIN_EMAIL;
$subject = 'Nueva Solicitud de Cotización - UPT Services';
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Crear contenido del email
$email_content = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Nueva Solicitud de Cotización</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
        <h2 style='color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;'>
            🚀 Nueva Solicitud de Cotización - UPT Services
        </h2>
        
        <div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;'>
            <h3 style='color: #495057; margin-top: 0;'>📋 Información del Cliente</h3>
            <p><strong>Nombre:</strong> $nombre</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Teléfono:</strong> $telefono</p>
            <p><strong>Servicio de Interés:</strong> $servicio</p>
        </div>
        
        <div style='background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;'>
            <h3 style='color: #1976d2; margin-top: 0;'>💬 Mensaje del Cliente</h3>
            <p style='background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;'>
                $mensaje
            </p>
        </div>
        
        <div style='background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;'>
            <p style='margin: 0; color: #e65100;'>
                <strong>⚠️ Acción Requerida:</strong> Este cliente está esperando tu cotización. 
                Responde en menos de 2 horas para mantener un excelente servicio.
            </p>
        </div>
        
        <div style='text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;'>
            <p style='color: #6c757d; font-size: 14px;'>
                Este email fue enviado desde el formulario de contacto de 
                <a href='https://utpservice.online' style='color: #667eea;'>utpservice.online</a>
            </p>
        </div>
    </div>
</body>
</html>
";

// Enviar email
error_log("📧 Intentando enviar email a: $to");
error_log("📧 Asunto: $subject");
error_log("📧 Headers: $headers");

$mail_sent = mail($to, $subject, $email_content, $headers);

if ($mail_sent) {
    error_log("✅ Email enviado exitosamente");
} else {
    error_log("❌ Error enviando email");
}

if ($mail_sent) {
    // Email enviado exitosamente
    echo json_encode([
        'success' => true,
        'message' => 'Solicitud de cotización enviada exitosamente. Te responderemos en menos de 2 horas.',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
    // Log del envío exitoso
    error_log("📝 Escribiendo log de éxito");
    writeLog("Cotización enviada exitosamente - Cliente: $nombre, Email: $email, Servicio: $servicio");
    
    // Enviar auto-respuesta al cliente
    if (AUTO_REPLY_ENABLED) {
        error_log("📧 Enviando auto-respuesta a: $email");
        sendAutoReply($email, $nombre, $servicio);
    }
    
} else {
    // Error al enviar email
    http_response_code(500);
    echo json_encode([
        'error' => 'Error al enviar la solicitud. Por favor, intenta nuevamente o contáctanos directamente.',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
    // Log del error
    error_log("📝 Escribiendo log de error");
    writeLog("Error al enviar cotización - Cliente: $nombre, Email: $email, Servicio: $servicio");
}

// Guardar en archivo de log local
error_log("📝 Guardando en log local");
try {
    writeLog("$nombre | $email | $telefono | $servicio | $mensaje");
    error_log("✅ Log escrito exitosamente");
} catch (Exception $e) {
    error_log("❌ Error escribiendo log: " . $e->getMessage());
}
?>
