import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import TokenService from "../services/TokenService";
import { validateBody, validateParams, validateQuery } from "../middleware/validation";
import {
  CreateBillRequestSchema,
  GetBillsQuerySchema,
  BillIdParamSchema,
  DeleteBillSchema
} from "../utils/validators/bill.validator";
import { FactusBillResponse, FactusBillData } from "../types/factus";
import { DeleteBillByReferenceSchema } from "../utils/validators/deleteBill.validator";

const FACTUS_URL = process.env.FACTUS_ENV === "sandbox"
  ? "https://api-sandbox.factus.com.co"
  : "https://api.factus.com.co";

class BillController {
  public static createBill = [
    validateBody(CreateBillRequestSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const body = req.body as any;
        
        const token = await TokenService.getValidToken();

        const payload = {
          numbering_range_id: body.numbering_range_id,
          document: body.document || "01",
          reference_code: body.reference_code,
          observation: body.observation || "",
          payment_form: body.payment_form,
          payment_due_date: body.payment_due_date,
          payment_method_code: body.payment_method_code,
          operation_type: body.operation_type,
          order_reference: body.order_reference,
          send_email: body.send_email,
          related_documents: body.related_documents,
          billing_period: body.billing_period,
          establishment: body.establishment,
          customer: {
            identification: body.customer.identification,
            dv: body.customer.dv || "",
            company: body.customer.company || "",
            trade_name: body.customer.trade_name || "",
            names: body.customer.names || "",
            address: body.customer.address || "",
            email: body.customer.email || "",
            phone: body.customer.phone || "",
            legal_organization_id: body.customer.legal_organization_id,
            tribute_id: body.customer.tribute_id,
            identification_document_id: body.customer.identification_document_id,
            municipality_id: body.customer.municipality_id
          },
          items: body.items.map((item: any) => ({
            code_reference: item.code_reference,
            name: item.name,
            quantity: item.quantity,
            discount_rate: item.discount_rate || 0,
            price: item.price,
            tax_rate: String(item.tax_rate || "0"),
            unit_measure_id: item.unit_measure_id,
            standard_code_id: item.standard_code_id,
            is_excluded: item.is_excluded || 0,
            tribute_id: item.tribute_id,
            withholding_taxes: item.withholding_taxes || [],
            note: item.note,
            scheme_id: item.scheme_id
          })),
          allowance_charges: body.allowance_charges || []
        };

        const response = await axios.post<FactusBillResponse>(
          `${FACTUS_URL}/v1/bills/validate`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          }
        );

        if (response.status === 201) {
          const data = response?.data?.data;
          const billCreated = BillController.mapBillResponse(data);
          res.status(201).json(billCreated);
        } else {
          res.status(response.status).json({
            message: "Respuesta inesperada de Factus",
            data: response.data
          });
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static getBills = [
    validateQuery(GetBillsQuerySchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const token = await TokenService.getValidToken();
        const { page = 1, limit = 20, status, start_date, end_date } = req.query as any;

        let url = `${FACTUS_URL}/v1/bills?page=${page}&limit=${limit}`;
        if (status !== undefined) url += `&status=${status}`;
        if (start_date) url += `&start_date=${start_date}`;
        if (end_date) url += `&end_date=${end_date}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 200) {
          res.status(200).json(response.data.data);
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static getBillById = [
    validateParams(BillIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.get(
          `${FACTUS_URL}/v1/bills/show/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200) {
          res.status(200).json(response.data.data);
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static deleteBill = [
    validateBody(DeleteBillSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id, tokenRequest } = req.body;
        const token = tokenRequest || await TokenService.getValidToken();

        const response = await axios.delete(
          `${FACTUS_URL}/v1/bills/destroy/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200) {
          res.status(200).json({
            message: "Factura eliminada exitosamente",
            data: response.data
          });
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static downloadPdf = [
    validateParams(BillIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.get(
          `${FACTUS_URL}/v1/bills/${id}/pdf`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/pdf"
            },
            responseType: "arraybuffer"
          }
        );

        res.setHeader("Content-Type", "application/pdf");
        res.send(response.data);
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static downloadXml = [
    validateParams(BillIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.get(
          `${FACTUS_URL}/v1/bills/${id}/xml`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/xml"
            },
            responseType: "text"
          }
        );

        res.setHeader("Content-Type", "application/xml");
        res.send(response.data);
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static sendEmail = [
    validateParams(BillIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.post(
          `${FACTUS_URL}/v1/bills/${id}/send-email`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200) {
          res.status(200).json({
            message: "Correo enviado exitosamente",
            data: response.data
          });
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static getEmailContent = [
    validateParams(BillIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.get(
          `${FACTUS_URL}/v1/bills/${id}/email-content`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          }
        );

        if (response.status === 200) {
          res.status(200).json({
            message: "Contenido de correo obtenido",
            data: response.data.data
          });
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static acceptBill = [
    validateParams(BillIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.post(
          `${FACTUS_URL}/v1/bills/${id}/accept`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200) {
          res.status(200).json({
            message: "Factura aceptada exitosamente",
            data: response.data
          });
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static rejectBill = [
    validateParams(BillIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const { observation } = req.body;
        const token = await TokenService.getValidToken();

        const response = await axios.post(
          `${FACTUS_URL}/v1/bills/${id}/reject`,
          { observation: observation || "" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200) {
          res.status(200).json({
            message: "Factura rechazada",
            data: response.data
          });
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
  ];

  public static acceptWithClaims = [
    validateParams(BillIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const { claim_type, claim_description } = req.body;
        const token = await TokenService.getValidToken();

        const response = await axios.post(
          `${FACTUS_URL}/v1/bills/${id}/accept-with-claims`,
          {
            claim_type: claim_type || 1,
            claim_description: claim_description || ""
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200) {
          res.status(200).json({
            message: "Factura aceptada con reclamaciones",
            data: response.data
          });
        }
      } catch (error: any) {
        BillController.handleError(error, res);
      }
    }
];

  public static deleteBillByReference = [
    validateBody(DeleteBillByReferenceSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { reference_code } = req.body as any;
        const token = await TokenService.getValidToken();

        const searchResponse = await axios.get(
          `${FACTUS_URL}/v1/bills?reference_code=${reference_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const bills = searchResponse.data?.data?.data || [];
        
        if (bills.length === 0) {
          res.status(404).json({
            message: `No se encontró factura con código de referencia: ${reference_code}`
          });
          return;
        }

        const bill = bills[0];
        
        if (bill.status === 1) {
          res.status(400).json({
            message: "La factura está validada y no puede eliminarse",
            details: {
              bill_id: bill.id,
              number: bill.number,
              reference_code: bill.reference_code,
              status: "validada"
            }
          });
          return;
        }

        const deleteResponse = await axios.delete(
          `${FACTUS_URL}/v1/bills/destroy/reference/${reference_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (deleteResponse.status === 200) {
          res.status(200).json({
            message: `Factura con código de referencia ${reference_code} eliminada exitosamente`,
            data: deleteResponse.data
          });
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          res.status(404).json({
            message: "Factura no encontrada",
            details: error.response.data
          });
        } else {
          BillController.handleError(error, res);
        }
      }
    }
  ];

  private static handleError(error: any, res: Response): void {
    console.error("[BillController] Error:", error.message);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 409) {
        res.status(409).json({
          message: "Factura pendiente por enviar a la DIAN",
          details: data
        });
      } else if (status === 422) {
        res.status(422).json({
          message: "Validación fallida",
          errors: data.errors || data
        });
      } else {
        res.status(status).json({
          message: "Error desde Factus",
          details: data
        });
      }
    } else if (error.request) {
      res.status(503).json({
        message: "Sin respuesta del servidor Factus",
        details: "Tiempo de espera agotado"
      });
    } else {
      res.status(500).json({
        message: "Error interno",
        details: error.message
      });
    }
  }

  private static mapBillResponse(data: FactusBillData): any {
    return {
      identification_customer: data?.customer?.identification,
      dv_customer: data?.customer?.dv,
      graphic_representation_name_customer: data?.customer?.graphic_representation_name,
      trade_name_customer: data?.customer?.trade_name,
      company_customer: data?.customer?.company,
      names_customer: data?.customer?.names,
      address_customer: data?.customer?.address,
      email_customer: data?.customer?.email,
      phone_customer: data?.customer?.phone,
      id_legal_organization: data?.customer?.legal_organization?.id,
      code_legal_organization: data?.customer?.legal_organization?.code,
      name_legal_organization: data?.customer?.legal_organization?.name,
      tribut_customer: data?.customer?.tribute,
      id_municipality_customer: data?.customer?.municipality?.id,
      code_municipality_customer: data?.customer?.municipality?.code,
      name_municipality_customer: data?.customer?.municipality?.name,
      url_logo_company: data?.company?.url_logo,
      nit_company: data?.company?.nit,
      dv_company: data?.company?.dv,
      company_company: data?.company?.company,
      name_company: data?.company?.name,
      registration_code_company: data?.company?.registration_code,
      economic_activity_company: data?.company?.economic_activity,
      phone_company: data?.company?.phone,
      email_company: data?.company?.email,
      direction_company: data?.company?.direction,
      municipality_company: data?.company?.municipality,
      prefix_numbering_range: data?.numbering_range?.prefix,
      from_numbering_range: data?.numbering_range?.from,
      to_numbering_range: data?.numbering_range?.to,
      resolution_number_numbering_range: data?.numbering_range?.resolution_number,
      start_date_numbering_range: data?.numbering_range?.start_date,
      end_date_numbering_range: data?.numbering_range?.end_date,
      months_numbering_range: data?.numbering_range?.months,
      id_bill: data?.bill?.id,
      number_bill: data?.bill?.number,
      reference_code_bill: data?.bill?.reference_code,
      status_bill: data?.bill?.status,
      send_email_bill: data?.bill?.send_email,
      qr_bill: data?.bill?.qr,
      cufe_bill: data?.bill?.cufe,
      validated_bill: data?.bill?.validated,
      discount_rate_bill: data?.bill?.discount_amount,
      discount_bill: data?.bill?.discount_amount,
      gross_value_bill: data?.bill?.gross_value,
      taxable_amount_bill: data?.bill?.taxable_amount,
      tax_amount_bill: data?.bill?.tax_amount,
      total_bill: data?.bill?.total,
      observation_bill: data?.bill?.observation,
      errors_bill: data?.bill?.errors,
      created_at_bill: data?.bill?.created_at,
      expires_at_bill: data?.bill?.payment_due_date,
      qr_image_bill: data?.bill?.qr_image,
      payment_form_code: data?.bill?.payment_form?.code,
      payment_form_name: data?.bill?.payment_form?.name,
      payment_method_code_bill: data?.bill?.payment_method?.code,
      payment_method_name_bill: data?.bill?.payment_method?.name,
      document_code: data?.bill?.document?.code,
      document_name: data?.bill?.document?.name,
      operation_type_code: data?.bill?.operation_type?.code,
      operation_type_name: data?.bill?.operation_type?.name,
      has_claim: data?.bill?.has_claim,
      is_negotiable_instrument: data?.bill?.is_negotiable_instrument,
      items: data?.items,
      allowance_charges: data?.allowance_charges,
      withholding_taxes: data?.withholding_taxes,
      credit_notes: data?.credit_notes,
      debit_notes: data?.debit_notes
    };
  }
}

export default BillController;