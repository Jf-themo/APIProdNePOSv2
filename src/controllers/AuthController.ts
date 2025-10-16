import { Request, Response } from "express";
import { config } from "dotenv";
import { isAnyEmptyOrNull } from "../utils/authUtils";
import { IAuthData } from "../interfaces/interfaces";
import axios, { AxiosResponse } from "axios";

config();

const url: string = "https://api.factus.com.co";
// const url: string = "https://api-sandbox.factus.com.co";

class AuthController {
  /**
   * Obtiene un token de acceso utilizando las credenciales proporcionadas.
   *
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<void>} - Promesa que se resuelve cuando se envía la respuesta.
   *
   * @throws {Error} - Si hay un error al obtener el token, se envía una respuesta 500 con un mensaje de error.
   */
  public static async getToken(req: Request, res: Response): Promise<void> {
    try {
      if (isAnyEmptyOrNull()) {
        res.status(400).json({
          message: "Al menos una variable de entorno esta implicitamente falsa",
        });
        return;
      }

      //Se debe tratar la respuesta com un AxiosResponse y dentro la interfaz
      const response: AxiosResponse<IAuthData> = await axios.post(
        `${url}/oauth/token`,
        {
          grant_type: "password",
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          //Al crear una variable de entorno toma las del equipo tambien
          username: process.env.USER,
          password: process.env.PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({
        access_token: response.data.access_token,
        // refresh_token: response.data.refresh_token,
      });
    } catch (error) {
      console.log({ error });
      res.status(500).send({ error: error });
    }
  }

  /**
   * Servicio para validar la suscripción actual.
   *
   * @async
   * @function
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express para enviar los resultados de la solicitud.
   * @returns {Promise<void>} Responde al cliente con el estado de la suscripción.
   *
   * @response {200} Objeto JSON con la información de la suscripción actual.
   * @response {500} Error al realizar la solicitud.
   */
  public static async validateSubscription(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // El token puede venir del body o usar el token global
      const tokenRequest = req.body?.token;
      console.log({ tokenRequest });

      if (!tokenRequest) {
        res.status(400).json({
          message: "El token de autorización es requerido",
        });
        return;
      }

      const response = await axios.get(`${url}/v1/subscriptions/current`, {
        headers: {
          Authorization: `Bearer ${tokenRequest}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        // data completa
        const data = response.data?.data;
        res.status(200).json({
          message: "Suscripción obtenida correctamente",
          subscription: data,
        });
        return;
      }
    } catch (error: any) {
      console.error("Error en validateSubscription:", error);

      if (error.response) {
        res.status(error.response.status).json({
          message: "Error desde el servidor",
          details: error.response.data,
        });
      } else if (error.request) {
        res.status(500).json({
          message: "No se recibió respuesta del servidor",
          request: error.request,
        });
      } else {
        res.status(500).json({
          message: "Error al realizar la petición",
          details: error.message,
        });
      }
    }
  }

  /**
   * Servicio para consultar adquirente en la DIAN.
   *
   * @async
   * @function
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<void>} Responde con la información del adquirente.
   */
  public static async getDianAcquirer(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { token, identification_document_id, identification_number } =
        req.body;

      // Validaciones
      if (!token) {
        res
          .status(400)
          .json({ message: "El token de autorización es requerido" });
        return;
      }
      if (!identification_document_id || !identification_number) {
        res.status(400).json({
          message:
            "Los parámetros identification_document_id e identification_number son requeridos",
        });
        return;
      }

      const response = await axios.get(
        `${url}/v1/dian/acquirer?identification_document_id=${identification_document_id}&identification_number=${identification_number}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        res.status(200).json({
          message: "Adquirente obtenido correctamente",
          acquirer: response.data?.data || response.data,
        });
        return;
      }
    } catch (error: any) {
      console.error("Error en getDianAcquirer:", error);

      if (error.response) {
        res.status(error.response.status).json({
          message: "Error desde el servidor",
          details: error.response.data,
        });
      } else if (error.request) {
        res.status(500).json({
          message: "No se recibió respuesta del servidor",
          request: error.request,
        });
      } else {
        res.status(500).json({
          message: "Error al realizar la petición",
          details: error.message,
        });
      }
    }
  }
}

export default AuthController;
