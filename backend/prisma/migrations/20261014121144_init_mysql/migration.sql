-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'GURU', 'SISWA', 'ORANG_TUA', 'CALON_PENDAFTAR') NOT NULL DEFAULT 'CALON_PENDAFTAR',
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `emailToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategoriBerita` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `kategoriBerita_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `berita` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `konten` TEXT NOT NULL,
    `gambarUrl` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `authorId` VARCHAR(191) NOT NULL,
    `kategoriId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `berita_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengumuman` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `konten` TEXT NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pengumuman_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `galeri` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanKontak` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subjek` VARCHAR(191) NOT NULL,
    `pesan` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendaftaranPpdb` (
    `id` VARCHAR(191) NOT NULL,
    `nomorPendaftaran` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('DITINJAU', 'LULUS_ADMINISTRASI', 'TIDAK_LULUS', 'LULUS_FINAL') NOT NULL DEFAULT 'DITINJAU',
    `gelombang` VARCHAR(191) NOT NULL DEFAULT 'Gelombang 1',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pendaftaranPpdb_nomorPendaftaran_key`(`nomorPendaftaran`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `biodataSiswaPpdb` (
    `id` VARCHAR(191) NOT NULL,
    `pendaftaranId` VARCHAR(191) NOT NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(191) NULL,
    `nik` VARCHAR(191) NULL,
    `tempatLahir` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NOT NULL,
    `jenisKelamin` ENUM('LAKI_LAKI', 'PEREMPUAN') NOT NULL,
    `agama` VARCHAR(191) NOT NULL DEFAULT 'Islam',
    `alamat` TEXT NOT NULL,
    `asalSekolah` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `biodataSiswaPpdb_pendaftaranId_key`(`pendaftaranId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dataOrangTuaPpdb` (
    `id` VARCHAR(191) NOT NULL,
    `pendaftaranId` VARCHAR(191) NOT NULL,
    `namaAyah` VARCHAR(191) NOT NULL,
    `pekerjaanAyah` VARCHAR(191) NOT NULL,
    `noHpAyah` VARCHAR(191) NOT NULL,
    `namaIbu` VARCHAR(191) NOT NULL,
    `pekerjaanIbu` VARCHAR(191) NOT NULL,
    `noHpIbu` VARCHAR(191) NOT NULL,
    `alamatOrangTua` TEXT NOT NULL,

    UNIQUE INDEX `dataOrangTuaPpdb_pendaftaranId_key`(`pendaftaranId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumenPpdb` (
    `id` VARCHAR(191) NOT NULL,
    `pendaftaranId` VARCHAR(191) NOT NULL,
    `jenisDokumen` ENUM('PAS_FOTO', 'KARTU_KELUARGA', 'AKTA_KELAHIRAN', 'IJAZAH', 'SKHU') NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tahunAjaran` (
    `id` VARCHAR(191) NOT NULL,
    `tahun` VARCHAR(191) NOT NULL,
    `semester` ENUM('GANJIL', 'GENAP') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guru` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `nip` VARCHAR(191) NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NULL,
    `jenisKelamin` ENUM('LAKI_LAKI', 'PEREMPUAN') NOT NULL,

    UNIQUE INDEX `guru_userId_key`(`userId`),
    UNIQUE INDEX `guru_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas` (
    `id` VARCHAR(191) NOT NULL,
    `namaKelas` VARCHAR(191) NOT NULL,
    `tingkat` INTEGER NOT NULL,
    `tahunAjaranId` VARCHAR(191) NOT NULL,
    `waliKelasId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orangTua` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NOT NULL,
    `alamat` TEXT NOT NULL,

    UNIQUE INDEX `orangTua_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `siswa` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `nis` VARCHAR(191) NOT NULL,
    `nisn` VARCHAR(191) NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `jenisKelamin` ENUM('LAKI_LAKI', 'PEREMPUAN') NOT NULL,
    `kelasId` VARCHAR(191) NOT NULL,
    `orangTuaId` VARCHAR(191) NULL,

    UNIQUE INDEX `siswa_userId_key`(`userId`),
    UNIQUE INDEX `siswa_nis_key`(`nis`),
    UNIQUE INDEX `siswa_nisn_key`(`nisn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mataPelajaran` (
    `id` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kelompok` VARCHAR(191) NULL,

    UNIQUE INDEX `mataPelajaran_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai` (
    `id` VARCHAR(191) NOT NULL,
    `siswaId` VARCHAR(191) NOT NULL,
    `mataPelajaranId` VARCHAR(191) NOT NULL,
    `kelasId` VARCHAR(191) NOT NULL,
    `tahunAjaranId` VARCHAR(191) NOT NULL,
    `nilaiTugas` DOUBLE NOT NULL DEFAULT 0,
    `nilaiUTS` DOUBLE NOT NULL DEFAULT 0,
    `nilaiUAS` DOUBLE NOT NULL DEFAULT 0,
    `nilaiAkhir` DOUBLE NOT NULL DEFAULT 0,
    `grade` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `absensi` (
    `id` VARCHAR(191) NOT NULL,
    `siswaId` VARCHAR(191) NOT NULL,
    `kelasId` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `status` ENUM('HADIR', 'IZIN', 'SAKIT', 'ALPA') NOT NULL,
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tahfidz` (
    `id` VARCHAR(191) NOT NULL,
    `siswaId` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `surah` VARCHAR(191) NOT NULL,
    `ayatMulai` INTEGER NOT NULL,
    `ayatSelesai` INTEGER NOT NULL,
    `predikat` ENUM('MUMTAZ', 'JAYYID_JIDDAN', 'JAYYID', 'MAQBUL') NOT NULL,
    `catatan` VARCHAR(191) NULL,
    `pembimbingId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `berita` ADD CONSTRAINT `berita_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `berita` ADD CONSTRAINT `berita_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `kategoriBerita`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaranPpdb` ADD CONSTRAINT `pendaftaranPpdb_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `biodataSiswaPpdb` ADD CONSTRAINT `biodataSiswaPpdb_pendaftaranId_fkey` FOREIGN KEY (`pendaftaranId`) REFERENCES `pendaftaranPpdb`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dataOrangTuaPpdb` ADD CONSTRAINT `dataOrangTuaPpdb_pendaftaranId_fkey` FOREIGN KEY (`pendaftaranId`) REFERENCES `pendaftaranPpdb`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumenPpdb` ADD CONSTRAINT `dokumenPpdb_pendaftaranId_fkey` FOREIGN KEY (`pendaftaranId`) REFERENCES `pendaftaranPpdb`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guru` ADD CONSTRAINT `guru_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_tahunAjaranId_fkey` FOREIGN KEY (`tahunAjaranId`) REFERENCES `tahunAjaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_waliKelasId_fkey` FOREIGN KEY (`waliKelasId`) REFERENCES `guru`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orangTua` ADD CONSTRAINT `orangTua_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_orangTuaId_fkey` FOREIGN KEY (`orangTuaId`) REFERENCES `orangTua`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_siswaId_fkey` FOREIGN KEY (`siswaId`) REFERENCES `siswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_mataPelajaranId_fkey` FOREIGN KEY (`mataPelajaranId`) REFERENCES `mataPelajaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_tahunAjaranId_fkey` FOREIGN KEY (`tahunAjaranId`) REFERENCES `tahunAjaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absensi` ADD CONSTRAINT `absensi_siswaId_fkey` FOREIGN KEY (`siswaId`) REFERENCES `siswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absensi` ADD CONSTRAINT `absensi_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tahfidz` ADD CONSTRAINT `tahfidz_siswaId_fkey` FOREIGN KEY (`siswaId`) REFERENCES `siswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tahfidz` ADD CONSTRAINT `tahfidz_pembimbingId_fkey` FOREIGN KEY (`pembimbingId`) REFERENCES `guru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
