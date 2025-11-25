import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware/logger.midleware";

import lojasRoutes from "./routes/loja.routes";
import caixasRoutes from "./routes/caixa.routes";
import depositosRoutes from "./routes/deposito.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use("/lojas", lojasRoutes);
app.use("/depositos", depositosRoutes);
app.use("/caixas", caixasRoutes);

export default app;
