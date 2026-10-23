import { Request, Response, NextFunction } from "express";
import { validateBody, validateParams, validateQuery } from "../../middleware/validation";
import { z } from "zod";

describe("Validation Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      body: {},
      params: {},
      query: {}
    };
    
    mockResponse = {
      status: statusMock,
      json: jsonMock
    };
    
    mockNext = jest.fn();
  });

  describe("validateBody", () => {
    const TestSchema = z.object({
      name: z.string().min(1),
      age: z.number().positive()
    });

    it("should call next() when validation passes", () => {
      mockRequest.body = { name: "Test", age: 25 };
      const middleware = validateBody(TestSchema);
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it("should return 400 when validation fails", () => {
      mockRequest.body = { name: "" };
      const middleware = validateBody(TestSchema);
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Validation failed"
        })
      );
    });

    it("should return proper error format with path and message", () => {
      mockRequest.body = { age: -5 };
      const middleware = validateBody(TestSchema);
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({
              path: expect.any(String),
              message: expect.any(String)
            })
          ])
        })
      );
    });
  });

  describe("validateParams", () => {
    const ParamsSchema = z.object({
      id: z.coerce.number().int().positive()
    });

    it("should call next() when params are valid", () => {
      mockRequest.params = { id: "123" };
      const middleware = validateParams(ParamsSchema);
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 400 when params are invalid", () => {
      mockRequest.params = { id: "-1" };
      const middleware = validateParams(ParamsSchema);
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });

  describe("validateQuery", () => {
    const QuerySchema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20)
    });

    it("should call next() when query is valid", () => {
      mockRequest.query = { page: "2" };
      const middleware = validateQuery(QuerySchema);
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 400 when query is invalid", () => {
      mockRequest.query = { page: "-1" };
      const middleware = validateQuery(QuerySchema);
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it("should apply default values", () => {
      mockRequest.query = {};
      const middleware = validateQuery(QuerySchema);
      
      middleware(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });
  });
});