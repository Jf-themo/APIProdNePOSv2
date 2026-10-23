import winston from "winston";
import path from "path";

const logDir = process.env.LOG_DIR || "logs";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(metadata).length > 0) {
      log += ` | ${JSON.stringify(metadata)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(metadata).length > 0) {
      log += ` ${JSON.stringify(metadata)}`;
    }
    
    return log;
  })
);

class Logger {
  private static instance: winston.Logger;
  private static environment: string = process.env.NODE_ENV || "development";

  private static createLogger(): winston.Logger {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: consoleFormat,
        level: Logger.environment === "production" ? "info" : "debug"
      })
    ];

    const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

    if (Logger.environment !== "test" && !isServerless) {
      transports.push(
        new winston.transports.File({
          filename: path.join(logDir, "error.log"),
          level: "error",
          format: logFormat,
          maxsize: 5242880,
          maxFiles: 5
        }),
        new winston.transports.File({
          filename: path.join(logDir, "combined.log"),
          format: logFormat,
          maxsize: 5242880,
          maxFiles: 5
        })
      );
    }

    return winston.createLogger({
      level: Logger.environment === "production" ? "info" : "debug",
      format: logFormat,
      transports,
      exitOnError: false
    });
  }

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      Logger.instance = Logger.createLogger();
    }
    return Logger.instance;
  }

  public static setLevel(level: string): void {
    if (Logger.instance) {
      Logger.instance.level = level;
    }
  }

  public static child(meta: Record<string, any>): winston.Logger {
    return Logger.getInstance().child(meta);
  }

  public static debug(message: string, meta?: Record<string, any>): void {
    Logger.getInstance().debug(message, meta);
  }

  public static info(message: string, meta?: Record<string, any>): void {
    Logger.getInstance().info(message, meta);
  }

  public static warn(message: string, meta?: Record<string, any>): void {
    Logger.getInstance().warn(message, meta);
  }

  public static error(message: string, meta?: Record<string, any>): void {
    Logger.getInstance().error(message, meta);
  }

  public static http(message: string, meta?: Record<string, any>): void {
    Logger.getInstance().http(message, meta);
  }
}

export default Logger;