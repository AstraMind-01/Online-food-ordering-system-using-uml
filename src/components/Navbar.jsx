import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { authService, cartService } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [cartCount, setCartCount] = useState(0);

  // Sync auth & cart status
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    if (authService.isAuthenticated()) {
      cartService.get()
        .then((cart) => {
          if (cart && Array.isArray(cart.items)) {
            const count = cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(count);
          }
        })
        .catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCartCount(0);
    navigate('/');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive && location.hash === ''
      ? 'px-3 py-1.5 rounded-full bg-[#fdc65c] text-[#231916] font-bold text-xs uppercase border-2 border-[#231916] shadow-[2px_2px_0px_#231916]'
      : 'px-3 py-1.5 rounded-full text-xs uppercase font-bold text-[#59413b] hover:text-[#231916] hover:bg-[#fff1ec] transition-colors';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f6] border-b-[3px] border-[#231916] shadow-[0_3px_0px_#231916] h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4">
        {/* Logo Wordmark */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-full bg-[#cb4926] border-2 border-[#231916] flex items-center justify-center text-white font-extrabold text-lg shadow-[2px_2px_0px_#231916] group-hover:scale-105 transition-transform">
            🍔
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-lg uppercase tracking-tight text-[#231916] font-black leading-none">
              Chow Chow
            </span>
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#cb4926] font-extrabold">
              Retro Diner &amp; Eats
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/restaurants" className={navLinkClass}>
            Restaurants
          </NavLink>
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="px-3 py-1.5 rounded-full text-xs uppercase font-bold text-[#59413b] hover:text-[#231916] hover:bg-[#fff1ec] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <NavLink to="/group-ordering" className={navLinkClass}>
            Group Order
          </NavLink>
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="px-3 py-1.5 rounded-full text-xs uppercase font-bold text-[#59413b] hover:text-[#231916] hover:bg-[#fff1ec] transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Right Section: Cart + Auth Buttons */}
        <div className="flex items-center gap-3">
          {/* Cart Icon with Item-Count Sticker */}
          <Link
            to="/restaurants#shared-ticket"
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ffdea7] text-[#231916] font-black text-xs uppercase rounded-xl border-2 border-[#231916] shadow-[2px_2px_0px_#231916] hover:bg-[#fed388] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="View Cart"
          >
            <span className="material-symbols-outlined text-base">shopping_cart</span>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="w-5 h-5 rounded-full bg-[#cb4926] text-white flex items-center justify-center text-[10px] font-black border border-[#231916] shadow-[1px_1px_0px_#231916] -mr-1">
                {cartCount}
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full bg-[#f7e4de] text-[#231916] flex items-center justify-center text-[10px] font-bold border border-[#231916] -mr-1">
                0
              </span>
            )}
          </Link>

          {/* Auth State */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to={
                  currentUser.role === 'ADMIN'
                    ? '/admin/dashboard'
                    : currentUser.role === 'RESTAURANT'
                    ? '/restaurant/dashboard'
                    : currentUser.role === 'DELIVERY_PARTNER'
                    ? '/delivery/dashboard'
                    : '/diner-dashboard'
                }
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#f7e4de] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#ffece6]"
              >
                <span className="material-symbols-outlined text-sm text-[#cb4926]">account_circle</span>
                <span className="max-w-[100px] truncate">{currentUser.name || 'Account'}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 bg-[#ffdad6] text-[#93000a] text-xs font-black uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#ffb4a1] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 bg-[#fff8f6] text-[#231916] font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 bg-[#cb4926] text-white font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#b03a19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
