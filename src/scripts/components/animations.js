/**
 * UTP-Service Website - Animations Component
 * Manejo de animaciones y efectos visuales
 */

export function initializeAnimations() {
    console.log('Inicializando animaciones...');
    
    initializeProjectFilter();
    initializeTestimonialSlider();
    initializeParallaxEffects();
    initializeHoverEffects();
    
    console.log('Animaciones inicializadas');
}

/**
 * Inicializar filtro de proyectos
 */
function initializeProjectFilter() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrar proyectos
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('show');
                    }, 50);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Inicializar slider de testimonios
 */
function initializeTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }
    
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    }
    
    // Event listeners para botones
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }
    
    // Auto-play cada 5 segundos
    setInterval(nextTestimonial, 5000);
    
    // Mostrar primer testimonio
    showTestimonial(0);
}

/**
 * Inicializar efectos parallax
 */
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * Inicializar efectos hover
 */
function initializeHoverEffects() {
    const hoverElements = document.querySelectorAll('.hover-effect');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('hovered');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('hovered');
        });
    });
}

/**
 * Función para animar elementos al hacer scroll
 */
export function animateOnScroll(element, animationClass = 'animate-in') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(element);
}

/**
 * Función para animar contadores
 */
export function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}
