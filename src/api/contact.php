<?php
// Habilitar logging de errores
ini_set('log_errors', 1);
ini_set('error_log', '/tmp/uptservices_php_error.log');
error_log("🚀 ==========================================");
error_log("🚀 SCRIPT PHP INICIADO - " . date('Y-m-d H:i:s'));
error_log("🚀 Método: " . ($_SERVER['REQUEST_METHOD'] ?? 'NO DEFINIDO'));
error_log("🚀 Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'NO DEFINIDO'));
error_log("🚀 ==========================================");

// Logging adicional para debugging
error_log("🔍 Script ejecutado desde: " . __FILE__);
error_log("🔍 Directorio de trabajo: " . getcwd());
error_log("🔍 Usuario del proceso: " . get_current_user());
// Incluir configuración
require_once 'config.php';
require_once 'gmail-config.php';

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
$input = [];

// Leer datos desde argumentos de línea de comandos
$input = [];

// Logging de argumentos de línea de comandos
error_log("🔍 === ARGUMENTOS DE LÍNEA DE COMANDOS ===");
$argv = $_SERVER['argv'] ?? [];
error_log("🔍 Argumentos recibidos: " . print_r($argv, true));

// Parsear argumentos de línea de comandos
foreach ($argv as $arg) {
    if (strpos($arg, '--') === 0) {
        $arg = substr($arg, 2); // Remover --
        $parts = explode('=', $arg, 2);
        if (count($parts) === 2) {
            $field_name = $parts[0];
            $field_value = $parts[1];
            $input[$field_name] = $field_value;
            error_log("🔍 Campo encontrado en argumento: $field_name = '$field_value'");
        }
    }
}

// Logging específico de los campos que esperamos
$expected_fields = ['nombre', 'email', 'servicio', 'mensaje'];
foreach ($expected_fields as $field) {
    if (isset($input[$field])) {
        error_log("✅ Campo encontrado: $field = '{$input[$field]}'");
    } else {
        error_log("❌ Campo NO encontrado: $field");
    }
}

// Fallback: si no hay campos en argumentos, intentar con $_POST
if (empty($input)) {
    error_log("🔍 No se encontraron campos en argumentos, usando \$_POST como fallback");
    $input = $_POST;
}

// Logging del input final
error_log("🔍 === INPUT FINAL PROCESADO ===");
error_log("🔍 Número de campos: " . count($input));
error_log("🔍 Campos disponibles: " . implode(', ', array_keys($input)));
error_log("🔍 Input completo: " . print_r($input, true));
error_log("🔍 === FIN INPUT ===");

error_log("🔍 \$_FILES completo: " . print_r($_FILES, true));
error_log("🔍 \$_POST original: " . print_r($_POST, true));

// Validar datos requeridos
$required_fields = ['nombre', 'email', 'servicio', 'mensaje'];
$missing_fields = [];

error_log("🔍 === VALIDACIÓN DE CAMPOS ===");
error_log("🔍 Campos requeridos: " . implode(', ', $required_fields));
error_log("🔍 Campos disponibles en input: " . implode(', ', array_keys($input)));
error_log("🔍 Input completo: " . print_r($input, true));

foreach ($required_fields as $field) {
    if (isset($input[$field])) {
        $value = $input[$field];
        if (empty($value)) {
            $missing_fields[] = $field;
            error_log("❌ Campo '$field' existe pero está vacío");
        } else {
            error_log("✅ Campo '$field' válido: '$value'");
        }
    } else {
        $missing_fields[] = $field;
        error_log("❌ Campo '$field' NO EXISTE en el input");
    }
}

error_log("🔍 Campos faltantes: " . implode(', ', $missing_fields));
error_log("🔍 === FIN VALIDACIÓN ===");

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

// Enviar email usando Gmail SMTP
error_log("📧 Intentando enviar email a: $to");
error_log("📧 Asunto: $subject");

// Verificar si la configuración de Gmail está completa
if (isGmailConfigComplete()) {
    error_log("📧 Configuración de Gmail completa, intentando envío SMTP");
    
    // Verificar si PHPMailer está disponible
    error_log("📧 Verificando disponibilidad de PHPMailer...");
    error_log("📧 PHPMailer disponible: " . (class_exists('PHPMailer\PHPMailer\PHPMailer') ? 'SÍ' : 'NO'));
    
    // Verificar si el archivo de PHPMailer existe
    $phpmailer_path = __DIR__ . '/../vendor/autoload.php';
    error_log("📧 Ruta de PHPMailer: $phpmailer_path");
    error_log("📧 Archivo existe: " . (file_exists($phpmailer_path) ? 'SÍ' : 'NO'));
    
    // Intentar cargar PHPMailer si existe
    if (file_exists($phpmailer_path)) {
        require_once $phpmailer_path;
        error_log("📧 PHPMailer cargado desde: $phpmailer_path");
    }
    
    // Verificar nuevamente si PHPMailer está disponible
    error_log("📧 PHPMailer disponible después de cargar: " . (class_exists('PHPMailer\PHPMailer\PHPMailer') ? 'SÍ' : 'NO'));
    
    // Intentar usar PHPMailer si está disponible
    if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        error_log("📧 Usando PHPMailer con Gmail SMTP");
        
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $gmail_config = getGmailConfig();
            error_log("📧 Configuración Gmail: " . print_r($gmail_config, true));
            
            $mail->isSMTP();
            $mail->Host = $gmail_config['host'];
            $mail->SMTPAuth = $gmail_config['auth'];
            $mail->Username = $gmail_config['username'];
            $mail->Password = $gmail_config['password'];
            $mail->SMTPSecure = $gmail_config['secure'];
            $mail->Port = $gmail_config['port'];
            $mail->Timeout = $gmail_config['timeout'];
            
            // Configuración adicional para debugging
            $mail->SMTPDebug = 2; // Habilitar debug SMTP
            $mail->Debugoutput = function($str, $level) {
                error_log("📧 SMTP Debug: $str");
            };
            
            $mail->setFrom($gmail_config['from_email'], $gmail_config['from_name']);
            $mail->addAddress($to);
            $mail->Subject = $subject;
            $mail->isHTML(true);
            $mail->Body = $email_content;
            
            error_log("📧 Intentando enviar email con PHPMailer...");
            $mail_sent = $mail->send();
            error_log("✅ Email enviado exitosamente con PHPMailer + Gmail SMTP");
        } catch (Exception $e) {
            error_log("❌ Error con PHPMailer: " . $e->getMessage());
            $mail_sent = false;
        }
    } else {
        error_log("📧 PHPMailer no disponible, intentando con mail() nativo");
        $mail_sent = mail($to, $subject, $email_content, $headers);
        
        if ($mail_sent) {
            error_log("✅ Email enviado exitosamente con mail() nativo");
        } else {
            error_log("❌ Error enviando email con mail() nativo");
        }
    }
} else {
    error_log("📧 Configuración de Gmail incompleta, usando mail() nativo como fallback");
    
    // Fallback a la función mail() nativa
    $mail_sent = mail($to, $subject, $email_content, $headers);
    
    if ($mail_sent) {
        error_log("✅ Email enviado exitosamente con mail() nativo");
    } else {
        error_log("❌ Error enviando email con mail() nativo");
    }
}

if ($mail_sent) {
    // Email enviado exitosamente
    error_log("🎉 EMAIL ENVIADO EXITOSAMENTE - Cliente: $nombre, Email: $email");
    
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
    error_log("❌ ERROR AL ENVIAR EMAIL - Cliente: $nombre, Email: $email");
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

error_log("🏁 ==========================================");
error_log("🏁 SCRIPT PHP FINALIZADO - " . date('Y-m-d H:i:s'));
error_log("🏁 ==========================================");
?>
