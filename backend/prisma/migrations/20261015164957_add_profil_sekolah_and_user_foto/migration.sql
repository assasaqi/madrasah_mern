-- AlterTable
ALTER TABLE `users` ADD COLUMN `foto` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `profilSekolah` (
    `id` VARCHAR(191) NOT NULL,
    `namaSekolah` VARCHAR(191) NOT NULL DEFAULT 'MA Negeri 1 Contoh',
    `npsn` VARCHAR(191) NOT NULL,
    `akreditasi` VARCHAR(191) NOT NULL DEFAULT 'A',
    `tagline` VARCHAR(191) NULL,
    `deskripsi` TEXT NULL,
    `logo` VARCHAR(191) NULL,
    `banner` VARCHAR(191) NULL,
    `alamat` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `telepon` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `mapsUrl` TEXT NULL,
    `visi` TEXT NULL,
    `misi` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
