import { Request, Response } from "express";
import {
  FormaDePagamento,
  prisma,
  StatusCaixa,
} from "../services/prisma.service";

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

    await prisma.caixa.update({
      where: {
        id,
      },
      data: {
        status: StatusCaixa.AGUARDANDO_RETORNO,
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
      orderBy: { data: "desc" },
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
    res.status(500).json({ error: "Erro ao listar os resumos de caixa." });
  }
};

/**
 GET /caixas/:id/transacoes
 Retorna as transações de um caixa (incluindo vendas, depósitos e solicitações)
*/
export const getTransacoes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { tipo = "ambos", ordenar = "data_desc" } = req.query;

    let transacoes: any[] = [];

    const depositos = await prisma.deposito.findMany({
      where: { caixaId: id },
      select: { id: true, valor: true, data: true },
    });

    const vendas = await prisma.venda.findMany({
      where: { caixaId: id },
      select: { id: true, valor: true, data: true },
    });

    const saldoFinalDoCaixa = depositos.reduce((soma, d) => soma + Number(d.valor), 0) - vendas.reduce((soma, v) => soma + Number(v.valor), 0);

    if (tipo === "depositos" || tipo === "ambos") {
      transacoes.push(
        ...depositos.map((d) => ({
          id: d.id,
          tipo: "DEPOSITO",
          valor: Number(d.valor),
          data: d.data,
        }))
      );
    }

    if (tipo === "vendas" || tipo === "ambos") {
      transacoes.push(
        ...vendas.map((v) => ({
          id: v.id,
          tipo: "VENDA",
          valor: Number(v.valor),
          data: v.data,
        }))
      );
    }

    switch (ordenar) {
      case "data_asc":
        transacoes.sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        );
        break;

      case "data_desc":
      default:
        transacoes.sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        break;
    }

    res.json({
      saldoFinal: Number(saldoFinalDoCaixa.toFixed(2)),
      transacoes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar transações." });
  }
};

export const addDepositoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { valor, data } = req.body;

    if (!valor) {
      res.status(400).json({ error: "Valor é obrigatório." });
      return;
    }

    if (!data || !/^\d{2}\/\d{2}\/\d{4}$/.test(String(data))) {
      res
        .status(400)
        .json({ error: "Data inválida. Use o formato DD/MM/YYYY." });
      return;
    }

    const [day, month, year] = String(data).split("/");
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    const deposito = await prisma.deposito.create({
      data: {
        caixaId: id,
        valor,
        data: date,
      },
    });

    res.status(201).json(deposito);
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    res.status(500).json({ error: "Erro ao criar solicitação" });
  }
};

export const getDepositosController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const depositos = await prisma.deposito.findMany({
      where: { caixaId: id },
      include: {
        caixa: {
          include: {
            loja: true,
          },
        },
      },
    });

    res.status(200).json(depositos);
  } catch (error) {
    console.error("Erro ao buscar depósitos:", error);
    res.status(500).json({ error: "Erro ao buscar depósitos" });
  }
};
