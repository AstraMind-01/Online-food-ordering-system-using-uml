import React from 'react';

export default function MenuItemCard({
  item,
  cartQty = 0,
  onAddToCart,
  onUpdateQty,
}) {
  if (!item) return null;

  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
  const badge = item.badgeText || item.badge || '★ CHEF SPECIAL';
  const prepTime = item.prepTimeMins ? `${item.prepTimeMins} Mins` : (item.prepTime || '10 Mins');

  return (
    <article className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#231916] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_#231916] transition-all group">
      <div>
        {/* Food Photo Container */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-[#231916] shadow-[2px_2px_0px_#231916] mb-4 bg-[#f7e4de]">
          <img
            src={
              item.imageUrl ||
              'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
            }
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Ribbon Badge */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#cb4926] text-white font-black text-[10px] uppercase border border-[#231916] shadow-[1px_1px_0px_#231916] tracking-wider">
            {badge}
          </div>

          {/* Prep-Time Pill */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#ffdea7] text-[#231916] font-black text-xs border border-[#231916] shadow-[1px_1px_0px_#231916] flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#cb4926]">timer</span>
            <span>{prepTime}</span>
          </div>
        </div>

        {/* Food Name & Price Header */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-headline-sm text-lg font-black uppercase text-[#231916] tracking-tight leading-snug line-clamp-1 group-hover:text-[#cb4926] transition-colors">
            {item.name}
          </h3>
          <span className="font-headline-sm text-lg font-black text-[#cb4926] shrink-0">
            ₹{price.toFixed(2)}
          </span>
        </div>

        {/* Description */}
        <p className="font-body-sm text-xs text-[#59413b] leading-relaxed line-clamp-2 mb-3">
          {item.description || 'Delicious diner classic griddled fresh to order with authentic secret seasonings.'}
        </p>
      </div>

      {/* Action Strip: ADD TO CART vs Quantity Stepper */}
      <div className="pt-3 border-t-2 border-dashed border-[#231916]/30 mt-2">
        {cartQty > 0 ? (
          <div className="flex items-center justify-between gap-2 bg-[#ffdea7]/60 p-1.5 rounded-xl border border-[#231916]/40">
            <span className="text-xs font-black uppercase text-[#231916] pl-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#5e7d56]">check_circle</span>
              <span>In Cart</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateQty && onUpdateQty(item, cartQty - 1)}
                className="w-8 h-8 rounded-lg bg-white text-[#231916] font-black text-base border-2 border-[#231916] shadow-[1.5px_1.5px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="w-8 text-center font-black text-sm text-[#231916] bg-white py-1 rounded-lg border-2 border-[#231916] shadow-inner">
                {cartQty}
              </span>

              <button
                type="button"
                onClick={() => onUpdateQty && onUpdateQty(item, cartQty + 1)}
                className="w-8 h-8 rounded-lg bg-[#cb4926] text-white font-black text-base border-2 border-[#231916] shadow-[1.5px_1.5px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(item)}
            className="w-full py-2.5 px-4 bg-[#cb4926] text-white font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">shopping_basket</span>
            <span>ADD TO CART</span>
          </button>
        )}
      </div>
    </article>
  );
}
