import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PPDBSidebar from '../components/ppdb/PPDBSidebar';

export default function PPDBLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row">
      {/* Sidebar PPDB persisten, tidak re-mount saat pindah route */}
      <PPDBSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 p-4 sm:p-8 space-y-6 print:hidden">
          {/* Komponen halaman PPDB akan dirender di sini */}
          <Outlet context={{ sidebarOpen, setSidebarOpen }} />
        </main>
      </div>
    </div>
  );
}
