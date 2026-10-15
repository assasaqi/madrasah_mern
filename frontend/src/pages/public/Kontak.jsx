import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Headphones } from 'lucide-react';

export default function Kontak() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Indikator Ringkas Ticker Bar
  const stats = [
    { label: 'Layanan Sekretariat', value: 'Buka Setiap Hari Kerja' },
    { label: 'Respon Email', value: '< 24 Jam' },
    { label: 'Hotline WhatsApp', value: 'Aktif 08.00 - 16.00' },
    { label: 'Status PPDB', value: 'Gelombang 1 Dibuka' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi pengiriman pesan
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ nama: '', email: '', subjek: '', pesan: '' });
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* 1. TOP BANNER HEADER (Konsisten dengan Seluruh Halaman) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
              Hubungi Kami
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Kontak & Lokasi Madrasah
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Punya pertanyaan seputar pendaftaran PPDB, informasi akademik, atau layanan madrasah? Tim sekretariat kami siap membantu Anda.
            </p>
          </div>
          <div className="shrink-0 z-10 hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Headphones size={32} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & INDIKATOR TICKER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center overflow-x-auto gap-4 text-xs font-semibold scrollbar-none shadow-xs">
          <div className="bg-emerald-800 text-white px-4 py-2 rounded-lg font-bold uppercase shrink-0">
            PUSAT BANTUAN
          </div>
          <div className="flex items-center gap-6 divide-x divide-gray-200 shrink-0">
            {stats.map((stat, idx) => (
              <div key={idx} className="pl-6 first:pl-2 flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-gray-500 font-medium">{stat.label}</span>
                <span className="text-emerald-700 font-extrabold text-sm">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Grid 4 Kartu Informasi Kontak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-2 hover:-translate-y-0.5 transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Alamat Utama</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Jl. Pendidikan No. 123, Kel. Sukamaju, Kec. Madani, Kota Madrasah 12345
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-2 hover:-translate-y-0.5 transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Telepon & WhatsApp</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              (021) 555-0192 / +62 812-3456-7890 (PPDB)
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-2 hover:-translate-y-0.5 transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Mail size={20} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Alamat Email</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              info@madrasah.sch.id<br />ppdb@madrasah.sch.id
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-2 hover:-translate-y-0.5 transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Jam Operasional</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Senin - Jumat: 07.00 - 15.30 WIB<br />Sabtu: 08.00 - 12.00 WIB
            </p>
          </div>
        </div>

        {/* Section Form Pesan & Peta Lokasi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Form Pertanyaan */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Kirim Pertanyaan</h2>
              <p className="text-xs text-gray-500 mt-0.5">Isi formulir di bawah ini untuk mengirimkan pesan langsung ke sekretariat madrasah.</p>
            </div>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs font-medium leading-relaxed">
                  Pesan Anda telah berhasil terkirim! Tim sekretariat kami akan segera menghubungi Anda melalui email.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Ahmad Fauzi"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subjek Pertanyaan</label>
                <input
                  type="text"
                  name="subjek"
                  required
                  value={formData.subjek}
                  onChange={handleChange}
                  placeholder="Informasi Pendaftaran PPDB"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Pesan</label>
                <textarea
                  name="pesan"
                  rows={3}
                  required
                  value={formData.pesan}
                  onChange={handleChange}
                  placeholder="Tuliskan pertanyaan atau pesan Anda secara lengkap..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-900 transition cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {loading ? 'Memproses...' : (
                  <>
                    <Send size={15} /> Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Peta Lokasi */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-100 shadow-xs space-y-4 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Peta Lokasi</h2>
              <p className="text-xs text-gray-500 mt-0.5">Lokasi kampus madrasah dapat diakses dengan mudah melalui peta digital.</p>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 h-[340px] bg-gray-100">
              <iframe
                title="Peta Lokasi Madrasah"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.28318728957!2d107.573117!3d-6.914744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x14607716192a5b0!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
