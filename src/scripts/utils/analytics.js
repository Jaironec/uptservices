/**
 * UTP-Service Website - Analytics Utility
 * Sistema de analytics y tracking de interacciones
 */

class Analytics {
    constructor() {
        this.events = [];
        this.isInitialized = false;
        this.config = {
            trackPageViews: true,
            trackClicks: true,
            trackForms: true,
            trackScroll: true,
            trackTimeOnPage: true
        };
    }
    
    /**
     * Inicializar analytics
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializando analytics...');
        
        this.setupEventListeners();
        this.trackPageView();
        this.startTimeTracking();
        
        this.isInitialized = true;
        console.log('Analytics inicializado');
    }
    
    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        if (this.config.trackClicks) {
            document.addEventListener('click', (e) => this.trackClick(e));
        }
        
        if (this.config.trackForms) {
            document.addEventListener('submit', (e) => this.trackFormSubmit(e));
        }
        
        if (this.config.trackScroll) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => this.trackScroll(), 100);
            });
        }
        
        // Tracking de enlaces externos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname !== window.location.hostname) {
                this.trackEvent('external_link_click', {
                    url: link.href,
                    text: link.textContent.trim()
                });
            }
        });
        
        // Tracking de descargas
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isDownloadLink(link.href)) {
                this.trackEvent('download', {
                    url: link.href,
                    filename: link.download || link.href.split('/').pop()
                });
            }
        });
    }
    
    /**
     * Trackear vista de página
     */
    trackPageView() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        this.trackEvent('page_view', pageData);
        
        // Enviar a Google Analytics si está configurado
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: pageData.title,
                page_location: pageData.url
            });
        }
    }
    
    /**
     * Trackear clicks
     */
    trackClick(e) {
        const target = e.target;
        const clickData = {
            element: target.tagName.toLowerCase(),
            className: target.className,
            id: target.id,
            text: target.textContent?.trim().substring(0, 100),
            timestamp: new Date().toISOString(),
            position: { x: e.clientX, y: e.clientY }
        };
        
        this.trackEvent('click', clickData);
    }
    
    /**
     * Trackear envío de formularios
     */
    trackFormSubmit(e) {
        const form = e.target;
        const formData = {
            formId: form.id || 'unknown',
            formAction: form.action,
            formMethod: form.method,
            timestamp: new Date().toISOString()
        };
        
        this.trackEvent('form_submit', formData);
    }
    
    /**
     * Trackear scroll
     */
    trackScroll() {
        const scrollData = {
            scrollY: window.scrollY,
            scrollPercent: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100),
            timestamp: new Date().toISOString()
        };
        
        this.trackEvent('scroll', scrollData);
    }
    
    /**
     * Iniciar tracking de tiempo en página
     */
    startTimeTracking() {
        const startTime = Date.now();
        
        // Trackear cada 30 segundos
        const timeInterval = setInterval(() => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('time_on_page', { seconds: timeOnPage });
        }, 30000);
        
        // Trackear al salir de la página
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('page_exit', { totalSeconds: totalTime });
            clearInterval(timeInterval);
        });
    }
    
    /**
     * Trackear evento personalizado
     */
    trackEvent(eventName, eventData = {}) {
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        };
        
        this.events.push(event);
        
        // Enviar a Google Analytics si está configurado
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Log en consola en desarrollo
        if (window.location.hostname === 'localhost') {
            console.log('Analytics Event:', event);
        }
        
        // Guardar en localStorage para persistencia
        this.saveEvents();
    }
    
    /**
     * Obtener ID de sesión
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }
    
    /**
     * Guardar eventos en localStorage
     */
    saveEvents() {
        try {
            const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            const allEvents = [...existingEvents, ...this.events];
            
            // Mantener solo los últimos 1000 eventos
            const trimmedEvents = allEvents.slice(-1000);
            
            localStorage.setItem('analytics_events', JSON.stringify(trimmedEvents));
        } catch (error) {
            console.warn('No se pudieron guardar los eventos de analytics:', error);
        }
    }
    
    /**
     * Verificar si es un enlace de descarga
     */
    isDownloadLink(url) {
        const downloadExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.exe'];
        return downloadExtensions.some(ext => url.toLowerCase().includes(ext));
    }
    
    /**
     * Obtener estadísticas de eventos
     */
    getStats() {
        const stats = {};
        
        this.events.forEach(event => {
            if (!stats[event.name]) {
                stats[event.name] = 0;
            }
            stats[event.name]++;
        });
        
        return stats;
    }
    
    /**
     * Exportar datos de analytics
     */
    exportData() {
        return {
            events: this.events,
            stats: this.getStats(),
            sessionId: this.getSessionId(),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Limpiar datos de analytics
     */
    clear() {
        this.events = [];
        localStorage.removeItem('analytics_events');
        sessionStorage.removeItem('analytics_session_id');
    }
}

// Exportar instancia singleton
export const analytics = new Analytics();
