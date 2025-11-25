import { env } from "../config/env.config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});
