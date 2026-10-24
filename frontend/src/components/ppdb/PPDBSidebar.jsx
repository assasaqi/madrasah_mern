import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  School,
  LayoutDashboard,
  FileEdit,
  X,
  User,
  LogOut
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function PPDBSidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login: setAuthContext } = useContext(AuthContext);

  const isDashboardActive = location.pathname === '/ppdb/dashboard';
  const isFormulirActive = location.pathname === '/ppdb/formulir';

  // Memproses sesi keluar akun pendaftar dan membersihkan state global
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setAuthContext) setAuthContext(null);
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto flex flex-col justify-between print:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-6 bg-slate-950/50 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/50">
                <School size={20} />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm tracking-wide">PORTAL PPDB</h1>
                <p className="text-[10px] text-slate-400 font-medium">Dashboard Pendaftar</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Menu Utama
            </div>

            <Link
              to="/ppdb/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition font-semibold ${
                isDashboardActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/ppdb/formulir"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                isFormulirActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/40'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <FileEdit size={16} />
              <span>Formulir & Dokumen</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 border border-slate-700">
                <User size={16} />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.nama || 'Pendaftar'}</p>
                <p className="text-[10px] text-slate-400 truncate">Siswa Baru</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden print:hidden"
        />
      )}
    </>
  );
}
