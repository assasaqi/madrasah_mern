import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import {
  User,
  Users,
  Upload,
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  Loader2,
  Check,
  Menu,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '../../services/api';
import { ppdbService } from '../../services/ppdbService';
import { AuthContext } from '../../context/AuthContext';

export default function PPDBForm() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setSidebarOpen } = useOutletContext() || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [hasBiodata, setHasBiodata] = useState(false);
  const [hasOrtu, setHasOrtu] = useState(false);
  const [hasUploadedDocs, setHasUploadedDocs] = useState(false);
  const [pendaftaranData, setPendaftaranData] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null);

  const [formData, setFormData] = useState({
    namaLengkap: '',
    nik: '',
    nisn: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'LAKI_LAKI',
    sekolahAsal: '',
    alamat: '',

    namaAyah: '',
    pekerjaanAyah: '',
    namaIbu: '',
    pekerjaanIbu: '',
    noWhatsapp: '',

    fileKK: null,
    fileAkta: null,
    fileFoto: null,
  });

  // Mengubah format ISO Date ke input format YYYY-MM-DD
  const formatIsoToDateInput = (isoString) => {
    if (!isoString) return '';
    try {
      if (isoString.length === 10 && isoString.includes('-')) return isoString;
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  };

  // Memuat data formulir pendaftaran dari API saat komponen dipasang
  useEffect(() => {
    fetchExistingData();
  }, []);

  // Ambil data pendaftaran eksisting calon siswa
  const fetchExistingData = async () => {
    try {
      setFetching(true);
      const res = await api.get('/ppdb/status');
      if (res.data && res.data.id) {
        setPendaftaranData(res.data);
        const { biodata, orangTua, dokumen } = res.data;

        if (biodata) setHasBiodata(true);
        if (orangTua) setHasOrtu(true);
        if (dokumen && dokumen.length > 0) setHasUploadedDocs(true);

        setFormData((prev) => ({
          ...prev,
          namaLengkap: biodata?.namaLengkap || '',
          nik: biodata?.nik || '',
          nisn: biodata?.nisn || '',
          tempatLahir: biodata?.tempatLahir || '',
          tanggalLahir: formatIsoToDateInput(biodata?.tanggalLahir),
          jenisKelamin: biodata?.jenisKelamin || 'LAKI_LAKI',
          sekolahAsal: biodata?.asalSekolah || '',
          alamat: biodata?.alamat || '',

          namaAyah: orangTua?.namaAyah || '',
          pekerjaanAyah: orangTua?.pekerjaanAyah || '',
          namaIbu: orangTua?.namaIbu || '',
          pekerjaanIbu: orangTua?.pekerjaanIbu || '',
          noWhatsapp: orangTua?.noHpAyah || orangTua?.noHpIbu || '',
        }));
      }
    } catch (err) {
      console.error('Gagal memuat data pendaftaran:', err);
    } finally {
      setFetching(false);
    }
  };

  // Toggle tampilan ringkasan data yang sudah diisi
  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  // Mengelola pembaruan nilai pada bidang input teks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mengelola pemilihan berkas dokumen dengan validasi ukuran
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setError('');
    if (files && files[0]) {
      const selectedFile = files[0];
      const maxSize = name === 'fileFoto' ? 1 * 1024 * 1024 : 2 * 1024 * 1024;

      if (selectedFile.size > maxSize) {
        setError(`Ukuran file ${selectedFile.name} melebihi batas maksimum (${name === 'fileFoto' ? '1MB' : '2MB'}).`);
        e.target.value = null;
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: selectedFile }));
    }
  };

  // Memvalidasi bidang input wajib dan berpindah ke langkah berikutnya
  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    if (currentStep === 1) {
      if (!formData.namaLengkap || !formData.nik || !formData.sekolahAsal || !formData.tanggalLahir) {
        setError('Harap lengkapi seluruh kolom wajib bertanda (*) di Langkah 1.');
        return;
      }
      if (formData.nik.length !== 16) {
        setError('NIK harus berisi tepat 16 digit angka.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.namaAyah || !formData.namaIbu || !formData.noWhatsapp) {
        setError('Harap lengkapi nama orang tua dan nomor WhatsApp di Langkah 2.');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  // Kembali ke langkah formulir sebelumnya
  const handlePrev = (e) => {
    e.preventDefault();
    setError('');
    setCurrentStep((prev) => prev - 1);
  };

  // Mengirimkan data formulir pendaftaran dan unggahan dokumen ke server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payloadBiodata = {
        namaLengkap: formData.namaLengkap,
        nik: formData.nik,
        nisn: formData.nisn,
        tempatLahir: formData.tempatLahir,
        tanggalLahir: formData.tanggalLahir,
        jenisKelamin: formData.jenisKelamin,
        sekolahAsal: formData.sekolahAsal,
        alamat: formData.alamat,
        namaAyah: formData.namaAyah,
        pekerjaanAyah: formData.pekerjaanAyah,
        namaIbu: formData.namaIbu,
        pekerjaanIbu: formData.pekerjaanIbu,
        noWhatsapp: formData.noWhatsapp,
      };

      await ppdbService.submitPendaftaran(payloadBiodata);

      if (formData.fileKK instanceof File) {
        await ppdbService.uploadDokumen(formData.fileKK, 'fileKK');
      }
      if (formData.fileAkta instanceof File) {
        await ppdbService.uploadDokumen(formData.fileAkta, 'fileAkta');
      }
      if (formData.fileFoto instanceof File) {
        await ppdbService.uploadDokumen(formData.fileFoto, 'fileFoto');
      }

      navigate('/ppdb/dashboard', { state: { submitted: true } });
    } catch (err) {
      console.error('Gagal Submit PPDB:', err);
      const serverMsg = err.response?.data?.message;
      const isTechError = typeof serverMsg === 'string' && (serverMsg.includes('prisma') || serverMsg.includes('pool timeout') || serverMsg.includes('invocation'));
      setError(isTechError || !serverMsg ? 'Gagal menyimpan data pendaftaran. Terjadi kendala sistem.' : serverMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-16 flex items-center justify-center text-emerald-600 gap-2 font-sans">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-sm font-medium">Memuat data formulir...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 -mx-4 -mt-4 sm:-mx-8 sm:-mt-8 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen && setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Link
              to="/ppdb/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mr-2"
            >
              <ArrowLeft size={14} /> Kembali
            </Link>
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Pengisian Formulir PPDB</h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">Lengkapi biodata diri, data orang tua, dan unggah dokumen berkas</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Langkah {currentStep} dari 3
          </span>
        </div>
      </header>

      <div className="max-w-5xl w-full mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Progres Pengisian Formulir</h3>
            {pendaftaranData && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                Mode Pembaruan Data
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setCurrentStep(1)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                currentStep === 1
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                  : hasBiodata
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  hasBiodata ? 'bg-emerald-600 text-white' : currentStep === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {hasBiodata ? <Check size={16} /> : '1'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate">1. Data Diri</p>
                <p className="text-[10px] text-slate-500 truncate">Identitas Calon Siswa</p>
              </div>
            </div>

            <div
              onClick={() => setCurrentStep(2)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                currentStep === 2
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                  : hasOrtu
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  hasOrtu ? 'bg-emerald-600 text-white' : currentStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {hasOrtu ? <Check size={16} /> : '2'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate">2. Data Orang Tua</p>
                <p className="text-[10px] text-slate-500 truncate">Kontak Ayah & Ibu</p>
              </div>
            </div>

            <div
              onClick={() => setCurrentStep(3)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                currentStep === 3
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                  : hasUploadedDocs
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  hasUploadedDocs ? 'bg-emerald-600 text-white' : currentStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {hasUploadedDocs ? <Check size={16} /> : '3'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate">3. Upload Berkas</p>
                <p className="text-[10px] text-slate-500 truncate">KK, Akta & Foto</p>
              </div>
            </div>
          </div>

          {hasBiodata && (
            <div className="pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => toggleDropdown('biodata')}
                className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                <FileText size={14} className="text-emerald-600" />
                <span>{openDropdown === 'biodata' ? 'Sembunyikan Ringkasan Terisi' : 'Lihat Ringkasan Data Terisi'}</span>
                {openDropdown === 'biodata' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {openDropdown === 'biodata' && pendaftaranData?.biodata && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div><span className="text-slate-400">Nama Siswa:</span> <strong>{pendaftaranData.biodata.namaLengkap}</strong></div>
                  <div><span className="text-slate-400">NIK:</span> <strong>{pendaftaranData.biodata.nik || '-'}</strong></div>
                  <div><span className="text-slate-400">Sekolah Asal:</span> <strong>{pendaftaranData.biodata.asalSekolah}</strong></div>
                  <div><span className="text-slate-400">Wali:</span> <strong>{pendaftaranData.orangTua?.namaAyah || pendaftaranData.orangTua?.namaIbu}</strong></div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Langkah 1: Biodata Calon Siswa</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    placeholder="Sesuai Akta Kelahiran"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (Nomor Induk Kependudukan) *</label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleChange}
                    placeholder="16 Digit NIK di KK"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NISN (Opsional)</label>
                  <input
                    type="text"
                    name="nisn"
                    maxLength={10}
                    value={formData.nisn}
                    onChange={handleChange}
                    placeholder="10 Digit NISN"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir *</label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    placeholder="Kota Tempat Lahir"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  >
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sekolah Asal *</label>
                  <input
                    type="text"
                    name="sekolahAsal"
                    value={formData.sekolahAsal}
                    onChange={handleChange}
                    placeholder="SD / MI Asal"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Tempat Tinggal Lengkap *</label>
                  <textarea
                    name="alamat"
                    rows={3}
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kab/Kota"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Users size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Langkah 2: Data Orang Tua / Wali</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Ayah *</label>
                  <input
                    type="text"
                    name="namaAyah"
                    value={formData.namaAyah}
                    onChange={handleChange}
                    placeholder="Nama Ayah Kandung"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ayah</label>
                  <input
                    type="text"
                    name="pekerjaanAyah"
                    value={formData.pekerjaanAyah}
                    onChange={handleChange}
                    placeholder="PNS / Swasta / Wiraswasta"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Ibu *</label>
                  <input
                    type="text"
                    name="namaIbu"
                    value={formData.namaIbu}
                    onChange={handleChange}
                    placeholder="Nama Ibu Kandung"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ibu</label>
                  <input
                    type="text"
                    name="pekerjaanIbu"
                    value={formData.pekerjaanIbu}
                    onChange={handleChange}
                    placeholder="Ibu Rumah Tangga / Swasta"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif Orang Tua *</label>
                  <input
                    type="text"
                    name="noWhatsapp"
                    value={formData.noWhatsapp}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Upload size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Langkah 3: Unggah Dokumen Persyaratan</h3>
              </div>

              <div className="space-y-4">
                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">1. Scan Kartu Keluarga (KK)</h4>
                    <p className="text-[11px] text-slate-500">Format: JPG, PNG, atau PDF (Maksimal 2MB)</p>
                    {formData.fileKK ? (
                      <p className="text-[11px] font-bold text-blue-600 mt-1">Dipilih: {formData.fileKK.name}</p>
                    ) : pendaftaranData?.dokumen?.some(d => d.jenisDokumen === 'KARTU_KELUARGA') ? (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        ✓ File KK Sudah Terunggah di Server
                      </span>
                    ) : null}
                  </div>
                  <input
                    type="file"
                    name="fileKK"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>

                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">2. Scan Akta Kelahiran</h4>
                    <p className="text-[11px] text-slate-500">Format: JPG, PNG, atau PDF (Maksimal 2MB)</p>
                    {formData.fileAkta ? (
                      <p className="text-[11px] font-bold text-blue-600 mt-1">Dipilih: {formData.fileAkta.name}</p>
                    ) : pendaftaranData?.dokumen?.some(d => d.jenisDokumen === 'AKTA_KELAHIRAN') ? (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        ✓ File Akta Sudah Terunggah di Server
                      </span>
                    ) : null}
                  </div>
                  <input
                    type="file"
                    name="fileAkta"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>

                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">3. Pas Foto Terbaru (3x4)</h4>
                    <p className="text-[11px] text-slate-500">Format: JPG atau PNG (Maksimal 1MB)</p>
                    {formData.fileFoto ? (
                      <p className="text-[11px] font-bold text-blue-600 mt-1">Dipilih: {formData.fileFoto.name}</p>
                    ) : pendaftaranData?.dokumen?.some(d => d.jenisDokumen === 'PAS_FOTO') ? (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        ✓ Pas Foto Sudah Terunggah di Server
                      </span>
                    ) : null}
                  </div>
                  <input
                    type="file"
                    name="fileFoto"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft size={15} /> Sebelumnya
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition cursor-pointer"
              >
                Selanjutnya <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Menyimpan Data...
                  </>
                ) : (
                  <>
                    <Send size={15} /> Simpan Perubahan
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
