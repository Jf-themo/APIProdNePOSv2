import { z } from "zod";

export const CustomerSchema = z.object({
  identification: z.string().min(1, "Identificación requerida"),
  dv: z.string().optional(),
  company: z.string().optional(),
  trade_name: z.string().optional(),
  names: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  legal_organization_id: z.number().int().positive("ID organización legal requerido"),
  tribute_id: z.number().int().positive("ID tributo requerido"),
  identification_document_id: z.number().int().positive("ID documento identificación requerido"),
  municipality_id: z.number().int().positive().optional()
});

export const BillItemSchema = z.object({
  code_reference: z.string().min(1, "Código de referencia requerido"),
  name: z.string().min(1, "Nombre del producto requerido"),
  quantity: z.number().int().positive("Cantidad debe ser entero positivo"),
  discount_rate: z.number().min(0).max(100).optional().default(0),
  price: z.number().positive("Precio debe ser positivo"),
  tax_rate: z.union([z.string(), z.number()]).optional().default("0"),
  unit_measure_id: z.number().int().positive("ID unidad de medida requerido"),
  standard_code_id: z.number().int().positive("ID código estándar requerido"),
  is_excluded: z.number().int().min(0).max(1).optional().default(0),
  tribute_id: z.number().int().positive("ID tributo requerido"),
  withholding_taxes: z.array(z.object({
    code: z.string(),
    withholding_tax_rate: z.union([z.number(), z.string()])
  })).optional().default([])
});

export const OrderReferenceSchema = z.object({
  reference_code: z.string().min(1),
  issue_date: z.string().optional()
});

export const EstablishmentSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email(),
  municipality_id: z.number().int().positive()
});

export const AllowanceChargeSchema = z.object({
  concept_type: z.string().min(1),
  is_surcharge: z.boolean(),
  reason: z.string().min(1),
  base_amount: z.union([z.number(), z.string()]),
  amount: z.union([z.number(), z.string()])
});

export const CreateBillRequestSchema = z.object({
  numbering_range_id: z.number().int().positive().optional(),
  document: z.string().optional(),
  reference_code: z.string().min(1, "Código de referencia requerido"),
  observation: z.string().max(250, "Observación máximo 250 caracteres").optional().default(""),
  payment_form: z.number().int().optional().default(1),
  payment_due_date: z.string().optional(),
  payment_method_code: z.number().int().optional().default(10),
  operation_type: z.number().int().optional().default(10),
  order_reference: OrderReferenceSchema.optional(),
  send_email: z.boolean().optional().default(true),
  establishment: EstablishmentSchema.optional(),
  customer: CustomerSchema,
  items: z.array(BillItemSchema).min(1, "Al menos un item requerido"),
  allowance_charges: z.array(AllowanceChargeSchema).optional().default([])
});

export const GetBillsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.coerce.number().int().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export const BillIdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID debe ser un número entero positivo")
});

export const DeleteBillSchema = z.object({
  id: z.coerce.number().int().positive("ID requerido"),
  tokenRequest: z.string().optional()
});

export type CreateBillRequest = z.infer<typeof CreateBillRequestSchema>;
export type BillItem = z.infer<typeof BillItemSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Establishment = z.infer<typeof EstablishmentSchema>;
export type AllowanceCharge = z.infer<typeof AllowanceChargeSchema>;