/**
 * UTP-Service Website - Contact Service
 * Servicio para manejo de formularios de contacto y comunicación con API
 */

class ContactService {
    constructor() {
        this.apiEndpoint = '/api/contact.php';
        this.isInitialized = false;
        this.submissionQueue = [];
        this.maxRetries = 3;
    }
    
    /**
     * Inicializar servicio de contacto
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializando servicio de contacto...');
        
        // Procesar cola de envíos pendientes
        this.processQueue();
        
        this.isInitialized = true;
        console.log('Servicio de contacto inicializado');
    }
    
    /**
     * Enviar formulario de contacto
     */
    async submitContactForm(formData) {
        try {
            console.log('Enviando formulario de contacto:', formData);
            
            // Validar datos antes del envío
            const validationResult = this.validateFormData(formData);
            if (!validationResult.isValid) {
                throw new Error(`Validación fallida: ${validationResult.errors.join(', ')}`);
            }
            
            // Preparar datos para envío
            const submissionData = this.prepareSubmissionData(formData);
            
            // Intentar envío inmediato
            const result = await this.sendToAPI(submissionData);
            
            if (result.success) {
                console.log('Formulario enviado exitosamente');
                return {
                    success: true,
                    message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
                    data: result.data
                };
            } else {
                throw new Error(result.message || 'Error desconocido al enviar el formulario');
            }
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            
            // Agregar a cola de reintentos
            this.addToQueue(formData);
            
            return {
                success: false,
                message: 'Error al enviar el mensaje. Se reintentará automáticamente.',
                error: error.message
            };
        }
    }
    
    /**
     * Validar datos del formulario
     */
    validateFormData(data) {
        const errors = [];
        
        // Validar nombre
        if (!data.name || data.name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.push('Email inválido');
        }
        
        // Validar teléfono
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            errors.push('Teléfono inválido');
        }
        
        // Validar servicio
        if (!data.service) {
            errors.push('Debe seleccionar un servicio');
        }
        
        // Validar mensaje
        if (!data.message || data.message.trim().length < 10) {
            errors.push('El mensaje debe tener al menos 10 caracteres');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Preparar datos para envío
     */
    prepareSubmissionData(formData) {
        return {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            service: formData.service,
            message: formData.message.trim(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            pageUrl: window.location.href
        };
    }
    
    /**
     * Enviar datos a la API
     */
    async sendToAPI(data) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    }
    
    /**
     * Agregar formulario a cola de reintentos
     */
    addToQueue(formData) {
        const queueItem = {
            data: formData,
            attempts: 0,
            timestamp: Date.now(),
            id: this.generateQueueId()
        };
        
        this.submissionQueue.push(queueItem);
        this.saveQueue();
        
        console.log('Formulario agregado a cola de reintentos:', queueItem.id);
    }
    
    /**
     * Procesar cola de envíos pendientes
     */
    async processQueue() {
        if (this.submissionQueue.length === 0) return;
        
        console.log(`Procesando ${this.submissionQueue.length} formularios en cola...`);
        
        const queueCopy = [...this.submissionQueue];
        this.submissionQueue = [];
        
        for (const item of queueCopy) {
            if (item.attempts < this.maxRetries) {
                try {
                    item.attempts++;
                    
                    const result = await this.sendToAPI(item.data);
                    
                    if (result.success) {
                        console.log(`Formulario ${item.id} enviado exitosamente en reintento ${item.attempts}`);
                        continue;
                    }
                    
                } catch (error) {
                    console.warn(`Error en reintento ${item.attempts} para formulario ${item.id}:`, error);
                }
                
                // Si aún no se pudo enviar, agregar de vuelta a la cola
                if (item.attempts < this.maxRetries) {
                    this.submissionQueue.push(item);
                } else {
                    console.error(`Formulario ${item.id} falló después de ${this.maxRetries} intentos`);
                }
            }
        }
        
        this.saveQueue();
        
        // Programar próximo procesamiento
        if (this.submissionQueue.length > 0) {
            setTimeout(() => this.processQueue(), 60000); // 1 minuto
        }
    }
    
    /**
     * Generar ID único para cola
     */
    generateQueueId() {
        return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Guardar cola en localStorage
     */
    saveQueue() {
        try {
            localStorage.setItem('contact_form_queue', JSON.stringify(this.submissionQueue));
        } catch (error) {
            console.warn('No se pudo guardar la cola de formularios:', error);
        }
    }
    
    /**
     * Cargar cola desde localStorage
     */
    loadQueue() {
        try {
            const savedQueue = localStorage.getItem('contact_form_queue');
            if (savedQueue) {
                this.submissionQueue = JSON.parse(savedQueue);
                console.log(`Cola cargada: ${this.submissionQueue.length} formularios pendientes`);
            }
        } catch (error) {
            console.warn('No se pudo cargar la cola de formularios:', error);
            this.submissionQueue = [];
        }
    }
    
    /**
     * Limpiar cola de formularios
     */
    clearQueue() {
        this.submissionQueue = [];
        this.saveQueue();
        console.log('Cola de formularios limpiada');
    }
    
    /**
     * Obtener estadísticas de envíos
     */
    getStats() {
        return {
            queueLength: this.submissionQueue.length,
            totalAttempts: this.submissionQueue.reduce((sum, item) => sum + item.attempts, 0),
            oldestItem: this.submissionQueue.length > 0 ? 
                new Date(Math.min(...this.submissionQueue.map(item => item.timestamp))) : null
        };
    }
    
    /**
     * Enviar mensaje de WhatsApp como alternativa
     */
    sendWhatsAppAlternative(formData) {
        const phone = '+593964092002';
        const message = `Hola, soy ${formData.name}. Me interesa el servicio de ${formData.service}. ${formData.message}`;
        
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        return {
            success: true,
            message: 'Redirigiendo a WhatsApp...',
            alternative: 'whatsapp'
        };
    }
}

// Exportar instancia singleton
export const contactService = new ContactService();
