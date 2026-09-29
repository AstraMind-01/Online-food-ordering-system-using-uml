import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="w-full relative bg-[#f7e4de] border-t-[3px] border-[#231916] mt-24">
      {/* Wavy / Scalloped Top Edge Decoration */}
      <div className="absolute -top-4 left-0 right-0 h-4 overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-[#f7e4de]">
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,-30 1200,30 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b-2 border-dashed border-[#231916]/30">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#cb4926] border-2 border-[#231916] flex items-center justify-center text-white text-lg shadow-[2px_2px_0px_#231916]">
                🍔
              </div>
              <div>
                <span className="font-headline-sm text-xl uppercase font-black tracking-tight text-[#231916] block leading-none">
                  Chow Chow Retro Diner &amp; Eats
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#cb4926]">
                  Classic American Drive-In &amp; Delivery System
                </span>
              </div>
            </div>

            <p className="font-body-md text-sm text-[#59413b] font-medium max-w-md leading-relaxed">
              Serving up sizzled smashburgers, hand-spun malts, crinkle fries, and seamless group dining on Route 66 since 1974. Fresh buns, thick shakes, shared booths.
            </p>

            {/* EST 1974 Stamp Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffdea7] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916]">
              <span className="text-[#cb4926] font-bold text-xs">★</span>
              <span className="font-mono text-xs font-black uppercase text-[#231916]">
                EST. 1974 • OVER 500,000 MEALS SERVED
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-headline-sm text-sm font-black uppercase tracking-wider text-[#231916] border-b-2 border-[#231916] pb-1 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-bold uppercase text-[#59413b]">
              <li>
                <Link to="/" className="hover:text-[#cb4926] transition-colors">
                  • Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="hover:text-[#cb4926] transition-colors">
                  • Restaurants &amp; Menus
                </Link>
              </li>
              <li>
                <Link to="/group-ordering" className="hover:text-[#cb4926] transition-colors">
                  • Group Ordering
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#cb4926] transition-colors">
                  • Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/diner-dashboard" className="hover:text-[#cb4926] transition-colors">
                  • Diner Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Hotline */}
          <div className="space-y-3">
            <h4 className="font-headline-sm text-sm font-black uppercase tracking-wider text-[#231916] border-b-2 border-[#231916] pb-1 inline-block">
              Roadside Contact
            </h4>
            <div className="text-xs text-[#59413b] space-y-1.5 font-medium">
              <p className="flex items-center gap-1.5 font-bold text-[#231916]">
                <span className="material-symbols-outlined text-sm text-[#cb4926]">location_on</span>
                742 Evergreen Terrace, Springfield
              </p>
              <p className="flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-sm text-[#cb4926]">call</span>
                (555) 0100 • 24/7 Sizzle Hotline
              </p>
              <p className="flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-sm text-[#cb4926]">mail</span>
                orders@chowchow.com
              </p>
              <div className="pt-2">
                <span className="px-2 py-0.5 rounded bg-[#5e7d56] text-[#f8fff0] font-black text-[10px] uppercase border border-[#231916]">
                  ● DINER OPEN 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#8d716a]">
          <p>© 1974–2026 Chow Chow Diner Inc. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Route 66 Retro Diner Delivery Management System
          </p>
        </div>
      </div>
    </footer>
  );
}
