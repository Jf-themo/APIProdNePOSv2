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
}

export default AuthController;
