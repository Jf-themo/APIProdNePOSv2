import axios from "axios";
import { config } from "dotenv";
import { FactusTokenResponse } from "../types/factus";
import { isAnyEmptyOrNull } from "../utils/authUtils";

config();

const FACTUS_URL = process.env.FACTUS_ENV === "sandbox" 
  ? "https://api-sandbox.factus.com.co" 
  : "https://api.factus.com.co";

interface TokenCache {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

class TokenService {
  private static tokenCache: TokenCache | null = null;
  private static readonly TOKEN_BUFFER_MS = 5 * 60 * 1000;

  private static getEnvCredentials(): { clientId: string; clientSecret: string; username: string; password: string } {
    return {
      clientId: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
      username: process.env.USER || "",
      password: process.env.PASSWORD || ""
    };
  }

  public static isTokenExpiringSoon(): boolean {
    if (!this.tokenCache) return true;
    return Date.now() >= (this.tokenCache.expiresAt - this.TOKEN_BUFFER_MS);
  }

  public static isTokenExpired(): boolean {
    if (!this.tokenCache) return true;
    return Date.now() >= this.tokenCache.expiresAt;
  }

  public static async fetchNewToken(): Promise<string> {
    const credentials = this.getEnvCredentials();

    if (isAnyEmptyOrNull()) {
      throw new Error("Credenciales de entorno no configuradas");
    }

    const response = await axios.post<FactusTokenResponse>(
      `${FACTUS_URL}/oauth/token`,
      {
        grant_type: "password",
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        username: credentials.username,
        password: credentials.password
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const expiresIn = response.data.expires_in * 1000;
    const expiresAt = Date.now() + expiresIn;

    this.tokenCache = {
      token: response.data.access_token,
      expiresAt,
      refreshToken: response.data.refresh_token
    };

    console.log(`[TokenService] Nuevo token obtenido. Expira en ${Math.round(expiresIn / 1000 / 60)} minutos`);

    return this.tokenCache.token;
  }

  public static async getValidToken(): Promise<string> {
    if (this.tokenCache && !this.isTokenExpiringSoon()) {
      console.log("[TokenService] Usando token en cache");
      return this.tokenCache.token;
    }

    if (this.tokenCache?.refreshToken) {
      try {
        console.log("[TokenService] Intentando refresh token...");
        const newToken = await this.refreshToken();
        return newToken;
      } catch (error) {
        console.log("[TokenService] Refresh falló, obtiendo nuevo token");
      }
    }

    return this.fetchNewToken();
  }

  public static async refreshToken(): Promise<string> {
    if (!this.tokenCache?.refreshToken) {
      throw new Error("No hay refresh token disponible");
    }

    const credentials = this.getEnvCredentials();

    try {
      const response = await axios.post<FactusTokenResponse>(
        `${FACTUS_URL}/oauth/token`,
        {
          grant_type: "refresh_token",
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          refresh_token: this.tokenCache.refreshToken
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const expiresIn = response.data.expires_in * 1000;
      const expiresAt = Date.now() + expiresIn;

      this.tokenCache = {
        token: response.data.access_token,
        expiresAt,
        refreshToken: response.data.refresh_token
      };

      console.log("[TokenService] Token refrescado exitosamente");

      return this.tokenCache.token;
    } catch (error) {
      console.error("[TokenService] Error al refresh token:", error);
      throw error;
    }
  }

  public static clearToken(): void {
    this.tokenCache = null;
    console.log("[TokenService] Token cache limpiado");
  }

  public static getTokenInfo(): { hasToken: boolean; expiresAt?: number; isExpired: boolean } {
    if (!this.tokenCache) {
      return { hasToken: false, isExpired: true };
    }
    return {
      hasToken: true,
      expiresAt: this.tokenCache.expiresAt,
      isExpired: this.isTokenExpired()
    };
  }
}

export default TokenService;