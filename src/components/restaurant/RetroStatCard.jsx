import React from 'react';

export default function RetroStatCard({ title, value, subtitle, icon, badgeColor = 'bg-[#fdc65c]', badgeText }) {
  return (
    <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-xl p-5 shadow-[3px_3px_0px_#231916] relative overflow-hidden transition-transform hover:-translate-y-0.5">
      {/* Background halftone accent */}
      <div className="flex items-start justify-between">
        <div>
          <span className="font-label-md text-xs uppercase tracking-wider text-[#59413b] font-bold block mb-1">
            {title}
          </span>
          <h3 className="font-headline-xl text-3xl lg:text-4xl font-extrabold text-[#231916] tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="font-body-sm text-xs text-[#59413b] mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-full border-2 border-[#231916] ${badgeColor} flex items-center justify-center shadow-[2px_2px_0px_#231916] flex-shrink-0`}>
          <span className="material-symbols-outlined text-[#231916] text-2xl font-bold">
            {icon || 'star'}
          </span>
        </div>
      </div>

      {badgeText && (
        <div className="mt-3 pt-3 border-t-2 border-dashed border-[#e8d6d0] flex items-center gap-2">
          <span className="inline-block px-2 py-0.5 text-[10px] font-bold font-label-sm uppercase bg-[#ffdbd1] text-[#881f00] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
}
