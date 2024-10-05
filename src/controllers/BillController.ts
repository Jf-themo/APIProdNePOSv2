import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

const url: string = "https://api-sandbox.factus.com.co";
const token: string =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YzczNGJkNi04MWJkLTRmNjEtODNhNS05ZTc5NDExOGE1NDciLCJqdGkiOiJiNjg5ZDc3ZWQwN2EzODc4OGE3NTk3YzVhMTFkMTRhYjg4YjdhMjA2YmMyMTRhMTI5ODAyYmQ3ZWZlMjdmMzI3ODgyZGQ0OWRiNjFlNzQxZSIsImlhdCI6MTcyODEzMzk3Ny4zMDk4MjcsIm5iZiI6MTcyODEzMzk3Ny4zMDk4MywiZXhwIjoxNzI4MTM3NTc3LjI4LCJzdWIiOiIzIiwic2NvcGVzIjpbXX0.IRtweViYeyexEpdsYCqB_eFHp-CMOG0hDYnH_BPQizHHBCUIbrIZ3yX1hJxk5cjKTFat-TnqIiLLbW-IyhZX1uYFENBkhAsf_XXF3UjBKwKXbwg0hUAF8lWcUdRNbCEuxGdotQvV6zjy70Svr0P7xiNxn7_Q5ZhanoWj3kOj9QYjaH7sS_SvwT4t4UosXAycy4woZrzhLkpHl5CBDtWsoIOJNLgCbHDpEl2cg7ghUsj47uE69ZEbel7LvaP0M0tVgBA5Hjj6-FEBOEmJUjlzbkPGbMgbsQS0IngLmjpsvoPg2TpKIEKtu3_m3Bu-s2LoyZwd9N9jx8lOflaD5QJIIPuPGH4iB0wySyMlG1JcdAW7u_vSNTM2ZmG2nisIpzjoOgEkUibw6-5YXWgDRXS5QhsqxvifKks1ix4kww2Zgr-C2IE38pfT2YM82TfmP8jhRcTp3ECISk3ihdKUBXErFHlBTJOqCVxOwNSKZ7pCHOG-vbyETpij8UHyKyo5jUnGhu-VMxO0hSzdThIYctQPXnJYkopLDox-dh0n1Chuegvqr7ZKcf-xIbEVM9XrSxR0j31dQdDV2zMij_THIu6o404HqB3VTNxkOFNRFU3ytjDDuw82Xn5mRKcaBBn033EP6hN4zZSmKeOtnc8Tif4i5XQbpH1P8IofwHkR1ISw_2g";

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
      const response = await axios.post(
        `${url}/v1/bills/validate`,

        {
          numbering_range_id: 4,
          reference_code: "I3",
          observation: "",
          payment_method_code: "10",
          customer: {
            identification: "123456789",
            dv: "3",
            company: "",
            trade_name: "",
            names: "Alan Turing",
            address: "calle 1 # 2-68",
            email: "alanturing@enigmasas.com",
            phone: "1234567890",
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

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json(error);
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
