const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Mengisi data awal ke dalam database MySQL
async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);

  // Mendaftarkan akun admin utama
  const admin = await prisma.user.upsert({
    where: { email: 'admin@madrasah.sch.id' },
    update: {},
    create: {
      email: 'admin@madrasah.sch.id',
      password: hashedPassword,
      role: 'ADMIN',
      isVerified: true
    }
  });

  // Mendaftarkan data profil sekolah awal
  await prisma.profilSekolah.create({
    data: {
      namaSekolah: 'MA Negeri 1 Lombok',
      npsn: '12345678',
      akreditasi: 'A',
      tagline: 'Unggul dalam Prestasi, Anggun dalam Akhlak',
      deskripsi: 'Madrasah Aliyah Negeri unggulan dengan fasilitas dan kurikulum berbasis teknologi.',
      alamat: 'Jl. Pendidikan No. 1, Mataram, Nusa Tenggara Barat',
      email: 'info@man1lombok.sch.id',
      telepon: '0370-621234',
      whatsapp: '081234567890',
      visi: 'Terwujudnya generasi religius, cerdas, dan berdaya saing global.',
      misi: ['Menyelenggarakan pendidikan islami berkualitas', 'Meningkatkan prestasi akademik dan non-akademik']
    }
  });

  // Mendaftarkan kategori berita awal
  await prisma.kategoriBerita.createMany({
    data: [
      { nama: 'Kegiatan Sekolah', slug: 'kegiatan-sekolah' },
      { nama: 'Prestasi', slug: 'prestasi' },
      { nama: 'Pengumuman Resmi', slug: 'pengumuman-resmi' }
    ],
    skipDuplicates: true
  });

  console.log('Seeding data awal berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
