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

  try {
    const caixas = await prisma.caixa.findMany({
      where: {
        lojaId: id,
        data: String(data),
      },
    });
    res.status(200).json(caixas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar caixas" });
  }
};
