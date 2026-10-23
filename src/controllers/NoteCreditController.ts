import { Request, Response } from "express";
import axios from "axios";
import TokenService from "../services/TokenService";
import { validateBody, validateParams, validateQuery } from "../middleware/validation";
import {
  CreateCreditNoteRequestSchema,
  CreditNoteIdParamSchema,
  GetCreditNotesQuerySchema
} from "../utils/validators/creditNote.validator";
import { FactusCreditNoteResponse } from "../types/factus";

const FACTUS_URL = process.env.FACTUS_ENV === "sandbox"
  ? "https://api-sandbox.factus.com.co"
  : "https://api.factus.com.co";

class NoteCreditController {
  public static createNoteCredit = [
    validateBody(CreateCreditNoteRequestSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const body = req.body as any;
        
        const token = await TokenService.getValidToken();

        const payload = {
          numbering_range_id: body.numbering_range_id,
          correction_concept_code: body.correction_concept_code,
          customization_id: body.customization_id || 1,
          bill_id: body.bill_id,
          reference_code: body.reference_code,
          observation: body.observation || "",
          payment_method_code: body.payment_method_code,
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
            withholding_taxes: item.withholding_taxes || []
          }))
        };

        const response = await axios.post<FactusCreditNoteResponse>(
          `${FACTUS_URL}/v1/credit-notes/validate`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          }
        );

        console.log(`[NoteCreditController] Status: ${response.status}`);
        
        const noteCreated = NoteCreditController.mapCreditNoteResponse(response.data);
        
        res.status(response.status).json(noteCreated);
      } catch (error: any) {
        NoteCreditController.handleError(error, res);
      }
    }
  ];

  public static getCreditNotes = [
    validateQuery(GetCreditNotesQuerySchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const token = await TokenService.getValidToken();
        const { page = 1, limit = 20, status, start_date, end_date } = req.query as any;

        let url = `${FACTUS_URL}/v1/credit-notes?page=${page}&limit=${limit}`;
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
        NoteCreditController.handleError(error, res);
      }
    }
  ];

  public static getCreditNoteById = [
    validateParams(CreditNoteIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.get(
          `${FACTUS_URL}/v1/credit-notes/show/${id}`,
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
        NoteCreditController.handleError(error, res);
      }
    }
  ];

  public static deleteCreditNote = [
    validateParams(CreditNoteIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.delete(
          `${FACTUS_URL}/v1/credit-notes/destroy/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200) {
          res.status(200).json({
            message: "Nota de crédito eliminada exitosamente",
            data: response.data
          });
        }
      } catch (error: any) {
        NoteCreditController.handleError(error, res);
      }
    }
  ];

  public static downloadPdf = [
    validateParams(CreditNoteIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.get(
          `${FACTUS_URL}/v1/credit-notes/${id}/pdf`,
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
        NoteCreditController.handleError(error, res);
      }
    }
  ];

  public static downloadXml = [
    validateParams(CreditNoteIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.get(
          `${FACTUS_URL}/v1/credit-notes/${id}/xml`,
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
        NoteCreditController.handleError(error, res);
      }
    }
  ];

  public static sendEmail = [
    validateParams(CreditNoteIdParamSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const token = await TokenService.getValidToken();

        const response = await axios.post(
          `${FACTUS_URL}/v1/credit-notes/${id}/send-email`,
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
        NoteCreditController.handleError(error, res);
      }
    }
  ];

  private static handleError(error: any, res: Response): void {
    console.error("[NoteCreditController] Error:", error.message);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 409) {
        res.status(409).json({
          message: "Nota de crédito pendiente por enviar a la DIAN",
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

  private static mapCreditNoteResponse(data: any): any {
    return {
      status: data.status,
      message: data.message,
      data: data.data
    };
  }
}

export default NoteCreditController;