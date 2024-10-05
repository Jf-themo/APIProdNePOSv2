import { connect } from "../database";
import { request, Request, Response } from "express";
import User from "../models/User";
const { v4: uuidv4 } = require("uuid");

class userController {
  public static async listUsers(req: Request, res: Response) {
    try {
      const connection = await connect();
      const response = await connection.query("SELECT * FROM users");
      res.json({
        message: "Consulta exitosa",
        response: response[0],
      });
    } catch (error) {
      res.status(500).json({ message: "Error al realizar la consulta", error });
    }
  }

  public static async createUser(req: Request, res: Response) {
    const connection = await connect();
    try {
      await connection.beginTransaction;

      const body = req.body;

      let user = new User(
        uuidv4().replace(/-/g, "").slice(0, 10),
        body.identification,
        body.namePerson,
        body.lastName,
        body.phone,
        body.userName,
        body.passCode,
        body.userRole
      );

      const ok = user.isAnyEmptyOrNull();

      if (ok) {
        console.log(user.toString());
        res.status(400).send({
          message: "Todos los campos son obligatorios",
        });
        return;
      }

      console.log(user.toString());
      if (!user.getIdentification()) {
        //bad request response
        res.status(400).send({ message: "El campo identificación está vacío" });
        return;
      }

      const isThere = await connection.query(
        "SELECT * FROM people WHERE identification=?",
        [user.getIdentification()]
      );

      if (Array.isArray(isThere[0]) && isThere[0].length > 0) {
        //bad request response
        res.status(400).send({
          message: "Este usuario ya existe",
        });
        return;
      }

      // query to insert people
      await connection.query(
        `INSERT INTO people (identification, namePerson, lastName, phone) VALUES(?, ?, ?, ?)`,
        [
          user.getIdentification(),
          user.getNamePerson(),
          user.getLastName(),
          user.getPhone(),
        ]
      );

      //query to insert user'
      await connection.query(
        `INSERT INTO users (id, idPeople, userName, passCode, userRole) VALUES(?, ?, ?, ?, ?)`,
        [
          user.getId(),
          user.getIdentification(),
          user.getUserName(),
          user.getPassCode(),
          user.getUserRole(),
        ]
      );

      await connection.commit; // Commit de la transacción

      //success request response
      res.status(201).send({
        message: "Usuario creado con éxito",
      });
    } catch (error) {
      await connection.rollback;

      //error request response
      res.status(500).send({ error });
    } finally {
      if (connection) {
        await connection.end(); // Cerrar la conexión
      }
    }
  }

  /**
   * Maneja la solicitud de inicio de sesión del usuario.
   *
   * Este método verifica las credenciales del usuario y responde con un mensaje
   * indicando si el acceso fue concedido o denegado. Valida que todos los campos
   * necesarios estén presentes en la solicitud y realiza una consulta a la base
   * de datos para verificar las credenciales.
   *
   * @param {Request} req - La solicitud HTTP que contiene los datos del usuario.
   * @param {Response} res - La respuesta HTTP que se enviará al cliente.
   *
   * @returns {Promise<void>} - Promesa que se resuelve al finalizar el proceso de autenticación.
   *
   * @throws {Error} - Lanza un error si ocurre un problema al consultar la base de datos.
   *
   * @example
   *
   * app.post('/login', User.singIn);
   *
   * @responses
   * 200 - Acceso concedido.
   * {
   *   message: "Acceso concebido"
   * }
   *
   * 400 - Todos los campos son obligatorios.
   * {
   *   message: "Todos los campos son obligatorios"
   * }
   *
   * 404 - Acceso denegado.
   * {
   *   message: "Acceso denegado"
   * }
   *
   * 500 - Error interno del servidor.
   * {
   *   error: <Error>
   * }
   */
  public static async singIn(req: Request, res: Response) {
    const connection = await connect();
    try {
      const body = req.body;

      for (let item in body) {
        if (!body[item as keyof Body]) {
          res.status(400).send({
            message: "Todos los campos son obligatorios",
          });
          return;
          ("");
        }
      }

      const { userName, passCode } = body;

      const response = await connection.query(
        "SELECT * FROM users WHERE userName =? AND passCode =?",
        [userName, passCode]
      );

      if (Array.isArray(response[0]) && response[0].length > 0) {
        res.status(200).send({
          message: "Acceso concebido",
        });

        return;
      } else {
        res.status(404).send({
          message: "Credenciales incorrectas",
        });

        return;
      }
    } catch (erro) {
      res.status(500).send({ message: erro });
    }
  }
}

export default userController;
