import { Router } from "express";
import {
  getCaixa,
  finalizarCaixa,
  addSolicitacaoController,
  getResumo,
  addDepositoController,
  getTransacoes,
} from "../controllers/caixa.controller";
import { createDeposito } from "../controllers/Depositos.controller";

const router = Router();

router.get("/resumo", getResumo);
router.get("/:id", getCaixa);
router.post("/:id/depositos", addDepositoController);
router.patch("/:id/finalizar", finalizarCaixa);
router.post("/:id/solicitacoes", addSolicitacaoController);
router.get("/:id/transacoes", getTransacoes);
router.post("/:id/depositos", createDeposito);

export default router;
