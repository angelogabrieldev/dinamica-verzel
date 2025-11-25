import { Router } from "express";
import {
  getCaixa,
  finalizarCaixa,
  addSolicitacaoController,
} from "../controllers/caixa.controller";

const router = Router();

router.get("/:id", getCaixa);
router.patch("/:id/finalizar", finalizarCaixa);
router.post("/:id/solicitacoes", addSolicitacaoController);

export default router;
