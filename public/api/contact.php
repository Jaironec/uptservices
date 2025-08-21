<?php
/**
 * UTP-Service Contact Form Handler
 * Procesa el formulario de contacto y envía notificaciones por email
 */

// Configuración
$config = [
    'admin_email' => 'info@utpservice.live',
    'company_name' => 'UTP-Service',
    'subject_prefix' => '[UTP-Service] Nuevo mensaje de contacto',
    'success_message' => 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.',
    'error_message' => 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.',
    'spam_protection' => true,
    'honeypot_field' => 'website'
];

// Función para limpiar y validar datos
function cleanInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Función para validar email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Función para detectar spam
function isSpam($data) {
    global $config;
    
    // Honeypot check
    if (!empty($data[$config['honeypot_field']])) {
        return true;
    }
    
    // Check for suspicious content
    $suspicious_words = ['casino', 'viagra', 'loan', 'credit', 'debt'];
    $message = strtolower($data['message']);
    
    foreach ($suspicious_words as $word) {
        if (strpos($message, $word) !== false) {
            return true;
        }
    }
    
    return false;
}

// Función para enviar email
function sendEmail($data) {
    global $config;
    
    $to = $config['admin_email'];
    $subject = $config['subject_prefix'];
    
    // Construir el mensaje
    $message = "Nuevo mensaje de contacto desde el sitio web:\n\n";
    $message .= "Nombre: " . $data['name'] . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    $message .= "Teléfono: " . $data['phone'] . "\n";
    $message .= "Servicio: " . $data['service'] . "\n";
    $message .= "Mensaje:\n" . $data['message'] . "\n\n";
    $message .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
    $message .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
    // Headers
    $headers = "From: " . $data['email'] . "\r\n";
    $headers .= "Reply-To: " . $data['email'] . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Enviar email
    return mail($to, $subject, $message, $headers);
}

// Función para enviar email de confirmación al cliente
function sendConfirmationEmail($data) {
    global $config;
    
    $to = $data['email'];
    $subject = 'Gracias por contactar con UTP-Service';
    
    $message = "Hola " . $data['name'] . ",\n\n";
    $message .= "Gracias por contactar con UTP-Service. Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.\n\n";
    $message .= "Resumen de tu consulta:\n";
    $message .= "Servicio: " . $data['service'] . "\n";
    $message .= "Mensaje: " . substr($data['message'], 0, 100) . "...\n\n";
    $message .= "Si tienes alguna pregunta urgente, puedes contactarnos directamente:\n";
    $message .= "Email: info@utpservice.live\n";
    $message .= "WhatsApp: +593 XX XXX XXXX\n\n";
    $message .= "Saludos,\n";
    $message .= "Equipo de UTP-Service\n";
    $message .= "Conectamos tu negocio con la tecnología del futuro";
    
    $headers = "From: " . $config['admin_email'] . "\r\n";
    $headers .= "Reply-To: " . $config['admin_email'] . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    return mail($to, $subject, $message, $headers);
}

// Función para registrar en base de datos (opcional)
function logContact($data) {
    // Aquí puedes implementar el logging en base de datos
    // Por ahora solo creamos un archivo de log
    $log_entry = date('Y-m-d H:i:s') . " | " . 
                 $data['name'] . " | " . 
                 $data['email'] . " | " . 
                 $data['service'] . " | " . 
                 $_SERVER['REMOTE_ADDR'] . "\n";
    
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
}

// Procesar el formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = ['success' => false, 'message' => ''];
    
    try {
        // Verificar protección anti-spam
        if ($config['spam_protection'] && isSpam($_POST)) {
            throw new Exception('Mensaje detectado como spam');
        }
        
        // Validar campos requeridos
        $required_fields = ['name', 'email', 'service', 'message'];
        foreach ($required_fields as $field) {
            if (empty($_POST[$field])) {
                throw new Exception('El campo ' . $field . ' es requerido');
            }
        }
        
        // Limpiar y validar datos
        $data = [
            'name' => cleanInput($_POST['name']),
            'email' => cleanInput($_POST['email']),
            'phone' => cleanInput($_POST['phone'] ?? ''),
            'service' => cleanInput($_POST['service']),
            'message' => cleanInput($_POST['message']),
            'website' => cleanInput($_POST['website'] ?? '') // Honeypot
        ];
        
        // Validar email
        if (!isValidEmail($data['email'])) {
            throw new Exception('Email inválido');
        }
        
        // Validar longitud del mensaje
        if (strlen($data['message']) < 10) {
            throw new Exception('El mensaje debe tener al menos 10 caracteres');
        }
        
        if (strlen($data['message']) > 1000) {
            throw new Exception('El mensaje no puede exceder 1000 caracteres');
        }
        
        // Enviar email al administrador
        if (!sendEmail($data)) {
            throw new Exception('Error al enviar el email');
        }
        
        // Enviar email de confirmación al cliente
        sendConfirmationEmail($data);
        
        // Registrar en log
        logContact($data);
        
        $response['success'] = true;
        $response['message'] = $config['success_message'];
        
    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
    }
    
    // Devolver respuesta JSON
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Si no es POST, redirigir a la página principal
header('Location: index.html');
exit;
?>
