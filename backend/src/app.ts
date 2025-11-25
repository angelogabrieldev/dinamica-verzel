import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware/logger.midleware";
import lojasRoutes from "./routes/loja.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use("/lojas", lojasRoutes);

export default app;
