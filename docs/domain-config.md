# Configuración de Dominio - UTP-Service

## Dominio Principal
- **Dominio**: utpservice.online
- **Registrador**: [Tu registrador de dominios]
- **Fecha de expiración**: [Fecha de expiración]

## Subdominios Configurados

### 1. Tienda Online
- **Subdominio**: tienda.utpservice.online
- **Plataforma**: WooCommerce (WordPress)
- **Propósito**: Venta de equipos tecnológicos
- **Estado**: Pendiente de implementación

### 2. Cursos Online
- **Subdominio**: cursos.utpservice.online
- **Plataforma**: Moodle o LMS personalizado
- **Propósito**: Plataforma de formación
- **Estado**: Pendiente de implementación

### 3. Sistema de Tickets
- **Subdominio**: tickets.utpservice.online
- **Plataforma**: Sistema personalizado o Zendesk
- **Propósito**: Soporte técnico y atención al cliente
- **Estado**: Pendiente de implementación

### 4. Zona de Clientes
- **Subdominio**: clientes.utpservice.online
- **Plataforma**: CRM (Odoo o SuiteCRM)
- **Propósito**: Gestión de clientes y proyectos
- **Estado**: Pendiente de implementación

### 5. Blog Tecnológico
- **Subdominio**: blog.utpservice.online
- **Plataforma**: WordPress o Ghost
- **Propósito**: Contenido tecnológico y marketing
- **Estado**: Pendiente de implementación

## Configuración DNS

### Registros A
```
utpservice.online.     A     [IP_DEL_SERVIDOR]
tienda.utpservice.online.     A     [IP_DEL_SERVIDOR]
cursos.utpservice.online.     A     [IP_DEL_SERVIDOR]
tickets.utpservice.online.     A     [IP_DEL_SERVIDOR]
clientes.utpservice.online.     A     [IP_DEL_SERVIDOR]
blog.utpservice.online.     A     [IP_DEL_SERVIDOR]
```

### Registros MX (Email)
```
utpservice.online.     MX     10     [SERVIDOR_EMAIL]
```

### Registros SPF
```
utpservice.online.     TXT     "v=spf1 include:_spf.google.com ~all"
```

### Registros DKIM
```
[selector]._domainkey.utpservice.online.     TXT     [CLAVE_DKIM]
```

### Registros DMARC
```
_dmarc.utpservice.online.     TXT     "v=DMARC1; p=quarantine; rua=mailto:dmarc@utpservice.online"
```

## Certificados SSL
- **Proveedor**: Let's Encrypt (gratuito) o comercial
- **Cobertura**: Dominio principal + wildcard (*.utpservice.online)
- **Renovación**: Automática (Let's Encrypt) o manual

## Configuración de Email
- **Servidor SMTP**: [configurado en el hosting]
- **Email principal**: info@utpservice.online
- **Email de soporte**: soporte@utpservice.online
- **Email de ventas**: ventas@utpservice.online

## Notas Importantes
1. Todos los subdominios apuntan actualmente al mismo servidor
2. La implementación de cada subdominio se hará por fases
3. Cada subdominio puede tener su propia base de datos
4. Considerar usar un CDN para mejorar el rendimiento
5. Implementar monitoreo y respaldos automáticos

## Próximos Pasos
1. ✅ Configurar DNS y SSL
2. 🔄 Implementar tienda online (WooCommerce)
3. ⏳ Implementar plataforma de cursos
4. ⏳ Implementar sistema de tickets
5. ⏳ Implementar CRM para clientes
6. ⏳ Implementar blog tecnológico
