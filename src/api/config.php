<?php
// Configuración del backend UPT Services para Ubuntu
// ===================================================

// Configuración de Email
define('ADMIN_EMAIL', '16cardenas16@gmail.com');
define('COMPANY_NAME', 'UPT Services');
define('WEBSITE_URL', 'https://utpservice.online');

// Configuración de Seguridad
define('MAX_MESSAGE_LENGTH', 2000);
define('MAX_NAME_LENGTH', 100);
define('RATE_LIMIT_MINUTES', 5);
define('MAX_REQUESTS_PER_HOUR', 10);

// Configuración de Logs
define('LOG_FILE', __DIR__ . '/logs/contact_log.txt');
define('ERROR_LOG_FILE', __DIR__ . '/logs/error_log.txt');

// Configuración de Notificaciones
define('AUTO_REPLY_ENABLED', true);
define('AUTO_REPLY_SUBJECT', 'Recibimos tu solicitud - UPT Services');
define('AUTO_REPLY_MESSAGE', '
Hola {nombre},

Hemos recibido tu solicitud de cotización para el servicio: {servicio}

Nuestro equipo técnico la revisará y te responderá en menos de 2 horas con una propuesta personalizada.

Mientras tanto, puedes:
- Visitar nuestro sitio web: ' . WEBSITE_URL . '
- Llamarnos al: +593 964092002
- Escribirnos por WhatsApp

¡Gracias por confiar en UPT Services!

Saludos,
El equipo de UPT Services
');

// Función para validar rate limiting
function checkRateLimit($email) {
    $log_file = LOG_FILE;
    if (!file_exists($log_file)) return true;
    
    $current_time = time();
    $one_hour_ago = $current_time - (60 * 60);
    
    $lines = file($log_file, FILE_IGNORE_NEW_LINES);
    $recent_requests = 0;
    
    foreach ($lines as $line) {
        if (strpos($line, $email) !== false) {
            $parts = explode(' | ', $line);
            if (isset($parts[0])) {
                $timestamp = strtotime($parts[0]);
                if ($timestamp > $one_hour_ago) {
                    $recent_requests++;
                }
            }
        }
    }
    
    return $recent_requests < MAX_REQUESTS_PER_HOUR;
}

// Función para enviar auto-respuesta
function sendAutoReply($to, $nombre, $servicio) {
    $subject = str_replace('{nombre}', $nombre, AUTO_REPLY_SUBJECT);
    $message = str_replace(
        ['{nombre}', '{servicio}'], 
        [$nombre, $servicio], 
        AUTO_REPLY_MESSAGE
    );
    
    $headers = "From: " . ADMIN_EMAIL . "\r\n";
    $headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    return mail($to, $subject, $message, $headers);
}

// Función para crear directorio de logs si no existe
function ensureLogDirectory() {
    $log_dir = dirname(LOG_FILE);
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
}

// Función para escribir log de forma segura
function writeLog($message) {
    ensureLogDirectory();
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = $timestamp . " | " . $message . "\n";
    return file_put_contents(LOG_FILE, $log_entry, FILE_APPEND | LOCK_EX);
}
?>
