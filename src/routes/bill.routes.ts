import { Router, Request, Response } from "express";
import BillController from "../controllers/BillController";
import { apiLimiter } from "../middleware/rateLimiter";

const route = Router();

route.post("/create-bill", apiLimiter.billCreate, BillController.createBill as any);
route.get("/get-bills", BillController.getBills as any);
route.get("/get-bill-by-id/:id", BillController.getBillById as any);

// Compatibilidad v2: POST /get-bill-by-id con { id } en body
route.post("/get-bill-by-id", (req: Request, res: Response) => {
  req.params.id = String(req.body.id || "");
  return (BillController.getBillById as any)(req, res);
});

route.delete("/delete-bill", BillController.deleteBill as any);
route.delete("/delete-bill-by-reference", BillController.deleteBillByReference as any);
route.get("/download-pdf/:id", BillController.downloadPdf as any);
route.get("/download-xml/:id", BillController.downloadXml as any);
route.post("/send-email/:id", BillController.sendEmail as any);
route.get("/email-content/:id", BillController.getEmailContent as any);
route.post("/accept/:id", BillController.acceptBill as any);
route.post("/reject/:id", BillController.rejectBill as any);
route.post("/accept-with-claims/:id", BillController.acceptWithClaims as any);

export default route;