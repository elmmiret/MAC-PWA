/*
  Warnings:

  - Made the column `dataNaixement` on table `Usuari` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuari" ALTER COLUMN "dataNaixement" SET NOT NULL;
