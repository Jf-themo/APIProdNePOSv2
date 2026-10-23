import ReferenceDataService from "../../services/ReferenceDataService";
import axios from "axios";
import TokenService from "../../services/TokenService";

jest.mock("axios");
jest.mock("../../services/TokenService");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockTokenService = TokenService as jest.Mocked<typeof TokenService>;

describe("ReferenceDataService", () => {
  beforeEach(() => {
    ReferenceDataService.clearCache();
    jest.clearAllMocks();
    (mockTokenService.getValidToken as jest.Mock).mockResolvedValue("test_token_123");
  });

  describe("getMunicipalities", () => {
    it("should fetch municipalities from API when cache is empty", async () => {
      const mockMunicipalities = [
        { id: 1, code: "001", name: "Municipio 1", department: { id: 1, code: "01", name: "Depto 1" } },
        { id: 2, code: "002", name: "Municipio 2", department: { id: 1, code: "01", name: "Depto 1" } }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockMunicipalities } }
      });

      const result = await ReferenceDataService.getMunicipalities();

      expect(result).toEqual(mockMunicipalities);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/municipalities"),
        expect.any(Object)
      );
    });

    it("should return cached data when available", async () => {
      const mockMunicipalities = [
        { id: 1, code: "001", name: "Municipio 1", department: { id: 1, code: "01", name: "Depto 1" } }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockMunicipalities } }
      });

      await ReferenceDataService.getMunicipalities();
      const result = await ReferenceDataService.getMunicipalities();

      expect(result).toEqual(mockMunicipalities);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("should force refresh when requested", async () => {
      const mockMunicipalities = [
        { id: 1, code: "001", name: "Municipio 1" }
      ];

      mockedAxios.get.mockResolvedValue({
        data: { data: { data: mockMunicipalities } }
      });

      await ReferenceDataService.getMunicipalities();
      await ReferenceDataService.getMunicipalities(true);

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  describe("getNumberingRanges", () => {
    it("should fetch numbering ranges from API", async () => {
      const mockRanges = [
        { id: 1, prefix: "FAC", from: 1, to: 1000, resolution_number: "123", start_date: "2024-01-01", end_date: "2025-01-01", months: 12 }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockRanges } }
      });

      const result = await ReferenceDataService.getNumberingRanges();

      expect(result).toEqual(mockRanges);
    });

    it("should return cached data when available", async () => {
      const mockRanges = [{ id: 1, prefix: "FAC", from: 1, to: 1000 }];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockRanges } }
      });

      await ReferenceDataService.getNumberingRanges();
      const result = await ReferenceDataService.getNumberingRanges();

      expect(result).toEqual(mockRanges);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUnitsOfMeasure", () => {
    it("should fetch units of measure from API", async () => {
      const mockUnits = [
        { id: 70, code: "94", name: "Unidad" },
        { id: 71, code: "EA", name: "Unidad" }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockUnits } }
      });

      const result = await ReferenceDataService.getUnitsOfMeasure();

      expect(result).toEqual(mockUnits);
    });
  });

  describe("getTributes", () => {
    it("should fetch tributes from API", async () => {
      const mockTributes = [
        { id: 1, code: "01", name: "IVA" },
        { id: 2, code: "02", name: "IC" }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockTributes } }
      });

      const result = await ReferenceDataService.getTributes();

      expect(result).toEqual(mockTributes);
    });
  });

  describe("getNumberingRangeById", () => {
    it("should return specific range by id", async () => {
      const mockRanges = [
        { id: 1, prefix: "FAC", from: 1, to: 1000 },
        { id: 2, prefix: "NCR", from: 1, to: 500 }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockRanges } }
      });

      const result = await ReferenceDataService.getNumberingRangeById(2);

      expect(result).toEqual({ id: 2, prefix: "NCR", from: 1, to: 500 });
    });

    it("should return null for non-existent id", async () => {
      const mockRanges = [{ id: 1, prefix: "FAC" }];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockRanges } }
      });

      const result = await ReferenceDataService.getNumberingRangeById(999);

      expect(result).toBeNull();
    });
  });

  describe("clearCache", () => {
    it("should clear all cache entries", async () => {
      const mockMunicipalities = [{ id: 1, name: "Municipio 1" }];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockMunicipalities } }
      });

      await ReferenceDataService.getMunicipalities();
      ReferenceDataService.clearCache();

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockMunicipalities } }
      });

      await ReferenceDataService.getMunicipalities();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  describe("getCacheInfo", () => {
    it("should return cache entries info", async () => {
      const mockMunicipalities = [{ id: 1, name: "Municipio 1" }];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockMunicipalities } }
      });

      await ReferenceDataService.getMunicipalities();
      const info = ReferenceDataService.getCacheInfo();

      expect(info.length).toBeGreaterThan(0);
      expect(info[0]).toHaveProperty("key");
      expect(info[0]).toHaveProperty("expiresAt");
      expect(info[0]).toHaveProperty("isValid");
    });
  });

  describe("getCountries", () => {
    it("should fetch countries from API", async () => {
      const mockCountries = [
        { id: 1, code: "CO", name: "Colombia" }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: { data: mockCountries } }
      });

      const result = await ReferenceDataService.getCountries();

      expect(result).toEqual(mockCountries);
    });
  });

  describe("getReferenceTables", () => {
    it("should fetch reference tables from API", async () => {
      const mockTables = {
        document_types: [{ code: "01", name: "Factura" }],
        payment_methods: [{ code: "10", name: "Efectivo" }]
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockTables }
      });

      const result = await ReferenceDataService.getReferenceTables();

      expect(result).toEqual(mockTables);
    });
  });
});