import { z } from "zod";

export const RejectBillSchema = z.object({
  observation: z.string().max(500, "Observación máximo 500 caracteres").optional().default("")
});

export const AcceptWithClaimsSchema = z.object({
  claim_type: z.number().int().min(1).max(3).optional().default(1),
  claim_description: z.string().max(500, "Descripción máximo 500 caracteres").optional().default("")
});

export type RejectBillRequest = z.infer<typeof RejectBillSchema>;
export type AcceptWithClaimsRequest = z.infer<typeof AcceptWithClaimsSchema>;