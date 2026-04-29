import { Router } from "express";
import HealthController from "../controllers/HealthController";

const route = Router();

route.get("/health", HealthController.simple);
route.get("/health/status", HealthController.check);
route.get("/health/ready", HealthController.ready);
route.get("/health/detailed", HealthController.detailed);

export default route;