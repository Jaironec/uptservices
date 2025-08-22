# Backend PHP - UPT Services

## 🚀 Configuración del Sistema de Cotizaciones

### **Archivos Creados:**
- `contact.php` - Procesa las solicitudes de cotización
- `config.php` - Configuración del sistema
- `README.md` - Este archivo de instrucciones

### **📧 Configuración del Email (OBLIGATORIO)**

1. **Editar `config.php`:**
   ```php
   define('ADMIN_EMAIL', 'tu@email.com'); // CAMBIA ESTO
   ```

2. **Reemplazar `tu@email.com` con tu email real:**
   - Gmail: `tuemail@gmail.com`
   - Outlook: `tuemail@outlook.com`
   - Email corporativo: `tuemail@tuempresa.com`

### **🔧 Requisitos del Servidor:**

- **PHP 7.4+** instalado
- **Función `mail()`** habilitada
- **Permisos de escritura** en la carpeta para logs

### **📱 Cómo Funciona:**

1. **Cliente llena formulario** en la web
2. **JavaScript envía datos** a `/api/contact.php`
3. **PHP procesa y valida** los datos
4. **Se envía email** a tu dirección configurada
5. **Cliente recibe confirmación** automática
6. **Se guarda log** local de todas las solicitudes

### **📊 Características de Seguridad:**

- ✅ **Validación de datos** completa
- ✅ **Rate limiting** (máximo 10 solicitudes por hora por email)
- ✅ **Sanitización** de datos de entrada
- ✅ **Logs** de todas las solicitudes
- ✅ **Auto-respuesta** al cliente
- ✅ **Headers CORS** configurados

### **📝 Logs Generados:**

- `contact_log.txt` - Todas las solicitudes exitosas
- `error_log.txt` - Errores del sistema (si los hay)

### **🔄 Flujo de Trabajo:**

```
Cliente → Formulario Web → JavaScript → PHP → Tu Email
                ↓
        Cliente recibe confirmación automática
                ↓
        Tú recibes solicitud completa en tu email
                ↓
        Respondes con cotización en menos de 2 horas
```

### **⚠️ Notas Importantes:**

1. **Cambia el email** en `config.php` ANTES de usar
2. **Verifica que PHP funcione** en tu servidor
3. **Revisa tu carpeta de spam** por si acaso
4. **Los logs se guardan** en la misma carpeta del API

### **🧪 Prueba del Sistema:**

1. Llena el formulario en la web
2. Revisa tu email (incluyendo spam)
3. Verifica que aparezca en `contact_log.txt`
4. El cliente debe recibir confirmación automática

### **📞 Soporte:**

Si tienes problemas:
1. Verifica que PHP esté instalado
2. Revisa los logs de error
3. Confirma que tu email esté bien configurado
4. Verifica permisos de escritura en la carpeta

---

**¡Listo! Ahora las cotizaciones llegarán directamente a tu email. 🎉**
