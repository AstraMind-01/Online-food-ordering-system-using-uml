import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authService, deliveryService } from '../../services/api';

export default function DeliveryLayout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isOnline, setIsOnline] = useState(true);
  const [isTogglingOnline, setIsTogglingOnline] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      // 1. Fetch available orders count
      const available = await deliveryService.getAvailable();
      if (Array.isArray(available)) {
        setAvailableCount(available.length);
      }
    } catch {
      // Ignore poll error
    }

    try {
      // 2. Fetch active assigned deliveries count
      const assigned = await deliveryService.getAssigned();
      if (Array.isArray(assigned)) {
        setActiveCount(assigned.length);
      }
    } catch {
      // Ignore poll error
    }
  }, []);

  useEffect(() => {
    // Initial fetch of profile details
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (typeof user.online === 'boolean') {
        setIsOnline(user.online);
      }
    }
    loadData();

    // 15s Polling for real-time dispatch updates
    const interval = setInterval(() => {
      loadData();
    }, 15000);

    return () => clearInterval(interval);
  }, [loadData]);

  const handleToggleOnline = async () => {
    setIsTogglingOnline(true);
    try {
      const updated = await authService.toggleOnline();
      if (updated && typeof updated.online === 'boolean') {
        setIsOnline(updated.online);
        const stored = authService.getCurrentUser();
        if (stored) {
          stored.online = updated.online;
          localStorage.setItem('user', JSON.stringify(stored));
          setCurrentUser({ ...stored });
        }
      } else {
        setIsOnline(!isOnline);
      }
      await loadData();
    } catch (err) {
      console.error('Failed to toggle status:', err);
      setIsOnline(!isOnline);
    } finally {
      setIsTogglingOnline(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/delivery/dashboard', label: 'Dashboard', icon: 'speed' },
    { to: '/delivery/available', label: 'Available Orders', icon: 'inventory_2', badge: availableCount > 0 ? availableCount : null },
    { to: '/delivery/deliveries', label: 'My Deliveries', icon: 'local_shipping', badge: activeCount > 0 ? activeCount : null },
    { to: '/delivery/history', label: 'Delivery History', icon: 'history_edu' },
    { to: '/delivery/profile', label: 'Courier Profile', icon: 'badge' },
  ];

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#231916] flex flex-col font-body-md select-none relative overflow-x-hidden">
      {/* Background Decorative Halftone & Sunburst */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 retro-halftone"></div>
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] pointer-events-none z-0 opacity-15 animate-sunburst">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#cb4926] fill-current">
          {Array.from({ length: 16 }).map((_, i) => (
            <polygon key={i} points="50,50 46,0 54,0" transform={`rotate(${i * 22.5} 50 50)`} />
          ))}
        </svg>
      </div>

      {/* TOP DISPATCH BAR */}
      <header className="sticky top-0 z-30 bg-[#fff8f6] border-b-[3px] border-[#231916] shadow-[0_3px_0px_#231916] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#cb4926] border-2 border-[#231916] flex items-center justify-center shadow-[2px_2px_0px_#231916] text-white font-extrabold text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-lg text-lg uppercase font-black tracking-wide text-[#231916]">
                Road Runner Dispatch Depot
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase font-label-sm bg-[#fdc65c] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
                COURIER PORTAL
              </span>
            </div>
            <p className="text-xs font-medium text-[#59413b]">
              Fast Vintage Delivery • Hot Meals on Route 66
            </p>
          </div>
        </div>

        {/* Top Bar Actions & Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Available runs indicator */}
          <div
            onClick={() => navigate('/delivery/available')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f7e4de] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] cursor-pointer hover:bg-[#ffece6] transition-all"
            title="Available orders ready for pickup"
          >
            <span className="material-symbols-outlined text-lg text-[#cb4926]">fastfood</span>
            <span className="text-xs font-extrabold uppercase">
              Available: <span className="text-[#cb4926]">{availableCount}</span>
            </span>
          </div>

          {/* Active runs indicator */}
          <div
            onClick={() => navigate('/delivery/deliveries')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#ffdea7] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] cursor-pointer hover:bg-[#ffe7b8] transition-all"
            title="Current active deliveries in progress"
          >
            <span className="material-symbols-outlined text-lg text-[#231916]">two_wheeler</span>
            <span className="text-xs font-extrabold uppercase">
              On Road: <span className="text-[#231916]">{activeCount}</span>
            </span>
          </div>

          {/* Online / Offline Driver Toggle */}
          <div className="flex items-center gap-2 bg-[#f7e4de] px-3.5 py-1.5 rounded-xl border-2 border-[#231916] shadow-[2px_2px_0px_#231916]">
            <span className="hidden sm:inline text-xs font-bold font-label-md uppercase text-[#231916]">
              DUTY:
            </span>
            <button
              onClick={handleToggleOnline}
              disabled={isTogglingOnline}
              className={`px-3 py-1 text-xs font-black uppercase rounded-lg border-2 border-[#231916] shadow-[1px_1px_0px_#231916] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                isOnline
                  ? 'bg-[#5e7d56] text-[#f8fff0]'
                  : 'bg-[#cb4926] text-white'
              }`}
            >
              {isOnline ? '● ONLINE & READY' : '○ OFFLINE (BREAK)'}
            </button>
          </div>

          {/* Customer View Link */}
          <NavLink
            to="/"
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-[#fff8f6] border-2 border-[#231916] text-xs font-bold font-label-md uppercase hover:bg-[#fff1ec] shadow-[2px_2px_0px_#231916] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            <span className="hidden sm:inline">Diner View</span>
          </NavLink>
        </div>
      </header>

      {/* MAIN BODY: SIDEBAR + CONTENT */}
      <div className="flex flex-1 z-10">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-[#fff8f6] border-r-[3px] border-[#231916] shadow-[3px_0px_0px_#231916] p-4 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-65px)]">
          <nav className="space-y-1.5">
            <div className="px-3 py-1 mb-2 font-label-sm text-[11px] font-extrabold uppercase text-[#8d716a] tracking-wider">
              Dispatch Navigation
            </div>

            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#fdc65c] text-[#231916] font-extrabold border-[2.5px] border-[#231916] shadow-[3px_3px_0px_#231916] translate-x-1'
                      : 'text-[#59413b] font-bold border-[2.5px] border-transparent hover:border-[#231916] hover:bg-[#fff1ec] hover:text-[#231916]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[11px] font-black bg-[#cb4926] text-white rounded-full border border-[#231916] shadow-[1px_1px_0px_#231916]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Courier Card & Logout */}
          <div className="pt-4 border-t-2 border-dashed border-[#231916] space-y-2">
            <div className="px-3 py-2 bg-[#f7e4de] rounded-xl border-2 border-[#231916] text-xs">
              <div className="flex items-center justify-between">
                <span className="block font-bold text-[#231916] uppercase truncate">
                  {currentUser?.name || 'Speedy Sam'}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full border border-[#231916] ${isOnline ? 'bg-[#5e7d56]' : 'bg-[#cb4926]'}`}></span>
              </div>
              <span className="text-[#8d716a] text-[11px] truncate block font-mono">
                {currentUser?.vehicleNumber || 'TX-ROAD-77'} • {currentUser?.vehicleType || 'Motorcycle'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#ffdad6] text-[#93000a] font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#ffb4a1] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Clock Out / Logout</span>
            </button>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet
            context={{
              currentUser,
              setCurrentUser,
              isOnline,
              setIsOnline,
              handleToggleOnline,
              availableCount,
              activeCount,
              refreshData: loadData,
            }}
          />
        </main>
      </div>
    </div>
  );
}
