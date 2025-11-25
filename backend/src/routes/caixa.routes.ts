import { Router } from "express";
import {
  getCaixa,
  finalizarCaixa,
  addSolicitacaoController,
  getResumo,
  addDepositoController,
} from "../controllers/caixa.controller";

const router = Router();

router.get("/resumo", getResumo);
router.get("/:id", getCaixa);
router.post("/:id/depositos", addDepositoController);
router.patch("/:id/finalizar", finalizarCaixa);
router.post("/:id/solicitacoes", addSolicitacaoController);

export default router;
