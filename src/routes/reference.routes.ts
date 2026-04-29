import { Router } from "express";
import ReferenceController from "../controllers/ReferenceController";

const route = Router();

route.get("/municipalities", ReferenceController.getMunicipalities);
route.get("/numbering-ranges", ReferenceController.getNumberingRanges);
route.get("/numbering-ranges/:id", ReferenceController.getNumberingRangeById);
route.get("/units-of-measure", ReferenceController.getUnitsOfMeasure);
route.get("/tributes", ReferenceController.getTributes);
route.get("/countries", ReferenceController.getCountries);
route.get("/reference-tables", ReferenceController.getReferenceTables);
route.get("/cache-info", ReferenceController.getCacheInfo);
route.post("/clear-cache", ReferenceController.clearCache);

export default route;