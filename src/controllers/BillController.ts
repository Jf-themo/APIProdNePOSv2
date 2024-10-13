import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

const url: string = "https://api-sandbox.factus.com.co";
const token: string =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YzczNGJkNi04MWJkLTRmNjEtODNhNS05ZTc5NDExOGE1NDciLCJqdGkiOiIwMTU5OThiMWM1MjFmNGQ1MjIzYjZkNzg1NDZmYzE3MWYzODJiZjA4NGRkMjgxZjFjODZhNWRjNDAyMjZlYWRlNzA0OWQ1ZjI0NzYzNTc4NiIsImlhdCI6MTcyODc4ODM4My4zODMxMzEsIm5iZiI6MTcyODc4ODM4My4zODMxNDUsImV4cCI6MTcyODc5MTk4My4zNzA4MDEsInN1YiI6IjMiLCJzY29wZXMiOltdfQ.XF90RHSxUwKujqG_HH5vcPeK16dG1rqW5FTbG4s1g3h9etIHsDpi-JMhEOz1OxvPg3_4fKhvZRR7CzoV1btI0dIJN71K2g_Vw2YQJSd78qFraW78V6U4tqJHaVtihD5-HSHP6OWp4_ThOcUMAmQx3IF8zZI86BdETd-r--XufgVSlwWvH2jnNBUMH3Blp8sSPna7ILAH_yWy2Y3KgeB8K8t7eyufFb9_xOGfJcK-YXxKYLaStjotFwuClLOPv_CLcdWGjjxiBytOHW1wO6yhmM66dVXjW-eevavPeHDSV90eup80Hjqh2NujzW58T_fi6wm-wMgEV05otUyMV7RR_3GwjSKMt63BqCvG4PAyzgXwozS8UBFx2Eh7k9H9gjgz9t0vcZF_PJ7PyGDZqp5itDyc5UnV1METS9zLjgn4oBe3B_N_Mltgaj_UoImNb9WuT_Ms9cJcdt-5ZGYZW3E8v_C17NCZvTSfxI7bFRHqPpcnUJs3F5sWdHEh5ejFPvOqCAfhWzR8bEEjpDMFhhZWZpGvpllChTzv4wAp9Gxt-Fz870ks_p4qbvjFf7VWLvzaXc2zurLv9I92kcGbHkspFDA8_qPqxY8F-CxVQCmfMjk5ccRYATL6LNSJ9ZV_-7UcTP3icifU0mYN01Iv2NMVb_rlcAgRJXjhSgYVD1lQd8E";

class BillController {
  /**
   * Servicio para crear una factura.
   *
   * @async
   * @function
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express para enviar los resultados de la solicitud.
   * @returns {Promise<void>} Responde al cliente con el estado de la solicitud.
   *
   *
   * @response {200} Un objeto JSON con la información de la factura creada.
   * @response {500} Error al realizar la solicitud.
   */
  public static async createBill(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const response = await axios.post(
        `${url}/v1/bills/validate`,
        {
          numbering_range_id: body?.numbering_range_id,
          reference_code: body?.reference_code,
          observation: "",
          payment_method_code: "10",
          customer: {
            identification: "123456789",
            dv: "",
            company: "",
            trade_name: "",
            names: "Alan Turing",
            address: "",
            email: "alanturing@enigmasas.com",
            phone: "",
            legal_organization_id: "2",
            tribute_id: "21",
            identification_document_id: "3",
            municipality_id: "980",
          },
          items: [
            {
              code_reference: "12345",
              name: "producto de prueba",
              quantity: 1,
              discount: 8403.36,
              discount_rate: 20,
              price: 50000,
              tax_rate: "19.00",
              unit_measure_id: 70,
              standard_code_id: 1,
              is_excluded: 0,
              tribute_id: 1,
              withholding_taxes: [
                {
                  code: "06",
                  withholding_tax_rate: "7.00",
                },
                {
                  code: "05",
                  withholding_tax_rate: "15.00",
                },
              ],
            },
            {
              code_reference: "54321",
              name: "producto de prueba 2",
              quantity: 1,
              discount: 0,
              discount_rate: 0,
              price: 50000,
              tax_rate: "5.00",
              unit_measure_id: 70,
              standard_code_id: 1,
              is_excluded: 0,
              tribute_id: 1,
              withholding_taxes: [],
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const data = response?.data?.data;
        console.log("DATA SIN TRATAR");
        console.log(data);
        console.log("SALIENDO DATA SIN TRATAR");

        let billCreated = {
          identification_customer: data?.customer?.identification,
          dv_customer: data?.customer?.customer,
          graphic_representation_name_customer:
            data?.customer?.graphic_representation_name,
          trade_name_customer: data?.customer?.trade_name_customer,
          company_customer: data?.customer?.company,
          names_customer: data?.customer?.names,
          address_customer: data?.adress,
          email_customer: data?.customer?.email,
          phone_customer: data?.customer?.phone,
          id_legal_organization: data?.customer?.legal_organization?.id,
          code_legal_organization: data?.customer?.legal_organization?.code,
          name_legal_organization: data?.customer?.legal_organization?.name,
          tribut_customer: data?.customer?.tribut,
          id_municipality_customer: data?.customer?.municipality?.id,
          code_municipality_customer: data?.customer?.municipality?.code,
          name_municipality_customer: data?.customer?.municipality?.name,
          url_logo_compnay: data?.company?.url_logo,
          nit_company: data?.company?.nit,
          dv_company: data?.company?.dv,
          company_compnay: data?.company?.company,
          name_company: data?.company?.name,
          registration_code_company: data?.company?.registration,
          economic_activity_company: data?.company?.economic_activity,
          phone_company: data?.company?.phone,
          email_company: data?.company?.email,
          direction_company: data?.company?.direction,
          municipality_company: data?.company?.municipality,
          prefix_numbering_range: data?.numbering_range?.prefix,
          from_numbering_range: data?.numbering_range?.from,
          to_numbering_range: data?.numbering_range?.to,
          resolution_number_numbering_range:
            data?.numbering_range?.resolution_number,
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
          discount_rate_bill: data?.bill?.discount_rate,
          discount_bill: data?.bill?.discount,
          gross_value_bill: data?.bill?.gross_value,
          taxable_amount_bill: data?.bill?.taxable_amount,
          tax_amount_bill: data?.bill?.tax_amount,
          total_bill: data?.bill?.total,
          observation_bill: data?.bill?.observation,
          errors_bill: data?.bill?.errors,
          created_at_bill: data?.bill?.created_at,
          expires_at_bill: data?.bill?.expires_at,
          qr_image_bill: data?.bill?.qr_image,
          payment_method_code_bill: data?.bill?.payment_method?.code,
          payment_method_name_bill: data?.bill?.payment_method?.name,
          items: data?.items,
          credit_notes: data?.credit_notes,
          debit_notes: data?.debit_notes,
        };

        console.log("DATA TRATADA");
        console.log(billCreated);
        res.status(201).json(billCreated);
      }
    } catch (error: any) {
      // Check if the error has a response from the server
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);

        res.status(error.response.status).json({
          message: "Error from server",
          details: error.response.data,
        });

        // Check if no response was received from the server
      } else if (error.request) {
        console.error("No response received:", error.request);

        res.status(500).json({
          message: "No response from server",
          request: error.request,
        });

        // Handle other types of errors (e.g., setup or coding issues)
      } else {
        console.error("Error", error.message);

        res.status(500).json({
          message: "Request error",
          details: error.message,
        });
      }
    }
  }

  /**
   * Servicio para obtener todas las facturas.
   *
   * @async
   * @function
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express para enviar los resultados de la solicitud.
   * @returns {Promise<void>} Responde al cliente con el estado de la solicitud.
   *
   *
   * @response {200} Un arreglo JSON con la información de las facturas.
   * @response {500} Error al realizar la solicitud.
   */
  public static async getBills(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${url}/v1/bills`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 200) {
        let data = response.data.data.data;
        res.status(200).json(data);
        return;
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  /**
   * Servicio para obtener una factura por su ID.
   *
   * @async
   * @function
   * @param {Request} req - Objeto de solicitud de Express, que contiene el ID de la factura en `req.body`.
   * @param {Response} res - Objeto de respuesta de Express para enviar los resultados de la solicitud.
   * @returns {Promise<void>} Responde al cliente con el estado de la solicitud.
   *
   *
   * @response {400} El campo id es implícitamente falso.
   * @response {200} Objeto JSON con la información de la factura.
   * @response {500} Error al realizar la solicitud.
   */
  public static async getBillById(req: Request, res: Response) {
    const { id } = req.body;
    console.log({ id });

    if (!id) {
      res.status(400).json({
        message: "El campo id es implicitamente falso",
      });
      return;
    }

    try {
      const response = await axios.get(`${url}/v1/bills/show/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let data = response;

      console.log(data);
      if (response.status === 200) {
        res.status(200).json(response.data.data);
        return;
      }
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }
}

export default BillController;
