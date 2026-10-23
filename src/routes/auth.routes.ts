import { Router } from "express";

import AuthController from "../controllers/AuthController";

const route = Router();

route.route("/get-token").post(AuthController.getToken);
route.route("/get-subscription").post(AuthController.validateSubscription);
route.route("/get-acquirer").post(AuthController.getDianAcquirer);

export default route;
