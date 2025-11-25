import { Request, Response } from "express";
import { prisma } from "../services/prisma.service";

export const addSolicitacaoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { mensagem } = req.body;

    const novaSolicitacao = await prisma.solicitacaoEvidencia.create({
      data: {
        caixaId: id,
        mensagem,
      },
    });

    res.status(201).json(novaSolicitacao);
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    res.status(500).json({ error: "Erro ao criar solicitação" });
  }
};
