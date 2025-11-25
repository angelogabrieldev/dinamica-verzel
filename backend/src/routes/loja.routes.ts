import { Router } from "express";
import {
  getLojasController,
  getCaixasByLojaController,
} from "../controllers/LojaController.controller";

const router = Router();

router.get("/", getLojasController);
router.get("/:id/caixas", getCaixasByLojaController);

export default router;
