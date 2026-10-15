import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Kontak() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-12 pb-16 font-sans">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-600/60 text-emerald-100 border border-emerald-400/30">
            Hubungi Kami
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Kontak & Lokasi</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Punya pertanyaan seputar pendaftaran PPDB, informasi akademik, atau layanan madrasah? Kami siap membantu Anda.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Grid Kartu Informasi Kontak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin size={22} />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Alamat Utama</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Jl. Pendidikan No. 123, Kel. Sukamaju, Kec. Madani, Kota Madrasah 12345
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone size={22} />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Telepon & WhatsApp</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              (021) 555-0192 / +62 812-3456-7890 (Layanan PPDB)
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Mail size={22} />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Alamat Email</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              info@madrasah.sch.id<br />ppdb@madrasah.sch.id
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock size={22} />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Jam Operasional</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Senin - Jumat: 07.00 - 15.30 WIB<br />Sabtu: 08.00 - 12.00 WIB
            </p>
          </div>
        </div>

        {/* Section Form Pesan & Peta Lokasi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Pertanyaan */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kirim Pertanyaan</h2>
              <p className="text-xs text-gray-500 mt-1">Isi formulir di bawah ini untuk mengirimkan pesan langsung ke sekretariat madrasah.</p>
            </div>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs font-medium leading-relaxed">
                  Pesan Anda telah berhasil terkirim! Tim sekretariat kami akan segera menghubungi Anda melalui email.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Ahmad Fauzi"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
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
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
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
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Pesan</label>
                <textarea
                  name="pesan"
                  rows={4}
                  required
                  value={formData.pesan}
                  onChange={handleChange}
                  placeholder="Tuliskan pertanyaan atau pesan Anda secara lengkap..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-50 shadow-md shadow-emerald-200"
              >
                {loading ? 'Memproses...' : (
                  <>
                    <Send size={16} /> Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Peta Lokasi */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 flex flex-col h-full justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Peta Lokasi</h2>
              <p className="text-xs text-gray-500 mt-1">Lokasi kampus madrasah dapat diakses dengan mudah melalui peta digital.</p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 h-[380px] bg-gray-100">
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
