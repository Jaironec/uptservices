<?php
// Configuración de Gmail SMTP para UPT Services
// =============================================

// IMPORTANTE: Para usar Gmail SMTP, necesitas:
// 1. Habilitar autenticación de 2 factores en tu cuenta de Gmail
// 2. Generar una contraseña de aplicación específica
// 3. Usar esa contraseña aquí (NO tu contraseña normal de Gmail)

// Configuración de Gmail SMTP
define('GMAIL_SMTP_HOST', 'smtp.gmail.com');
define('GMAIL_SMTP_PORT', 587);
define('GMAIL_SMTP_USERNAME', '16cardenas16@gmail.com');
define('GMAIL_SMTP_PASSWORD', 'tiwj yixw gpbt hsab'); // Reemplaza con tu contraseña de aplicación

// Configuración de seguridad
define('GMAIL_SMTP_SECURE', 'tls'); // tls o ssl
define('GMAIL_SMTP_AUTH', true);

// Configuración del remitente
define('GMAIL_FROM_NAME', 'UPT Services');
define('GMAIL_FROM_EMAIL', '16cardenas16@gmail.com');

// Configuración de timeout
define('GMAIL_SMTP_TIMEOUT', 30); // segundos

// Función para verificar si la configuración está completa
function isGmailConfigComplete() {
    return !empty(GMAIL_SMTP_PASSWORD) && GMAIL_SMTP_PASSWORD !== 'tu_app_password_aqui';
}

// Función para obtener configuración de Gmail
function getGmailConfig() {
    return [
        'host' => GMAIL_SMTP_HOST,
        'port' => GMAIL_SMTP_PORT,
        'username' => GMAIL_SMTP_USERNAME,
        'password' => GMAIL_SMTP_PASSWORD,
        'secure' => GMAIL_SMTP_SECURE,
        'auth' => GMAIL_SMTP_AUTH,
        'timeout' => GMAIL_SMTP_TIMEOUT,
        'from_name' => GMAIL_FROM_NAME,
        'from_email' => GMAIL_FROM_EMAIL
    ];
}
?>
