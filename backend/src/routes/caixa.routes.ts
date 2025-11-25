import { Router } from "express";
import {
  getCaixa,
  finalizarCaixa,
  addSolicitacaoController,
  getResumo,
  getTransacoes,
} from "../controllers/caixa.controller";

const router = Router();

router.get("/resumo", getResumo);
router.get("/:id", getCaixa);
router.patch("/:id/finalizar", finalizarCaixa);
router.post("/:id/solicitacoes", addSolicitacaoController);
router.get("/:id/transacoes", getTransacoes);

export default router;