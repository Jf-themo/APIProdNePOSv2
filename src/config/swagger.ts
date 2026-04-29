// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerJsdoc = require("swagger-jsdoc");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NeoApp API - Factus Integration",
      version: "3.0.0",
      description: "API NeoApp v3 - Integración con Facturación Electrónica Factus.com.co",
      contact: { name: "NeoApp Support", email: "neoappingenieriasas@gmail.com" },
      license: { name: "ISC", url: "https://opensource.org/licenses/ISC" }
    },
    servers: [
      { url: "http://localhost:3000", description: "Development" },
      { url: "https://api.neoapp.com", description: "Production" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerUiOptions = {
  swaggerOptions: {
    urls: [{ url: "/api-docs.json", name: "NeoApp API v3" }]
  },
  customCss: ".swagger-ui .topbar { display: none }"
};