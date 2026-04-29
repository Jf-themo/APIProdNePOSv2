import { Request, Response } from "express";
import ReferenceDataService from "../services/ReferenceDataService";

class ReferenceController {
  public static async getMunicipalities(req: Request, res: Response): Promise<void> {
    try {
      const forceRefresh = req.query.refresh === "true";
      const municipalities = await ReferenceDataService.getMunicipalities(forceRefresh);
      
      res.status(200).json({
        message: "Municipios obtenidos correctamente",
        count: municipalities.length,
        data: municipalities
      });
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  public static async getNumberingRanges(req: Request, res: Response): Promise<void> {
    try {
      const forceRefresh = req.query.refresh === "true";
      const ranges = await ReferenceDataService.getNumberingRanges(forceRefresh);
      
      res.status(200).json({
        message: "Rangos de numeración obtenidos correctamente",
        count: ranges.length,
        data: ranges
      });
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  public static async getNumberingRangeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const forceRefresh = req.query.refresh === "true";
      const rangeId = parseInt(id, 10);
      
      if (isNaN(rangeId)) {
        res.status(400).json({
          message: "ID inválido"
        });
        return;
      }

      const range = await ReferenceDataService.getNumberingRangeById(rangeId, forceRefresh);
      
      if (!range) {
        res.status(404).json({
          message: "Rango de numeración no encontrado"
        });
        return;
      }

      res.status(200).json({
        message: "Rango de numeración obtenido correctamente",
        data: range
      });
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  public static async getUnitsOfMeasure(req: Request, res: Response): Promise<void> {
    try {
      const forceRefresh = req.query.refresh === "true";
      const units = await ReferenceDataService.getUnitsOfMeasure(forceRefresh);
      
      res.status(200).json({
        message: "Unidades de medida obtenidas correctamente",
        count: units.length,
        data: units
      });
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  public static async getTributes(req: Request, res: Response): Promise<void> {
    try {
      const forceRefresh = req.query.refresh === "true";
      const tributes = await ReferenceDataService.getTributes(forceRefresh);
      
      res.status(200).json({
        message: "Tributos obtenidos correctamente",
        count: tributes.length,
        data: tributes
      });
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  public static async getCountries(req: Request, res: Response): Promise<void> {
    try {
      const forceRefresh = req.query.refresh === "true";
      const countries = await ReferenceDataService.getCountries(forceRefresh);
      
      res.status(200).json({
        message: "Países obtenidos correctamente",
        count: countries.length,
        data: countries
      });
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  public static async getReferenceTables(req: Request, res: Response): Promise<void> {
    try {
      const forceRefresh = req.query.refresh === "true";
      const tables = await ReferenceDataService.getReferenceTables(forceRefresh);
      
      res.status(200).json({
        message: "Tablas de referencia obtenidas correctamente",
        data: tables
      });
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  public static async getCacheInfo(req: Request, res: Response): Promise<void> {
    try {
      const cacheInfo = ReferenceDataService.getCacheInfo();
      
      res.status(200).json({
        message: "Información del cache",
        cacheEntries: cacheInfo.map(entry => ({
          key: entry.key,
          expiresAt: new Date(entry.expiresAt).toISOString(),
          isValid: entry.isValid
        }))
      });
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  public static async clearCache(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.body;
      
      if (key) {
        ReferenceDataService.clearSpecificCache(key);
        res.status(200).json({
          message: `Cache '${key}' limpiado`
        });
      } else {
        ReferenceDataService.clearCache();
        res.status(200).json({
          message: "Todo el cache limpiado"
        });
      }
    } catch (error: any) {
      ReferenceController.handleError(error, res);
    }
  }

  private static handleError(error: any, res: Response): void {
    console.error("[ReferenceController] Error:", error.message);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      res.status(status).json({
        message: "Error desde Factus",
        details: data
      });
    } else if (error.request) {
      res.status(503).json({
        message: "Sin respuesta del servidor Factus",
        details: "Tiempo de espera agotado"
      });
    } else {
      res.status(500).json({
        message: "Error interno",
        details: error.message
      });
    }
  }
}

export default ReferenceController;