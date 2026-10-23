import {
  CreateCreditNoteRequestSchema,
  CreditNoteIdParamSchema,
  GetCreditNotesQuerySchema
} from "../../utils/validators/creditNote.validator";

describe("Credit Note Validators", () => {
  describe("CreateCreditNoteRequestSchema", () => {
    it("should validate a valid credit note request", () => {
      const creditNoteRequest = {
        correction_concept_code: "1",
        bill_id: 123,
        reference_code: "NC-001",
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

      const result = CreateCreditNoteRequestSchema.safeParse(creditNoteRequest);
      expect(result.success).toBe(true);
    });

    it("should fail when correction_concept_code is missing", () => {
      const creditNoteRequest = {
        bill_id: 123,
        reference_code: "NC-001",
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

      const result = CreateCreditNoteRequestSchema.safeParse(creditNoteRequest);
      expect(result.success).toBe(false);
    });

    it("should fail when bill_id is missing", () => {
      const creditNoteRequest = {
        correction_concept_code: "1",
        reference_code: "NC-001",
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

      const result = CreateCreditNoteRequestSchema.safeParse(creditNoteRequest);
      expect(result.success).toBe(false);
    });

    it("should fail when items array is empty", () => {
      const creditNoteRequest = {
        correction_concept_code: "1",
        bill_id: 123,
        reference_code: "NC-001",
        items: []
      };

      const result = CreateCreditNoteRequestSchema.safeParse(creditNoteRequest);
      expect(result.success).toBe(false);
    });

    it("should accept optional fields", () => {
      const creditNoteRequest = {
        numbering_range_id: 1,
        correction_concept_code: "1",
        customization_id: 1,
        bill_id: 123,
        reference_code: "NC-001",
        observation: "Nota de crédito por devolución",
        payment_method_code: 10,
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

      const result = CreateCreditNoteRequestSchema.safeParse(creditNoteRequest);
      expect(result.success).toBe(true);
    });

    it("should validate items with withholding_taxes", () => {
      const creditNoteRequest = {
        correction_concept_code: "1",
        bill_id: 123,
        reference_code: "NC-001",
        items: [
          {
            code_reference: "PROD001",
            name: "Producto",
            quantity: 1,
            price: 50000,
            unit_measure_id: 70,
            standard_code_id: 1,
            is_excluded: 0,
            tribute_id: 1,
            withholding_taxes: [
              { code: "06", withholding_tax_rate: 7.0 }
            ]
          }
        ]
      };

      const result = CreateCreditNoteRequestSchema.safeParse(creditNoteRequest);
      expect(result.success).toBe(true);
    });
  });

  describe("CreditNoteIdParamSchema", () => {
    it("should validate numeric id", () => {
      const params = { id: "456" };

      const result = CreditNoteIdParamSchema.safeParse(params);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(456);
      }
    });

    it("should fail for invalid id", () => {
      const params = { id: "0" };

      const result = CreditNoteIdParamSchema.safeParse(params);
      expect(result.success).toBe(false);
    });
  });

  describe("GetCreditNotesQuerySchema", () => {
    it("should validate default query params", () => {
      const query = {};

      const result = GetCreditNotesQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });

    it("should accept optional filters", () => {
      const query = { page: "1", limit: "20", status: "1" };

      const result = GetCreditNotesQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
    });
  });
});