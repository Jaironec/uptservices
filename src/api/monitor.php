<?php
/**
 * UPT Services - System Monitor
 * Monitorea el estado del sistema y envía alertas si es necesario
 */

// Configuración
define('ADMIN_EMAIL', '16cardenas16@gmail.com');
define('LOG_FILE', __DIR__ . '/logs/monitor.log');
define('CHECK_INTERVAL', 300); // 5 minutos

// Función para escribir logs
function writeLog($message) {
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message\n";
    file_put_contents(LOG_FILE, $log_entry, FILE_APPEND | LOCK_EX);
}

// Función para enviar alerta por email
function sendAlert($subject, $message) {
    $headers = "From: monitor@utpservice.online\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    return mail(ADMIN_EMAIL, $subject, $message, $headers);
}

// Función para verificar espacio en disco
function checkDiskSpace() {
    $free_space = disk_free_space('/');
    $total_space = disk_total_space('/');
    $used_percentage = (($total_space - $free_space) / $total_space) * 100;
    
    if ($used_percentage > 90) {
        $message = "ALERTA: Espacio en disco crítico. Usado: " . round($used_percentage, 2) . "%";
        writeLog($message);
        sendAlert("Alerta de Disco - UPT Services", $message);
        return false;
    }
    
    return true;
}

// Función para verificar logs de errores
function checkErrorLogs() {
    $error_log = __DIR__ . '/logs/error_log.txt';
    
    if (file_exists($error_log)) {
        $last_modified = filemtime($error_log);
        $current_time = time();
        
        // Si el archivo de error se modificó en la última hora
        if (($current_time - $last_modified) < 3600) {
            $error_count = count(file($error_log));
            if ($error_count > 10) {
                $message = "ALERTA: Muchos errores detectados en la última hora: $error_count";
                writeLog($message);
                sendAlert("Alerta de Errores - UPT Services", $message);
                return false;
            }
        }
    }
    
    return true;
}

// Función para verificar conectividad de la base de datos (si existe)
function checkDatabase() {
    // Por ahora solo verificamos que no haya errores de conexión
    // En el futuro se puede agregar verificación de MySQL/PostgreSQL
    return true;
}

// Función para verificar servicios del sistema
function checkSystemServices() {
    $services = ['apache2', 'php8.1-fpm'];
    $failed_services = [];
    
    foreach ($services as $service) {
        $output = shell_exec("systemctl is-active $service 2>&1");
        if (trim($output) !== 'active') {
            $failed_services[] = $service;
        }
    }
    
    if (!empty($failed_services)) {
        $message = "ALERTA: Servicios fallando: " . implode(', ', $failed_services);
        writeLog($message);
        sendAlert("Alerta de Servicios - UPT Services", $message);
        return false;
    }
    
    return true;
}

// Función para verificar archivos críticos
function checkCriticalFiles() {
    $critical_files = [
        __DIR__ . '/contact.php',
        __DIR__ . '/config.php',
        __DIR__ . '/../pages/index.html',
        __DIR__ . '/../styles/main.css',
        __DIR__ . '/../scripts/main.js'
    ];
    
    $missing_files = [];
    
    foreach ($critical_files as $file) {
        if (!file_exists($file)) {
            $missing_files[] = basename($file);
        }
    }
    
    if (!empty($missing_files)) {
        $message = "ALERTA: Archivos críticos faltantes: " . implode(', ', $missing_files);
        writeLog($message);
        sendAlert("Alerta de Archivos - UPT Services", $message);
        return false;
    }
    
    return true;
}

// Función para verificar permisos
function checkPermissions() {
    $api_dir = __DIR__;
    $logs_dir = $api_dir . '/logs';
    
    if (!is_writable($logs_dir)) {
        $message = "ALERTA: Directorio de logs no tiene permisos de escritura";
        writeLog($message);
        sendAlert("Alerta de Permisos - UPT Services", $message);
        return false;
    }
    
    return true;
}

// Función para generar reporte de estado
function generateStatusReport() {
    $status = [
        'disk_space' => checkDiskSpace(),
        'error_logs' => checkErrorLogs(),
        'database' => checkDatabase(),
        'system_services' => checkSystemServices(),
        'critical_files' => checkCriticalFiles(),
        'permissions' => checkPermissions()
    ];
    
    $all_ok = array_reduce($status, function($carry, $item) {
        return $carry && $item;
    }, true);
    
    if ($all_ok) {
        writeLog("Estado del sistema: OK");
    } else {
        writeLog("Estado del sistema: PROBLEMAS DETECTADOS");
    }
    
    return $status;
}

// Función para limpiar logs antiguos
function cleanupOldLogs() {
    $logs_dir = __DIR__ . '/logs';
    $max_age = 30 * 24 * 3600; // 30 días
    
    if (is_dir($logs_dir)) {
        $files = glob($logs_dir . '/*.log');
        
        foreach ($files as $file) {
            if (filemtime($file) < (time() - $max_age)) {
                unlink($file);
                writeLog("Log antiguo eliminado: " . basename($file));
            }
        }
    }
}

// Función principal del monitor
function runMonitor() {
    writeLog("Iniciando verificación del sistema...");
    
    // Verificar estado del sistema
    $status = generateStatusReport();
    
    // Limpiar logs antiguos
    cleanupOldLogs();
    
    // Verificar si hay problemas críticos
    $critical_issues = array_filter($status, function($item) {
        return !$item;
    });
    
    if (count($critical_issues) > 0) {
        writeLog("Se detectaron " . count($critical_issues) . " problemas críticos");
        
        // Enviar reporte diario si hay problemas
        $report = "Reporte de Estado - UPT Services\n";
        $report .= "Fecha: " . date('Y-m-d H:i:s') . "\n\n";
        
        foreach ($status as $check => $result) {
            $status_text = $result ? "OK" : "ERROR";
            $report .= "$check: $status_text\n";
        }
        
        sendAlert("Reporte de Estado - UPT Services", $report);
    }
    
    writeLog("Verificación del sistema completada");
}

// Ejecutar monitor
if (php_sapi_name() === 'cli') {
    runMonitor();
} else {
    // Si se accede desde web, solo mostrar estado
    header('Content-Type: application/json');
    
    $status = generateStatusReport();
    $all_ok = array_reduce($status, function($carry, $item) {
        return $carry && $item;
    }, true);
    
    echo json_encode([
        'status' => $all_ok ? 'healthy' : 'unhealthy',
        'timestamp' => date('Y-m-d H:i:s'),
        'checks' => $status
    ]);
}
?>
