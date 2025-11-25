import { Request, Response } from "express";
import { prisma } from "../services/prisma.service";

export const getLojasController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lojas = await prisma.loja.findMany();

    res.status(200).json(lojas);
  } catch (error) {
    console.error("Erro ao buscar lojas:", error);
    res.status(500).json({ error: "Erro ao buscar lojas" });
  }
};

export const getCaixasByLojaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { data } = req.query;
  if (!data || !/^\d{2}\/\d{2}\/\d{4}$/.test(String(data))) {
    res.status(400).json({ error: "Data inválida. Use o formato DD/MM/YYYY." });
    return;
  }

  const [day, month, year] = String(data).split("/");
  const start = new Date(Number(year), Number(month) - 1, Number(day));

  if (isNaN(start.getTime())) {
    res.status(400).json({ error: "Data inválida. Use o formato DD/MM/YYYY." });
    return;
  }

  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  try {
    const caixas = await prisma.caixa.findMany({
      where: {
        lojaId: id,
        data: {
          gte: start,
          lt: end,
        },
      },
    });

    res.status(200).json(caixas);
  } catch (error) {
    console.error("Erro ao buscar caixas:", error);
    res.status(500).json({ error: "Erro ao buscar caixas" });
  }
};
