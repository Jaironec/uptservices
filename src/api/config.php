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
define('MAX_REQUESTS_PER_HOUR', 50); // Aumentado de 10 a 50

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
    try {
        $log_file = LOG_FILE;
        if (!file_exists($log_file)) {
            error_log("✅ Log file no existe, permitiendo primera solicitud");
            return true;
        }
        
        $current_time = time();
        $one_hour_ago = $current_time - (60 * 60);
        
        $lines = file($log_file, FILE_IGNORE_NEW_LINES);
        if ($lines === false) {
            error_log("❌ Error leyendo archivo de log");
            return true; // Permitir si no se puede leer
        }
        
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
        
        error_log("✅ Rate limit check: $recent_requests solicitudes en la última hora para $email");
        return $recent_requests < MAX_REQUESTS_PER_HOUR;
    } catch (Exception $e) {
        error_log("❌ Excepción en rate limiting: " . $e->getMessage());
        return true; // Permitir si hay error
    }
}

// Función para enviar auto-respuesta
function sendAutoReply($to, $nombre, $servicio) {
    try {
        $subject = str_replace('{nombre}', $nombre, AUTO_REPLY_SUBJECT);
        $message = str_replace(
            ['{nombre}', '{servicio}'], 
            [$nombre, $servicio], 
            AUTO_REPLY_MESSAGE
        );
        
        $headers = "From: " . ADMIN_EMAIL . "\r\n";
        $headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        $result = mail($to, $subject, $message, $headers);
        
        if ($result) {
            error_log("✅ Auto-respuesta enviada exitosamente a: $to");
        } else {
            error_log("❌ Error enviando auto-respuesta a: $to");
        }
        
        return $result;
    } catch (Exception $e) {
        error_log("❌ Excepción enviando auto-respuesta: " . $e->getMessage());
        return false;
    }
}

// Función para crear directorio de logs si no existe
function ensureLogDirectory() {
    try {
        $log_dir = dirname(LOG_FILE);
        if (!is_dir($log_dir)) {
            $result = mkdir($log_dir, 0755, true);
            if (!$result) {
                error_log("❌ Error creando directorio de logs: " . $log_dir);
                return false;
            }
            error_log("✅ Directorio de logs creado: " . $log_dir);
        }
        return true;
    } catch (Exception $e) {
        error_log("❌ Excepción creando directorio de logs: " . $e->getMessage());
        return false;
    }
}

// Función para escribir log de forma segura
function writeLog($message) {
    try {
        ensureLogDirectory();
        $timestamp = date('Y-m-d H:i:s');
        $log_entry = $timestamp . " | " . $message . "\n";
        $result = file_put_contents(LOG_FILE, $log_entry, FILE_APPEND | LOCK_EX);
        
        if ($result === false) {
            error_log("❌ Error escribiendo en log: " . LOG_FILE);
            return false;
        }
        
        return true;
    } catch (Exception $e) {
        error_log("❌ Excepción escribiendo log: " . $e->getMessage());
        return false;
    }
}
?>
