import { Router } from "express";
import { apiLimiter } from "../middleware/rateLimiter";
import AuthController from "../controllers/AuthController";

const route = Router();

route.route("/get-token").post(apiLimiter.auth, AuthController.getToken);
route.route("/get-subscription").post(apiLimiter.auth, AuthController.validateSubscription);
route.route("/get-acquirer").post(apiLimiter.auth, AuthController.getDianAcquirer);

export default route;
