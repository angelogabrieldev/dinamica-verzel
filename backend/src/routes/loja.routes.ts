import { Router } from "express";
import { getLojasController } from "../controllers/LojaController.controller";

const router = Router();

router.get("/", getLojasController);
router.get("/:id/caixas", getLojasController);

export default router;
