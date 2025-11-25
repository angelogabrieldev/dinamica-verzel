-- CreateTable
CREATE TABLE "Loja" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Caixa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lojaId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ABERTO',
    CONSTRAINT "Caixa_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "Loja" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caixaId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "formaDePagamento" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "conferido" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Venda_caixaId_fkey" FOREIGN KEY ("caixaId") REFERENCES "Caixa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Deposito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caixaId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "valor" DECIMAL NOT NULL,
    "conferido" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Deposito_caixaId_fkey" FOREIGN KEY ("caixaId") REFERENCES "Caixa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SolicitacaoEvidencia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caixaId" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "dataEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SolicitacaoEvidencia_caixaId_fkey" FOREIGN KEY ("caixaId") REFERENCES "Caixa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Caixa_lojaId_data_key" ON "Caixa"("lojaId", "data");
