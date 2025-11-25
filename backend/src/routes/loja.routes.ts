import { Router } from "express";
import { getLojasController } from "../controllers/LojaController.controller";

const router = Router();

router.get("/lojas", getLojasController);

export default router;
