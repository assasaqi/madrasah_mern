import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation, Link, useOutletContext } from 'react-router-dom';
import {
  Printer,
  LogOut,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  FileText,
  FileCheck,
  ChevronRight,
  ChevronDown,
  Loader2,
  Check,
  Menu,
  ShieldCheck,
  Calendar,
  CreditCard,
  Mail,
  Shield
} from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
// Perbarui path impor dari folder ppdb ke subfolder documents
import SuratKeteranganLulus from '../../components/ppdb/documents/SuratKeteranganLulus';

export default function PPDBDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { user, login: setAuthContext } = useContext(AuthContext);
  const { setSidebarOpen } = useOutletContext() || {};

  const [pendaftaran, setPendaftaran] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Memuat data status pendaftaran PPDB pengguna saat komponen dipasang
  useEffect(() => {
    fetchStatusPPDB();
  }, [location]);

  // Menutup dropdown profil pengguna jika mengklik area di luar elemen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mengambil status pendaftaran PPDB dari API backend
  const fetchStatusPPDB = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ppdb/status');
      if (response.data && (response.data.status || response.data.id)) {
        setPendaftaran(response.data);
      } else {
        setPendaftaran(null);
      }
    } catch (error) {
      console.error('Gagal mengambil status PPDB:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memproses sesi keluar akun pendaftar dan membersihkan state global
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setAuthContext) setAuthContext(null);
    navigate('/login');
  };

  // Memicu dialog cetak dokumen bukti pendaftaran
  const handleCetakBukti = () => {
    window.print();
  };

  const statusPPDB = pendaftaran?.status || 'BELUM_ISI';
  const hasBiodataOrtu = !!pendaftaran && !!pendaftaran.biodata && !!pendaftaran.orangTua;

  const dokumenList = pendaftaran?.dokumen || [];
  const totalUploadedDocs = ['KARTU_KELUARGA', 'AKTA_KELAHIRAN', 'PAS_FOTO'].filter((docType) =>
    dokumenList.some((d) => d.jenisDokumen === docType)
  ).length;

  const hasAllDocs = totalUploadedDocs === 3;

  // Menentukan lencana status pendaftaran berdasarkan kondisi saat ini
  const getStatusBadge = () => {
    switch (statusPPDB) {
      case 'DITINJAU':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={14} /> Berkas Sedang Ditinjau
          </span>
        );
      case 'LULUS_ADMINISTRASI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={14} /> Lulus Administrasi
          </span>
        );
      case 'TIDAK_LULUS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <AlertCircle size={14} /> Tidak Lulus
          </span>
        );
      case 'LULUS_FINAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Award size={14} /> Selamat! Lulus Final
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <AlertCircle size={14} /> Formulir Belum Dilengkapi
          </span>
        );
    }
  };

  const timelineSteps = [
    {
      id: 1,
      title: 'Pembuatan Akun Pendaftar',
      description: 'Registrasi akun portal PPDB berhasil dibuat.',
      isCompleted: true,
      isActive: false,
      date: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : 'Selesai',
    },
    {
      id: 2,
      title: 'Pengisian Biodata & Data Orang Tua',
      description: 'Kelengkapan informasi calon siswa, sekolah asal, dan kontak ortu.',
      isCompleted: hasBiodataOrtu,
      isActive: !hasBiodataOrtu,
      date: hasBiodataOrtu && pendaftaran?.createdAt
        ? new Date(pendaftaran.createdAt).toLocaleDateString('id-ID')
        : 'Belum diisi',
    },
    {
      id: 3,
      title: 'Verifikasi Berkas Administrasi',
      description: 'Pemeriksaan dokumen KK, Akta Kelahiran, dan Pas Foto oleh Panitia PPDB.',
      isCompleted: hasAllDocs || ['LULUS_ADMINISTRASI', 'LULUS_FINAL'].includes(statusPPDB),
      isActive: hasBiodataOrtu && !hasAllDocs && statusPPDB === 'DITINJAU',
      date: ['LULUS_ADMINISTRASI', 'LULUS_FINAL', 'DITINJAU'].includes(statusPPDB)
        ? (statusPPDB === 'DITINJAU' ? 'Sedang Diproses' : 'Selesai')
        : (hasAllDocs ? 'Selesai' : 'Menunggu Dokumen'),
    },
    {
      id: 4,
      title: 'Pengumuman Kelulusan Akhir',
      description: 'Penetapan hasil seleksi final penerimaan siswa baru madrasah.',
      isCompleted: ['LULUS_FINAL', 'TIDAK_LULUS'].includes(statusPPDB),
      isActive: statusPPDB === 'LULUS_ADMINISTRASI',
      date: ['LULUS_FINAL', 'TIDAK_LULUS'].includes(statusPPDB) ? 'Diterbitkan' : 'Menunggu',
    },
  ];

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center text-emerald-600 gap-2 font-sans">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-sm font-medium">Memuat Dashboard PPDB...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 12mm 15mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 print:hidden -mx-4 -mt-4 sm:-mx-8 sm:-mt-8 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen && setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">Ringkasan Sistem PPDB</h2>
            <p className="text-[11px] text-slate-500 hidden sm:block">Status dan Garis Waktu Seleksi Penerimaan Siswa Baru</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">{getStatusBadge()}</div>

          <div className="relative pl-3 border-l border-slate-200" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition focus:outline-none cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-200 border border-emerald-500">
                <User size={18} />
              </div>
              <div className="hidden md:block text-left max-w-[130px]">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {pendaftaran?.biodata?.namaLengkap || user?.nama || 'Pendaftar'}
                </p>
                <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                  {user?.email || ''}
                </p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden">
                <div className="p-4 bg-slate-900 text-white space-y-1">
                  <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Detail Akun</p>
                  <p className="text-sm font-bold truncate">
                    {pendaftaran?.biodata?.namaLengkap || user?.nama || 'Calon Siswa'}
                  </p>
                </div>

                <div className="p-4 space-y-3 text-xs border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{user?.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Shield size={14} className="text-slate-400 shrink-0" />
                    <span className="capitalize">Role: {user?.role?.toLowerCase() || 'pendaftar'}</span>
                  </div>
                  {pendaftaran?.nomorPendaftaran && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <CreditCard size={14} className="text-slate-400 shrink-0" />
                      <span className="font-mono font-semibold text-slate-800">{pendaftaran.nomorPendaftaran}</span>
                    </div>
                  )}
                </div>

                <div className="p-2 bg-slate-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <LogOut size={14} /> Keluar dari Akun
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <SuratKeteranganLulus pendaftaran={pendaftaran} user={user} />

      <div className="space-y-6 print:hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wider">
                Sistem PPDB Online
              </span>
              <span className="text-xs text-slate-400">• Gelombang {pendaftaran?.gelombang || '1'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {pendaftaran?.biodata?.namaLengkap || user?.nama || 'Calon Siswa'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {hasBiodataOrtu
                ? `Nomor Pendaftaran Anda: ${pendaftaran.nomorPendaftaran}. Pantau ringkasan berkas dan garis waktu seleksi Anda secara langsung.`
                : 'Anda belum melengkapi formulir biodata pendaftaran. Silakan klik tombol di samping untuk melengkapi data.'}
            </p>
          </div>

          {!hasBiodataOrtu ? (
            <Link
              to="/ppdb/formulir"
              className="shrink-0 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-2"
            >
              Isi Formulir Sekarang <ChevronRight size={16} />
            </Link>
          ) : (
            <Link
              to="/ppdb/formulir"
              className="shrink-0 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition"
            >
              Edit Biodata
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Status Seleksi</span>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">No. Pendaftaran</span>
              <p className="text-sm font-bold font-mono text-slate-900">
                {pendaftaran?.nomorPendaftaran || 'Belum Terbit'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Kelengkapan Berkas</span>
              <p className="text-sm font-bold text-slate-900">
                {totalUploadedDocs} / 3 Dokumen
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileCheck size={22} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Tgl Pembaruan</span>
              <p className="text-xs font-semibold text-slate-800">
                {pendaftaran?.updatedAt ? new Date(pendaftaran.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar size={22} />
            </div>
          </div>
        </div>

        {statusPPDB === 'LULUS_ADMINISTRASI' && (
          <div className="bg-emerald-500 text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/20 text-white">
                <CheckCircle2 size={12} /> Pengumuman
              </span>
              <h3 className="text-lg font-extrabold">Selamat! Anda Dinyatakan LULUS Administrasi</h3>
              <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
                Berkas Anda telah terverifikasi. Silakan cetak Surat Keterangan Lulus resmi untuk dibawa saat proses verifikasi fisik lanjutan.
              </p>
            </div>
            <button
              onClick={handleCetakBukti}
              className="shrink-0 px-4 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-50 transition flex items-center gap-2 cursor-pointer"
            >
              <Printer size={15} /> Cetak
            </button>
          </div>
        )}

        {statusPPDB === 'LULUS_FINAL' && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white/20 text-white">
                <Award size={12} /> Seleksi Final
              </span>
              <h3 className="text-lg font-extrabold">Selamat! Anda Diterima Sebagai Siswa Baru</h3>
              <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
                Selamat bergabung! Silakan lakukan cetak bukti kelulusan final dan daftar ulang di sekretariat PPDB.
              </p>
            </div>
            <button
              onClick={handleCetakBukti}
              className="shrink-0 px-4 py-2.5 bg-white text-blue-950 font-bold text-xs rounded-xl shadow-sm hover:bg-blue-50 transition flex items-center gap-2 cursor-pointer"
            >
              <Printer size={15} /> Cetak
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Alur & Garis Waktu Seleksi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tahapan pendaftaran dan verifikasi status real-time</p>
              </div>
              {hasBiodataOrtu && (
                <Link
                  to="/ppdb/formulir"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl transition"
                >
                  Edit Data
                </Link>
              )}
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[15px] sm:before:left-[19px] before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
              {timelineSteps.map((step) => (
                <div key={step.id} className="relative group">
                  <div
                    className={`absolute -left-[24px] sm:-left-[32px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition shadow-sm ${
                      step.isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : step.isActive
                        ? 'bg-amber-500 border-amber-500 text-white animate-pulse'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {step.isCompleted ? <Check size={16} /> : step.id}
                  </div>

                  <div
                    className={`p-4 rounded-xl border transition ${
                      step.isActive
                        ? 'bg-amber-50/60 border-amber-200'
                        : step.isCompleted
                        ? 'bg-emerald-50/30 border-emerald-100'
                        : 'bg-slate-50/60 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          step.isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : step.isActive
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {step.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {hasBiodataOrtu ? (
              <>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <FileText size={18} className="text-emerald-600" /> Ringkasan Biodata
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Nama Lengkap Siswa</span>
                      <span className="font-bold text-slate-800">{pendaftaran.biodata?.namaLengkap}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400 block font-medium">NIK</span>
                        <span className="font-semibold text-slate-800">{pendaftaran.biodata?.nik || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">NISN</span>
                        <span className="font-semibold text-slate-800">{pendaftaran.biodata?.nisn || '-'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Asal Sekolah</span>
                      <span className="font-semibold text-slate-800">{pendaftaran.biodata?.asalSekolah}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-medium">Nama Ayah</span>
                        <span className="font-semibold text-slate-800">{pendaftaran.orangTua?.namaAyah}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Nama Ibu</span>
                        <span className="font-semibold text-slate-800">{pendaftaran.orangTua?.namaIbu}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">No. WhatsApp Wali</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {pendaftaran.orangTua?.noHpAyah || pendaftaran.orangTua?.noHpIbu || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <FileCheck size={18} className="text-emerald-600" /> Dokumen Terlampir
                  </h3>

                  <div className="space-y-2">
                    {['KARTU_KELUARGA', 'AKTA_KELAHIRAN', 'PAS_FOTO'].map((docType) => {
                      const isUploaded = pendaftaran.dokumen?.some((d) => d.jenisDokumen === docType);
                      const labelMap = {
                        KARTU_KELUARGA: 'Kartu Keluarga (KK)',
                        AKTA_KELAHIRAN: 'Akta Kelahiran',
                        PAS_FOTO: 'Pas Foto 3x4',
                      };

                      return (
                        <div
                          key={docType}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                        >
                          <span className="font-medium text-slate-700">{labelMap[docType]}</span>
                          {isUploaded ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Check size={12} /> Terunggah
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                              Belum
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3 text-xs text-emerald-950">
                <h4 className="font-bold text-sm text-emerald-950">Petunjuk Pendaftaran</h4>
                <p className="leading-relaxed">
                  Lengkapi data formulir pendaftaran serta unggah hasil scan Kartu Keluarga, Akta Kelahiran, dan Pas Foto untuk memproses verifikasi.
                </p>
                <Link
                  to="/ppdb/formulir"
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 underline pt-1"
                >
                  Mulai Pengisian Formulir <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
