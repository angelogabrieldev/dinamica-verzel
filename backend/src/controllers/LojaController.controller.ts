import { Request, Response } from "express";
import { prisma } from "../services/prisma.service";

export const getLojasController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lojas = await prisma.loja.findMany();

    res.status(200).json([]);
  } catch (error) {}
};
