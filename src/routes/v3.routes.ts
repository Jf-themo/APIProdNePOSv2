import { Router } from "express";
import BillController from "../controllers/BillController";
import NoteCreditController from "../controllers/NoteCreditController";
import ReferenceController from "../controllers/ReferenceController";
import HealthController from "../controllers/HealthController";

const v3 = Router();

v3.get("/health", HealthController.simple);
v3.get("/health/status", HealthController.check);
v3.get("/health/ready", HealthController.ready);
v3.get("/health/detailed", HealthController.detailed);

v3.post("/bills", BillController.createBill as any);
v3.get("/bills", BillController.getBills as any);
v3.get("/bills/:id", BillController.getBillById as any);
v3.delete("/bills", BillController.deleteBill as any);
v3.delete("/bills/by-reference", BillController.deleteBillByReference as any);
v3.get("/bills/:id/pdf", BillController.downloadPdf as any);
v3.get("/bills/:id/xml", BillController.downloadXml as any);
v3.post("/bills/:id/send-email", BillController.sendEmail as any);
v3.get("/bills/:id/email-content", BillController.getEmailContent as any);
v3.post("/bills/:id/accept", BillController.acceptBill as any);
v3.post("/bills/:id/reject", BillController.rejectBill as any);
v3.post("/bills/:id/accept-with-claims", BillController.acceptWithClaims as any);

v3.post("/credit-notes", NoteCreditController.createNoteCredit as any);
v3.get("/credit-notes", NoteCreditController.getCreditNotes as any);
v3.get("/credit-notes/:id", NoteCreditController.getCreditNoteById as any);
v3.delete("/credit-notes/:id", NoteCreditController.deleteCreditNote as any);
v3.get("/credit-notes/:id/pdf", NoteCreditController.downloadPdf as any);
v3.get("/credit-notes/:id/xml", NoteCreditController.downloadXml as any);
v3.post("/credit-notes/:id/send-email", NoteCreditController.sendEmail as any);

v3.get("/reference/municipalities", ReferenceController.getMunicipalities);
v3.get("/reference/numbering-ranges", ReferenceController.getNumberingRanges);
v3.get("/reference/numbering-ranges/:id", ReferenceController.getNumberingRangeById);
v3.get("/reference/units-of-measure", ReferenceController.getUnitsOfMeasure);
v3.get("/reference/tributes", ReferenceController.getTributes);
v3.get("/reference/countries", ReferenceController.getCountries);
v3.get("/reference/reference-tables", ReferenceController.getReferenceTables);
v3.get("/reference/cache-info", ReferenceController.getCacheInfo);
v3.post("/reference/clear-cache", ReferenceController.clearCache);

export default v3;