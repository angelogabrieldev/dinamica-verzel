import { PrismaClient } from "../src/generated/prisma/client";
import { faker } from "@faker-js/faker";
import { env } from "../src/config/env.config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Limpando banco...");
  await prisma.solicitacaoEvidencia.deleteMany();
  await prisma.deposito.deleteMany();
  await prisma.venda.deleteMany();
  await prisma.caixa.deleteMany();
  await prisma.loja.deleteMany();

  console.log("Populando dados mockados...");

  const NUM_LOJAS = 10;

  for (let i = 0; i < NUM_LOJAS; i++) {
    const loja = await prisma.loja.create({
      data: {
        nome: faker.company.name(),
      },
    });

    // Criar caixas (1 caixa por dia nos últimos 30 dias)
    const NUM_DIAS = 30;
    for (let d = 0; d < NUM_DIAS; d++) {
      const dataDoCaixa = faker.date.recent({ days: NUM_DIAS });

      const caixa = await prisma.caixa.create({
        data: {
          lojaId: loja.id,
          data: dataDoCaixa,
          status: faker.helpers.arrayElement([
            "ABERTO",
            "FECHADO",
            "AGUARDANDO_RETORNO",
            "NAO_INTEGRADO",
          ]),
        },
      });

      // -------------------------
      // VENDAS
      // -------------------------
      const numVendas = faker.number.int({ min: 5, max: 15 });

      for (let v = 0; v < numVendas; v++) {
        await prisma.venda.create({
          data: {
            caixaId: caixa.id,
            data: faker.date.between({
              from: dataDoCaixa,
              to: new Date(),
            }),
            formaDePagamento: faker.helpers.arrayElement([
              "DINHEIRO",
              "PIX",
              "CARTAO_CREDITO",
              "CARTAO_DEBITO",
              "CARTEIRA_DIGITAL",
            ]),
            valor: faker.number.float({
              min: 5,
              max: 500,
              fractionDigits: 2,
            }),
            conferido: faker.datatype.boolean(),
          },
        });
      }

      // -------------------------
      // DEPÓSITOS
      // -------------------------
      const numDepositos = faker.number.int({ min: 2, max: 8 });

      for (let dp = 0; dp < numDepositos; dp++) {
        await prisma.deposito.create({
          data: {
            caixaId: caixa.id,
            data: faker.date.between({
              from: dataDoCaixa,
              to: new Date(),
            }),
            valor: faker.number.float({
              min: 20,
              max: 2000,
              fractionDigits: 2,
            }),
            conferido: faker.datatype.boolean(),
          },
        });
      }

      // -------------------------
      // SOLICITAÇÕES DE EVIDÊNCIA
      // -------------------------
      const numSolicitacoes = faker.number.int({ min: 0, max: 3 });

      for (let s = 0; s < numSolicitacoes; s++) {
        await prisma.solicitacaoEvidencia.create({
          data: {
            caixaId: caixa.id,
            mensagem: faker.lorem.sentence(),
            dataEnvio: faker.date.between({
              from: dataDoCaixa,
              to: new Date(),
            }),
          },
        });
      }
    }
  }

  console.log("Seed finalizado com sucesso!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
