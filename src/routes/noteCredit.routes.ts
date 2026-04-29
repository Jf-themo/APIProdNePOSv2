import { Router } from "express";
import NoteCreditController from "../controllers/NoteCreditController";

const route = Router();

route.post("/create-note-credit", NoteCreditController.createNoteCredit as any);
route.get("/get-credit-notes", NoteCreditController.getCreditNotes as any);
route.get("/get-credit-note-by-id/:id", NoteCreditController.getCreditNoteById as any);
route.delete("/delete-credit-note/:id", NoteCreditController.deleteCreditNote as any);
route.get("/download-pdf/:id", NoteCreditController.downloadPdf as any);
route.get("/download-xml/:id", NoteCreditController.downloadXml as any);
route.post("/send-email/:id", NoteCreditController.sendEmail as any);

export default route;