import { Request, Response, NextFunction } from "express";
import Logger from "../services/Logger";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Error de validación") {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflicto") {
    super(message, 409, "CONFLICT");
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = (req as any).requestId || "unknown";

  if (err instanceof AppError) {
    Logger.warn(`[${requestId}] Operational Error: ${err.message}`, {
      statusCode: err.statusCode,
      code: err.code,
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      },
      requestId
    });
    return;
  }

  Logger.error(`[${requestId}] Unexpected Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: isProduction ? "Error interno del servidor" : err.message
    },
    requestId
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const requestId = (req as any).requestId || "unknown";

  Logger.warn(`[${requestId}] Route not found: ${req.method} ${req.path}`, {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Ruta ${req.method} ${req.path} no encontrada`
    },
    requestId
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = (req.headers["x-request-id"] as string) || 
    `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  (req as any).requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
};