import { Request, Response, NextFunction } from "express";

export interface ApiVersionConfig {
  version: string;
  deprecationDate?: string;
  sunsetDate?: string;
  features: string[];
}

const API_VERSIONS: Record<string, ApiVersionConfig> = {
  v1: {
    version: "v1",
    features: [
      "Basic bill operations",
      "Credit notes",
      "Token management (hardcoded tokens)"
    ]
  },
  v2: {
    version: "v2",
    features: [
      "TokenService with cache",
      "Zod validation",
      "Reference data caching"
    ]
  },
  v3: {
    version: "v3",
    features: [
      "Winston logging",
      "Centralized error handling",
      "Health checks",
      "Delete bill by reference",
      "Bill events (accept/reject)",
      "Email integration"
    ]
  }
};

export const apiVersionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const path = req.path;
  
  if (path.startsWith("/v1") || path.startsWith("/v2") || path.startsWith("/v3")) {
    const version = path.split("/")[1];
    (req as any).apiVersion = version;
    
    const versionInfo = API_VERSIONS[version];
    if (versionInfo) {
      res.setHeader("X-API-Version", version);
      res.setHeader("X-API-Features", versionInfo.features.join(", "));
    }
  }
  
  next();
};

export const getVersionInfo = (version: string): ApiVersionConfig | undefined => {
  return API_VERSIONS[version];
};

export const getAllVersions = (): ApiVersionConfig[] => {
  return Object.values(API_VERSIONS);
};

export const getLatestVersion = (): string => {
  return "v3";
};

export class VersionNotSupportedError extends Error {
  public readonly supportedVersions: string[];
  
  constructor(requestedVersion: string, supported: string[]) {
    super(`API version '${requestedVersion}' not supported. Supported: ${supported.join(", ")}`);
    this.name = "VersionNotSupportedError";
    this.supportedVersions = supported;
  }
}