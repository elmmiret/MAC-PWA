/*
  Warnings:

  - You are about to drop the column `correusContacte` on the `Usuari` table. All the data in the column will be lost.
  - Added the required column `emailPrincipal` to the `Usuari` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuari" DROP COLUMN "correusContacte",
ADD COLUMN     "emailPrincipal" TEXT NOT NULL,
ADD COLUMN     "emailSecundari" TEXT;
