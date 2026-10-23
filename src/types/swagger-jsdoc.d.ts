declare module "swagger-jsdoc" {
  interface SwaggerJsdocOptions {
    definition: {
      openapi: string;
      info: {
        title: string;
        version: string;
        description?: string;
        contact?: { name: string; email?: string };
        license?: { name: string; url?: string };
      };
      servers?: { url: string; description?: string }[];
      components?: {
        securitySchemes?: Record<string, any>;
        schemas?: Record<string, any>;
      };
      security?: Array<Record<string, string[]>>;
    };
    apis?: string[];
  }

  function swaggerJsdoc(options: SwaggerJsdocOptions): object;
  export default swaggerJsdoc;
}