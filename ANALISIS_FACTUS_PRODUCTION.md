# Análisis de Compatibilidad con Factus API - Plan de Producción

## Estado Actual vs Factus API v1

---

## 1. Resumen Ejecutivo

Este documento analiza la implementación actual de la API NeoApp contra la documentación de Factus API v1 y establece el roadmap para alcanzar un nivel de producción escalable.

**Estado actual:** MVP funcional con limitaciones críticas para producción  
**Objetivo:** API lista para producción con soporte completo de Factus

---

## 2. Análisis de Funcionalidades

### 2.1 Autenticación (OAuth 2.0)

| Funcionalidad | Estado | Observaciones |
|---------------|--------|----------------|
| Obtención de token (`/oauth/token`) | ✅ Implementado | Usa variables de entorno correctamente |
| Validación de suscripción | ✅ Implementado | Endpoint disponible |
| Consulta adquiriente DIAN | ✅ Implementado | Endpoint disponible |
| Refresh Token | ❌ No implementado | No hay soporte para renovación automática |
| Token management centralizado | ⚠️ Parcial | Tokens hardcodeados en controladores |

**Problemas identificados:**
- No hay gestión centralizada de tokens con TTL
- Los controladores `BillController` y `NoteCreditController` tienen tokens hardcodeados (líneas 6-7 y 6-7 respectivamente)
- No hay mecanismo de refresh automático

---

### 2.2 Creación de Facturas (`POST /v1/bills/validate`)

#### Campos del Body - Comparativa

| Campo Factus API | Estado Actual | Notas |
|------------------|---------------|-------|
| `document` | ❌ No enviado | Tipo de documento (01 = factura venta) |
| `numbering_range_id` | ⚠️ Enviado como array vacío | Debe ser integer |
| `reference_code` | ✅ Implementado | |
| `observation` | ✅ Enviado vacío | |
| `payment_form` | ❌ No enviado | Por defecto usa 1 |
| `payment_due_date` | ❌ No enviado | Para crédito |
| `payment_method_code` | ✅ Implementado | 10 = efectivo |
| `operation_type` | ❌ No enviado | Por defecto 10 |
| `order_reference` | ❌ No enviado | Objeto de orden |
| `send_email` | ❌ No enviado | Boolean |
| `related_documents` | ❌ No enviado | Para documento 03 |
| `billing_period` | ❌ No enviado | Servicios públicos |
| `establishment` | ❌ No enviado | Datos del establecimiento |
| `customer` | ⚠️ Parcial | Ver detalle |

#### Customer - Comparativa

| Campo Factus API | Estado Actual | Notas |
|------------------|---------------|-------|
| `identification_document_id` | ✅ Enviado desde body | |
| `identification` | ✅ Enviado desde body | |
| `dv` | ❌ Enviado vacío | **Requerido para NIT** |
| `company` | ❌ Enviado vacío | Obligatorio para jurídicas |
| `trade_name` | ❌ Enviado vacío | |
| `names` | ✅ Enviado desde body | Solo naturales |
| `address` | ❌ Enviado vacío | |
| `email` | ✅ Enviado desde body | |
| `phone` | ❌ Enviado vacío | |
| `legal_organization_id` | ⚠️ Hardcodeado "2" | Ignora body[0].legal_organization_id |
| `tribute_id` | ⚠️ Hardcodeado "21" | Ignora cualquier valor del body |
| `municipality_id` | ✅ Enviado desde body | |

#### Items - Comparativa

| Campo Factus API | Estado Actual | Notas |
|------------------|---------------|-------|
| `scheme_id` | ❌ No enviado | Para mandatos (opcional) |
| `note` | ❌ No enviado | Nota adicional |
| `code_reference` | ✅ Implementado | |
| `name` | ✅ Implementado | |
| `quantity` | ✅ Implementado | Entero |
| `discount_rate` | ✅ Implementado | Porcentaje |
| `price` | ✅ Implementado | Con impuestos |
| `tax_rate` | ✅ Implementado | String "19.00" |
| `unit_measure_id` | ✅ Implementado | |
| `standard_code_id` | ✅ Implementado | |
| `is_excluded` | ✅ Implementado | 0/1 |
| `tribute_id` | ⚠️ Hardcodeado 1 | IVA |
| `withholding_taxes` | ✅ Array vacío | Soporta retenciones |
| `mandate` | ❌ No enviado | Para esquemas 1 |

#### AllowanceCharges (Descuentos/Recargos Globales)

| Campo | Estado | Notas |
|-------|--------|-------|
| `allowance_charges` | ❌ No enviado | Array de descuentos/recargos |

**Errores críticos en BillController.ts:**
- Línea 6-7: Token hardcodeado
- Línea 74: `numbering_range_id: []` debe ser integer
- Línea 87: `legal_organization_id: "2"` ignora el valor del body
- Línea 88: `tribute_id: "21"` hardcodeado
- Línea 29-36: Asume que `req.body` es array y usa `body[0]`

---

### 2.3 Consulta y Gestión de Facturas

| Endpoint | Estado | Notas |
|----------|--------|-------|
| `GET /v1/bills` (listar) | ✅ Implementado | Sin filtros |
| `GET /v1/bills/show/:id` | ✅ Implementado | |
| `DELETE /v1/bills/destroy/:id` | ✅ Implementado | Solo no validadas |
| Descargar PDF | ❌ No implementado | Endpoint existente |
| Descargar XML | ❌ No implementado | Endpoint existente |
| Obtener contenido correo | ❌ No implementado | Endpoint existente |
| Enviar correo | ❌ No implementado | Endpoint existente |
| Eventos de facturas | ❌ No implementado | Aceptación tácita |
| Aceptación tácita | ❌ No implementado | Endpoint específico |

---

### 2.4 Notas de Crédito

| Endpoint | Estado | Notas |
|----------|--------|-------|
| `POST /v1/credit-notes/validate` | ✅ Parcial | Falta muchos campos |
| `GET /v1/credit-notes` | ❌ No implementado | Listar notas |
| `GET /v1/credit-notes/show/:id` | ❌ No implementado | Ver detalle |
| Descargar PDF/XML | ❌ No implementado | |
| Eliminar | ❌ No implementado | |

**Problemas en NoteCreditController.ts:**
- Token hardcodeado línea 6-7
- Usa `bill_id` en lugar de `id_bill` (línea 102)
- Asume body[0] (línea 93)
- No mapea respuesta de forma estructurada

---

### 2.5 Datos de Referencia (Sugeridos por Factus)

Factus recomienda cachear estos datos para mejorar rendimiento:

| Endpoint | Estado | Notas |
|----------|--------|-------|
| Rangos de numeración | ❌ No implementado | CRITICAL |
| Municipios | ❌ No implementado | CRITICAL |
| Tributos | ❌ No implementado | CRITICAL |
| Unidades de medida | ❌ No implementado | CRITICAL |
| Tipos de documentos | ❌ No implementado | |
| Formas de pago | ❌ No implementado | |
| Métodos de pago | ❌ No implementado | |
| Tipos de operación | ❌ No implementado | |
| Códigos de organización | ❌ No implementado | |

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

## 3. Arquitectura Actual - Problemas Estructurales

### 3.1 Patrones Incorrectos

```typescript
// PROBLEMA: Asume formato de entrada incorrecto
const body = req.body; // array
let client = { name: body[0]?.names, ... };

// CORRECTO: Validar y normalizar input
interface BillRequest {
  numbering_range_id?: number;
  document?: string;
  reference_code: string;
  customer: Customer;
  items: Item[];
  // ... campos opcionales
}
```

### 3.2 Tokens Hardcodeados

```typescript
// PROBLEMA CRÍTICO
const token = "eyJ0eXAi..."; // BillController.ts línea 6-7
const token = "eyJ0eXAi..."; // NoteCreditController.ts línea 6-7

// CORRECTO: Usar AuthService centralizado
import { TokenService } from '../services/TokenService';
const token = await TokenService.getValidToken();
```

### 3.3 Errores de Lógica en Utils

- `userControllerUtils.isAnyEmptyOrNull()` retorna en primera iteración - no valida todo el objeto
- `userController.ts` usa `await connection.beginTransaction` sin invocar método correcto

---

## 4. Roadmap de Implementación

### Fase 1: Fundamentos (Semana 1-2)

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 🔴 Crítica | TokenService | Servicio centralizado de gestión de tokens con refresh automático |
| 🔴 Crítica | Validación de Input | Middleware de validación con Zod/Joi |
| 🔴 Crítica | Normalización Request | Estandarizar formato de entrada (no arrays) |
| 🟠 Alta | Refactor BillController | Eliminar hardcoded tokens, mapear todos campos Factus |
| 🟠 Alta | Refactor NoteCreditController | Mismo tratamiento |

### Fase 2: Datos de Referencia (Semana 3)

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 🟠 Alta | Cache Municipalities | Consultar y cachear municipios |
| 🟠 Alta | Cache NumberingRanges | Rangos de numeración por empresa |
| 🟠 Alta | Cache Units | Unidades de medida |
| 🟠 Alta | Cache Taxes | Tributos disponibles |
| 🟡 Media | Reference Tables | Tablas de códigos (documentos, pagos, etc.) |

### Fase 3: Completar Funcionalidad (Semana 4-5)

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 🟠 Alta | Bill Downloads | PDF y XML |
| 🟠 Alta | Email Integration | Enviar y obtener contenido |
| 🟠 Alta | Credit Notes CRUD | Completar CRUD notas crédito |
| 🟡 Media | Bill Events | Aceptación tácita |
| 🟡 Media | Document Support | Documentos soporte (opcional) |

### Fase 4: Production Ready (Semana 6-7)

| Prioridad | Tarea | Descripción |
|-----------|-------|-------------|
| 🔴 Crítica | Logging | Winston/Pino estructurado |
| 🔴 Crítica | Error Handling | Middleware centralizado |
| 🔴 Crítica | Health Checks | Endpoint de monitoreo |
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

| Métrica | Actual | Meta Producción |
|---------|--------|-----------------|
| Cobertura campos Factus | ~40% | 95%+ |
| Tokens centralizados | 0% | 100% |
| Validación input | Ninguna | Strict |
| Datos referenciales cacheados | 0% | 100% |
| Endpoints implementados | 6/30+ | 25/30+ |
| Tests覆盖率 | 0% | 80%+ |

---

## 8. Recomendaciones Inmediatas

1. **NO usar en producción** hasta resolver tokens hardcodeados
2. **Priorizar** TokenService con refresh automático
3. **Implementar** validación de input antes de refactorizar controladores
4. **Crear** tipos TypeScript para контрактов Factus
5. **Configurar** ambiente sandbox para pruebas

---

*Documento generado para análisis y planificación de MVP a Producción*
*Versión: 1.0 - Fecha: Abril 2026*