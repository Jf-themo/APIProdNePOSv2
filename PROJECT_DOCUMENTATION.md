# API NeoApp Producción V2

## 1. Descripción general

Este proyecto es una API REST construida con Node.js, TypeScript y Express que actúa como puente entre un cliente y la plataforma externa de Facturación Electrónica `factus.com.co`. También incluye un módulo de administración de usuarios con acceso a una base de datos MySQL.

## 2. Stack tecnológico

- Node.js + TypeScript
- Express
- MySQL2 (`mysql2/promise`)
- Axios para llamadas HTTP a servicios externos
- Morgan para logging de peticiones
- CORS habilitado globalmente
- Dotenv para cargar variables de entorno
- UUID / Nanoid para generación de identificadores

## 3. Estructura principal del proyecto

```
src/
  app.ts
  index.ts
  database.ts
  controllers/
    AuthController.ts
    BillController.ts
    NoteCreditController.ts
    userController.ts
    index.controller.ts
  routes/
    auth.routes.ts
    bill.routes.ts
    noteCredit.routes.ts
    user.routes.ts
    index.routes.ts
  models/
    People.ts
    User.ts
  interfaces/
    interfaces.ts
  utils/
    authUtils.ts
    userControllerUtils.ts
package.json
tsconfig.json
.env
```

## 4. Arranque de la aplicación

- `npm run dev`: ejecuta `nodemon src/index.ts --exec ts-node`
- `npm run build`: transpila TypeScript a `dist` usando `tsc`
- `npm run start`: inicia `node dist/index.js`

El servidor se inicializa en `src/index.ts` con `new App(6000)`, por lo que arranca por defecto en el puerto `6000`.

## 5. Configuración de entorno

El proyecto usa variables de entorno definidas en `.env`:

- `CLIENT_ID`
- `CLIENT_SECRET`
- `USER`
- `PASSWORD`
- `PORT` (opcional)

### Uso actual

Las variables son usadas por `AuthController.getToken()` para obtener un token OAuth de Factus.

> Nota: el archivo `.env` actual contiene credenciales reales. No incluyas estas credenciales en documentación pública ni en repositorios compartidos.

## 6. Flujo principal de la app

1. `src/index.ts` arranca la app.
2. `src/app.ts` configura Express, middleware y rutas.
3. Las rutas importan controladores desde `src/controllers`.
4. Los controladores ejecutan: consultas SQL, validaciones, o llamadas HTTP con Axios.

## 7. Rutas expuestas

### Route base

- `GET /` — prueba de estado. Retorna:
  - `{ message: "Si funciono desde el controlador" }`

### Auth

- `POST /get-token`
  - Parámetros: ninguno en body.
  - Usa: `CLIENT_ID`, `CLIENT_SECRET`, `USER`, `PASSWORD`.
  - Resultado: `{ access_token }`.
- `POST /get-subscription`
  - Body: `{ token }`
  - Llama a `https://api.factus.com.co/v1/subscriptions/current`.
- `POST /get-acquirer`
  - Body: `{ token, identification_document_id, identification_number }`
  - Llama a `https://api.factus.com.co/v1/dian/acquirer?...`

### Facturación

- `POST /create-bill`
  - Body: arreglo de items. El endpoint asume que `req.body` es un arreglo y toma `body[0]` para los datos del cliente, token y metadatos.
  - Genera factura en Factus mediante `POST https://api.factus.com.co/v1/bills/validate`.
  - El token se obtiene de `body[0].token`.
  - El cliente se construye con:
    - `names` (body[0].names)
    - `identification` (body[0].identification)
    - `identification_document_id` (body[0].identification_document_id)
    - `email` (body[0].email)
    - `municipality_id` (body[0].municipality_id)
  - Se usa también:
    - `reference_code` (body[0].reference_code)
    - `legal_organization_id` (body[0].legal_organization_id)
  - Notas de implementación importantes:
    - El código envía `legal_organization_id: "2"` en el cuerpo de `customer`, ignorando `body[0].legal_organization_id`.
    - El código envía `tribute_id: "21"` en `customer`, ignorando cualquier valor de body.
  - Cada item se transforma a la siguiente estructura:
    - `code_reference`
    - `name`
    - `quantity`
    - `discount`
    - `discount_rate`
    - `price`
    - `tax_rate`
    - `unit_measure_id`
    - `standard_code_id`
    - `is_excluded`
    - `tribute_id` se fija en `1`
    - `withholding_taxes` se envía como arreglo vacío
  - Ejemplo mínimo de body para `POST /create-bill`:

```json
[
  {
    "token": "<TOKEN>",
    "names": "Juan Pérez",
    "identification": "1234567890",
    "identification_document_id": 1,
    "email": "cliente@example.com",
    "municipality_id": 123,
    "reference_code": "REF-001",
    "legal_organization_id": 2,
    "code_reference": "P001",
    "name": "Producto ejemplo",
    "quantity": 1,
    "discount": 0,
    "discount_rate": 0,
    "price": 100000,
    "tax_rate": 19.0,
    "unit_measure_id": 70,
    "standard_code_id": 1,
    "is_excluded": 0
  }
]
```

  - El body puede contener múltiples productos. Todos se mapean a la propiedad `items` que envía la API externa.
  - Si Factus responde con `201`, la API retorna un objeto de factura procesado con campos como `number_bill`, `status_bill`, `total_bill`, `qr_bill`, `cufe_bill`, `items`, entre otros.
  - Riesgo: si el arreglo está vacío o no contiene `body[0]`, el endpoint fallará.
- `GET /get-bills`
  - Obtiene todas las facturas con `GET https://api.factus.com.co/v1/bills`.
- `POST /get-bill-by-id`
  - Body: `{ id }`
  - Obtiene detalle de factura con `GET https://api.factus.com.co/v1/bills/show/${id}`.
- `DELETE /delete-bill`
  - Body: `{ id, tokenRequest }`
  - Elimina factura con `DELETE https://api.factus.com.co/v1/bills/destroy/${id}`.

### Nota de crédito

- `POST /create-note-credit`
  - Body: array donde `body[0]` contiene:
    - `token`
    - `numbering_range_id`
    - `correction_concept_code`
    - `customization_id`
    - `id_bill`
    - `reference_code`
    - `observation`
    - `payment_method_code`
    - `items`
  - Llama a `POST https://api.factus.com.co/v1/credit-notes/validate`.

### Usuarios

- `GET /list-all-user`
  - Lista todos los usuarios desde la tabla `users`.
- `POST /create-user`
  - Crea un nuevo usuario y persona.
  - Inserta datos en `people` y `users`.
- `POST /sing-in`
  - Inicia sesión verificando `userName` y `passCode`.

## 8. Modelos y base de datos

### `src/models/People.ts`
- Clase base con:
  - `identification`
  - `namePerson`
  - `lastName`
  - `phone`

### `src/models/User.ts`
- Extiende `People`.
- Atributos:
  - `id`
  - `userName`
  - `passCode`
  - `userRole`
- Métodos:
  - `isAnyEmptyOrNull()`
  - `toString()`

### Conexión MySQL

- `src/database.ts` exporta `connect()` que crea un pool con `mysql2/promise`.
- Actualmente el objeto `createPool({})` no tiene configuración de host/usuario/contraseña/base de datos activa.

### Tablas usadas (basado en consultas)

- `people`
  - `identification`
  - `namePerson`
  - `lastName`
  - `phone`
- `users`
  - `id`
  - `idPeople`
  - `userName`
  - `passCode`
  - `userRole`

> Nota: no hay esquema SQL directo en el repo, solo inferencia desde las consultas.

## 9. Utilidades

### `src/utils/authUtils.ts`
- Valida si alguna de las variables de entorno requeridas está vacía o nula.

### `src/utils/userControllerUtils.ts`
- Función que revisa un objeto y devuelve `true` si detecta una propiedad falsy.
- El código actual tiene errores de lógica, ya que retorna dentro del primer ciclo y no valida todo el objeto correctamente.

## 10. Dependencias relevantes

- `express` — servidor HTTP
- `dotenv` — variables de entorno
- `axios` — llamadas HTTP externas
- `mysql2` — MySQL con promesas
- `morgan` — logging
- `cors` — habilita CORS
- `uuid` — genera identificadores
- `nodemon`, `ts-node`, `typescript` — desarrollo TypeScript

## 11. Integración con servicios externos

La API consume Factus directamente:

- `https://api.factus.com.co/oauth/token`
- `https://api.factus.com.co/v1/subscriptions/current`
- `https://api.factus.com.co/v1/dian/acquirer`
- `https://api.factus.com.co/v1/bills/validate`
- `https://api.factus.com.co/v1/bills`
- `https://api.factus.com.co/v1/bills/show/:id`
- `https://api.factus.com.co/v1/bills/destroy/:id`
- `https://api.factus.com.co/v1/credit-notes/validate`

## 12. Puntos críticos / TODO

1. `database.ts` no define datos de conexión reales en `createPool()`.
2. `userController.createUser()` usa `await connection.beginTransaction;` y `await connection.commit;` sin invocar métodos. Esto no comienza ni confirma transacción.
3. `connection.rollback` también se usa sin llamada a función.
4. `userControllerUtils.isAnyEmptyOrNull()` retorna en la primera iteración, por lo que no valida todos los campos.
5. `BillController.createBill()` asume que el request body es un arreglo y toma `body[0]` para metadatos, lo que puede ser frágil.
6. `NoteCreditController.createNoteCredit()` también asume que el body es un array con datos en la posición `0`.
7. `AuthController.validateSubscription()` y `getDianAcquirer()` requieren que el token llegue en el body en lugar de usar `Authorization` header estándar.
8. Existen tokens hardcodeados en `BillController.ts` y `NoteCreditController.ts`.
9. No hay validación estricta de datos de entrada para facturas y notas de crédito.
10. `tsconfig.json` compila a `dist`, pero no hay archivo `dist/` versionado ni documentación sobre producción.

## 13. Recomendaciones para otra IA

- El servicio principal es `src/app.ts`.
- `src/routes/*.ts` define rutas públicas.
- `src/controllers/*.ts` contiene la lógica de cada endpoint.
- `src/database.ts` debe configurarse con las credenciales MySQL correctas.
- Para usar la API, primero debe cargarse `.env` con las variables requeridas.
- Verificar y corregir los errores de transacción en `userController.ts` antes de usar operaciones de escritura.

## 14. Observaciones finales

- La API actúa como wrapper entre un front-end / cliente y los endpoints de Factus.
- También mantiene un micro-módulo básico de usuarios en MySQL.
- Para entenderla rápidamente, enfoque la revisión en: rutas → controladores → modelos → utils.

---

Este documento está listo para entregarse a otro IA como resumen del proyecto.
