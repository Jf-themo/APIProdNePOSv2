# Análisis de Compatibilidad con Factus API - Plan de Producción

## Estado Actual vs Factus API v1

---

## 1. Resumen Ejecutivo

Este documento analiza la implementación actual de la API NeoApp contra la documentación de Factus API v1 y establece el roadmap para alcanzar un nivel de producción escalable.

**Estado actual:** MVP funcional con limitaciones críticas para producción  
**Objetivo:** API lista para producción con soporte completo de Factus

---

---

## 2.1 IMPLEMENTADO - Fase 1: Fundamentos (Semana 1-2)

### Cambios Realizados

| Componente | Antes | Después |
|------------|-------|---------|
| **TokenService** | ❌ No existía | ✅ Centralizado con cache + refresh automático |
| **Types/Factus** | ❌ No existían | ✅ Interfaces TypeScript completas |
| **Validación Input** | ❌ Ninguna | ✅ Middleware Zod con validadores |
| **BillController** | Tokens hardcodeados línea 6-7 | ✅ Usa TokenService + validación |
| **NoteCreditController** | Tokens hardcodeados línea 6-7 | ✅ Usa TokenService + validación |
| **Formatos Request** | Array `body[0]` | ✅ Objeto estructurado con validación |

### Nuevos Archivos Creados

```
src/
├── services/
│   └── TokenService.ts          # Gestión centralizada de tokens
├── types/
│   └── factus.ts                # Interfaces TypeScript Factus
├── middleware/
│   └── validation.ts            # Middleware validación Zod
└── utils/validators/
    ├── bill.validator.ts        # Validador facturas
    └── creditNote.validator.ts  # Validador notas crédito
```

### Tests Implementados

```
src/__tests__/
├── setup.ts                     # Configuración de entorno para tests
├── __mocks__/
│   └── axios.ts                 # Mock de axios
├── services/
│   └── TokenService.test.ts     # Tests TokenService (10 tests)
└── validators/
    ├── bill.validator.test.ts   # Tests validador facturas (16 tests)
    ├── creditNote.validator.test.ts  # Tests validador notas crédito (12 tests)
    └── validation.middleware.test.ts  # Tests middleware validación (6 tests)
```

**Resultados tests:** 44 tests ✅ Pasados
- TokenService: 10 tests
- Validadores facturas: 16 tests
- Validadores notas crédito: 12 tests
- Middleware validación: 6 tests

### Endpoints Nuevos Agregados

**BillController:**
- `GET /get-bill-by-id/:id` - Ahora usa params en URL
- `GET /download-pdf/:id` - Descargar PDF
- `GET /download-xml/:id` - Descargar XML
- `POST /send-email/:id` - Enviar correo

**NoteCreditController:**
- `POST /create-note-credit` - Refactorizado con validación
- `GET /get-credit-notes` - Listar notas crédito
- `GET /get-credit-note-by-id/:id` - Ver detalle
- `DELETE /delete-credit-note/:id` - Eliminar
- `GET /download-pdf/:id` - PDF
- `GET /download-xml/:id` - XML
- `POST /send-email/:id` - Enviar correo

---

## 2. Análisis de Funcionalidades

### 2.1 Autenticación (OAuth 2.0) ✅ FASE 1 COMPLETADA

| Funcionalidad | Estado | Observaciones |
|---------------|--------|----------------|
| Obtención de token (`/oauth/token`) | ✅ Implementado | TokenService con cache |
| Validación de suscripción | ✅ Implementado | Endpoint disponible |
| Consulta adquiriente DIAN | ✅ Implementado | Endpoint disponible |
| Refresh Token | ✅ Implementado | Automático en TokenService |
| Token management centralizado | ✅ Completado | Sin tokens hardcodeados |

**Implementado en Fase 1:**
- TokenService con cache y refresh automático
- Controladores refactorizados sin tokens hardcodeados
- TTL configurable para tokens

---

### 2.2 Creación de Facturas (`POST /v1/bills/validate`) ✅ FASE 1 COMPLETADA

#### Campos del Body - Comparativa

| Campo Factus API | Estado | Notas |
|------------------|--------|-------|
| `document` | ✅ Enviado | "01" por defecto |
| `numbering_range_id` | ✅ Implementado | Integer opcional |
| `reference_code` | ✅ Implementado | |
| `observation` | ✅ Implementado | |
| `payment_form` | ✅ Implementado |默认值 1 |
| `payment_due_date` | ✅ Implementado | Para crédito |
| `payment_method_code` | ✅ Implementado | 10 = efectivo |
| `operation_type` | ✅ Implementado |默认值 10 |
| `order_reference` | ✅ Implementado | Objeto de orden |
| `send_email` | ✅ Implementado | Boolean |
| `related_documents` | ✅ Implementado | Para documento 03 |
| `billing_period` | ✅ Implementado | Servicios públicos |
| `establishment` | ✅ Implementado | Datos del establecimiento |
| `customer` | ✅ Completo | Todos los campos |

#### Customer - Comparativa (Actualizado)

| Campo Factus API | Estado | Notas |
|------------------|--------|-------|
| `identification_document_id` | ✅ Enviado desde body | |
| `identification` | ✅ Enviado desde body | |
| `dv` | ✅ Enviado desde body | Ahora requerido para NIT |
| `company` | ✅ Enviado desde body | Personas jurídicas |
| `trade_name` | ✅ Enviado desde body | |
| `names` | ✅ Enviado desde body | Personas naturales |
| `address` | ✅ Enviado desde body | |
| `email` | ✅ Enviado desde body | |
| `phone` | ✅ Enviado desde body | |
| `legal_organization_id` | ✅ Desde body | Ya no hardcodeado |
| `tribute_id` | ✅ Desde body | Ya no hardcodeado |
| `municipality_id` | ✅ Enviado desde body | |

#### Items - Comparativa (Actualizado)

| Campo Factus API | Estado | Notas |
|------------------|--------|-------|
| `scheme_id` | ✅ Implementado | Para mandatos |
| `note` | ✅ Implementado | Nota adicional |
| `code_reference` | ✅ Implementado | |
| `name` | ✅ Implementado | |
| `quantity` | ✅ Implementado | Entero |
| `discount_rate` | ✅ Implementado | Porcentaje |
| `price` | ✅ Implementado | Con impuestos |
| `tax_rate` | ✅ Implementado | String "19.00" |
| `unit_measure_id` | ✅ Implementado | |
| `standard_code_id` | ✅ Implementado | |
| `is_excluded` | ✅ Implementado | 0/1 |
| `tribute_id` | ✅ Desde body | Ya no hardcodeado |
| `withholding_taxes` | ✅ Implementado | Soporta retenciones |
| `mandate` | ✅ Implementado | Para esquemas 1 |

#### AllowanceCharges (Actualizado)

| Campo | Estado | Notas |
|-------|--------|-------|
| `allowance_charges` | ✅ Implementado | Array de descuentos/recargos |

**Fase 1 - Cambios realizados:**
- Token eliminado de hardcode, usa TokenService
- `numbering_range_id` ahora es integer
- `customer.legal_organization_id` y `tribute_id` vienen del body
- Validación completa con Zod schemas

---

### 2.3 Consulta y Gestión de Facturas ✅ FASE 1 COMPLETADA

| Endpoint | Estado | Notas |
|----------|--------|-------|
| `GET /v1/bills` (listar) | ✅ Implementado | Con filtros (page, limit, status, fechas) |
| `GET /v1/bills/show/:id` | ✅ Implementado | |
| `DELETE /v1/bills/destroy/:id` | ✅ Implementado | Por ID |
| `DELETE /v1/bills/destroy/reference/:reference_code` | ⏳ Fase 4 | Por código de referencia |
| Descargar PDF | ✅ Implementado | Nuevo endpoint |
| Descargar XML | ✅ Implementado | Nuevo endpoint |
| Obtener contenido correo | ⚠️ Pendiente | |
| Enviar correo | ✅ Implementado | Nuevo endpoint |
| Eventos de facturas | ✅ Implementado | Aceptar, rechazar, aceptar con reclamaciones |
| Aceptación tácita | ✅ Implementado | Endpoint específico |

**Fase 4 - Pendiente:**
- Eliminar factura por reference_code (requiere verificar status primero)

---

### 2.4 Notas de Crédito ✅ FASE 1 COMPLETADA

| Endpoint | Estado | Notas |
|----------|--------|-------|
| `POST /v1/credit-notes/validate` | ✅ Completado | Refactorizado con validación |
| `GET /v1/credit-notes` | ✅ Completado | Listar notas |
| `GET /v1/credit-notes/show/:id` | ✅ Completado | Ver detalle |
| Descargar PDF | ✅ Completado | Nuevo endpoint |
| Descargar XML | ✅ Completado | Nuevo endpoint |
| Eliminar | ✅ Completado | |
| Enviar correo | ✅ Completado | |

**Fase 1 - Cambios realizados:**
- Token eliminado, usa TokenService
- Validación completa con Zod
- Estructura de request normalizada
- Mapeo de respuesta estructurado

---

### 2.5 Datos de Referencia (Sugeridos por Factus) ✅ FASE 2 COMPLETADA

Factus recomienda cachear estos datos para mejorar rendimiento:

| Endpoint | Estado | Notas |
|----------|--------|-------|
| Rangos de numeración | ✅ Implementado | Cache 1h |
| Municipios | ✅ Implementado | Cache 1h |
| Tributos | ✅ Implementado | Cache 1h |
| Unidades de medida | ✅ Implementado | Cache 1h |
| Tipos de documentos | ✅ Implementado | Tablas referencia |
| Formas de pago | ✅ Implementado | Tablas referencia |
| Métodos de pago | ✅ Implementado | Tablas referencia |
| Tipos de operación | ✅ Implementado | Tablas referencia |
| Códigos de organización | ✅ Implementado | Tablas referencia |
| Países | ✅ Implementado | Nuevo |

**Fase 2 - Implementado:**
- ReferenceDataService con cache en memoria
- TTL configurable (default 1 hora)
- Parámetro `?refresh=true` para forzar actualización
- Endpoints de cache: `cache-info`, `clear-cache`

---

### 2.6 Módulos Adicionales No Implementados

| Módulo | Estado |
|--------|--------|
| Documentos Soporte | ❌ No implementado |
| Notas de Ajuste a Documentos Soporte | ❌ No implementado |
| Empresas | ❌ No implementado |
| Recepción de Documentos | ❌ No implementado |
| Países | ❌ No implementado |

---

## 3. Arquitectura - Estado Actual (Fases 1-2)

### ✅ 3.1 Patrones Corregidos

```typescript
// ANTES (PROBLEMA): Asume formato de entrada incorrecto
const body = req.body; // array
let client = { name: body[0]?.names, ... };

// DESPUÉS (CORREGIDO): Validación con Zod
const CreateBillRequestSchema = z.object({
  reference_code: z.string().min(1),
  customer: CustomerSchema,
  items: z.array(BillItemSchema).min(1)
});
```

### ✅ 3.2 Tokens Corregidos

```typescript
// ANTES (PROBLEMA): Tokens hardcodeados
const token = "eyJ0eXAi..."; // BillController.ts

// DESPUÉS (CORREGIDO): TokenService centralizado
import TokenService from '../services/TokenService';
const token = await TokenService.getValidToken();
```

### ⚠️ 3.3 Errores de Lógica Pendientes

- `userControllerUtils.isAnyEmptyOrNull()` retorna en primera iteración - no valida todo el objeto
- `userController.ts` usa `await connection.beginTransaction` sin invocar método correcto
- **Pendiente para Fase 4**

---

## 4. Roadmap de Implementación

---

## 2.2 IMPLEMENTADO - Fase 2: Datos de Referencia (Semana 3)

### Cambios Realizados

| Componente | Estado |
|------------|--------|
| **ReferenceDataService** | ✅ Cache en memoria con TTL configurable |
| **ReferenceController** | ✅ Endpoints para municipios, rangos, unidades, tributos |
| **Rutas Referencia** | ✅ 9 nuevos endpoints |
| **Tests ReferenceDataService** | ✅ 13 tests |

### Nuevos Endpoints

| Endpoint | Descripción |
|----------|-------------|
| `GET /municipalities` | Lista todos los municipios (cacheable) |
| `GET /numbering-ranges` | Lista rangos de numeración (cacheable) |
| `GET /numbering-ranges/:id` | Ver rango específico |
| `GET /units-of-measure` | Lista unidades de medida (cacheable) |
| `GET /tributes` | Lista tributos (cacheable) |
| `GET /countries` | Lista países |
| `GET /reference-tables` | Tablas de referencia completas |
| `GET /cache-info` | Ver estado del cache |
| `POST /clear-cache` | Limpiar cache (todo o específico) |

**Parámetro `?refresh=true`** Fuerza actualización del cache

### Tests Fase 2 (13 tests)
- ReferenceDataService: 13 tests

---

## 2.3 IMPLEMENTADO - Fase 3: Completar Funcionalidad

### Nuevos Endpoints Agregados

| Endpoint | Descripción |
|----------|-------------|
| `GET /email-content/:id` | Obtener contenido del correo antes de enviar |
| `POST /accept/:id` | Aceptación tácita de factura |
| `POST /reject/:id` | Rechazar factura con observación |
| `POST /accept-with-claims/:id` | Aceptar con reclamaciones |

### Documentos Soporte (pendiente)
- ⏳ Crear documento soporte
- ⏳ Filtrar documentos soporte
- ⏳ Ver documento soporte
- ⏳ Descargar PDF/XML documento soporte

### Tests Fase 3 (10 tests)
- billEvent.validator: 10 tests

---

### Fase 1: Fundamentos (Semana 1-2) ✅ COMPLETADO

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| 🔴 Crítica | TokenService | ✅ Completado |
| 🔴 Crítica | Validación de Input | ✅ Completado |
| 🔴 Crítica | Normalización Request | ✅ Completado |
| 🟠 Alta | Refactor BillController | ✅ Completado |
| 🟠 Alta | Refactor NoteCreditController | ✅ Completado |

### Fase 2: Datos de Referencia (Semana 3) ✅ COMPLETADO

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| 🟠 Alta | Cache Municipalities | ✅ Completado |
| 🟠 Alta | Cache NumberingRanges | ✅ Completado |
| 🟠 Alta | Cache Units | ✅ Completado |
| 🟠 Alta | Cache Taxes | ✅ Completado |
| 🟡 Media | Reference Tables | ✅ Completado |

### Fase 3: Completar Funcionalidad (Semana 4-5) ✅ COMPLETADO

| Prioridad | Tarea | Estado |
|-----------|-------|--------|
| 🟠 Alta | Bill Downloads (PDF/XML) | ✅ Completado |
| 🟠 Alta | Email Integration | ✅ Completado |
| 🟠 Alta | Credit Notes CRUD | ✅ Completado |
| 🟡 Media | Bill Events | ✅ Completado |
| 🟡 Media | Document Support | ⏳ Pendiente |

### Fase 4: Production Ready (Semana 6-7)

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 🔴 Crítica | Logging | Winston/Pino estructurado |
| 🔴 Crítica | Error Handling | Middleware centralizado |
| 🔴 Crítica | Health Checks | Endpoint de monitoreo |
| 🟠 Alta | Eliminar Factura por Reference | DELETE /v1/bills/destroy/reference/:reference_code |
| 🟠 Alta | Rate Limiting | Protección API |
| 🟠 Alta | Environment Config | Desarrollo vs Producción |
| 🟡 Media | API Versioning | v1/v2 |
| 🟡 Media | Documentación | Swagger/OpenAPI |

### Fase 5: Escalabilidad (Semana 8+)

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 🟡 Media | Multi-empresa | Soporte múltiples empresas |
| 🟡 Media | Webhooks | Notificaciones asíncronas |
| 🟢 Baja | Queue Jobs | Procesamiento async facturas |
| 🟢 Baja | Reportes | Dashboard métricas |

---

## 5. Estructura Sugerida para Producción

```
src/
├── app.ts
├── index.ts
├── config/
│   ├── database.ts
│   └── environments.ts
├── middleware/
│   ├── validation.ts
│   ├── errorHandler.ts
│   ├── rateLimiter.ts
│   └── auth.ts
├── services/
│   ├── TokenService.ts        # NUEVO: Gestión centralizada tokens
│   ├── FactusService.ts       # NUEVO: Wrapper Factus
│   ├── ReferenceDataService.ts  # NUEVO: Cache datos referencia
│   └── BillService.ts
├── controllers/
│   ├── AuthController.ts
│   ├── BillController.ts      # REFACTOR: Sin hardcoded tokens
│   ├── NoteCreditController.ts  # REFACTOR
│   └── ReferenceController.ts  # NUEVO
├── routes/
│   ├── auth.routes.ts
│   ├── bill.routes.ts
│   ├── noteCredit.routes.ts
│   └── reference.routes.ts   # NUEVO
├── utils/
│   ├── authUtils.ts
│   └── validators/           # NUEVO
│       ├── bill.validator.ts
│       └── creditNote.validator.ts
└── types/
    └── factus.d.ts            # NUEVO: Interfaces TypeScript Factus
```

---

## 6. Contratos de Datos Sugeridos

### 6.1 CreateBill Request

```typescript
interface CreateBillRequest {
  numbering_range_id?: number;      // Opcional si hay solo uno activo
  document?: string;                // "01" = factura venta
  reference_code: string;
  observation?: string;
  payment_form?: number;            // 1 = contado, 2 = crédito
  payment_due_date?: string;        // YYYY-MM-DD
  payment_method_code?: number;    // 10 = efectivo
  operation_type?: number;         // 10 = estándar
  order_reference?: {
    reference_code: string;
    issue_date?: string;
  };
  send_email?: boolean;
  establishment?: {
    name: string;
    address: string;
    phone_number: string;
    email: string;
    municipality_id: number;
  };
  customer: {
    identification: string;
    dv?: string;                    // Para NIT
    company?: string;               // Personas jurídicas
    trade_name?: string;
    names?: string;                 // Personas naturales
    address?: string;
    email: string;
    phone?: string;
    legal_organization_id: number;
    tribute_id: number;
    municipality_id?: number;
  };
  items: BillItem[];
  allowance_charges?: AllowanceCharge[];
}
```

---

## 7. Métricas de Implementación

| Métrica | Fase 1 Fin | Fase 2 Fin | Fase 3 Fin | Meta Producción |
|---------|------------|------------|------------|-----------------|
| Cobertura campos Factus | ~75% | ~75% | ~85% | 95%+ |
| Tokens centralizados | 100% | 100% | 100% | 100% |
| Validación input | Strict (Zod) | Strict (Zod) | Strict (Zod) | Strict |
| Datos referenciales cacheados | 0% | 100% | 100% | 100% |
| Endpoints implementados | 16 | 25 | 29 | 25/30+ |
| Tests | 44 | 57 | 67 tests ✅ | 80%+ |

### Progreso: 60% de la hoja de ruta

---

## 8. Estado Actual - Recomendaciones

### ✅ Completado (Fases 1-2)
1. Tokens hardcodeados eliminados → TokenService
2. Validación de input implementada con Zod
3. Tipos TypeScript creados para contratos Factus
4. Datos de referencia con cache

### ⚠️ Pendiente (Fase 3)
1. Testing completo de controladores (integración)
2. Aceptación tácita de facturas
3. Obtener contenido de correo

### 📋 Para Producción (Fase 4)
1. Logging estructurado (Winston/Pino)
2. Error handling centralizado
3. Health checks
4. Rate limiting
5. Swagger/OpenAPI documentation

---

*Documento generado para análisis y planificación de MVP a Producción*
*Versión: 1.3 - Fecha: Abril 2026 - Fases 1, 2 y 3 Completadas*