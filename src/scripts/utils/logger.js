/**
 * UTP-Service Website - Logger Utility
 * Sistema de logging para debugging y monitoreo
 */

class Logger {
    constructor() {
        this.isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.protocol === 'file:';
        
        this.logLevel = this.isDevelopment ? 'debug' : 'info';
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
    }
    
    /**
     * Log de error
     */
    error(message, ...args) {
        this.log('error', message, args);
    }
    
    /**
     * Log de advertencia
     */
    warn(message, ...args) {
        this.log('warn', message, args);
    }
    
    /**
     * Log de información
     */
    info(message, ...args) {
        this.log('info', message, args);
    }
    
    /**
     * Log de debug
     */
    debug(message, ...args) {
        this.log('debug', message, args);
    }
    
    /**
     * Función principal de logging
     */
    log(level, message, args = []) {
        if (this.levels[level] <= this.levels[this.logLevel]) {
            const timestamp = new Date().toISOString();
            const prefix = `[UTP-Service] [${timestamp}] [${level.toUpperCase()}]`;
            
            switch (level) {
                case 'error':
                    console.error(prefix, message, ...args);
                    break;
                case 'warn':
                    console.warn(prefix, message, ...args);
                    break;
                case 'info':
                    console.info(prefix, message, ...args);
                    break;
                case 'debug':
                    console.debug(prefix, message, ...args);
                    break;
            }
            
            // En desarrollo, también mostrar en la consola del navegador
            if (this.isDevelopment) {
                this.displayInConsole(level, message, args);
            }
        }
    }
    
    /**
     * Mostrar log en consola visual (solo en desarrollo)
     */
    displayInConsole(level, message, args) {
        // Crear elemento visual para logs en desarrollo
        const logContainer = this.getOrCreateLogContainer();
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${level}`;
        
        const timestamp = new Date().toLocaleTimeString();
        logEntry.innerHTML = `
            <span class="log-timestamp">${timestamp}</span>
            <span class="log-level">${level.toUpperCase()}</span>
            <span class="log-message">${message}</span>
        `;
        
        logContainer.appendChild(logEntry);
        
        // Auto-remover logs antiguos
        setTimeout(() => {
            if (logEntry.parentNode) {
                logEntry.remove();
            }
        }, 10000);
    }
    
    /**
     * Obtener o crear contenedor de logs visual
     */
    getOrCreateLogContainer() {
        let container = document.getElementById('dev-log-container');
        
        if (!container && this.isDevelopment) {
            container = document.createElement('div');
            container.id = 'dev-log-container';
            container.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 400px;
                max-height: 300px;
                background: rgba(0,0,0,0.9);
                color: white;
                font-family: monospace;
                font-size: 12px;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                overflow-y: auto;
                display: none;
            `;
            
            // Botón para mostrar/ocultar logs
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = '📋';
            toggleBtn.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 10001;
                background: #333;
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                font-size: 18px;
            `;
            
            toggleBtn.addEventListener('click', () => {
                container.style.display = container.style.display === 'none' ? 'block' : 'none';
            });
            
            document.body.appendChild(container);
            document.body.appendChild(toggleBtn);
        }
        
        return container;
    }
    
    /**
     * Limpiar todos los logs
     */
    clear() {
        const container = document.getElementById('dev-log-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Exportar instancia singleton
export const logger = new Logger();
