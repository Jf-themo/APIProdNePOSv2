"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const node_fetch_1 = __importDefault(require("node-fetch"));
(0, dotenv_1.config)();
const url = "https://api-sandbox.factus.com.co/";
const token = "";
class AuthController {
    /**
     * Obtiene un token de autenticación desde el API externo.
     *
     * @param {Request} req - Objeto de solicitud HTTP de Express.
     * @param {Response} res - Objeto de respuesta HTTP de Express.
     * @returns {Promise<void>} Respuesta con el token obtenido o un mensaje de error.
     *
     * @async
     * @static
     */
    static getToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, node_fetch_1.default)(url, {
                    method: "POST",
                    headers: {
                        access_token: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        //   grant_type: "",
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        username: process.env.USERNAME,
                        password: process.env.PASSWORD,
                    }),
                });
                const data = yield response.json();
                res.status(200).json(data);
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Error al obtener el token");
            }
        });
    }
}
exports.default = AuthController;
