import React from 'react';

export default function SuratKeteranganLulus({ pendaftaran, user }) {
  // Mengambil nilai atribut dari jalur objek bersarang
  const getField = (item, paths, fallback = '-') => {
    if (!item) return fallback;
    for (const path of paths) {
      const keys = path.split('.');
      let val = item;
      for (const k of keys) {
        val = val?.[k];
      }
      if (val !== undefined && val !== null && val !== '') {
        return val;
      }
    }
    return fallback;
  };

  const statusPPDB = String(pendaftaran?.status || 'BELUM_ISI').toUpperCase();

  const nomorPendaftaran = getField(pendaftaran, ['nomorPendaftaran', 'noPendaftaran', 'no_pendaftaran'], '001');
  const namaSiswa = getField(pendaftaran, ['biodata.namaLengkap', 'namaLengkap', 'nama_lengkap', 'nama'], user?.nama || '-');
  const nisn = getField(pendaftaran, ['biodata.nisn', 'nisn'], '-');
  const nik = getField(pendaftaran, ['biodata.nik', 'nik'], '-');
  const tempatLahir = getField(pendaftaran, ['biodata.tempatLahir', 'tempatLahir'], '-');
  const rawTanggalLahir = getField(pendaftaran, ['biodata.tanggalLahir', 'tanggalLahir'], null);
  const asalSekolah = getField(pendaftaran, ['biodata.asalSekolah', 'asalSekolah', 'asal_sekolah'], '-');

  const namaAyah = getField(pendaftaran, ['orangTua.namaAyah', 'namaAyah'], '');
  const namaIbu = getField(pendaftaran, ['orangTua.namaIbu', 'namaIbu'], '');
  const namaOrangTua = namaAyah || namaIbu ? [namaAyah, namaIbu].filter(Boolean).join(' / ') : '-';

  // Format tanggal kelahiran siswa
  const formattedTanggalLahir = rawTanggalLahir
    ? new Date(rawTanggalLahir).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  return (
    <div className="hidden print:block font-sans text-slate-900 max-w-[210mm] mx-auto p-8 bg-white border border-slate-200 rounded-none shadow-none leading-relaxed text-xs">
      {/* HEADER KOP SURAT MODERN */}
      <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-sm border border-emerald-500">
            MAN1
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
              KEMENTERIAN AGAMA REPUBLIK INDONESIA
            </h4>
            <h2 className="text-base font-black uppercase tracking-tight text-slate-900">
              MADRASAH ALIYAH NEGERI 1
            </h2>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Jl. Pendidikan No. 45, Kota Nusantara | Telp: (021) 7654321 | Web: www.madrasah.sch.id
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 tracking-wider">
            DOKUMEN RESMI PPDB
          </span>
        </div>
      </div>

      {/* JUDUL SURAT & NOMOR */}
      <div className="text-center my-6 space-y-1">
        <h3 className="text-base font-black uppercase tracking-wider text-slate-900">
          SURAT KETERANGAN KELULUSAN
        </h3>
        <p className="text-xs font-mono text-slate-500 font-semibold">
          Nomor: PPDB/SKL/2026/{nomorPendaftaran}
        </p>
      </div>

      <p className="mb-4 text-justify text-slate-700 leading-relaxed">
        Panitia Penerimaan Peserta Didik Baru (PPDB) Madrasah Aliyah Negeri 1 menerangkan bahwa berdasarkan hasil verifikasi dokumen dan tahapan seleksi penerimaan peserta didik baru Tahun Ajaran 2026/2027, dengan ini menyatakan bahwa:
      </p>

      {/* TAMPILAN DATA SISWA GRID MODERN */}
      <div className="my-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-200/60">
          <span className="font-semibold text-slate-500">Nomor Pendaftaran</span>
          <span className="col-span-2 font-black font-mono text-emerald-700 text-sm">{nomorPendaftaran}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-200/60">
          <span className="font-semibold text-slate-500">Nama Lengkap Siswa</span>
          <span className="col-span-2 font-bold uppercase text-slate-900">{namaSiswa}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-200/60">
          <span className="font-semibold text-slate-500">NISN / NIK</span>
          <span className="col-span-2 font-medium text-slate-800">{nisn} / {nik}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-200/60">
          <span className="font-semibold text-slate-500">Tempat, Tanggal Lahir</span>
          <span className="col-span-2 font-medium text-slate-800">{tempatLahir}, {formattedTanggalLahir}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-200/60">
          <span className="font-semibold text-slate-500">Asal Sekolah</span>
          <span className="col-span-2 font-medium text-slate-800">{asalSekolah}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 py-1.5">
          <span className="font-semibold text-slate-500">Nama Orang Tua / Wali</span>
          <span className="col-span-2 font-medium text-slate-800">{namaOrangTua}</span>
        </div>
      </div>

      {/* KOTAK STATUS KELULUSAN */}
      <div className="my-6 p-5 border-2 border-emerald-500 text-center rounded-2xl bg-emerald-50/40 space-y-1">
        <p className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-800">
          HASIL SELEKSI PENERIMAAN:
        </p>
        <p className="text-base sm:text-lg font-black uppercase tracking-widest text-emerald-950">
          {statusPPDB === 'LULUS_FINAL'
            ? 'LULUS SELEKSI FINAL / DITERIMA'
            : 'LULUS SELEKSI ADMINISTRASI'}
        </p>
        <p className="text-xs font-medium text-slate-600">
          Sebagai Peserta Didik Baru Madrasah Aliyah Negeri 1 Tahun Ajaran 2026/2027
        </p>
      </div>

      <p className="text-xs leading-relaxed mb-8 text-justify text-slate-600">
        Demikian Surat Keterangan Kelulusan ini diterbitkan secara resmi sebagai bukti sah untuk pendaftaran ulang serta verifikasi fisik dokumen lanjutan di sekretariat PPDB.
      </p>

      {/* TANDA TANGAN DUA KOLOM */}
      <div className="grid grid-cols-2 gap-8 mt-10 text-xs">
        <div className="text-center space-y-12">
          <p className="font-semibold text-slate-600">Ketua Panitia PPDB,</p>
          <div>
            <p className="font-extrabold text-slate-900 uppercase underline">H. Ahmad Dahlan, M.Pd.</p>
            <p className="text-[10px] text-slate-500 font-mono">NIP. 19780512 200501 1 002</p>
          </div>
        </div>

        <div className="text-center space-y-12">
          <p className="font-semibold text-slate-600">
            Nusantara,{' '}
            {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            <br />
            Kepala Madrasah,
          </p>
          <div>
            <p className="font-extrabold text-slate-900 uppercase underline">Drs. H. Muhammad Ridwan, M.Ag.</p>
            <p className="text-[10px] text-slate-500 font-mono">NIP. 19690315 199403 1 003</p>
          </div>
        </div>
      </div>
    </div>
  );
}
