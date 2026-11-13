-- AlterTable
ALTER TABLE "Usuari" ADD COLUMN     "entrenador" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usuariFamiliarId" TEXT;

-- AddForeignKey
ALTER TABLE "Usuari" ADD CONSTRAINT "Usuari_usuariFamiliarId_fkey" FOREIGN KEY ("usuariFamiliarId") REFERENCES "Usuari"("id") ON DELETE SET NULL ON UPDATE CASCADE;
