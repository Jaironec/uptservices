/**
 * UTP-Service Website - App Component
 * Componente principal de la aplicación
 */

export function initializeApp() {
    console.log('Inicializando aplicación UTP-Service...');
    
    // Inicializar funcionalidades básicas
    initializeProgressBar();
    initializeScrollAnimations();
    initializeCounters();
    
    console.log('Aplicación UTP-Service inicializada');
}

/**
 * Inicializar barra de progreso de scroll
 */
function initializeProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * Inicializar animaciones de scroll
 */
function initializeScrollAnimations() {
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
    
    // Observar elementos con animación
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Inicializar contadores animados
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}
