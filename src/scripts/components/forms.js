/**
 * UTP-Service Website - Forms Component
 * Manejo de formularios y validación
 */

export function initializeForms() {
    console.log('Inicializando formularios...');
    
    initializeContactForm();
    initializeNewsletterForm();
    
    console.log('Formularios inicializados');
}

/**
 * Inicializar formulario de contacto
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    
    // Validación en tiempo real
    formFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });
    
    // Envío del formulario
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm(contactForm)) {
            await submitForm(contactForm);
        }
    });
    
    // Validar campo individual
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones específicas por campo
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingrese un email válido';
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingrese un teléfono válido';
                }
                break;
                
            case 'service':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Seleccione un servicio';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    // Mostrar error de campo
    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }
    
    // Limpiar error de campo
    function clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('error');
    }
    
    // Validar formulario completo
    function validateForm(form) {
        let isValid = true;
        
        formFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Enviar formulario
    async function submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Cambiar estado del botón
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simular envío (reemplazar con llamada real a la API)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mostrar mensaje de éxito
            alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
            
            // Limpiar formulario
            form.reset();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
            
        } finally {
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}

/**
 * Inicializar formulario de newsletter
 */
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        if (email) {
            alert('¡Gracias por suscribirte a nuestro newsletter!');
            newsletterForm.reset();
        }
    });
}
