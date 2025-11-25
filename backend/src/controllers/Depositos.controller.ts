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

/**
 POST /caixas/:id/depositos
 Cria um depósito no caixa
*/
export const createDeposito = async (req: Request, res: Response): Promise<void> => {
try {
    const { id } = req.params;
    const { valor, data } = req.body;

    if (!valor || isNaN(Number(valor))) res.status(400).json({ error: "Valor do depósito inválido." });

    const caixa = await prisma.caixa.findUnique({ where: { id } });
    if (!caixa) res.status(404).json({ error: "Caixa não encontrado." });

    const deposito = await prisma.deposito.create({
      data: {
        caixaId: id,
        valor: Number(valor),
        data: data ? new Date(data) : new Date(),
        conferido: false
      },
    });

    res.status(201).json(deposito);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar depósito." });
  }
}