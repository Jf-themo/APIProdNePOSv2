# NeoApp API - Manual de Referencia Completo

> **Versión:** 3.0 (Production Ready)  
> **Fecha de Actualización:** Abril 2026  
> **Estado:** ✅ Completamente Operativo

---

## Tabla de Contenidos

1. [Información General](#1-información-general)
2. [Configuración e Instalación](#2-configuración-e-instalación)
3. [Autenticación](#3-autenticación)
4. [Versionado de API](#4-versionado-de-api)
5. [Códigos de Respuesta y Errores](#5-códigos-de-respuesta-y-errores)
6. [Endpoints - Health](#6-endpoints---health)
7. [Endpoints - v3 Bills](#7-endpoints---v3-bills)
8. [Endpoints - v3 Credit Notes](#8-endpoints---v3-credit-notes)
9. [Endpoints - Reference Data](#9-endpoints---reference-data)
10. [Endpoints - v1 Legacy](#10-endpoints---v1-legacy)
11. [Rate Limiting](#11-rate-limiting)
12. [Variables de Entorno](#12-variables-de-entorno)
13. [Tablas de Referencia](#13-tablas-de-referencia)
14. [Guía de Casos de Uso](#14-guía-de-casos-de-uso)
15. [Troubleshooting](#15-troubleshooting)
16. [Mejores Prácticas](#16-mejores-prácticas)

---

## 1. Información General

### Propósito
NeoApp API es una capa de integración entre sistemas de terceros y la plataforma de facturación electrónica Factus Colombia. Permite crear, gestionar y transmitir facturas electrónicas, notas crédito y otros documentos de manera simplificada.

### Características Principales
- ✅ Token OAuth con caché automática y renovación
- ✅ Validación de datos con Zod
- ✅ Logging centralizado con Winston
- ✅ Manejo centralizado de errores
- ✅ Rate Limiting configurable
- ✅ Versionado de API (v1, v2, v3)
- ✅ Documentación Swagger/OpenAPI
- ✅ Múltiples endpoints de health check
- ✅ Cache de datos de referencia

### Base URL

| Ambiente | URL | Descripción |
|----------|-----|-------------|
| Desarrollo | `http://localhost:3000` | Servidor local |
| Producción | `https://api.neoapp.com` | Servidor en producción (Vercel) |
| Staging | `https://staging-api.neoapp.com` | Pruebas previas a producción |

### Headers Requeridos

Todos los endpoints (excepto health y auth) requieren los siguientes headers:

```http
Content-Type: application/json
Authorization: Bearer <access_token>
Accept: application/json
X-API-Version: v3
X-API-Features: token-cache,logging,rate-limit
```

### Formato de Respuesta Exitosa

```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa",
  "requestId": "req-abc123"
}
```

### Formato de Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": {}
  },
  "requestId": "req-abc123"
}
```

---

## 2. Configuración e Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Cuenta activa en Factus

### Instalación Local

```bash
# Clonar el repositorio
git clone <repo-url>
cd apiNeoAppProduccionV2

# Instalar dependencias
npm install

# Crear archivo .env (copiar de .env.example)
cp .env.example .env

# Iniciar servidor en desarrollo
npm run dev

# Construir para producción
npm run build
npm start
```

### Verificar Instalación

```bash
# Health check básico
curl http://localhost:3000/health

# Health check completo
curl http://localhost:3000/health/status

# Verificar versiones disponibles
curl http://localhost:3000/api/versions
```

---

## 3. Autenticación

### Flujo de Autenticación

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Cliente   │────▶│  NeoApp API │────▶│ Factus API │
│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
    1. POST           2. OAuth             3. Token
    /get-token        Request              Response
```

### Obtener Token de Acceso

Obtiene un token OAuth de Factus. El token se almacena en caché y se renueva automáticamente cuando expira.

**Ruta:** `POST /auth/get-token`

**Encabezados:**
```http
Content-Type: application/json
```

**Cuerpo de Solicitud:**
```json
{
  // No requiere cuerpo - las credenciales se toman de las variables de entorno
}
```

**Ejemplo de Solicitud:**

```bash
curl -X POST http://localhost:3000/auth/get-token \
  -H "Content-Type: application/json"
```

**Ejemplo de Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Token obtenido exitosamente",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

**Códigos de Respuesta:**
| Código | Descripción | Acción |
|--------|-------------|--------|
| 200 | Token obtenido exitosamente | Usar el token en Authorization header |
| 400 | Variables de entorno vacías | Verificar .env |
| 401 | Credenciales de Factus inválidas | Verificar credenciales en Factus |
| 500 | Error del servidor | Contactar soporte |

---

### Validar Suscripción

Obtiene información de la suscripción actual de Factus para verificar el plan y estado.

**Ruta:** `POST /auth/get-subscription`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Cuerpo de Solicitud:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
}
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| token | string | Sí | Token de acceso OAuth |

**Ejemplo de Solicitud:**

```bash
curl -X POST http://localhost:3000/auth/get-subscription \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"token": "eyJ0eXAiOiJKV1Qi..."}'
```

**Ejemplo de Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Suscripción obtenida correctamente",
  "data": {
    "subscription": {
      "id": 1,
      "company_id": 123,
      "plan": "premium",
      "status": "active",
      "expires_at": "2026-12-31T23:59:59Z"
    }
  }
}
```

**Códigos de Error:**
| Código | Descripción |
|--------|-------------|
| 400 | Token no proporcionado |
| 401 | Token inválido o expirado |
| 500 | Error al obtener suscripción |

---

### Consultar Adquiriente DIAN

Consulta información de un adquiriente (cliente/empresa) en los registros de la DIAN. Útil para validar datos de clientes antes de crear facturas.

**Ruta:** `POST /auth/get-acquirer`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
```

**Cuerpo de Solicitud:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "identification_document_id": 3,
  "identification_number": "900825759"
}
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción | Valores Válidos |
|-------|------|----------|-------------|-----------------|
| token | string | Sí | Token de acceso OAuth | - |
| identification_document_id | number | Sí | Tipo de documento de identificación | Ver [Tabla de Documentos](#tipos-de-documento-de-identidad) |
| identification_number | string | Sí | Número de identificación | Según tipo de documento |

**Ejemplo de Solicitud:**

```bash
curl -X POST http://localhost:3000/auth/get-acquirer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "token": "eyJ0eXAiOiJKV1Qi...",
    "identification_document_id": 3,
    "identification_number": "900825759"
  }'
```

**Ejemplo de Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Adquiriente obtenido correctamente",
  "data": {
    "acquirer": {
      "identification": "900825759",
      "dv": "7",
      "company": "HALLTEC S.A.S.",
      "names": "",
      "email": "facturacion@halltec.com",
      "phone": "3165584659",
      "address": "cra 10 # 9 - 04",
      "municipality": "Bucaramanga",
      "department": "Santander",
      "status": "active",
      "validated_at": "2026-04-29T12:00:00Z"
    }
  }
}
```

**Ejemplo de Error (404):**
```json
{
  "success": false,
  "error": {
    "code": "ACQUIRER_NOT_FOUND",
    "message": "No se encontró el adquiriente con la identificación proporcionada"
  },
  "requestId": "req-abc123"
}
```

**Códigos de Error:**
| Código | Descripción |
|--------|-------------|
| 400 | Parámetros inválidos o faltantes |
| 401 | Token inválido o expirado |
| 404 | Adquiriente no encontrado en DIAN |
| 500 | Error del servidor |

---

## 4. Versionado de API

### Concepto

NeoApp API soporta múltiples versiones para garantizar retrocompatibilidad y permitir actualizaciones graduales.

### Listar Versiones Disponibles

**Ruta:** `GET /api/versions`

**Ejemplo de Solicitud:**

```bash
curl http://localhost:3000/api/versions
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "versions": [
      {
        "version": "v1",
        "status": "deprecated",
        "features": [
          "Operaciones básicas de facturas"
        ],
        "deprecation_date": "2026-06-01"
      },
      {
        "version": "v2",
        "status": "active",
        "features": [
          "TokenService con caché",
          "Validación Zod"
        ]
      },
      {
        "version": "v3",
        "status": "active",
        "features": [
          "Logging con Winston",
          "Manejo centralizado de errores",
          "Múltiples health checks",
          "Rate limiting configurable",
          "Documentación Swagger",
          "Cache de datos de referencia"
        ],
        "recommended": true
      }
    ],
    "latest": "v3",
    "default": "v3"
  }
}
```

### Usar Versión Específica

Hay tres formas de especificar la versión:

#### 1. Via URL (Recomendado)
```bash
# v3 (recomendado)
GET http://localhost:3000/v3/bills

# v2
GET http://localhost:3000/v2/bills

# v1 (legacy)
GET http://localhost:3000/v1/bills
```

#### 2. Via Header
```bash
curl -H "X-API-Version: v3" http://localhost:3000/bills
```

#### 3. Via Query Parameter
```bash
curl "http://localhost:3000/bills?version=v3"
```

### Encabezados de Versión

| Header | Descripción | Valores |
|--------|-------------|---------|
| X-API-Version | Versión del API | v1, v2, v3 |
| X-API-Features | Características activas | token-cache, logging, rate-limit |

**Ejemplo de Headers Completos:**

```http
GET /v3/bills HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
X-API-Features: token-cache,logging,rate-limit
Accept: application/json
```

---

## 5. Códigos de Respuesta y Errores

### Códigos HTTP Estándar

| Código | Descripción | Significado |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Solicitud exitosa sin contenido que devolver |
| 400 | Bad Request | Datos inválidos o mal formados |
| 401 | Unauthorized | Token inválido, expirado o no proporcionado |
| 403 | Forbidden | No tienes permisos para este recurso |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto con el estado actual del recurso |
| 422 | Unprocessable Entity | Validación de datos fallida |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error interno del servidor |
| 502 | Bad Gateway | Factus no responde correctamente |
| 503 | Service Unavailable | Servicio temporalmente no disponible |

### Códigos de Error Personalizados

#### Errores de Autenticación

| Código | Descripción | Causa | Solución |
|--------|-------------|-------|----------|
| AUTH_TOKEN_MISSING | Token no proporcionado | No se incluyó header Authorization | Incluir token en header |
| AUTH_TOKEN_EXPIRED | Token expirado | El token ya venció | Obtener nuevo token |
| AUTH_TOKEN_INVALID | Token inválido | Token mal formado o manipulado | Obtener nuevo token |
| AUTH_CREDENTIALS_INVALID | Credenciales inválidas | USER/PASSWORD incorrectos en Factus | Verificar credenciales |
| AUTH_RATE_LIMIT_EXCEEDED | Demasiados intentos | Más de 10 intentos en 15 min | Esperar 15 minutos |

#### Errores de Validación

| Código | Descripción | Causa | Solución |
|--------|-------------|-------|----------|
| VALIDATION_REQUIRED_FIELD | Campo requerido faltante | Campo obligatorio no proporcionado | Proporcionar campo |
| VALIDATION_INVALID_TYPE | Tipo de dato incorrecto | El tipo del dato no coincide | Verificar tipo |
| VALIDATION_INVALID_FORMAT | Formato incorrecto | El formato del dato es inválido | Verificar formato |
| VALIDATION_OUT_OF_RANGE | Valor fuera de rango | El valor está fuera de los límites | Ajustar valor |

#### Errores de Facturas

| Código | Descripción | Causa | Solución |
|--------|-------------|-------|----------|
| BILL_NOT_FOUND | Factura no encontrada | El ID no existe | Verificar ID |
| BILL_ALREADY_VALIDATED | Factura ya validada | La factura ya fue enviada a DIAN | No se puede modificar |
| BILL_ALREADY_ACCEPTED | Factura ya aceptada | La factura fue aceptada anteriormente | - |
| BILL_ALREADY_REJECTED | Factura ya rechazada | La factura fue rechazada anteriormente | - |
| BILL_PENDING | Factura pendiente | La factura no ha sido validada | Esperar validación |

#### Errores de Rate Limiting

| Código | Descripción | Causa | Solución |
|--------|-------------|-------|----------|
| RATE_LIMIT_EXCEEDED | Límite general excedido | Más de 100 requests/min | Reducir frecuencia |
| BILL_CREATE_LIMIT_EXCEEDED | Límite de creación excedido | Más de 20 facturas/min | Reducir frecuencia |
| AUTH_RATE_LIMIT_EXCEEDED | Límite de auth excedido | Más de 10 intentos/15min | Esperar 15 minutos |

### Estructura de Respuesta de Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción legible del error",
    "details": {
      "field": "identification",
      "reason": "El campo es requerido",
      "value": null
    },
    "timestamp": "2026-04-29T12:00:00Z"
  },
  "requestId": "req-abc123",
  "help": "https://docs.neoapp.com/errors/ERROR_CODE"
}
```

### Manejo de Errores en Código Cliente

```javascript
try {
  const response = await fetch('/v3/bills', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(billData)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.error.code, error.error.message);
    
    if (error.error.code === 'AUTH_TOKEN_EXPIRED') {
      // Obtener nuevo token
      await refreshToken();
    }
  }
} catch (e) {
  console.error('Error de red:', e);
}
```

---

## 6. Endpoints - Health

Los endpoints de health check permiten monitorear el estado del servicio.

### Health Simple

Verifica que el servicio esté activo. No requiere autenticación.

**Ruta:** `GET /v3/health`

**Encabezados:**
```http
Content-Type: application/json
```

**Ejemplo de Solicitud:**

```bash
curl -X GET http://localhost:3000/v3/health
```

**Ejemplo de Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "El servicio está activo",
  "data": {
    "status": "ok",
    "timestamp": "2026-04-29T12:00:00.000Z"
  }
}
```

**Casos de Uso:**
- Verificar conectividad básica
- Monitoreo básico de disponibilidad

---

### Health Status

Información completa del estado del servicio incluyendo memoria, uptime y servicios.

**Ruta:** `GET /v3/health/status`

**Encabezados:**
```http
Content-Type: application/json
```

**Ejemplo de Solicitud:**

```bash
curl -X GET http://localhost:3000/v3/health/status
```

**Ejemplo de Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Estado del servicio",
  "data": {
    "status": "healthy",
    "timestamp": "2026-04-29T12:00:00.000Z",
    "uptime": "3600s",
    "version": "3.0.0",
    "environment": "development",
    "memory": {
      "rss": "45.23 MB",
      "heapTotal": "30.12 MB",
      "heapUsed": "25.45 MB",
      "external": "5.67 MB"
    },
    "services": {
      "token": {
        "status": "ok",
        "message": "Token activo",
        "expiresAt": "2026-04-29T13:00:00Z"
      },
      "cache": {
        "status": "ok",
        "entries": 4,
        "size": "1.2 MB"
      }
    }
  }
}
```

**Campos de Respuesta:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| status | string | Estado general del servicio |
| uptime | string | Tiempo desde el último reinicio |
| version | string | Versión actual del API |
| environment | string | Ambiente de ejecución |
| memory | object | Uso de memoria |
| services | object | Estado de servicios internos |

**Casos de Uso:**
- Monitoreo detallado
- Alerts de producción
- Dashboard de estado

---

### Health Readiness

Verifica si el servicio está listo para recibir tráfico de producción.

**Ruta:** `GET /v3/health/ready`

**Encabezados:**
```http
Content-Type: application/json
```

**Ejemplo de Solicitud:**

```bash
curl -X GET http://localhost:3000/v3/health/ready
```

**Ejemplo de Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Servicio listo para recibir tráfico",
  "data": {
    "status": "ready",
    "checks": {
      "tokenService": {
        "status": "ok",
        "latency": "45ms"
      },
      "cache": {
        "status": "ok",
        "latency": "5ms"
      },
      "environment": {
        "status": "ok",
        "variables": "configured"
      }
    }
  }
}
```

**Casos de Uso:**
- Kubernetes readiness probe
- Balanceador de carga
- Despliegue blue-green

---

### Health Detalle

Información detallada para debugging y soporte técnico.

**Ruta:** `GET /v3/health/detailed`

**Encabezados:**
```http
Content-Type: application/json
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Información detallada",
  "data": {
    "status": "healthy",
    "timestamp": "2026-04-29T12:00:00.000Z",
    "requestId": "req-abc123",
    "system": {
      "platform": "win32",
      "nodeVersion": "18.17.0",
      "arch": "x64"
    },
    "configuration": {
      "cors": { "origin": "*" },
      "rateLimit": {
        "windowMs": 60000,
        "maxRequests": 100
      }
    },
    "logger": {
      "level": "info",
      "transports": ["console", "file"]
    }
  }
}
```

**Casos de Uso:**
- Debugging de problemas
- Soporte técnico
- Auditoría

---

## 7. Endpoints - v3 Bills

### Crear Factura

Crea y valida una factura electrónica en Factus. La factura se envía automáticamente a la DIAN para validación.

**Ruta:** `POST /v3/bills`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Cuerpo de Solicitud:**

```json
{
  "reference_code": "FACT-001-2026",
  "observation": "Factura de prueba para NeoApp",
  "customer": {
    "identification": "900825759",
    "dv": "7",
    "company": "HALLTEC S.A.S.",
    "names": "",
    "email": "facturacion@halltec.com",
    "phone": "3165584659",
    "address": "cra 10 # 9 - 04",
    "legal_organization_id": 1,
    "tribute_id": 21,
    "identification_document_id": 2,
    "municipality_id": 68001
  },
  "items": [
    {
      "code_reference": "PROD001",
      "name": "Servicio de desarrollo",
      "quantity": 1,
      "discount_rate": 0,
      "price": 1000000,
      "tax_rate": "19.00",
      "unit_measure_id": 70,
      "standard_code_id": 1,
      "is_excluded": 0,
      "tribute_id": 1
    }
  ],
  "payment_method_code": 10
}
```

**Parámetros del Request:**

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|----------|-------------|---------|
| reference_code | string | Sí | Código de referencia único del sistema | "FACT-001-2026" |
| observation | string | No | Observaciones de la factura | "Factura de prueba" |
| customer | object | Sí | Objeto con datos del cliente | Ver abajo |
| items | array | Sí | Array de items de la factura | Ver abajo |
| payment_method_code | number | Sí | Código del método de pago | 10 |

**Parámetros del Customer:**

| Campo | Tipo | Requerido | Descripción | Valores |
|-------|------|----------|-------------|---------|
| identification | string | Sí | Número de identificación | "900825759" |
| dv | string | No* | Dígito de verificación (requerido para NIT) | "7" |
| company | string | No* | Razón social (requerido para personas jurídicas) | "HALLTEC S.A.S." |
| names | string | No* | Nombres (requerido para personas naturales) | "Juan Perez" |
| email | string | Sí | Correo electrónico | "email@company.com" |
| phone | string | No | Teléfono de contacto | "3165584659" |
| address | string | No | Dirección | "cra 10 # 9 - 04" |
| legal_organization_id | number | Sí | Tipo de organización legal | Ver tabla |
| tribute_id | number | Sí | Tipo de tributo | Ver tabla |
| identification_document_id | number | Sí | Tipo de documento | Ver tabla |
| municipality_id | number | No | ID del municipio | 68001 |

**Parámetros del Item:**

| Campo | Tipo | Requerido | Descripción | Valores |
|-------|------|----------|-------------|---------|
| code_reference | string | Sí | Código único del producto | "PROD001" |
| name | string | Sí | Nombre del producto/servicio | "Desarrollo SW" |
| quantity | number | Sí | Cantidad (entero positivo) | 1, 2, 10... |
| discount_rate | number | No | Porcentaje de descuento (0-100) | 0, 10, 20 |
| price | number | Sí | Precio unitario con impuestos | 1000000 |
| tax_rate | string | Sí | Porcentaje de impuesto | "19.00", "5.00", "0.00" |
| unit_measure_id | number | Sí | ID de unidad de medida | Ver tabla |
| standard_code_id | number | Sí | ID de código estándar | 1 |
| is_excluded | number | No | 0=con IVA, 1=exento | 0 |
| tribute_id | number | Sí | ID del tributo | Ver tabla |
| withholding_taxes | array | No | Retenciones aplicables | [] |

**Ejemplo de Solicitud:**

```bash
curl -X POST http://localhost:3000/v3/bills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "reference_code": "FACT-001-2026",
    "customer": { ... },
    "items": [ ... ],
    "payment_method_code": 10
  }'
```

**Ejemplo de Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Factura creada exitosamente",
  "data": {
    "id_bill": 820,
    "number_bill": "SETP990000493",
    "reference_code_bill": "FACT-001-2026",
    "status_bill": 1,
    "total_bill": "1190000.00",
    "subtotal_bill": "1000000.00",
    "tax_bill": "190000.00",
    "qr_bill": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?document=...",
    "cufe_bill": "44e260a76e092e46fd5d8344a03146d5c8863ab68b18bde38a53318a33bf6805",
    "validated_bill": "29-04-2026 12:00:00 PM",
    "created_bill": "29-04-2026 11:59:55 AM",
    "customer": {
      "identification": "900825759",
      "company": "HALLTEC S.A.S.",
      "email": "facturacion@halltec.com"
    },
    "items": [
      {
        "code_reference": "PROD001",
        "name": "Servicio de desarrollo",
        "quantity": 1,
        "price": "1000000.00",
        "discount": "0.00",
        "tax_rate": "19.00",
        "tax_amount": "190000.00",
        "total": 1190000
      }
    ],
    "payment_method_code_bill": "10",
    "payment_method_name_bill": "Efectivo"
  }
}
```

**Códigos de Error:**

| Código | Descripción | Solución |
|--------|-------------|-----------|
| 400 | Validación fallida | Verificar campos requeridos |
| 409 | Factura pendiente por enviar | La factura ya existe, verificar reference_code |
| 422 | Error de validación de Factus | Revisar mensaje específico |
| 500 | Error interno | Contactar soporte |

---

### Listar Facturas

Obtiene todas las facturas con soporte de paginación y filtros.

**Ruta:** `GET /v3/bills`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Parámetros Query:**

| Campo | Tipo | Default | Descripción | Ejemplo |
|-------|------|---------|-------------|---------|
| page | number | 1 | Página actual | 1, 2, 3... |
| limit | number | 20 | Items por página (máx 100) | 20, 50, 100 |
| status | number | - | Filtrar por status | 0=pendiente, 1=validada |
| start_date | string | - | Fecha inicio (YYYY-MM-DD) | 2026-01-01 |
| end_date | string | - | Fecha fin (YYYY-MM-DD) | 2026-04-29 |
| reference_code | string | - | Filtrar por código de referencia | FACT-001 |
| customer_identification | string | - | Filtrar por identificación cliente | 900825759 |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/v3/bills?page=1&limit=20&status=1" \
  -H "Authorization: Bearer <token>"
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Facturas obtenidas correctamente",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 820,
        "number": "SETP990000493",
        "reference_code": "FACT-001-2026",
        "status": 1,
        "total": "1190000.00",
        "customer_identification": "900825759",
        "created_at": "2026-04-29T12:00:00Z"
      }
    ],
    "first_page_url": "http://localhost:3000/v3/bills?page=1",
    "last_page_url": "http://localhost:3000/v3/bills?page=5",
    "next_page_url": "http://localhost:3000/v3/bills?page=2",
    "prev_page_url": null,
    "from": 1,
    "to": 20,
    "per_page": 20,
    "total": 95,
    "last_page": 5
  }
}
```

---

### Obtener Factura por ID

Obtiene el detalle completo de una factura específica.

**Ruta:** `GET /v3/bills/:id`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Parámetros URL:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | ID de la factura en Factus |

**Ejemplo de Solicitud:**

```bash
curl -X GET http://localhost:3000/v3/bills/820 \
  -H "Authorization: Bearer <token>"
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Factura obtenida correctamente",
  "data": {
    "id_bill": 820,
    "number_bill": "SETP990000493",
    "reference_code_bill": "FACT-001-2026",
    "status_bill": 1,
    "total_bill": "1190000.00",
    "subtotal_bill": "1000000.00",
    "tax_bill": "190000.00",
    "qr_bill": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?document=...",
    "cufe_bill": "44e260a76e092e46fd5d8344a03146d5c8863ab68b18bde38a53318a33bf6805",
    "validated_bill": "29-04-2026 12:00:00 PM",
    "created_bill": "29-04-2026 11:59:55 AM",
    "customer": {
      "identification": "900825759",
      "dv": "7",
      "company": "HALLTEC S.A.S.",
      "email": "facturacion@halltec.com",
      "phone": "3165584659",
      "address": "cra 10 # 9 - 04",
      "municipality": "Bucaramanga"
    },
    "items": [
      {
        "line_id": 1,
        "code_reference": "PROD001",
        "name": "Servicio de desarrollo",
        "quantity": 1,
        "price": "1000000.00",
        "discount": "0.00",
        "tax_rate": "19.00",
        "tax_amount": "190000.00",
        "total": 1190000
      }
    ],
    "payment_method_code_bill": "10",
    "payment_method_name_bill": "Efectivo"
  }
}
```

**Códigos de Error:**

| Código | Descripción |
|--------|-------------|
| 404 | Factura no encontrada |

---

### Descargar PDF

Descarga el PDF de una factura validada.

**Ruta:** `GET /v3/bills/:id/pdf`

**Encabezados:**
```http
Authorization: Bearer <token>
X-API-Version: v3
```

**Parámetros URL:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | number | ID de la factura |

**Ejemplo de Solicitud:**

```bash
curl -X GET http://localhost:3000/v3/bills/820/pdf \
  -H "Authorization: Bearer <token>" \
  -o factura_820.pdf
```

**Respuesta:** Binary (application/pdf)

**Encabezados de Respuesta:**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="factura_820.pdf"
```

---

### Descargar XML

Descarga el XML de una factura validada.

**Ruta:** `GET /v3/bills/:id/xml`

**Encabezados:**
```http
Authorization: Bearer <token>
X-API-Version: v3
```

**Ejemplo de Solicitud:**

```bash
curl -X GET http://localhost:3000/v3/bills/820/xml \
  -H "Authorization: Bearer <token>" \
  -o factura_820.xml
```

**Respuesta:** XML (application/xml)

---

### Enviar Correo

Envía la factura por correo electrónico al cliente.

**Ruta:** `POST /v3/bills/:id/send-email`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Cuerpo de Solicitud:**

```json
{
  // No requiere cuerpo - usa el email del cliente
}
```

**Opcional - Sobrescribir email:**
```json
{
  "email": "otro@email.com"
}
```

**Ejemplo de Solicitud:**

```bash
curl -X POST http://localhost:3000/v3/bills/820/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>"
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Correo enviado exitosamente",
  "data": {
    "sent": true,
    "to": "facturacion@halltec.com",
    "messageId": "msg-123456"
  }
}
```

---

### Obtener Contenido de Correo

Obtiene el contenido HTML del correo antes de enviar (útil para previsualización).

**Ruta:** `GET /v3/bills/:id/email-content`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Ejemplo de Solicitud:**

```bash
curl -X GET http://localhost:3000/v3/bills/820/email-content \
  -H "Authorization: Bearer <token>"
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Contenido de correo obtenido",
  "data": {
    "subject": "Factura SETP990000493 - HALLTEC S.A.S.",
    "to": "facturacion@halltec.com",
    "html": "<!DOCTYPE html>...",
    "text": "Estimado cliente...",
    "attachments": [
      {
        "filename": "factura_820.pdf",
        "type": "application/pdf"
      }
    ]
  }
}
```

---

### Aceptar Factura (Aceptación Tácita)

Acepta una factura recibida. La aceptación tácita ocurre automáticamente después de 3 días si el cliente no responde.

**Ruta:** `POST /v3/bills/:id/accept`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Ejemplo de Solicitud:**

```bash
curl -X POST http://localhost:3000/v3/bills/820/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>"
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Factura aceptada exitosamente",
  "data": {
    "accepted": true,
    "bill_id": 820,
    "accepted_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### Rechazar Factura

Rechaza una factura con observación obligatoria.

**Ruta:** `POST /v3/bills/:id/reject`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Cuerpo de Solicitud:**

```json
{
  "observation": "Los productos no fueron recibidos en buen estado"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción | Longitud |
|-------|------|----------|-------------|----------|
| observation | string | Sí | Razón del rechazo | 1-500 caracteres |

**Ejemplo de Solicitud:**

```bash
curl -X POST http://localhost:3000/v3/bills/820/reject \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"observation": "Productos dañados en el transporte"}'
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Factura rechazada exitosamente",
  "data": {
    "rejected": true,
    "bill_id": 820,
    "rejected_at": "2026-04-29T12:00:00Z",
    "observation": "Productos dañados en el transporte"
  }
}
```

**Códigos de Error:**

| Código | Descripción |
|--------|-------------|
| 400 | Observación requerida |
| 409 | Factura ya aceptada/rechazada |

---

### Aceptar con Reclamaciones

Acepta una factura pero con reclamaciones (reclamo, devolución o descuento).

**Ruta:** `POST /v3/bills/:id/accept-with-claims`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Cuerpo de Solicitud:**

```json
{
  "claim_type": 1,
  "claim_description": "Producto dañado en el transporte - solicito descuento"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción | Valores |
|-------|------|----------|-------------|---------|
| claim_type | number | Sí | Tipo de reclamación | 1=Reclamo, 2=Devolución, 3=Descuento |
| claim_description | string | Sí | Descripción detallada | 1-500 caracteres |

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Factura aceptada con reclamaciones",
  "data": {
    "accepted": true,
    "bill_id": 820,
    "claim_type": "reclamo",
    "claim_description": "Producto dañado",
    "accepted_at": "2026-04-29T12:00:00Z"
  }
}
```

---

### Eliminar Factura (por ID)

Elimina una factura no validada.

**Ruta:** `DELETE /v3/bills`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Cuerpo de Solicitud:**

```json
{
  "id": 820
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| id | number | Sí | ID de la factura a eliminar |

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Factura eliminada exitosamente",
  "data": {
    "deleted": true,
    "id": 820
  }
}
```

**Códigos de Error:**

| Código | Descripción |
|--------|-------------|
| 400 | La factura está validada y no puede eliminarse |
| 404 | Factura no encontrada |

---

### Eliminar Factura (por Reference Code)

Elimina una factura no validada usando el código de referencia.

**Ruta:** `DELETE /v3/bills/by-reference`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Cuerpo de Solicitud:**

```json
{
  "reference_code": "FACT-001-2026"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| reference_code | string | Sí | Código de referencia único |

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Factura con código de referencia FACT-001-2026 eliminada exitosamente",
  "data": {
    "deleted": true,
    "reference_code": "FACT-001-2026"
  }
}
```

---

## 8. Endpoints - v3 Credit Notes

### Crear Nota de Crédito

Crea una nota de crédito para una factura. La nota de crédito invierte parcial o totalmente el valor de una factura.

**Ruta:** `POST /v3/credit-notes`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Cuerpo de Solicitud:**

```json
{
  "correction_concept_code": "4",
  "bill_id": 820,
  "reference_code": "NC-001-2026",
  "observation": "Devolución por producto defectuoso",
  "items": [
    {
      "code_reference": "PROD001",
      "name": "Servicio de desarrollo",
      "quantity": 1,
      "price": 1000000,
      "tax_rate": "19.00",
      "unit_measure_id": 70,
      "standard_code_id": 1,
      "is_excluded": 0,
      "tribute_id": 1
    }
  ],
  "payment_method_code": 10
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción | Valores |
|-------|------|----------|-------------|---------|
| correction_concept_code | string | Sí | Código del concepto de corrección | 1-5 (ver abajo) |
| bill_id | number | Sí | ID de la factura a corregir | - |
| reference_code | string | Sí | Código de referencia único | - |
| observation | string | No | Observaciones | - |
| items | array | Sí | Lista de productos | Ver items factura |
| payment_method_code | number | No | Método de pago (default: 10) | Ver tabla |

**Códigos de Concepto de Corrección:**

| Código | Descripción | Uso |
|--------|-------------|-----|
| 1 | Anulación de la factura | Invoice completa inválida |
| 2 | Reversión de la factura | Cambios significativos |
| 3 | Descuento | Descuento comercial/promoción |
| 4 | Devolución | Devolución de productos |
| 5 | Otros | Otros conceptos |

**Ejemplo de Respuesta (201):**
```json
{
  "success": true,
  "message": "Nota de crédito creada exitosamente",
  "data": {
    "id_credit_note": 145,
    "number_credit_note": "NC990000078",
    "reference_code_credit_note": "NC-001-2026",
    "bill_id": 820,
    "correction_concept_code": "4",
    "status_credit_note": 1,
    "total_credit_note": "1190000.00",
    "cufe_credit_note": "...",
    "validated_credit_note": "29-04-2026 12:00:00 PM"
  }
}
```

---

### Listar Notas de Crédito

**Ruta:** `GET /v3/credit-notes`

**Encabezados:**
```http
Authorization: Bearer <token>
X-API-Version: v3
```

**Parámetros Query:**

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| page | number | 1 | Página actual |
| limit | number | 20 | Items por página (máx 100) |
| bill_id | number | - | Filtrar por factura asociada |
| start_date | string | - | Fecha inicio (YYYY-MM-DD) |
| end_date | string | - | Fecha fin (YYYY-MM-DD) |

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Notas de crédito obtenidas correctamente",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 145,
        "number": "NC990000078",
        "reference_code": "NC-001-2026",
        "bill_id": 820,
        "status": 1,
        "total": "1190000.00",
        "created_at": "2026-04-29T12:00:00Z"
      }
    ],
    "total": 1,
    "per_page": 20
  }
}
```

---

### Obtener Nota de Crédito por ID

**Ruta:** `GET /v3/credit-notes/:id`

**Encabezados:**
```http
Authorization: Bearer <token>
X-API-Version: v3
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Nota de crédito obtenida correctamente",
  "data": {
    "id_credit_note": 145,
    "number_credit_note": "NC990000078",
    "reference_code_credit_note": "NC-001-2026",
    "bill_id": 820,
    "status_credit_note": 1,
    "total_credit_note": "1190000.00",
    "items": [ ... ]
  }
}
```

---

### Eliminar Nota de Crédito

**Ruta:** `DELETE /v3/credit-notes/:id`

**Encabezados:**
```http
Authorization: Bearer <token>
X-API-Version: v3
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Nota de crédito eliminada exitosamente",
  "data": { "deleted": true }
}
```

---

### Descargar PDF

**Ruta:** `GET /v3/credit-notes/:id/pdf`

**Respuesta:** Binary (application/pdf)

---

### Descargar XML

**Ruta:** `GET /v3/credit-notes/:id/xml`

**Respuesta:** XML (application/xml)

---

### Enviar Correo

**Ruta:** `POST /v3/credit-notes/:id/send-email`

**Cuerpo de Solicitud (opcional):**
```json
{
  "email": "otro@email.com"
}
```

---

## 9. Endpoints - Reference Data

### Obtener Municipios

Lista todos los municipios de Colombia con su departamento.

**Ruta:** `GET /v3/reference/municipalities`

**Encabezados:**
```http
Authorization: Bearer <token>
X-API-Version: v3
```

**Parámetros Query:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| refresh | boolean | Forzar actualización del cache |

**Ejemplo de Solicitud:**

```bash
curl -X GET "http://localhost:3000/v3/reference/municipalities" \
  -H "Authorization: Bearer <token>"
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Municipios obtenidos correctamente",
  "data": {
    "count": 1100,
    "data": [
      {
        "id": 68001,
        "code": "68001",
        "name": "Bucaramanga",
        "department": {
          "id": 68,
          "code": "68",
          "name": "Santander"
        }
      }
    ]
  }
}
```

**Casos de Uso:**
- Validar municipio del cliente
- Autocompletar formularios
- Dropdowns de selección

---

### Obtener Rangos de Numeración

Lista los rangos de numeración disponibles para la empresa.

**Ruta:** `GET /v3/reference/numbering-ranges`

**Encabezados:**
```http
Authorization: Bearer <token>
X-API-Version: v3
```

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Rangos de numeración obtenidos correctamente",
  "data": {
    "data": [
      {
        "id": 1,
        "prefix": "SETP",
        "resolution_number": "187600000000",
        "from": 1,
        "to": 1000,
        "current": 493,
        "type": "electronic_invoice"
      }
    ]
  }
}
```

---

### Obtener Rango por ID

**Ruta:** `GET /v3/reference/numbering-ranges/:id`

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "prefix": "SETP",
    "from": 1,
    "to": 1000,
    "current": 493,
    "available": 507
  }
}
```

---

### Obtener Unidades de Medida

Lista las unidades de medida disponibles según la DIAN.

**Ruta:** `GET /v3/reference/units-of-measure`

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Unidades de medida obtenidas correctamente",
  "data": {
    "count": 80,
    "data": [
      { "id": 70, "code": "94", "name": "Unidad" },
      { "id": 71, "code": "EA", "name": "Unidad" },
      { "id": 94, "code": "S7", "name": "Porcentaje" },
      { "id": 145, "code": "C62", "name": "Kilogramo" },
      { "id": 333, "code": "GR", "name": "Gramo" },
      { "id": 415, "code": "L", "name": "Litro" },
      { "id": 416, "code": "ML", "name": "Mililitro" }
    ]
  }
}
```

---

### Obtener Tributos

Lista los tipos de tributos disponibles.

**Ruta:** `GET /v3/reference/tributes`

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Tributos obtenidos correctamente",
  "data": {
    "data": [
      { "id": 1, "code": "01", "name": "IVA" },
      { "id": 2, "code": "02", "name": "Impuesto al Consumo" },
      { "id": 4, "code": "04", "name": "ICA" },
      { "id": 21, "code": "ZZ", "name": "No aplica" }
    ]
  }
}
```

---

### Obtener Países

**Ruta:** `GET /v3/reference/countries`

---

### Obtener Tablas de Referencia

Obtiene todas las tablas de referencia en una sola petición.

**Ruta:** `GET /v3/reference/reference-tables`

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "message": "Tablas de referencia obtenidas correctamente",
  "data": {
    "identification_document_types": [ ... ],
    "payment_methods": [ ... ],
    "legal_organizations": [ ... ],
    "tributes": [ ... ],
    "units_of_measure": [ ... ],
    "countries": [ ... ]
  }
}
```

---

### Ver Estado del Cache

**Ruta:** `GET /v3/reference/cache-info`

**Ejemplo de Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "municipalities": {
      "cached": true,
      "size": "500KB",
      "entries": 1100,
      "lastUpdate": "2026-04-29T10:00:00Z",
      "ttl": "24h"
    },
    "units_of_measure": { ... },
    "tributes": { ... }
  }
}
```

---

### Limpiar Cache

**Ruta:** `POST /v3/reference/clear-cache`

**Encabezados:**
```http
Content-Type: application/json
Authorization: Bearer <token>
X-API-Version: v3
```

**Cuerpo de Solicitud:**

```json
{
  "key": "municipalities"
}
```

**O para limpiar todo:**

```json
{}
```

---

## 10. Endpoints - v1 Legacy

> ⚠️ **Advertencia:** Estos endpoints están en desuso. Usar equivalentes en v3.

### Iniciar Sesión

**Ruta:** `POST /sing-in`

**Cuerpo de Solicitud:**
```json
{
  "userName": "admin",
  "passCode": "password123"
}
```

---

### Crear Usuario

**Ruta:** `POST /create-user`

---

### Listar Usuarios

**Ruta:** `GET /list-all-user`

---

## 11. Rate Limiting

### Límites Configurados

| Tipo | Límite | Ventana | Descripción |
|------|--------|---------|-------------|
| General | 100 | 1 minuto | Cualquier endpoint |
| Autenticación | 10 | 15 minutos | /auth/* |
| Creación de Facturas | 20 | 1 minuto | POST /v3/bills |

### Estructura de Respuesta de Rate Limit Excedido

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Demasiadas solicitudes. Por favor, intente más tarde.",
    "retry_after": 45
  },
  "requestId": "req-abc123"
}
```

### Headers de Rate Limiting

Los headers indican el estado actual del límite:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1714407600
```

---

## 12. Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| CLIENT_ID | Client ID de Factus | `9fdc88cb-f45d-4667-8465-aa7035d3d11b` |
| CLIENT_SECRET | Client Secret de Factus | `zh9eRdDoks7zYoL5FBRWQDbHyjZx2fHacOofGuRD` |
| USER | Usuario de Factus | `milleniun.services.sas@gmail.com` |
| PASSWORD | Contraseña de Factus | `1003249647` |

### Variables Opcionales

| Variable | Default | Descripción |
|----------|---------|-------------|
| PORT | 3000 | Puerto del servidor |
| FACTUS_ENV | staging | Ambiente de Factus (staging/production) |
| NODE_ENV | development | Ambiente de Node |
| RATE_LIMIT_WINDOW_MS | 60000 | Ventana de rate limit (ms) |
| RATE_LIMIT_MAX_REQUESTS | 100 | Máximo de requests por ventana |
| RATE_LIMIT_AUTH | 10 | Límite de auth |
| BILL_CREATE_LIMIT | 20 | Límite de creación de facturas |
| CACHE_TTL | 3600000 | TTL del cache (ms) |

### Archivo .env de Ejemplo

```env
# Credenciales Factus (REQUERIDAS)
CLIENT_ID=9fdc88cb-f45d-4667-8465-aa7035d3d11b
CLIENT_SECRET=zh9eRdDoks7zYoL5FBRWQDbHyjZx2fHacOofGuRD
USER=milleniun.services.sas@gmail.com
PASSWORD=1003249647

# Configuración del Servidor
PORT=3000
FACTUS_ENV=staging
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH=10
BILL_CREATE_LIMIT=20

# Cache
CACHE_TTL=3600000

# CORS (opcional)
CORS_ORIGIN=*
```

---

## 13. Tablas de Referencia (Fuente: Factus API)

### 13.1 Códigos de Tipos de Documentos para la Factura

| Código | Descripción |
|--------|-------------|
| 01 | Factura electrónica de venta |
| 03 | Instrumento electrónico de transmisión - tipo 03 |

### 13.2 Códigos de Tipos de Operación

| Código | Descripción |
|--------|-------------|
| 10 | Estándar |
| 11 | Mandatos |
| 12 | Transporte |

### 13.3 Códigos de Corrección (Notas Crédito)

| Código | Descripción |
|--------|-------------|
| 1 | Devolución parcial de los bienes y/o no aceptación parcial del servicio |
| 2 | Anulación de factura electrónica |
| 3 | Rebaja o descuento parcial o total |
| 4 | Ajuste de precio |
| 5 | Descuento comercial por pronto pago |
| 6 | Descuento comercial por volumen de ventas |

### 13.4 Códigos de Tipos de Operación (Notas Crédito)

| Código | Descripción |
|--------|-------------|
| 20 | Nota Crédito que referencia una factura electrónica |
| 22 | Nota Crédito sin referencia a una factura electrónica |

### 13.5 IDs de Estándar de Identificación del Producto

| ID | Nombre |
|----|--------|
| 1 | Estándar de adopción del contribuyente |
| 2 | UNSPSC |
| 3 | Partida Arancelaria |
| 4 | GTIN |

### 13.6 Códigos de Conceptos de Reclamo

| Código | Nombre |
|--------|--------|
| 01 | Documento con inconsistencias |
| 02 | Mercancía no entregada totalmente |
| 03 | Mercancía no entregada parcialmente |
| 04 | Servicio no prestado |

### 13.7 Códigos de Eventos

| Código | Nombre |
|--------|--------|
| 030 | Acuse de recibo de Factura Electrónica de Venta |
| 031 | Reclamo de la Factura Electrónica de Venta |
| 032 | Recibo del bien y/o prestación del servicio |
| 033 | Aceptación expresa |
| 034 | Aceptación tácita |

### 13.8 IDs de Tipos de Documentos de Identidad

| ID | Nombre |
|----|--------|
| 1 | Registro civil |
| 2 | Tarjeta de identidad |
| 3 | Cédula de ciudadanía |
| 4 | Tarjeta de extranjería |
| 5 | Cédula de extranjería |
| 6 | NIT |
| 7 | Pasaporte |
| 8 | Documento de identificación extranjero |
| 9 | PEP |
| 10 | NIT otro país |
| 11 | NUIP |

### 13.9 IDs de Tributos Clientes

| ID | Código | Nombre |
|----|--------|--------|
| 18 | 01 | IVA |
| 21 | ZZ | No aplica |

### 13.10 IDs de Tipos de Organizaciones

| ID | Nombre |
|----|--------|
| 1 | Persona Jurídica |
| 2 | Persona Natural |

### 13.11 Códigos de Métodos de Pago

| Código | Nombre |
|--------|--------|
| 10 | Efectivo |
| 42 | Consignación |
| 20 | Cheque |
| 47 | Transferencia |
| 71 | Bonos |
| 72 | Vales |
| 1 | Medio de pago no definido |
| 49 | Tarjeta Débito |
| 48 | Tarjeta Crédito |
| ZZZ | Otro |

### 13.12 Códigos de Formas de Pago

| Código | Nombre |
|--------|--------|
| 1 | Pago de contado |
| 2 | Pago a crédito |

### 13.13 Códigos de Tipos de Documento para Rangos de Numeración

| Código | Descripción |
|--------|-------------|
| 21 | Factura de Venta |
| 22 | Nota Crédito |
| 23 | Nota Débito |
| 24 | Documento Soporte |
| 25 | Nota de Ajuste Documento Soporte |
| 26 | Nómina |
| 27 | Nota de Ajuste Nómina |
| 28 | Nota de eliminación de nómina |
| 30 | Factura de talonario y de papel |

### 13.14 IDs de Tipos de Documentos de Identidad (Documentos Soporte)

| ID | Nombre |
|----|--------|
| 4 | Tarjeta de extranjería |
| 5 | Cédula de extranjería |
| 6 | NIT |
| 7 | Pasaporte |
| 8 | Documento de identificación extranjero |
| 9 | PEP |
| 10 | NIT otro país |

### 13.15 Motivos para Notas de Ajuste

| Código | Descripción |
|--------|-------------|
| 1 | Devolución parcial de los bienes y/o no aceptación parcial del servicio |
| 2 | Anulación del documento soporte en adquisiciones a sujetos no obligados |
| 3 | Rebaja o descuento parcial o total |
| 4 | Ajuste de precio |
| 5 | Otros |

### 13.16 Códigos de Recargos y Descuentos

| Código | Descripción |
|--------|-------------|
| 00 | Descuento no condicionado |
| 01 | Descuento condicionado |
| 02 | Recargo no condicionado |
| 03 | Recargo condicionado |

### 13.17 Responsabilidades Fiscales

| Código | Descripción |
|--------|-------------|
| O-13 | Gran contribuyente |
| O-15 | Autorretenedor |
| O-23 | Agente de retención de IVA |
| O-47 | Régimen simple de tributación |
| R-99-PN | No responsable |

### 13.18 Tributos (Productos/Servicios)

| ID | Código | Nombre | Descripción |
|----|--------|--------|-------------|
| 1 | 01 | IVA | Impuesto sobre la Ventas |
| 2 | 02 | IC | Impuesto al Consumo Departamental Nominal |
| 3 | 03 | ICA | Impuesto de Industria, Comercio y Aviso |
| 4 | 04 | INC | Impuesto Nacional al Consumo |
| 5 | 05 | ReteIVA | Retención sobre el IVA |
| 6 | 06 | ReteRenta | Retención sobre renta |
| 7 | 07 | ReteICA | Retención sobre el ICA |
| 8 | 08 | IC Porcentual | Impuesto al Consumo Departamental Porcentual |
| 9 | 20 | FtoHorticultura | Cuota de Fomento Hortifrutícula |
| 10 | 21 | Timbre | Impuesto de Timbre |
| 11 | 22 | INC Bolsas | Impuesto Nacional al Consumo de Bolsa Plástica |
| 12 | 23 | INCarbono | Impuesto Nacional del Carbono |
| 13 | 24 | INCombustibles | Impuesto Nacional a los Combustibles |
| 14 | 25 | Sobretasa Combustibles | Sobretasa a los combustibles |
| 15 | 26 | Sordicom | Contribución minoristas (Combustibles) |
| 16 | 30 | IC Datos | Impuesto al Consumo de Datos |

### 13.19 Unidades de Medida (comunes)

| ID | Código | Nombre |
|----|--------|--------|
| 70 | 94 | Unidad |
| 71 | EA | Cada uno |
| 94 | S7 | Porcentaje |
| 145 | C62 | Kilogramo |
| 333 | GR | Gramo |
| 415 | L | Litro |
| 416 | ML | Mililitro |
| 481 | H87 | Hora |

---

## 14. Guía de Casos de Uso

### Caso 1: Crear Factura Completa

**Escenario:** Crear una factura electrónica para una empresa con IVA.

```bash
# 1. Obtener token
curl -X POST http://localhost:3000/auth/get-token

# 2. Crear factura
curl -X POST http://localhost:3000/v3/bills \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reference_code": "FACT-2026-0001",
    "observation": "Factura de servicios",
    "customer": {
      "identification": "900825759",
      "dv": "7",
      "company": "HALLTEC S.A.S.",
      "email": "facturacion@halltec.com",
      "phone": "3165584659",
      "address": "cra 10 # 9 - 04",
      "legal_organization_id": 1,
      "tribute_id": 21,
      "identification_document_id": 2,
      "municipality_id": 68001
    },
    "items": [
      {
        "code_reference": "SERV001",
        "name": "Desarrollo de Software",
        "quantity": 1,
        "price": 5000000,
        "tax_rate": "19.00",
        "unit_measure_id": 70,
        "standard_code_id": 1,
        "is_excluded": 0,
        "tribute_id": 1
      }
    ],
    "payment_method_code": 10
  }'
```

---

### Caso 2: Crear Factura con Descuento

```json
{
  "reference_code": "FACT-2026-0002",
  "customer": { ... },
  "items": [
    {
      "code_reference": "PROD001",
      "name": "Producto X",
      "quantity": 10,
      "discount_rate": 15,
      "price": 100000,
      "tax_rate": "19.00",
      "unit_measure_id": 70,
      "standard_code_id": 1,
      "tribute_id": 1
    }
  ],
  "payment_method_code": 40
}
```

---

### Caso 3: Crear Nota de Crédito por Devolución

```bash
curl -X POST http://localhost:3000/v3/credit-notes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "correction_concept_code": "4",
    "bill_id": 820,
    "reference_code": "NC-2026-0001",
    "observation": "Devolución de producto por defecto",
    "items": [
      {
        "code_reference": "PROD001",
        "name": "Producto X",
        "quantity": 2,
        "price": 118000,
        "tax_rate": "19.00",
        "unit_measure_id": 70,
        "standard_code_id": 1,
        "tribute_id": 1
      }
    ]
  }'
```

---

### Caso 4: Buscar Facturas por Fecha

```bash
curl -X GET "http://localhost:3000/v3/bills?start_date=2026-01-01&end_date=2026-04-30&status=1" \
  -H "Authorization: Bearer <token>"
```

---

### Caso 5: Validar Cliente en DIAN

```bash
curl -X POST http://localhost:3000/auth/get-acquirer \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "identification_document_id": 3,
    "identification_number": "900825759"
  }'
```

---

## 15. Troubleshooting

### Error: 401 Unauthorized

**Síntoma:** Error al hacer requests a endpoints autenticados.

**Causas:**
1. Token expirado
2. Token inválido
3. Credenciales de Factus incorrectas

**Solución:**
```javascript
// Verificar si el token está activo
const tokenInfo = TokenService.getTokenInfo();
if (tokenInfo.isExpired) {
  // Obtener nuevo token
  await getNewToken();
}
```

---

### Error: RATE_LIMIT_EXCEEDED

**Síntoma:** "Demasiadas solicitudes"

**Causas:**
1. Demasiadas peticiones en poco tiempo
2. Código no espera entre requests

**Solución:**
```javascript
// Implementar retry con backoff
const retry = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e.response?.status === 429) {
        await sleep(60000); // esperar 1 minuto
      }
    }
  }
};
```

---

### Error: BILL_ALREADY_VALIDATED

**Síntoma:** No se puede modificar una factura ya validada

**Causas:**
1. Intentar modificar una factura enviada a la DIAN

**Solución:**
1. Crear nota de crédito para anular
2. Crear nueva factura correcta

---

### Error: Connection Refused

**Síntoma:** No se puede conectar al servidor

**Solución:**
1. Verificar que el servidor esté corriendo
2. Verificar el puerto en configuración
3. Verificar firewall/puertos

```bash
# Verificar que el servidor está corriendo
curl http://localhost:3000/health

# Verificar configuración de puerto
cat .env | grep PORT
```

---

## 16. Mejores Prácticas

### Autenticación

1. **No almacenar tokens en código fuente** - Usar variables de entorno
2. **Manejar expiración** - Verificar `expires_in` y renovar proactivamente
3. **Reintentar con backoff** - En errores 429/503

### Manejo de Errores

1. **Loggear todos los errores** - Incluir requestId para debug
2. **Mostrar mensajes claros al usuario** - No exponer errores internos
3. **Implementar retry automático** - Para errores transitorios

### Validación de Datos

1. **Validar antes de enviar** - Usar los endpoints de referencia para códigos válidos
2. **Sanitizar inputs** - Evitar inyección
3. **Usar tipos correctos** - Strings para códigos, numbers para cantidades

### Performance

1. **Cachear datos de referencia** - Municipios, unidades, tributos
2. **Usar paginación** - Para listados grandes
3. **Comprimir respuestas** - Si es necesario

### Documentación

1. **Mantener este documento actualizado**
2. **Documentar casos de uso específicos**
3. **Versionar la documentación**

---

## Anexo: Changelog

### v3.0 (2026-04)
- ✅ TokenService con caché automática
- ✅ Validación Zod
- ✅ Winston logging
- ✅ Manejo centralizado de errores
- ✅ Múltiples health checks
- ✅ Rate limiting configurable
- ✅ Swagger/OpenAPI
- ✅ Versionado de API

### v2.0 (2026-03)
- ✅ Cache de tokens
- ✅ Validación básica

### v1.0 (2026-02)
- ✅ MVP - Endpoints básicos

---

*Documento generado para NeoApp API v3 - Production Ready*  
*Versión: 3.0*  
*Última actualización: Abril 2026*