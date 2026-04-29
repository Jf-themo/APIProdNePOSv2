import { Request, Response } from "express";
import TokenService from "../services/TokenService";
import ReferenceDataService from "../services/ReferenceDataService";

const APP_VERSION = process.env.APP_VERSION || "1.0.0";

class HealthController {
  private static startTime: number = Date.now();

  public static check(req: Request, res: Response): void {
    const uptime = Math.floor((Date.now() - HealthController.startTime) / 1000);
    const memoryUsage = process.memoryUsage();

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: `${uptime}s`,
      version: APP_VERSION,
      environment: process.env.NODE_ENV || "development",
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      services: {
        token: HealthController.checkTokenService(),
        cache: HealthController.checkCache()
      }
    };

    const allHealthy = Object.values(health.services).every(s => s.status === "ok");

    res.status(allHealthy ? 200 : 503).json(health);
  }

  public static simple(req: Request, res: Response): void {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString() 
    });
  }

  public static ready(req: Request, res: Response): void {
    const checks = {
      tokenService: HealthController.checkTokenService(),
      cache: HealthController.checkCache()
    };

    const allReady = Object.values(checks).every(c => c.status === "ok");

    res.status(allReady ? 200 : 503).json({
      status: allReady ? "ready" : "not_ready",
      checks
    });
  }

  public static detailed(req: Request, res: Response): void {
    const uptime = Math.floor((Date.now() - HealthController.startTime) / 1000);
    const memoryUsage = process.memoryUsage();

    const detailed = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      application: {
        name: "NeoApp API",
version: APP_VERSION,
        environment: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        uptime: `${uptime}s`
      },
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        arrayBuffers: memoryUsage.arrayBuffers ? Math.round(memoryUsage.arrayBuffers / 1024 / 1024) : null
      },
      services: {
        token: HealthController.checkTokenService(),
        cache: HealthController.checkCache()
      },
      environment: {
        port: process.env.PORT || 3000,
        factusEnv: process.env.FACTUS_ENV || "sandbox",
        hasDbConfig: !!(process.env.DB_HOST)
      }
    };

    const allHealthy = Object.values(detailed.services).every(s => s.status === "ok");

    res.status(allHealthy ? 200 : 503).json(detailed);
  }

  private static checkTokenService(): { status: string; message?: string } {
    try {
      const tokenInfo = TokenService.getTokenInfo();
      if (tokenInfo.hasToken) {
        return {
          status: tokenInfo.isExpired ? "warning" : "ok",
          message: tokenInfo.isExpired ? "Token expirado" : "Token activo"
        };
      }
      return { status: "ok", message: "Sin token (se obtendrá bajo demanda)" };
    } catch (error) {
      return { status: "error", message: "Error verificando token" };
    }
  }

  private static checkCache(): { status: string; entries?: number } {
    try {
      const cacheInfo = ReferenceDataService.getCacheInfo();
      const validEntries = cacheInfo.filter(e => e.isValid).length;
      return {
        status: validEntries > 0 ? "ok" : "empty",
        entries: cacheInfo.length
      };
    } catch (error) {
      return { status: "error" };
    }
  }
}

export default HealthController;