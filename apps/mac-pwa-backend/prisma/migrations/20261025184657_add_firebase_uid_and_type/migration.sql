/*
  Warnings:

  - The values [Dilluns,Dimarts,Dimecres,Dijous,Divendres] on the enum `DiesSetmana` will be removed. If these variants are still used in the database, this will fail.
  - The values [Senior,Master,Individual,NoAtleta] on the enum `TCategoria` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pendent,Pagat,Cancee] on the enum `TEstat` will be removed. If these variants are still used in the database, this will fail.
  - The values [Llicencia,Activitat,Competicio,Soci] on the enum `TQuota` will be removed. If these variants are still used in the database, this will fail.
  - The values [Soci,NoSoci,Admin] on the enum `TUsuari` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[tipus]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Prova` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nom]` on the table `Ranking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[firebaseUid]` on the table `Usuari` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebaseUid` to the `Usuari` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DiesSetmana_new" AS ENUM ('DILLUNS', 'DIMARTS', 'DIMECRES', 'DIJOUS', 'DIVENDRES');
ALTER TABLE "Categoria" ALTER COLUMN "diesActivitat" TYPE "DiesSetmana_new"[] USING ("diesActivitat"::text::"DiesSetmana_new"[]);
ALTER TYPE "DiesSetmana" RENAME TO "DiesSetmana_old";
ALTER TYPE "DiesSetmana_new" RENAME TO "DiesSetmana";
DROP TYPE "public"."DiesSetmana_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TCategoria_new" AS ENUM ('SUB_8', 'SUB_10', 'SUB_12', 'SUB_14', 'SUB_16', 'SUB_20', 'SUB_23', 'SENIOR', 'MASTER', 'G_A_S', 'INDIVIDUAL', 'NO_ATLETA');
ALTER TABLE "Categoria" ALTER COLUMN "tipus" TYPE "TCategoria_new" USING ("tipus"::text::"TCategoria_new");
ALTER TYPE "TCategoria" RENAME TO "TCategoria_old";
ALTER TYPE "TCategoria_new" RENAME TO "TCategoria";
DROP TYPE "public"."TCategoria_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TEstat_new" AS ENUM ('PENDENT', 'PAGAT', 'CANCELAT');
ALTER TABLE "public"."Pagament" ALTER COLUMN "estat" DROP DEFAULT;
ALTER TABLE "Pagament" ALTER COLUMN "estat" TYPE "TEstat_new" USING ("estat"::text::"TEstat_new");
ALTER TYPE "TEstat" RENAME TO "TEstat_old";
ALTER TYPE "TEstat_new" RENAME TO "TEstat";
DROP TYPE "public"."TEstat_old";
ALTER TABLE "Pagament" ALTER COLUMN "estat" SET DEFAULT 'PENDENT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TQuota_new" AS ENUM ('LLICENCIA', 'ACTIVITAT', 'COMPETICIO', 'SOCI');
ALTER TABLE "QuotaConfig" ALTER COLUMN "tipus" TYPE "TQuota_new" USING ("tipus"::text::"TQuota_new");
ALTER TYPE "TQuota" RENAME TO "TQuota_old";
ALTER TYPE "TQuota_new" RENAME TO "TQuota";
DROP TYPE "public"."TQuota_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TUsuari_new" AS ENUM ('ADMIN', 'SOCI', 'NO_SOCI');
ALTER TABLE "Usuari" ALTER COLUMN "tipus" TYPE "TUsuari_new" USING ("tipus"::text::"TUsuari_new");
ALTER TYPE "TUsuari" RENAME TO "TUsuari_old";
ALTER TYPE "TUsuari_new" RENAME TO "TUsuari";
DROP TYPE "public"."TUsuari_old";
COMMIT;

-- AlterTable
ALTER TABLE "Pagament" ALTER COLUMN "estat" SET DEFAULT 'PENDENT';

-- AlterTable
ALTER TABLE "Usuari" ADD COLUMN     "firebaseUid" TEXT NOT NULL,
ALTER COLUMN "tipus" SET DEFAULT 'NO_SOCI';

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_tipus_key" ON "Categoria"("tipus");

-- CreateIndex
CREATE UNIQUE INDEX "Prova_nom_key" ON "Prova"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_nom_key" ON "Ranking"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Usuari_firebaseUid_key" ON "Usuari"("firebaseUid");
