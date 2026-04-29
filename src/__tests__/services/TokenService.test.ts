import axios from "axios";
import TokenService from "../../services/TokenService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("TokenService", () => {
  beforeEach(() => {
    TokenService.clearToken();
    jest.clearAllMocks();
  });

  describe("getValidToken", () => {
    it("should return a valid token when none exists", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          access_token: "test_access_token_123",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "test_refresh_token_456"
        }
      });

      const token = await TokenService.getValidToken();

      expect(token).toBe("test_access_token_123");
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api-sandbox.factus.com.co/oauth/token",
        expect.objectContaining({
          grant_type: "password",
          client_id: "test_client_id",
          client_secret: "test_client_secret"
        }),
        expect.any(Object)
      );
    });

    it("should return cached token if not expiring soon", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          access_token: "first_token",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "refresh_token"
        }
      });

      const firstToken = await TokenService.getValidToken();
      const secondToken = await TokenService.getValidToken();

      expect(firstToken).toBe(secondToken);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("should fetch new token when expired", async () => {
      mockedAxios.post
        .mockResolvedValueOnce({
          data: {
            access_token: "expired_token",
            token_type: "Bearer",
            expires_in: 0,
            refresh_token: "refresh_token"
          }
        })
        .mockResolvedValueOnce({
          data: {
            access_token: "new_token",
            token_type: "Bearer",
            expires_in: 3600,
            refresh_token: "new_refresh_token"
          }
        });

      const firstToken = await TokenService.getValidToken();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const secondToken = await TokenService.getValidToken();

      expect(firstToken).toBe("expired_token");
      expect(secondToken).toBe("new_token");
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe("getTokenInfo", () => {
    it("should return no token info when cache is empty", () => {
      const info = TokenService.getTokenInfo();

      expect(info.hasToken).toBe(false);
      expect(info.isExpired).toBe(true);
    });

    it("should return token info when token exists", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          access_token: "test_token",
          token_type: "Bearer",
          expires_in: 3600
        }
      });

      await TokenService.getValidToken();
      const info = TokenService.getTokenInfo();

      expect(info.hasToken).toBe(true);
      expect(info.isExpired).toBe(false);
      expect(info.expiresAt).toBeGreaterThan(Date.now());
    });
  });

  describe("clearToken", () => {
    it("should clear the token cache", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          access_token: "test_token",
          token_type: "Bearer",
          expires_in: 3600
        }
      });

      await TokenService.getValidToken();
      TokenService.clearToken();
      const info = TokenService.getTokenInfo();

      expect(info.hasToken).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should throw error when credentials are missing", async () => {
      delete process.env.CLIENT_ID;
      
      await expect(TokenService.getValidToken()).rejects.toThrow(
        "Credenciales de entorno no configuradas"
      );
    });

    it("should handle API errors gracefully", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));

      await expect(TokenService.getValidToken()).rejects.toThrow();
    });
  });
});