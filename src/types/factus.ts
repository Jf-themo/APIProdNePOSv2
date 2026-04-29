export interface FactusTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface FactusSubscription {
  id: number;
  company_id: number;
  plan: string;
  status: string;
  start_date: string;
  end_date?: string;
}

export interface FactusCustomer {
  identification: string;
  dv?: string;
  company?: string;
  trade_name?: string;
  names?: string;
  address?: string;
  email: string;
  phone?: string;
  legal_organization_id: number;
  tribute_id: number;
  identification_document_id: number;
  municipality_id?: number;
}

export interface FactusItem {
  code_reference: string;
  name: string;
  quantity: number;
  discount_rate?: number;
  price: number;
  tax_rate: string;
  unit_measure_id: number;
  standard_code_id: number;
  is_excluded: number;
  tribute_id: number;
  withholding_taxes?: FactusWithholdingTax[];
  note?: string;
  scheme_id?: string;
}

export interface FactusWithholdingTax {
  code: string;
  withholding_tax_rate: number | string;
}

export interface FactusAllowanceCharge {
  concept_type: string;
  is_surcharge: boolean;
  reason: string;
  base_amount: number | string;
  amount: number | string;
}

export interface FactusEstablishment {
  name: string;
  address: string;
  phone_number: string;
  email: string;
  municipality_id: number;
}

export interface FactusOrderReference {
  reference_code: string;
  issue_date?: string;
}

export interface FactusBillingPeriod {
  start_date: string;
  start_time?: string;
  end_date: string;
  end_time?: string;
}

export interface FactusBillRequest {
  numbering_range_id?: number;
  document?: string;
  reference_code: string;
  observation?: string;
  payment_form?: number;
  payment_due_date?: string;
  payment_method_code?: number;
  operation_type?: number;
  order_reference?: FactusOrderReference;
  send_email?: boolean;
  related_documents?: FactusRelatedDocument[];
  billing_period?: FactusBillingPeriod;
  establishment?: FactusEstablishment;
  customer: FactusCustomer;
  items: FactusItem[];
  allowance_charges?: FactusAllowanceCharge[];
}

export interface FactusRelatedDocument {
  code: string;
  issue_date: string;
  number: string;
}

export interface FactusBillResponse {
  status: string;
  message: string;
  data: FactusBillData;
}

export interface FactusBillData {
  company: FactusCompany;
  establishment?: FactusEstablishmentResponse;
  customer: FactusCustomerResponse;
  numbering_range: FactusNumberingRange;
  billing_period: any[];
  bill: FactusBill;
  related_documents: any[];
  items: FactusItemResponse[];
  allowance_charges?: FactusAllowanceChargeResponse[];
  withholding_taxes?: FactusWithholdingTaxResponse[];
  credit_notes: any[];
  debit_notes: any[];
}

export interface FactusCompany {
  url_logo: string;
  nit: string;
  dv: string;
  company: string;
  name: string;
  graphic_representation_name: string;
  registration_code: string;
  economic_activity: string;
  phone: string;
  email: string;
  direction: string;
  municipality: string;
}

export interface FactusEstablishmentResponse {
  name: string;
  address: string;
  phone_number: string;
  email: string;
  municipality_id: {
    id: number;
    code: string;
    name: string;
    department: {
      id: number;
      code: string;
      name: string;
    };
  };
}

export interface FactusCustomerResponse {
  identification: string;
  dv: string | null;
  graphic_representation_name: string;
  trade_name: string;
  company: string;
  names: string;
  address: string;
  email: string;
  phone: string;
  legal_organization: {
    id: number;
    code: string;
    name: string;
  };
  tribute: {
    id: number;
    code: string;
    name: string;
  };
  municipality: {
    id: number;
    code: string;
    name: string;
  };
}

export interface FactusNumberingRange {
  prefix: string;
  from: number;
  to: number;
  resolution_number: string;
  start_date: string;
  end_date: string;
  months: number;
}

export interface FactusBill {
  id: number;
  document: {
    code: string;
    name: string;
  };
  operation_type: {
    code: string;
    name: string;
  };
  order_reference: any;
  number: string;
  reference_code: string;
  status: number;
  send_email: number;
  qr: string;
  cufe: string;
  validated: string;
  gross_value: string;
  taxable_amount: string;
  tax_amount: string;
  discount_amount: string;
  surcharge_amount: string;
  total: string;
  observation: any;
  errors: any[];
  created_at: string;
  payment_due_date: any;
  qr_image: string;
  has_claim: number;
  is_negotiable_instrument: number;
  payment_form: {
    code: string;
    name: string;
  };
  payment_method: {
    code: string;
    name: string;
  };
}

export interface FactusItemResponse {
  scheme_id: any;
  note: any;
  code_reference: string;
  name: string;
  quantity: number;
  discount_rate: string;
  discount: string;
  gross_value: string;
  tax_rate: string;
  taxable_amount: string;
  tax_amount: string;
  price: string;
  is_excluded: number;
  unit_measure: {
    id: number;
    code: string;
    name: string;
  };
  standard_code: {
    id: number;
    code: string;
    name: string;
  };
  tribute: {
    id: number;
    code: string;
    name: string;
  };
  total: number;
  withholding_taxes: FactusWithholdingTaxResponse[];
  mandate: any;
}

export interface FactusAllowanceChargeResponse {
  concept_type: {
    code: string;
    name: string;
  };
  is_surcharge: boolean;
  reason: string;
  base_amount: string;
  percentage: string;
  amount: string;
}

export interface FactusWithholdingTaxResponse {
  tribute_code: string;
  name: string;
  value: string;
  rates?: {
    code: string;
    name: string;
    rate: string;
  }[];
}

export interface FactusCreditNoteRequest {
  numbering_range_id?: number;
  correction_concept_code: string;
  customization_id?: number;
  bill_id: number;
  reference_code: string;
  observation?: string;
  payment_method_code?: number;
  items: FactusItem[];
}

export interface FactusCreditNoteResponse {
  status: string;
  message: string;
  data: any;
}

export interface FactusMunicipality {
  id: number;
  code: string;
  name: string;
  department: {
    id: number;
    code: string;
    name: string;
  };
}

export interface FactusNumberingRangeResponse {
  id: number;
  prefix: string;
  from: number;
  to: number;
  resolution_number: string;
  start_date: string;
  end_date: string;
  months: number;
}

export interface FactusUnitMeasure {
  id: number;
  code: string;
  name: string;
}

export interface FactusTribute {
  id: number;
  code: string;
  name: string;
}