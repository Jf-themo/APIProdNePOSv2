import { Router } from "express";
import userController from "../controllers/userController";

const route = Router();

route.route("/list-all-user").get(userController.listUsers);
route.route("/create-user").post(userController.createUser);
route.route("/sing-in").post(userController.singIn);

export default route;
