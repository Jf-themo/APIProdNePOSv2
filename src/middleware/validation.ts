import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          path: err.path.join("."),
          message: err.message
        }));
        return res.status(400).json({
          message: "Validation failed",
          errors
        });
      }
      return res.status(500).json({
        message: "Internal validation error"
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated as Record<string, string>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          path: err.path.join("."),
          message: err.message
        }));
        return res.status(400).json({
          message: "Parameter validation failed",
          errors
        });
      }
      return res.status(500).json({
        message: "Internal validation error"
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as Record<string, string>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          path: err.path.join("."),
          message: err.message
        }));
        return res.status(400).json({
          message: "Query validation failed",
          errors
        });
      }
      return res.status(500).json({
        message: "Internal validation error"
      });
    }
  };
};