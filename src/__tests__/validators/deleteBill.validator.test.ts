import { DeleteBillByReferenceSchema } from "../../utils/validators/deleteBill.validator";

describe("Delete Bill Validators", () => {
  describe("DeleteBillByReferenceSchema", () => {
    it("should validate a valid delete request", () => {
      const request = { reference_code: "FACT-001-2024" };

      const result = DeleteBillByReferenceSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.reference_code).toBe("FACT-001-2024");
      }
    });

    it("should fail when reference_code is missing", () => {
      const request = {};

      const result = DeleteBillByReferenceSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it("should fail when reference_code is empty", () => {
      const request = { reference_code: "" };

      const result = DeleteBillByReferenceSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it("should fail when reference_code is whitespace only", () => {
      const request = { reference_code: "   " };

      const result = DeleteBillByReferenceSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it("should accept various reference code formats", () => {
      const formats = [
        "REF-001",
        "FACT-2024-0001",
        "NC-001",
        "bill_123"
      ];

      formats.forEach(format => {
        const request = { reference_code: format };
        const result = DeleteBillByReferenceSchema.safeParse(request);
        expect(result.success).toBe(true);
      });
    });
  });
});