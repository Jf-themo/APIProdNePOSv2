import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

// const url: string = "https://api.factus.com.co";
const url: string = "https://api-sandbox.factus.com.co";
const token: string =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YzczNGJkNi04MWJkLTRmNjEtODNhNS05ZTc5NDExOGE1NDciLCJqdGkiOiI0NDViMmNmYjFhMzIwMTE4ODk2NmYxNWJlMzdlY2ZkMWM3YzI2OWIzOWMwYzYzOGQ0MmJkYmE1MTk5ODZiMTVmZDY2ZWU1NzM0YjNlZjhkNyIsImlhdCI6MTcyOTIwNTcxOC42ODIxMDYsIm5iZiI6MTcyOTIwNTcxOC42ODIxMDksImV4cCI6MTcyOTIwOTMxOC42NzIyMjYsInN1YiI6IjMiLCJzY29wZXMiOltdfQ.ntW6Ch6d2pfLxHO7CpIIJFm21YdxV2qQONDRFZ2_nSBlYevNV7nLcfJs4hELJIEIB5u0Q5gw1KYfYjd6TWUpn3HP3EQNBzlIHlPjtM72KlFakZc1F3I9EBdC7Y_DC72FnkxKkk8lzVv3G_7n77qQCwBgWypNIkfQO4PmiMa02JLrSd34s4GFYmujXvpmitTsBuyN6pZoGKDsTDyAL0UJ77ZuaEQ3HtuwH9Nh41SN7HiUIgwhLZDINJwHCZRoEldMy-yNcfoeR9I-2eavb4uEYQOjAQHj4UUMJApkNb3a3Ry0LO1c-4BAXqgbt384ACHgH_w9OT6egjPN71I7i-GvQFbaqwsXWTqy-vO_-VXTu5YGk567oYXy4dp1dksLlmQ_FGB3v4ebyfcqEoqoF75O4LGwHeJ5fb_wbtc5Q2IBWldd8y7O82p7Br6UCkNYQ4ULRjDghnSFCgpNI6xci4UjmOrxMHkUK36DHibkJY6Ylw77KkLMSmZ_ubz1grf7XpLdhp1VqQGbaBb9AX4v4CkwNOZt9kcO_GxO-FMHnmZODX-cW5pkvb6uw5jzCXpuRCxm1B9z82YI7AEI_dYfA2-cEwPIiDcl5Z5OycC5yzPTRAR8l80LMSAsG6cu0plCYAKsH14y1r-12LGwwkfLZAAhdJTp-csIVCbu7ofZMfC4fUs";
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
    console.log("ENTRE");
    try {
      const body = req.body;
      console.log("Este es mi body");
      console.log(body[0]);

      //Client data
      let client = {
        name: body[0]?.names,
        identfication: body[0]?.identification,
        identification_document_id: body[0]?.identification_document_id,
        email: body[0]?.email,
        municipality_id: body[0].municipality_id,
      };

      //acces token
      let token = body[0]?.token;
      console.log({ esteEsMiToque: token });

      //reference code
      let reference_code = body[0]?.reference_code;
      let legal_organization_id = body[0]?.legal_organization_id;

      //product list
      let products = body.map((item: any) => ({
        code_reference: item?.code_reference,
        name: item?.name,
        quantity: item?.quantity,
        // discount: "0.0",
        discount: item?.discount,
        discount_rate: item?.discount_rate,
        price: item?.price,
        tax_rate: 19.0,
        // tax_rate: item.tax_rate,
        unit_measure_id: item?.unit_measure_id,
        standard_code_id: item?.standard_code_id,
        is_excluded: item?.is_excluded,
        tribute_id: 1,
        withholding_taxes: [],
        // precio: item?.precio,
      }));

      // console.log({ client });
      // console.log({ token });
      // console.log({ products });
      // console.log({ reference_code });
      // console.log({ legal_organization_id });

      const response = await axios.post(
        `${url}/v1/bills/validate`,
        {
          numbering_range_id: [],
          reference_code: reference_code,
          observation: "",
          payment_method_code: "10",
          customer: {
            identification: client.identfication,
            dv: "",
            company: "",
            trade_name: "",
            names: client.name,
            address: "",
            email: client.email,
            phone: "",
            legal_organization_id: "2",
            tribute_id: "21",
            identification_document_id: client.identification_document_id,
            municipality_id: client.municipality_id,
          },
          // items: [
          //   {
          //     code_reference: "12345",
          //     name: "producto de prueba",
          //     quantity: 1,
          //     discount: 8403.36,
          //     discount_rate: 20,
          //     price: 50000,
          //     tax_rate: "19.00",
          //     unit_measure_id: 70,
          //     standard_code_id: 1,
          //     is_excluded: 0,
          //     tribute_id: 1,
          //     withholding_taxes: [
          //       {
          //         code: "06",
          //         withholding_tax_rate: "7.00",
          //       },
          //       {
          //         code: "05",
          //         withholding_tax_rate: "15.00",
          //       },
          //     ],
          //   },
          //   {
          //     code_reference: "54321",
          //     name: "producto de prueba 2",
          //     quantity: 1,
          //     discount: 0,
          //     discount_rate: 0,
          //     price: 50000,
          //     tax_rate: "5.00",
          //     unit_measure_id: 70,
          //     standard_code_id: 1,
          //     is_excluded: 0,
          //     tribute_id: 1,
          //     withholding_taxes: [],
          //   },
          // ],

          items: products,
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
      } else if (response.status === 409) {
        res.status(409).json({
          msg: "Campos obligatorios vacion",
          respuesta: response,
        });
      }
    } catch (error: any) {
      // // Check if the error has a response from the server
      console.log({ errorLuva: error });
      if (error.response) {
        // console.error("Error response data:", error.response.data);
        console.error(error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        const myInfo = error.response.data;
        console.log({ myInfo: myInfo.errors });

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

  public static async deteleBill(req: Request, res: Response) {
    try {
      const { id, tokenRequest } = req.body;
      console.log({ id });

      if (!id) {
        res.status(400).json({
          message: "El campo id es implicitamente falso",
        });
        return;
      }

      const response = await axios.delete(`${url}/v1/bills/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenRequest}`,
          "Content-Type": "application/json",
        },
      });

      let data = response;

      console.log(data);
      if (response.status === 200) {
        res.status(200).json(response);
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
