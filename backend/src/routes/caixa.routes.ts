import { Router } from "express";
import { getCaixa, finalizarCaixa } from "../controllers/caixa.controller";

const router = Router();

router.get("/:id", getCaixa);
router.patch("/:id/finalizar", finalizarCaixa);

export default router;