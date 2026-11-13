-- DropForeignKey
ALTER TABLE "Usuari" DROP CONSTRAINT "Usuari_categoriaId_fkey";

-- AlterTable
ALTER TABLE "Usuari" ALTER COLUMN "categoriaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuari" ADD CONSTRAINT "Usuari_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
