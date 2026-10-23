import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import Logger from "../services/Logger";

export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  message: (req: Request, res: Response) => {
    Logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      path: req.path,
      method: req.method
    });
    return {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Demasiadas solicitudes. Por favor, intente más tarde."
      }
    };
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    return req.path.startsWith("/health") || req.path.startsWith("/api/versions");
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: (req: Request, res: Response) => {
    Logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    return {
      success: false,
      error: {
        code: "AUTH_RATE_LIMIT_EXCEEDED",
        message: "Demasiados intentos de autenticación. Intente en 15 minutos."
      }
    };
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const billCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: parseInt(process.env.BILL_CREATE_LIMIT || "20", 10),
  message: (req: Request, res: Response) => {
    Logger.warn(`Bill creation rate limit exceeded for IP: ${req.ip}`);
    return {
      success: false,
      error: {
        code: "BILL_CREATE_LIMIT_EXCEEDED",
        message: "Límite de creación de facturas excedido. Intente en un minuto."
      }
    };
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const apiLimiter = {
  general: generalLimiter,
  auth: authLimiter,
  billCreate: billCreateLimiter
};