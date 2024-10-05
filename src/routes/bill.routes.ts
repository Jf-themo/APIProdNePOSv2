import { Router } from "express";

import BillController from "../controllers/BillController";

const route = Router();

route.route("/create-bill").post(BillController.createBill);
route.route("/get-bills").get(BillController.getBills);
route.route("/get-bill-by-id").post(BillController.getBillById);

export default route;
