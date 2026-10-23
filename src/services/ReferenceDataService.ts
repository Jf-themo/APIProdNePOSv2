import axios from "axios";
import TokenService from "./TokenService";
import {
  FactusMunicipality,
  FactusNumberingRangeResponse,
  FactusUnitMeasure,
  FactusTribute
} from "../types/factus";

const FACTUS_URL = process.env.FACTUS_ENV === "sandbox"
  ? "https://api-sandbox.factus.com.co"
  : "https://api.factus.com.co";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ReferenceDataService {
  private static cache: Map<string, CacheEntry<any>> = new Map();
  private static readonly DEFAULT_TTL_MS = 60 * 60 * 1000;
  private static readonly SHORT_TTL_MS = 5 * 60 * 1000;

  private static isCacheValid(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() < entry.expiresAt;
  }

  private static setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL_MS): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
  }

  private static getCache<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data as T | null;
    }
    return null;
  }

  public static clearCache(): void {
    this.cache.clear();
    console.log("[ReferenceDataService] Cache limpiado");
  }

  public static clearSpecificCache(key: string): void {
    this.cache.delete(key);
  }

  public static async getMunicipalities(forceRefresh: boolean = false): Promise<FactusMunicipality[]> {
    const cacheKey = "municipalities";
    
    if (!forceRefresh) {
      const cached = this.getCache<FactusMunicipality[]>(cacheKey);
      if (cached) {
        console.log("[ReferenceDataService] Usando municipios en cache");
        return cached;
      }
    }

    const token = await TokenService.getValidToken();

    const response = await axios.get<{ data: { data: FactusMunicipality[] } }>(
      `${FACTUS_URL}/v1/municipalities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const municipalities = response.data.data.data;
    this.setCache(cacheKey, municipalities, this.DEFAULT_TTL_MS);
    
    console.log(`[ReferenceDataService] ${municipalities.length} municipios cacheados`);
    return municipalities;
  }

  public static async getNumberingRanges(forceRefresh: boolean = false): Promise<FactusNumberingRangeResponse[]> {
    const cacheKey = "numbering_ranges";
    
    if (!forceRefresh) {
      const cached = this.getCache<FactusNumberingRangeResponse[]>(cacheKey);
      if (cached) {
        console.log("[ReferenceDataService] Usando rangos de numeración en cache");
        return cached;
      }
    }

    const token = await TokenService.getValidToken();

    const response = await axios.get<{ data: { data: FactusNumberingRangeResponse[] } }>(
      `${FACTUS_URL}/v1/numbering-ranges`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const ranges = response.data.data.data;
    this.setCache(cacheKey, ranges, this.DEFAULT_TTL_MS);
    
    console.log(`[ReferenceDataService] ${ranges.length} rangos de numeración cacheados`);
    return ranges;
  }

  public static async getNumberingRangeById(id: number, forceRefresh: boolean = false): Promise<FactusNumberingRangeResponse | null> {
    const allRanges = await this.getNumberingRanges(forceRefresh);
    return allRanges.find(r => r.id === id) || null;
  }

  public static async getUnitsOfMeasure(forceRefresh: boolean = false): Promise<FactusUnitMeasure[]> {
    const cacheKey = "units_of_measure";
    
    if (!forceRefresh) {
      const cached = this.getCache<FactusUnitMeasure[]>(cacheKey);
      if (cached) {
        console.log("[ReferenceDataService] Usando unidades de medida en cache");
        return cached;
      }
    }

    const token = await TokenService.getValidToken();

    const response = await axios.get<{ data: { data: FactusUnitMeasure[] } }>(
      `${FACTUS_URL}/v1/units`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const units = response.data.data.data;
    this.setCache(cacheKey, units, this.DEFAULT_TTL_MS);
    
    console.log(`[ReferenceDataService] ${units.length} unidades de medida cacheadas`);
    return units;
  }

  public static async getTributes(forceRefresh: boolean = false): Promise<FactusTribute[]> {
    const cacheKey = "tributes";
    
    if (!forceRefresh) {
      const cached = this.getCache<FactusTribute[]>(cacheKey);
      if (cached) {
        console.log("[ReferenceDataService] Usando tributos en cache");
        return cached;
      }
    }

    const token = await TokenService.getValidToken();

    const response = await axios.get<{ data: { data: FactusTribute[] } }>(
      `${FACTUS_URL}/v1/tributes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const tributes = response.data.data.data;
    this.setCache(cacheKey, tributes, this.DEFAULT_TTL_MS);
    
    console.log(`[ReferenceDataService] ${tributes.length} tributos cacheados`);
    return tributes;
  }

  public static async getCountries(forceRefresh: boolean = false): Promise<any[]> {
    const cacheKey = "countries";
    
    if (!forceRefresh) {
      const cached = this.getCache<any[]>(cacheKey);
      if (cached) {
        console.log("[ReferenceDataService] Usando países en cache");
        return cached;
      }
    }

    const token = await TokenService.getValidToken();

    const response = await axios.get(
      `${FACTUS_URL}/v1/countries`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const countries = response.data.data.data;
    this.setCache(cacheKey, countries, this.DEFAULT_TTL_MS);
    
    console.log(`[ReferenceDataService] ${countries.length} países cacheados`);
    return countries;
  }

  public static async getReferenceTables(forceRefresh: boolean = false): Promise<any> {
    const cacheKey = "reference_tables";
    
    if (!forceRefresh) {
      const cached = this.getCache<any>(cacheKey);
      if (cached) {
        console.log("[ReferenceDataService] Usando tablas de referencia en cache");
        return cached;
      }
    }

    const token = await TokenService.getValidToken();

    const response = await axios.get(
      `${FACTUS_URL}/v1/tables`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const tables = response.data.data;
    this.setCache(cacheKey, tables, this.DEFAULT_TTL_MS);
    
    console.log("[ReferenceDataService] Tablas de referencia cacheadas");
    return tables;
  }

  public static getCacheInfo(): { key: string; expiresAt: number; isValid: boolean }[] {
    const info: { key: string; expiresAt: number; isValid: boolean }[] = [];
    
    this.cache.forEach((entry, key) => {
      info.push({
        key,
        expiresAt: entry.expiresAt,
        isValid: Date.now() < entry.expiresAt
      });
    });
    
    return info;
  }
}

export default ReferenceDataService;