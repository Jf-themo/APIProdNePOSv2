import { z } from "zod";
import { BillItemSchema } from "./bill.validator";

export const CreateCreditNoteRequestSchema = z.object({
  numbering_range_id: z.number().int().positive().optional(),
  correction_concept_code: z.string().min(1, "Código de concepto de corrección requerido"),
  customization_id: z.number().int().optional(),
  bill_id: z.number().int().positive("ID de factura requerido"),
  reference_code: z.string().min(1, "Código de referencia requerido"),
  observation: z.string().max(250).optional().default(""),
  payment_method_code: z.number().int().optional().default(10),
  items: z.array(BillItemSchema).min(1, "Al menos un item requerido")
});

export const CreditNoteIdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID debe ser un número entero positivo")
});

export const GetCreditNotesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.coerce.number().int().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export type CreateCreditNoteRequest = z.infer<typeof CreateCreditNoteRequestSchema>;