/*
  Warnings:

  - You are about to drop the column `gambarUrl` on the `berita` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `berita` DROP FOREIGN KEY `berita_kategoriId_fkey`;

-- DropIndex
DROP INDEX `berita_kategoriId_fkey` ON `berita`;

-- AlterTable
ALTER TABLE `berita` DROP COLUMN `gambarUrl`,
    ADD COLUMN `gambar` VARCHAR(191) NULL,
    MODIFY `kategoriId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `pendaftaranppdb` MODIFY `status` ENUM('BELUM_ISI', 'DITINJAU', 'LULUS_ADMINISTRASI', 'TIDAK_LULUS', 'LULUS_FINAL') NOT NULL DEFAULT 'BELUM_ISI';

-- AddForeignKey
ALTER TABLE `berita` ADD CONSTRAINT `berita_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `kategoriBerita`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
