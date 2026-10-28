-- DropForeignKey
ALTER TABLE "AtletaRanking" DROP CONSTRAINT "AtletaRanking_usuariId_fkey";

-- DropForeignKey
ALTER TABLE "Pagament" DROP CONSTRAINT "Pagament_usuariId_fkey";

-- AddForeignKey
ALTER TABLE "Pagament" ADD CONSTRAINT "Pagament_usuariId_fkey" FOREIGN KEY ("usuariId") REFERENCES "Usuari"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtletaRanking" ADD CONSTRAINT "AtletaRanking_usuariId_fkey" FOREIGN KEY ("usuariId") REFERENCES "Usuari"("id") ON DELETE CASCADE ON UPDATE CASCADE;
