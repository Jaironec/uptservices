# Configuración Formspree - UPT Services

## 🚀 Solución Temporal para Formularios

### **¿Por qué Formspree?**
- ✅ **No requiere PHP** instalado
- ✅ **Gratis** hasta 50 envíos por mes
- ✅ **Configuración en 2 minutos**
- ✅ **Funciona inmediatamente**

### **📧 Configuración del Email:**

1. **Visita:** https://formspree.io/
2. **Crea cuenta** gratuita
3. **Crea nuevo formulario** para UPT Services
4. **Copia el endpoint** (ej: `https://formspree.io/f/xpzgwqjq`)
5. **Reemplaza en `main.js`** la URL de Formspree

### **🔧 Configuración Actual:**

```javascript
// En src/scripts/main.js línea ~450
fetch('https://formspree.io/f/xpzgwqjq', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
```

### **📱 Cómo Funciona:**

1. **Cliente llena formulario** en la web
2. **JavaScript envía datos** a Formspree
3. **Formspree procesa** y envía email a tu dirección
4. **Tú recibes** la solicitud de cotización
5. **Cliente recibe** confirmación automática

### **⚠️ Limitaciones:**

- **50 envíos gratis** por mes
- **Dependencia externa** (Formspree)
- **Menos control** que PHP local

### **🔄 Migración a PHP (Cuando esté listo):**

1. **Instalar XAMPP** o PHP standalone
2. **Cambiar URL** de Formspree a `/api/contact.php`
3. **Configurar email** en `src/api/config.php`
4. **Probar** sistema completo

---

**¡Por ahora, Formspree te permitirá recibir cotizaciones inmediatamente! 🎉**
