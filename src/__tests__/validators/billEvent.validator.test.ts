import {
  RejectBillSchema,
  AcceptWithClaimsSchema
} from "../../utils/validators/billEvent.validator";

describe("Bill Event Validators", () => {
  describe("RejectBillSchema", () => {
    it("should validate a valid reject request", () => {
      const request = { observation: "Motivo del rechazo" };

      const result = RejectBillSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it("should accept empty observation", () => {
      const request = { observation: "" };

      const result = RejectBillSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it("should use default value when observation is undefined", () => {
      const request = {};

      const result = RejectBillSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.observation).toBe("");
      }
    });

    it("should fail when observation exceeds max length", () => {
      const request = { observation: "a".repeat(501) };

      const result = RejectBillSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });

  describe("AcceptWithClaimsSchema", () => {
    it("should validate a valid accept with claims request", () => {
      const request = { claim_type: 1, claim_description: "Producto dañado" };

      const result = AcceptWithClaimsSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it("should accept default values", () => {
      const request = {};

      const result = AcceptWithClaimsSchema.safeParse(request);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.claim_type).toBe(1);
        expect(result.data.claim_description).toBe("");
      }
    });

    it("should accept all valid claim types", () => {
      [1, 2, 3].forEach((claimType) => {
        const request = { claim_type: claimType };
        const result = AcceptWithClaimsSchema.safeParse(request);
        expect(result.success).toBe(true);
      });
    });

    it("should fail for invalid claim type", () => {
      const request = { claim_type: 0 };

      const result = AcceptWithClaimsSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it("should fail for claim_type > 3", () => {
      const request = { claim_type: 4 };

      const result = AcceptWithClaimsSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it("should fail when description exceeds max length", () => {
      const request = { claim_description: "a".repeat(501) };

      const result = AcceptWithClaimsSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });
});