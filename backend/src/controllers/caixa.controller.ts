import { Request, Response } from "express";
import { prisma, StatusCaixa } from "../services/prisma.service";

/**
 GET /caixas/:id
 Retorna um caixa com seus dados (incluindo vendas, depósitos e solicitações)
*/
export const getCaixa = async (req: Request, res: Response): Promise<void> => {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

/**
 PATCH /caixas/:id/finalizar
 Finaliza o caixa alterando o seu status para FECHADO
*/
export const finalizarCaixa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const caixa = await prisma.caixa.findUnique({ where: { id } });

    if (!caixa) res.status(404).json({ message: "Caixa não encontrado" });
    if (caixa!.status === StatusCaixa.FECHADO)
      res.status(400).json({ message: "Caixa já está fechado" });

    const atualizado = await prisma.caixa.update({
      where: { id },
      data: { status: StatusCaixa.FECHADO },
    });

    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

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

/**
 GET /caixas/resumo
 Retorna um caixa com seus dados (incluindo vendas, depósitos e solicitações)
*/
export const getResumo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, status } = req.query;

    const filtros: any = {};

    if (data) filtros.data = new Date(String(data));
    if (status) filtros.status = String(status);

    const caixas = await prisma.caixa.findMany({
      where: filtros,
      include: {
        loja: true,
        vendas: { select: { valor: true } },
        depositos: { select: { valor: true } },
      },
      orderBy: { data: 'desc' },
    });

    const resposta = caixas.map((c) => {
      const round = (value: number) => Math.floor(value * 100) / 100;

      const totalVendas = c.vendas.reduce(
        (soma, v) => soma + Number(v.valor),
        0
      );

      const totalDepositos = c.depositos.reduce(
        (soma, d) => soma + Number(d.valor),
        0
      );

      const saldo = totalVendas - totalDepositos;

      return {
        id: c.id,
        loja: c.loja.nome,
        data: c.data,
        status: c.status,
        totalVendas: round(totalVendas),
        totalDepositos: round(totalDepositos),
        saldo: round(saldo),
      };
    });

    res.json(resposta);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar os resumos de caixa.' });
  }
}