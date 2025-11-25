import { Router } from "express";
import { getCaixaById } from "../controllers/caixa.controller";

const router = Router();

router.get("/:id", getCaixaById);

export default router;