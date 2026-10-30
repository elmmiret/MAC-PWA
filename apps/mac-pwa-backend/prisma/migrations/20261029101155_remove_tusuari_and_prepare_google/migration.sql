/*
  Warnings:

  - You are about to drop the column `tipus` on the `Usuari` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuari" DROP COLUMN "tipus",
ALTER COLUMN "firebaseUid" DROP NOT NULL;

-- DropEnum
DROP TYPE "TUsuari";
