/**
 * UTP-Service Website - WhatsApp Component
 * Integración con WhatsApp y funcionalidad de contacto
 */

export function initializeWhatsApp() {
    console.log('Inicializando WhatsApp...');
    
    initializeWhatsAppButtons();
    initializeFloatingButton();
    
    console.log('WhatsApp inicializado');
}

/**
 * Inicializar botones de WhatsApp
 */
function initializeWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const phone = button.getAttribute('data-phone') || '+593964092002';
            const message = button.getAttribute('data-message') || 'Hola, me gustaría obtener más información sobre sus servicios.';
            
            openWhatsApp(phone, message);
        });
    });
}

/**
 * Inicializar botón flotante de WhatsApp
 */
function initializeFloatingButton() {
    const floatingButton = document.querySelector('.whatsapp-contact');
    
    if (floatingButton) {
        floatingButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const phone = '+593964092002';
            const message = 'Hola, me gustaría obtener más información sobre sus servicios de tecnología y redes.';
            
            openWhatsApp(phone, message);
        });
    }
}

/**
 * Abrir WhatsApp con mensaje predefinido
 */
function openWhatsApp(phone, message) {
    // Limpiar y codificar el mensaje
    const cleanMessage = encodeURIComponent(message);
    const cleanPhone = phone.replace(/\s+/g, '');
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${cleanMessage}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
}

/**
 * Función para crear botón de WhatsApp dinámicamente
 */
export function createWhatsAppButton(phone, message, className = 'whatsapp-btn') {
    const button = document.createElement('a');
    button.href = '#';
    button.className = className;
    button.setAttribute('data-phone', phone);
    button.setAttribute('data-message', message);
    
    button.innerHTML = `
        <i class="fab fa-whatsapp"></i>
        <span>Contactar por WhatsApp</span>
    `;
    
    // Agregar event listener
    button.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp(phone, message);
    });
    
    return button;
}

/**
 * Función para enviar mensaje de WhatsApp desde formulario
 */
export function sendWhatsAppFromForm(formData) {
    const { name, service, message } = formData;
    
    const phone = '+593964092002';
    const whatsappMessage = `Hola, soy ${name}. Me interesa el servicio de ${service}. ${message}`;
    
    openWhatsApp(phone, whatsappMessage);
}

/**
 * Función para obtener mensaje personalizado según el servicio
 */
export function getServiceMessage(service) {
    const messages = {
        'redes': 'Hola, me gustaría obtener información sobre sus servicios de instalación y mantenimiento de redes.',
        'cableado': 'Hola, necesito información sobre cableado estructurado para mi empresa.',
        'soporte': 'Hola, busco soporte técnico para mi infraestructura IT.',
        'infraestructura': 'Hola, me interesa conocer más sobre sus servicios de infraestructura tecnológica.',
        'default': 'Hola, me gustaría obtener más información sobre sus servicios de tecnología y redes.'
    };
    
    return messages[service] || messages.default;
}
