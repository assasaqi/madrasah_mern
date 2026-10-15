/*
  Warnings:

  - A unique constraint covering the columns `[pendaftaranId,jenisDokumen]` on the table `dokumenPpdb` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `pendaftaranPpdb` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `dataorangtuappdb` MODIFY `pekerjaanAyah` VARCHAR(191) NULL,
    MODIFY `noHpAyah` VARCHAR(191) NULL,
    MODIFY `pekerjaanIbu` VARCHAR(191) NULL,
    MODIFY `noHpIbu` VARCHAR(191) NULL,
    MODIFY `alamatOrangTua` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `dokumenPpdb_pendaftaranId_jenisDokumen_key` ON `dokumenPpdb`(`pendaftaranId`, `jenisDokumen`);

-- CreateIndex
CREATE UNIQUE INDEX `pendaftaranPpdb_userId_key` ON `pendaftaranPpdb`(`userId`);
