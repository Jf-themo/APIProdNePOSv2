import { Router } from "express";

import AuthController from "../controllers/AuthController";

const route = Router();

route.route("/get-token").post(AuthController.getToken);

export default route;
