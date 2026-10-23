import { Router } from "express";

import NoteCreditController from "../controllers/NoteCreditController";

const route = Router();

route.route("/create-note-credit").post(NoteCreditController.createNoteCredit);

export default route;
