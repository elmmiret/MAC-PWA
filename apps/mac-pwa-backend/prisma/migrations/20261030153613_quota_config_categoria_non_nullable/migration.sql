/*
  Warnings:

  - Made the column `categoriaId` on table `QuotaConfig` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "QuotaConfig" DROP CONSTRAINT "QuotaConfig_categoriaId_fkey";

-- AlterTable
ALTER TABLE "QuotaConfig" ALTER COLUMN "categoriaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "QuotaConfig" ADD CONSTRAINT "QuotaConfig_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
