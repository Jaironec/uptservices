/**
 * UPT Services Website - Main JavaScript
 * Funcionalidades principales del sitio web
 */

// Función para inicializar la aplicación
function initializeApp() {
    console.log('UPT Services Website iniciando...');
    
    initializeNavigation();
    initializeProjectFilters();
    initializeProjectVideos();
    initializeWhatsApp();
    initializeForms();
    initializeAnimations();
    initializeProgressBar();
    initializeTooltips();
    handleResponsive();
    initializeLazyLoading();
    handleErrors();
    initializeAnalytics();
    handlePerformance();
    
    console.log('UPT Services Website iniciado exitosamente');
}

// Función para inicializar la navegación
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle del menú móvil
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
            link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Navegación suave para enlaces internos
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
            e.preventDefault();
                const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                }
            }
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Función para inicializar filtros de proyectos
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar proyectos con animación
            projectCards.forEach((card, index) => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('fade-in');
                    } else {
                        card.style.display = 'none';
                    card.classList.remove('fade-in');
                    }
                });
            });
        });
    }

// Función para inicializar WhatsApp con mensajes personalizados
function initializeWhatsApp() {
    const whatsappBtn = document.querySelector('.whatsapp-contact');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            // Mensaje personalizado según la sección actual
            const currentSection = getCurrentSection();
            let message = '';
            
            switch(currentSection) {
                case 'services':
                    message = 'Hola UPT Services, me interesa conocer más sobre sus servicios tecnológicos en Esmeraldas. ¿Podrían enviarme información detallada?';
                    break;
                case 'projects':
                    message = 'Hola UPT Services, me gustaría ver más ejemplos de sus proyectos realizados. ¿Tienen casos de éxito similares al mío?';
                    break;
                case 'blog':
                    message = 'Hola UPT Services, me gustó su artículo del blog. ¿Podrían asesorarme sobre este tema para mi empresa?';
                    break;
                default:
                    message = 'Hola UPT Services, me interesa conocer más sobre sus servicios tecnológicos en Esmeraldas. ¿Podrían contactarme?';
            }
            
            const encodedMessage = encodeURIComponent(message);
            const phone = '593964092002';
            const url = `https://wa.me/${phone}?text=${encodedMessage}`;
            
            // Abrir WhatsApp en nueva pestaña
            window.open(url, '_blank');
            
            // Tracking del click (placeholder para analytics)
            trackWhatsAppClick(currentSection);
        });
    }
}

// Función para obtener la sección actual
function getCurrentSection() {
    const sections = ['home', 'about', 'services', 'projects', 'blog', 'testimonials', 'contact'];
    const scrollPosition = window.scrollY + 100;
    
    for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                return section;
            }
        }
    }
    return 'home';
}

// Función para tracking de WhatsApp (placeholder)
function trackWhatsAppClick(section) {
    console.log(`WhatsApp click desde sección: ${section}`);
    // Aquí se conectaría con Google Analytics u otra herramienta
}

// Función para inicializar formularios con validación mejorada
function initializeForms() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        contactForm.addEventListener('submit', handleFormSubmission);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
}

// Función para manejar suscripción al newsletter
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email || !isValidEmail(email)) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    // Simular suscripción
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Suscribiendo...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('¡Te has suscrito exitosamente a nuestro newsletter!', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Tracking del newsletter
        trackNewsletterSubscription(email);
    }, 1500);
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para tracking del newsletter (placeholder)
function trackNewsletterSubscription(email) {
    console.log('Newsletter subscription:', email);
    // Aquí se enviaría a Google Analytics u otra herramienta
}

// Función para inicializar botones de video de proyectos
function initializeProjectVideos() {
    const videoButtons = document.querySelectorAll('.play-video-btn');
    
    videoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            showProjectVideo(projectId);
        });
    });
}

// Función para mostrar video del proyecto
function showProjectVideo(projectId) {
    // Crear modal para el video
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-modal-header">
                <h3>Video del Proyecto</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="video-container">
                <div class="video-placeholder">
                    <i class="fas fa-play-circle"></i>
                    <p>Video del proyecto ${projectId}</p>
                    <small>Este es un placeholder. En producción se integraría con YouTube, Vimeo o similar.</small>
                </div>
            </div>
        </div>
    `;
    
    // Estilos del modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.video-modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: var(--border-radius-lg);
        max-width: 800px;
        width: 90%;
        max-height: 90%;
        overflow: hidden;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    // Agregar al DOM
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Cerrar modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => closeVideoModal(modal));
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal(modal);
        }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal(modal);
        }
    });
}

// Función para cerrar modal de video
function closeVideoModal(modal) {
    const modalContent = modal.querySelector('.video-modal-content');
    
    modal.style.opacity = '0';
    modalContent.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Función para validar campo individual
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldName) {
        case 'nombre':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
            break;
        case 'telefono':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un teléfono válido';
            }
            break;
        case 'servicio':
            if (!value) {
                isValid = false;
                errorMessage = 'Selecciona un servicio';
            }
            break;
        case 'mensaje':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Función para mostrar error de campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--error-color);
        font-size: var(--font-size-sm);
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

// Función para limpiar error de campo
function clearFieldError(field) {
    if (!field || !field.parentNode) return;
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// Función para manejar envío del formulario
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const inputs = e.target.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Por favor, corrige los errores en el formulario', 'error');
                return;
            }

    // Obtener datos del formulario
    const formData = new FormData(e.target);
    
    // Simular envío con estado de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Enviar datos al backend PHP local
    console.log('Enviando datos a PHP:', Object.fromEntries(formData));
    fetch('/api/contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Éxito
            showNotification(result.message, 'success');
            
            // Resetear formulario
            e.target.reset();
            
                    // Tracking del envío exitoso
        trackFormSubmission(Object.fromEntries(formData));
            
        } else {
            // Error del backend
            showNotification(result.error || 'Error al enviar el mensaje', 'error');
        }
    })
    .catch(error => {
        console.error('Error al enviar formulario:', error);
        showNotification('Error de conexión. Por favor, intenta nuevamente.', 'error');
    })
    .finally(() => {
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Limpiar errores
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: var(--shadow-lg);
    `;
    
    // Colores según tipo
    switch(type) {
        case 'success':
            notification.style.background = 'var(--success-color)';
            break;
        case 'error':
            notification.style.background = 'var(--error-color)';
            break;
        case 'warning':
            notification.style.background = 'var(--warning-color)';
            break;
        default:
            notification.style.background = 'var(--primary-color)';
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Función para inicializar animaciones mejoradas
function initializeAnimations() {
    // Intersection Observer para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animar
    const animateElements = document.querySelectorAll('.service-card, .project-card, .blog-card, .testimonial-card, .service-item');
    animateElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // Animación de contadores mejorada
    initializeCounters();
}

// Función para inicializar contadores animados
function initializeCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const text = stat.textContent;
        const target = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/\d/g, '');
        
        if (isNaN(target)) return;
        
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + suffix;
            }
        };
        
        // Iniciar contador cuando sea visible
        const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                    updateCounter();
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statObserver.observe(stat);
    });
}

// Función para inicializar barra de progreso
function initializeProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

// Función para manejar el scroll del header
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
                    } else {
                header.classList.remove('scrolled');
            }
            
            // Ocultar/mostrar header en scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Función para inicializar tooltips
function initializeTooltips() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        const tooltip = item.getAttribute('data-tooltip');
        
        if (tooltip) {
            item.addEventListener('mouseenter', (e) => {
                showTooltip(e.target, tooltip);
            });
            
            item.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        }
    });
}

// Función para mostrar tooltip
function showTooltip(element, text) {
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    
    tooltip.style.cssText = `
        position: absolute;
        background: var(--bg-dark);
        color: var(--text-white);
        padding: 0.5rem 0.75rem;
        border-radius: var(--border-radius);
        font-size: var(--font-size-sm);
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(tooltip);
    
    // Posicionar tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

// Función para ocultar tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.custom-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Función para manejar el responsive
function handleResponsive() {
    const checkScreenSize = () => {
        if (window.innerWidth <= 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    };
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Función para inicializar lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Función para manejar errores
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('Error en la aplicación:', e.error);
        // Aquí se podría enviar a un servicio de monitoreo de errores
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promesa rechazada no manejada:', e.reason);
        // Aquí se podría enviar a un servicio de monitoreo de errores
    });
}

// Función para inicializar analytics (placeholder)
function initializeAnalytics() {
    // Aquí se conectaría con Google Analytics u otra herramienta
    console.log('Analytics inicializado');
    
    // Tracking de eventos importantes
    trackPageView();
}

// Función para tracking de página (placeholder)
function trackPageView() {
    console.log('Página vista:', window.location.pathname);
    // Aquí se enviaría a Google Analytics
}

// Función para manejar el performance
function handlePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log('Tiempo de carga:', loadTime, 'ms');
                
                // Alertar si la carga es lenta
                if (loadTime > 3000) {
                    console.warn('La página está tardando en cargar. Considera optimizar las imágenes y recursos.');
                }
            }, 0);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    handleHeaderScroll();
});

// Exportar funciones para uso global
window.UPTServices = {
    initializeApp,
    initializeNavigation,
    initializeProjectFilters,
    initializeWhatsApp,
    initializeForms,
    initializeAnimations,
    initializeProgressBar,
    showNotification,
    trackWhatsAppClick
};

// Agregar estilos CSS para animaciones y estados
const style = document.createElement('style');
style.textContent = `
    /* Estados de animación */
    .animate-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Estados del formulario */
    .field-error {
        color: var(--error-color);
        font-size: var(--font-size-sm);
        margin-top: 0.25rem;
        display: block;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    /* Botón de carga */
    .btn.loading {
        position: relative;
        color: transparent;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Menú móvil */
    .mobile .nav-menu {
        display: none;
    }
    
    .mobile .nav-menu.active {
        display: flex;
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    /* Animación de entrada */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-out;
    }
    
    /* Header scrolled */
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: var(--shadow-lg);
    }
    
    .header {
        transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);
