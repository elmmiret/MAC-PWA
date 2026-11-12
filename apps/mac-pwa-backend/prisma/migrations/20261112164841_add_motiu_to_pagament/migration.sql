/*
  Warnings:

  - Added the required column `motiu` to the `Pagament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pagament" ADD COLUMN     "motiu" TEXT NOT NULL;
