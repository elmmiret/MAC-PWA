/*
  Warnings:

  - You are about to drop the `Athlete` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TUsuari" AS ENUM ('Soci', 'NoSoci', 'Admin');

-- CreateEnum
CREATE TYPE "TDocument" AS ENUM ('DNI', 'NIF');

-- CreateEnum
CREATE TYPE "TEstat" AS ENUM ('Pendent', 'Pagat', 'Cancee');

-- CreateEnum
CREATE TYPE "DiesSetmana" AS ENUM ('Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres');

-- CreateEnum
CREATE TYPE "TCategoria" AS ENUM ('SUB_8', 'SUB_10', 'SUB_12', 'SUB_14', 'SUB_16', 'SUB_20', 'SUB_23', 'Senior', 'Master', 'G_A_S', 'Individual', 'NoAtleta');

-- CreateEnum
CREATE TYPE "TQuota" AS ENUM ('Llicencia', 'Activitat', 'Competicio', 'Soci');

-- CreateEnum
CREATE TYPE "TSexe" AS ENUM ('M', 'F');

-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_userId_fkey";

-- DropForeignKey
ALTER TABLE "Fee" DROP CONSTRAINT "Fee_athleteId_fkey";

-- DropTable
DROP TABLE "Athlete";

-- DropTable
DROP TABLE "Fee";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "FeeType";

-- DropEnum
DROP TYPE "LicenseType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "tipus" "TCategoria" NOT NULL,
    "anyNaixement" INTEGER[],
    "diesActivitat" "DiesSetmana"[],
    "horaEntrada" TIMESTAMP(3),
    "horaSortida" TIMESTAMP(3),
    "detalls" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuari" (
    "id" TEXT NOT NULL,
    "imatgePerfil" TEXT,
    "tipus" "TUsuari" NOT NULL,
    "dataNaixement" TIMESTAMP(3),
    "LocalitatNaixement" TEXT,
    "sexe" "TSexe" NOT NULL,
    "numeroLlicencia" TEXT,
    "nom" TEXT NOT NULL,
    "cognom1" TEXT NOT NULL,
    "cognom2" TEXT,
    "telefons" TEXT[],
    "adreca" TEXT,
    "codiPostal" TEXT NOT NULL,
    "poblacio" TEXT NOT NULL,
    "tipusDocument" "TDocument" NOT NULL,
    "numeroDocument" TEXT NOT NULL,
    "nomTutor" TEXT,
    "tipusDocumentTutor" "TDocument",
    "numeroDocumentTutor" TEXT,
    "correusContacte" TEXT[],
    "numAbPatronat" INTEGER,
    "dataInscripcio" TIMESTAMP(3),
    "dataBaixa" TIMESTAMP(3),
    "dataAltaProva" TIMESTAMP(3),
    "iban" TEXT,
    "categoriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotaConfig" (
    "id" TEXT NOT NULL,
    "tipus" "TQuota" NOT NULL,
    "nom" TEXT NOT NULL,
    "preuBase" DOUBLE PRECISION NOT NULL,
    "temporadesAplicada" TEXT[],
    "activa" BOOLEAN NOT NULL DEFAULT false,
    "categoriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotaConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagament" (
    "id" TEXT NOT NULL,
    "preu" DOUBLE PRECISION NOT NULL,
    "estat" "TEstat" NOT NULL DEFAULT 'Pendent',
    "dataPagament" TIMESTAMP(3),
    "dataLimit" TIMESTAMP(3) NOT NULL,
    "dataGeneracio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuariId" TEXT NOT NULL,
    "quotaConfigId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pagament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prova" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prova_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "sexe" "TSexe" NOT NULL,
    "provaId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtletaRanking" (
    "id" TEXT NOT NULL,
    "localitatMarca" TEXT NOT NULL,
    "dataMarca" TIMESTAMP(3) NOT NULL,
    "marca" TEXT NOT NULL,
    "usuariId" TEXT NOT NULL,
    "rankingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AtletaRanking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AtletaRanking_usuariId_rankingId_key" ON "AtletaRanking"("usuariId", "rankingId");

-- AddForeignKey
ALTER TABLE "Usuari" ADD CONSTRAINT "Usuari_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotaConfig" ADD CONSTRAINT "QuotaConfig_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagament" ADD CONSTRAINT "Pagament_usuariId_fkey" FOREIGN KEY ("usuariId") REFERENCES "Usuari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagament" ADD CONSTRAINT "Pagament_quotaConfigId_fkey" FOREIGN KEY ("quotaConfigId") REFERENCES "QuotaConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtletaRanking" ADD CONSTRAINT "AtletaRanking_usuariId_fkey" FOREIGN KEY ("usuariId") REFERENCES "Usuari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtletaRanking" ADD CONSTRAINT "AtletaRanking_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "Ranking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
