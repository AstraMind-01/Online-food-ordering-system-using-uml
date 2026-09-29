import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#231916] flex flex-col font-body-md select-none relative overflow-x-hidden">
      {/* Decorative Halftone & Sunburst */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 retro-halftone"></div>
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] pointer-events-none z-0 opacity-15 animate-sunburst">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#cb4926] fill-current">
          {Array.from({ length: 16 }).map((_, i) => (
            <polygon key={i} points="50,50 46,0 54,0" transform={`rotate(${i * 22.5} 50 50)`} />
          ))}
        </svg>
      </div>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-[#fff8f6] border-b-[3px] border-[#231916] shadow-[0_3px_0px_#231916] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#cb4926] border-2 border-[#231916] flex items-center justify-center shadow-[2px_2px_0px_#231916] text-white font-extrabold text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-lg text-lg uppercase font-black tracking-tight text-[#231916]">
                Chow Chow Control Tower
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ffdea7] text-[#231916] border border-[#231916]">
                SYSTEM ADMIN
              </span>
            </div>
            <p className="text-[11px] text-[#59413b] font-medium leading-none mt-0.5">
              Unified MySQL Cluster &bull; food_ordering_db &bull; Live Telemetry
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/"
            className="hidden sm:inline-flex px-3 py-1.5 bg-[#fff8f6] text-[#231916] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#ffece6] transition-all"
          >
            🍔 Diner Front
          </NavLink>
          <NavLink
            to="/restaurant/dashboard"
            className="hidden sm:inline-flex px-3 py-1.5 bg-[#fdc65c] text-[#231916] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#ffdea7] transition-all"
          >
            👨‍🍳 Kitchen
          </NavLink>
          <NavLink
            to="/delivery/dashboard"
            className="hidden sm:inline-flex px-3 py-1.5 bg-[#caecbe] text-[#062105] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#b8e2aa] transition-all"
          >
            🏍️ Couriers
          </NavLink>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-[#ffdad6] text-[#93000a] border-2 border-[#231916] rounded-xl text-xs font-extrabold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#ffb4ab] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 relative z-10">
        <Outlet />
      </main>

      {/* RETRO STATUS FOOTER */}
      <footer className="relative z-10 border-t-2 border-[#231916] bg-[#fff8f6] px-6 py-3 flex flex-wrap items-center justify-between text-xs text-[#59413b]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#358b28] animate-pulse"></span>
          <span className="font-bold uppercase tracking-wide">
            Chow Chow Central Command &bull; Spring Boot 3 + MySQL 8 + STOMP WebSocket
          </span>
        </div>
        <div className="font-mono text-[11px]">
          Session: Authenticated Administrator &bull; Route 66 Node
        </div>
      </footer>
    </div>
  );
}
