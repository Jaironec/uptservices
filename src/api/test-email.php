<?php
// Script de prueba para verificar PHPMailer y Gmail SMTP
header('Content-Type: application/json');

// Incluir configuración
require_once 'gmail-config.php';

// Verificar configuración
$config = getGmailConfig();
echo json_encode([
    'config_ok' => isGmailConfigComplete(),
    'gmail_config' => $config,
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
