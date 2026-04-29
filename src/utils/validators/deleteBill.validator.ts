import { z } from "zod";

export const DeleteBillByReferenceSchema = z.object({
  reference_code: z.string().trim().min(1, "Código de referencia requerido")
});

export type DeleteBillByReferenceRequest = z.infer<typeof DeleteBillByReferenceSchema>;