import { Request, Response } from "express";
import { prisma } from "../services/prisma.service";

/**
 GET /caixas/:id
 Retorna um caixa  com seus dados (incluindo vendas, depósitos e solicitações)
*/
export const getCaixaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const caixa = await prisma.caixa.findUnique({
      where: { id },
      include: {
        loja: true,
        vendas: true,
        depositos: true,
        solicitacoes: true,
      },
    });

    if (!caixa) res.status(404).json({ message: "Caixa não encontrado" });
    res.json(caixa);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};