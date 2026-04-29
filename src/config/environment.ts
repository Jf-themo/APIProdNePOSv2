export interface AppConfig {
  env: string;
  port: number;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  
  factus: {
    baseUrl: string;
    apiVersion: string;
  };
  
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    authLimit: number;
    billCreateLimit: number;
  };
  
  logging: {
    level: string;
    dir: string;
  };
  
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

const getEnv = (key: string, defaultValue: string = ""): string => {
  return process.env[key] || defaultValue;
};

const getNumEnv = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getBoolEnv = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  return value ? value === "true" : defaultValue;
};

export const config: AppConfig = {
  env: getEnv("NODE_ENV", "development"),
  port: getNumEnv("PORT", 3000),
  isProduction: getEnv("NODE_ENV", "development") === "production",
  isDevelopment: getEnv("NODE_ENV", "development") === "development",
  isTest: getEnv("NODE_ENV", "development") === "test",
  
  factus: {
    baseUrl: getEnv("FACTUS_ENV", "sandbox") === "sandbox"
      ? "https://api-sandbox.factus.com.co"
      : "https://api.factus.com.co",
    apiVersion: "v1"
  },
  
  database: {
    host: getEnv("DB_HOST", "localhost"),
    port: getNumEnv("DB_PORT", 3306),
    user: getEnv("DB_USER", "root"),
    password: getEnv("DB_PASSWORD", ""),
    name: getEnv("DB_NAME", "neoapp")
  },
  
  rateLimit: {
    windowMs: getNumEnv("RATE_LIMIT_WINDOW_MS", 60000),
    maxRequests: getNumEnv("RATE_LIMIT_MAX_REQUESTS", 100),
    authLimit: getNumEnv("RATE_LIMIT_AUTH", 10),
    billCreateLimit: getNumEnv("BILL_CREATE_LIMIT", 20)
  },
  
  logging: {
    level: getEnv("LOG_LEVEL", "debug"),
    dir: getEnv("LOG_DIR", "logs")
  },
  
  cors: {
    origin: getEnv("CORS_ORIGIN", "*"),
    credentials: getBoolEnv("CORS_CREDENTIALS", true)
  }
};

export const validateConfig = (): boolean => {
  const required = [
    "CLIENT_ID",
    "CLIENT_SECRET", 
    "USER",
    "PASSWORD"
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    return false;
  }
  
  return true;
};

export default config;