/*
  Warnings:

  - You are about to drop the column `telefons` on the `Usuari` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailPrincipal]` on the table `Usuari` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuari" DROP COLUMN "telefons",
ADD COLUMN     "perfilCompletat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "telefonPrincipal" TEXT,
ADD COLUMN     "telefonSecundari" TEXT,
ALTER COLUMN "sexe" DROP NOT NULL,
ALTER COLUMN "nom" DROP NOT NULL,
ALTER COLUMN "cognom1" DROP NOT NULL,
ALTER COLUMN "codiPostal" DROP NOT NULL,
ALTER COLUMN "poblacio" DROP NOT NULL,
ALTER COLUMN "tipusDocument" DROP NOT NULL,
ALTER COLUMN "numeroDocument" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuari_emailPrincipal_key" ON "Usuari"("emailPrincipal");
