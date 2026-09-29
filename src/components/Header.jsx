import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  const [orderType, setOrderType] = useState('Delivery');

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'px-space-md py-space-xs rounded-full transition-all bg-secondary-container text-on-secondary-container font-label-md font-bold diner-tag'
      : 'px-space-md py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary-fixed/90 backdrop-blur-md diner-border-thick">
      <div className="h-20 max-w-7xl mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-space-md">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-space-md shrink-0 group">
          <img
            alt="Chow Chow Diner Retro Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UlFSKUlWoX24UnSSw_UGwvOciVEYcKqGvitbM1QJIcXwaFGu61uF5pVMv_G-db6OjQALguEP8BSvMsE6k5VB-7g_meClX_x2cN0wbjAHiCep4691ihj-ylbK3FKw-OuFDSd5eoOYet17LmFzyXs1AbDK9SGZB60jGWxOtiOQRN8-Y96VF7g2joiDkkTRDdHrlBaFBMrL4_8eciUAP6ipxCnl2VED-IcjZE3wD73GLo_FCaMKMAraT2CZs"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface leading-none">
              Chow Chow
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              Retro Diner &amp; Eats
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-space-sm">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/restaurants-and-menus" className={navLinkClass}>
            Restaurants &amp; Menus
          </NavLink>
          <NavLink to="/group-ordering" className={({ isActive }) =>
            `${navLinkClass({ isActive })} relative`
          }>
            Group Ordering
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase font-bold animate-pulse">
              NEW
            </span>
          </NavLink>
          <NavLink to="/track-order" className={navLinkClass}>
            Track Order
          </NavLink>
          <NavLink to="/diner-dashboard" className={navLinkClass}>
            Diner Dashboard
          </NavLink>
          <NavLink to="/restaurant/dashboard" className={({ isActive }) =>
            `${navLinkClass({ isActive })} relative text-[#cb4926]`
          }>
            Owner Panel
          </NavLink>
          <NavLink to="/delivery/dashboard" className={({ isActive }) =>
            `${navLinkClass({ isActive })} relative text-[#5e7d56]`
          }>
            Courier Panel
          </NavLink>
        </nav>

        {/* Right Section Actions */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* Delivery / Pickup Toggle */}
          <div className="hidden sm:flex items-center bg-surface-container-high rounded-full p-1 diner-tag">
            <button
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase transition-all ${
                orderType === 'Delivery'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
              onClick={() => setOrderType('Delivery')}
            >
              Delivery
            </button>
            <button
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase transition-all ${
                orderType === 'Pickup'
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
              onClick={() => setOrderType('Pickup')}
            >
              Pickup
            </button>
          </div>

          {/* Active Group Order Pill */}
          <Link
            to="/group-ordering"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm diner-tag hover:brightness-105 transition-all"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
            <span className="font-bold">Sally's Office Lunch</span>
            <span className="bg-tertiary-container text-on-tertiary-container px-1.5 py-0.5 rounded-full text-[10px]">
              4
            </span>
          </Link>
              
          {/* Cart Button */}
          <Link
            to="/restaurants-and-menus#shared-ticket"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md diner-tag hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
          >
            <span>Cart</span>
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold">
              3
            </span>
          </Link>

          {/* Profile Avatar */}
          <div className="relative pl-1">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover diner-tag ring-2 ring-transparent hover:ring-primary transition-all cursor-pointer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7mJxikjrxYrOrXY1QX5KVxw9rzathkdZbdpqKd9VVssWvwA5PUDP8qQLk_yegU_1g4YtYoTFSomup1563XnpIbQKdhwhh9weeXgJSNqAgQy4tQXjP2IyzqgPR1ar1Gb0jNk2VhW8RO-FGfZGMBJzwOX71heJqOW1bJ8Wi1-UE44F_vzr9WCweWLNKKI7PRmNW-AitzAa9SlrdX0XmmPWgH5AJZf1hJdIcni5k0NuQ6HnAqIqZIW9P"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-1.5 bg-repeat-x scallop-divider opacity-90"></div>
    </header>
  );
}
