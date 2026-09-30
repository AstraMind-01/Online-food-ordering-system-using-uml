import React from 'react';
import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  if (!restaurant) return null;

  const isOpen = restaurant.open !== false;
  const rating = restaurant.rating || 4.9;

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_#231916] transition-all group cursor-pointer block text-left"
    >
      <div>
        {/* Restaurant Image Banner */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-[#231916] shadow-[2px_2px_0px_#231916] mb-4 bg-[#f7e4de]">
          <img
            src={
              restaurant.imageUrl ||
              'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'
            }
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Open/Closed Status Ribbon */}
          <div
            className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md font-black text-[10px] uppercase border border-[#231916] shadow-[1px_1px_0px_#231916] flex items-center gap-1 ${
              isOpen
                ? 'bg-[#5e7d56] text-[#f8fff0]'
                : 'bg-[#b3a8a5] text-[#231916]'
            }`}
          >
            <span>{isOpen ? '●' : '○'}</span>
            <span>{isOpen ? 'OPEN NOW' : 'CLOSED'}</span>
          </div>

          {/* Rating Pill */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#fdc65c] text-[#231916] font-black text-xs border border-[#231916] shadow-[1px_1px_0px_#231916] flex items-center gap-1">
            <span>★</span>
            <span>{rating}</span>
          </div>
        </div>

        {/* Restaurant Name */}
        <h3 className="font-headline-md text-xl font-black uppercase text-[#231916] tracking-tight mb-1 group-hover:text-[#cb4926] transition-colors line-clamp-1">
          {restaurant.name}
        </h3>

        {/* Cuisine */}
        <p className="font-body-sm text-xs text-[#cb4926] font-bold uppercase tracking-wider mb-2 line-clamp-1">
          {restaurant.cuisine || 'American Diner & Grill'}
        </p>

        {/* Address */}
        <p className="font-body-xs text-xs text-[#59413b] font-medium flex items-center gap-1 line-clamp-1">
          <span className="material-symbols-outlined text-sm text-[#cb4926]">location_on</span>
          <span>{restaurant.address || 'Route 66 Highway, Springfield'}</span>
        </p>
      </div>

      {/* Card Action Strip */}
      <div className="pt-4 border-t-2 border-dashed border-[#231916]/30 mt-4 flex items-center justify-between">
        <span className="text-xs font-bold text-[#59413b] flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-[#fdc65c]">schedule</span>
          <span>{isOpen ? 'Serving hot food' : 'Closed for prep'}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-[#ffdea7] text-[#231916] font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] group-hover:bg-[#cb4926] group-hover:text-white transition-all">
          <span>View Menu</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}
