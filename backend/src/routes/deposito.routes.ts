import { Router } from "express";
import { updateDepositoController } from "../controllers/Depositos.controller";

const router = Router();

router.patch("/:id", updateDepositoController);

export default router;
