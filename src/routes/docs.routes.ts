import { Router } from "express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerUi = require("swagger-ui-express");
import { swaggerSpec, swaggerUiOptions } from "../config/swagger";

const route = Router();

route.use("/", swaggerUi.serve);
route.get("/", swaggerUi.setup(swaggerSpec, swaggerUiOptions));
route.get("/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export default route;