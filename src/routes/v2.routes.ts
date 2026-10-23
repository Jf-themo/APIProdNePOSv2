import { Router } from "express";
import BillController from "../controllers/BillController";
import { apiLimiter } from "../middleware/rateLimiter";
import authRoute from "./auth.routes";
import billRouter from "./bill.routes";

const v2 = Router();

v2.use("/auth", authRoute);
v2.use("/", authRoute);
v2.use("/", billRouter);

v2.post("/bills", apiLimiter.billCreate, BillController.createBill as any);
v2.get("/bills", BillController.getBills as any);
v2.get("/bills/:id", BillController.getBillById as any);
v2.delete("/bills", BillController.deleteBill as any);

export default v2;
