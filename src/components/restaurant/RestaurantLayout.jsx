import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { authService, restaurantService, orderService } from '../../services/api';

export default function RestaurantLayout() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isTogglingOpen, setIsTogglingOpen] = useState(false);

  // Fetch restaurant details and pending orders
  const loadData = useCallback(async () => {
    try {
      const rest = await restaurantService.getMine();
      if (rest) {
        setRestaurant(rest);
        setIsOpen(rest.open);
      }
    } catch {
      // Fallback
      setRestaurant({
        id: 1,
        name: 'Chow Chow Retro Diner & Eats',
        cuisine: 'American Retro Diner',
        open: true,
      });
    }

    try {
      // Fetch new/placed orders count for notification badge
      const placedOrders = await orderService.getOrders('PLACED');
      if (Array.isArray(placedOrders)) {
        setPendingCount(placedOrders.length);
      }
    } catch {
      // Ignore poll error
    }
  }, []);

  useEffect(() => {
    loadData();

    // Poll every 15 seconds for incoming orders
    const interval = setInterval(() => {
      loadData();
    }, 15000);

    return () => clearInterval(interval);
  }, [loadData]);

  // Handle open/closed status toggle
  const handleToggleOpen = async () => {
    if (!restaurant) return;
    setIsTogglingOpen(true);
    try {
      const updated = await restaurantService.toggleOpen(restaurant.id);
      if (updated && typeof updated.open === 'boolean') {
        setIsOpen(updated.open);
      } else {
        setIsOpen(!isOpen);
      }
    } catch {
      setIsOpen(!isOpen);
    } finally {
      setIsTogglingOpen(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/restaurant/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/restaurant/orders', label: 'Orders', icon: 'receipt_long', badge: pendingCount > 0 ? pendingCount : null },
    { to: '/restaurant/group-orders', label: 'Group Orders', icon: 'diversity_3' },
    { to: '/restaurant/menu', label: 'Menu Catalog', icon: 'restaurant_menu' },
    { to: '/restaurant/payments', label: 'Payments', icon: 'payments' },
    { to: '/restaurant/deliveries', label: 'Deliveries', icon: 'local_shipping' },
    { to: '/restaurant/profile', label: 'Diner Profile', icon: 'storefront' },
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

      {/* TOP BAR */}
      <header className="sticky top-0 z-30 bg-[#fff8f6] border-b-[3px] border-[#231916] shadow-[0_3px_0px_#231916] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#cb4926] border-2 border-[#231916] flex items-center justify-center shadow-[2px_2px_0px_#231916] text-white font-extrabold text-lg">
            ★
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-lg text-lg uppercase font-black tracking-wide text-[#231916]">
                {restaurant?.name || 'Chow Chow Retro Diner & Eats'}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase font-label-sm bg-[#ffdea7] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
                OWNER PANEL
              </span>
            </div>
            <p className="text-xs font-medium text-[#59413b]">
              Kitchen Order Management & Booth Dispatch System
            </p>
          </div>
        </div>

        {/* Top Bar Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell Badge */}
          <div
            onClick={() => navigate('/restaurant/orders')}
            className="relative cursor-pointer w-10 h-10 rounded-xl bg-[#fff8f6] border-2 border-[#231916] shadow-[2px_2px_0px_#231916] flex items-center justify-center hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            title={`${pendingCount} new incoming orders`}
          >
            <span className="material-symbols-outlined text-[#231916] text-2xl">
              notifications
            </span>
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[20px] text-center bg-[#cb4926] text-white text-[11px] font-black rounded-full border-2 border-[#231916] shadow-[1px_1px_0px_#231916] animate-pulse">
                {pendingCount}
              </span>
            )}
          </div>

          {/* Open / Closed Diner Toggle */}
          <div className="flex items-center gap-2 bg-[#f7e4de] px-3.5 py-1.5 rounded-xl border-2 border-[#231916] shadow-[2px_2px_0px_#231916]">
            <span className="text-xs font-bold font-label-md uppercase text-[#231916]">
              DINER STATUS:
            </span>
            <button
              onClick={handleToggleOpen}
              disabled={isTogglingOpen}
              className={`px-3 py-1 text-xs font-black uppercase rounded-lg border-2 border-[#231916] shadow-[1px_1px_0px_#231916] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                isOpen
                  ? 'bg-[#5e7d56] text-[#f8fff0]'
                  : 'bg-[#cb4926] text-white'
              }`}
            >
              {isOpen ? '● OPEN FOR ORDERS' : '○ CLOSED'}
            </button>
          </div>

          {/* Customer View Link */}
          <NavLink
            to="/"
            target="_blank"
            className="px-3.5 py-1.5 rounded-xl bg-[#fff8f6] border-2 border-[#231916] text-xs font-bold font-label-md uppercase hover:bg-[#fff1ec] shadow-[2px_2px_0px_#231916] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            <span>Customer View</span>
          </NavLink>
        </div>
      </header>

      {/* MAIN BODY: SIDEBAR + CONTENT */}
      <div className="flex flex-1 z-10">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-[#fff8f6] border-r-[3px] border-[#231916] shadow-[3px_0px_0px_#231916] p-4 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-65px)]">
          <nav className="space-y-1.5">
            <div className="px-3 py-1 mb-2 font-label-sm text-[11px] font-extrabold uppercase text-[#8d716a] tracking-wider">
              Management Menu
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

          {/* Bottom user / logout section */}
          <div className="pt-4 border-t-2 border-dashed border-[#231916] space-y-2">
            <div className="px-3 py-2 bg-[#f7e4de] rounded-xl border-2 border-[#231916] text-xs">
              <span className="block font-bold text-[#231916] uppercase truncate">
                {authService.getCurrentUser()?.name || 'Diner Staff'}
              </span>
              <span className="text-[#8d716a] text-[11px] truncate block">
                {authService.getCurrentUser()?.email || 'owner@chowchow.com'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#ffdad6] text-[#93000a] font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#ffb4a1] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet context={{ restaurant, setRestaurant, reloadData: loadData }} />
        </main>
      </div>
    </div>
  );
}
