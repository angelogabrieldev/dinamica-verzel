import { Request, Response } from "express";
import { prisma } from "../services/prisma.service";

export const updateDepositoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const deposito = await prisma.deposito.update({
      where: { id },
      data: {
        conferido: true,
      },
    });

    res.status(200).json(deposito);
  } catch (error) {
    console.error("Erro ao conferir depósito:", error);
    res.status(500).json({ error: "Erro ao conferir depósito" });
  }
};
