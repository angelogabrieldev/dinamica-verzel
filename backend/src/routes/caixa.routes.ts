import { Router } from "express";
import {
  getCaixa,
  finalizarCaixa,
  addSolicitacaoController,
  getResumo,
  addDepositoController,
  getTransacoes,
  getDepositosController,
} from "../controllers/caixa.controller";

const router = Router();

router.get("/resumo", getResumo);
router.get("/:id", getCaixa);
router.get("/:id/depositos", getDepositosController);
router.post("/:id/depositos", addDepositoController);
router.patch("/:id/finalizar", finalizarCaixa);
router.post("/:id/solicitacoes", addSolicitacaoController);
router.get("/:id/transacoes", getTransacoes);

export default router;
