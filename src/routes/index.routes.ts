import { Router } from "express";
import { index } from "../controllers/index.controller";

const route = Router();

route.route("/").get(index);

export default route;
