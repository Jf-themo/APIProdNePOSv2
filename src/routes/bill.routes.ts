import { Router } from "express";
import BillController from "../controllers/BillController";

const route = Router();

route.post("/create-bill", BillController.createBill as any);
route.get("/get-bills", BillController.getBills as any);
route.get("/get-bill-by-id/:id", BillController.getBillById as any);
route.delete("/delete-bill", BillController.deleteBill as any);
route.get("/download-pdf/:id", BillController.downloadPdf as any);
route.get("/download-xml/:id", BillController.downloadXml as any);
route.post("/send-email/:id", BillController.sendEmail as any);

export default route;