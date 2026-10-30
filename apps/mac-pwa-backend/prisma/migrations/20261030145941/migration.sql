/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `QuotaConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "QuotaConfig" DROP CONSTRAINT "QuotaConfig_categoriaId_fkey";

-- AlterTable
ALTER TABLE "QuotaConfig" ALTER COLUMN "categoriaId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuotaConfig_nom_key" ON "QuotaConfig"("nom");

-- AddForeignKey
ALTER TABLE "QuotaConfig" ADD CONSTRAINT "QuotaConfig_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
