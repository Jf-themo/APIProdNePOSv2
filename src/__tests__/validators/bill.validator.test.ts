import {
  CreateBillRequestSchema,
  CustomerSchema,
  BillItemSchema,
  GetBillsQuerySchema,
  BillIdParamSchema
} from "../../utils/validators/bill.validator";

describe("Bill Validators", () => {
  describe("CustomerSchema", () => {
    it("should validate a valid customer", () => {
      const customer = {
        identification: "123456789",
        legal_organization_id: 2,
        tribute_id: 21,
        identification_document_id: 1
      };

      const result = CustomerSchema.safeParse(customer);
      expect(result.success).toBe(true);
    });

    it("should fail when identification is missing", () => {
      const customer = {
        legal_organization_id: 2,
        tribute_id: 21,
        identification_document_id: 1
      };

      const result = CustomerSchema.safeParse(customer);
      expect(result.success).toBe(false);
    });

    it("should fail when legal_organization_id is invalid", () => {
      const customer = {
        identification: "123456789",
        legal_organization_id: -1,
        tribute_id: 21,
        identification_document_id: 1
      };

      const result = CustomerSchema.safeParse(customer);
      expect(result.success).toBe(false);
    });

    it("should validate optional email field", () => {
      const customer = {
        identification: "123456789",
        email: "invalid-email",
        legal_organization_id: 2,
        tribute_id: 21,
        identification_document_id: 1
      };

      const result = CustomerSchema.safeParse(customer);
      expect(result.success).toBe(false);
    });

    it("should accept valid email", () => {
      const customer = {
        identification: "123456789",
        email: "test@example.com",
        legal_organization_id: 2,
        tribute_id: 21,
        identification_document_id: 1
      };

      const result = CustomerSchema.safeParse(customer);
      expect(result.success).toBe(true);
    });
  });

  describe("BillItemSchema", () => {
    it("should validate a valid item", () => {
      const item = {
        code_reference: "PROD001",
        name: "Producto de prueba",
        quantity: 5,
        price: 100000,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1
      };

      const result = BillItemSchema.safeParse(item);
      expect(result.success).toBe(true);
    });

    it("should fail when quantity is not positive", () => {
      const item = {
        code_reference: "PROD001",
        name: "Producto",
        quantity: -1,
        price: 100000,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1
      };

      const result = BillItemSchema.safeParse(item);
      expect(result.success).toBe(false);
    });

    it("should fail when price is not positive", () => {
      const item = {
        code_reference: "PROD001",
        name: "Producto",
        quantity: 1,
        price: -100,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1
      };

      const result = BillItemSchema.safeParse(item);
      expect(result.success).toBe(false);
    });

    it("should allow optional discount_rate", () => {
      const item = {
        code_reference: "PROD001",
        name: "Producto",
        quantity: 1,
        price: 100000,
        unit_measure_id: 70,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        discount_rate: 10
      };

      const result = BillItemSchema.safeParse(item);
      expect(result.success).toBe(true);
    });
  });

  describe("CreateBillRequestSchema", () => {
    it("should validate a complete bill request", () => {
      const billRequest = {
        reference_code: "REF-001",
        customer: {
          identification: "123456789",
          names: "Juan Pérez",
          email: "juan@example.com",
          legal_organization_id: 2,
          tribute_id: 21,
          identification_document_id: 1
        },
        items: [
          {
            code_reference: "PROD001",
            name: "Producto 1",
            quantity: 2,
            price: 50000,
            unit_measure_id: 70,
            standard_code_id: 1,
            is_excluded: 0,
            tribute_id: 1
          }
        ]
      };

      const result = CreateBillRequestSchema.safeParse(billRequest);
      expect(result.success).toBe(true);
    });

    it("should fail when items array is empty", () => {
      const billRequest = {
        reference_code: "REF-001",
        customer: {
          identification: "123456789",
          legal_organization_id: 2,
          tribute_id: 21,
          identification_document_id: 1
        },
        items: []
      };

      const result = CreateBillRequestSchema.safeParse(billRequest);
      expect(result.success).toBe(false);
    });

    it("should fail when reference_code is missing", () => {
      const billRequest = {
        customer: {
          identification: "123456789",
          legal_organization_id: 2,
          tribute_id: 21,
          identification_document_id: 1
        },
        items: [
          {
            code_reference: "PROD001",
            name: "Producto",
            quantity: 1,
            price: 50000,
            unit_measure_id: 70,
            standard_code_id: 1,
            is_excluded: 0,
            tribute_id: 1
          }
        ]
      };

      const result = CreateBillRequestSchema.safeParse(billRequest);
      expect(result.success).toBe(false);
    });

    it("should accept optional fields", () => {
      const billRequest = {
        reference_code: "REF-001",
        observation: "Observación de prueba",
        payment_method_code: 10,
        numbering_range_id: 1,
        customer: {
          identification: "123456789",
          legal_organization_id: 2,
          tribute_id: 21,
          identification_document_id: 1
        },
        items: [
          {
            code_reference: "PROD001",
            name: "Producto",
            quantity: 1,
            price: 50000,
            unit_measure_id: 70,
            standard_code_id: 1,
            is_excluded: 0,
            tribute_id: 1
          }
        ]
      };

      const result = CreateBillRequestSchema.safeParse(billRequest);
      expect(result.success).toBe(true);
    });
  });

  describe("GetBillsQuerySchema", () => {
    it("should validate default query params", () => {
      const query = {};

      const result = GetBillsQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });

    it("should coerce string numbers to integers", () => {
      const query = { page: "2", limit: "50" };

      const result = GetBillsQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(50);
      }
    });

    it("should accept optional filters", () => {
      const query = { status: "1", start_date: "2024-01-01" };

      const result = GetBillsQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });
  });

  describe("BillIdParamSchema", () => {
    it("should validate numeric id", () => {
      const params = { id: "123" };

      const result = BillIdParamSchema.safeParse(params);
      expect(result.success).toBe(true);
    });

    it("should fail for invalid id", () => {
      const params = { id: "-1" };

      const result = BillIdParamSchema.safeParse(params);
      expect(result.success).toBe(false);
    });
  });
});