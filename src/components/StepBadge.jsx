import React from 'react';

export default function StepBadge({
  number,
  icon,
  title,
  description,
  badgeBg = 'bg-[#fdc65c]',
  cardBg = 'bg-[#fff8f6]',
}) {
  return (
    <div className={`relative ${cardBg} border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col items-center text-center h-full hover:-translate-y-1 transition-transform`}>
      {/* Numbered Round Sticker */}
      <div className={`w-14 h-14 rounded-full ${badgeBg} border-[2.5px] border-[#231916] shadow-[3px_3px_0px_#231916] flex items-center justify-center -mt-10 mb-4 relative`}>
        <span className="font-headline-lg text-2xl font-black text-[#231916]">
          {number}
        </span>
        {icon && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#231916] text-[#fff8f6] flex items-center justify-center text-xs">
            <span className="material-symbols-outlined text-sm">{icon}</span>
          </div>
        )}
      </div>

      <h3 className="font-headline-md text-base sm:text-lg font-black uppercase text-[#231916] tracking-wide mb-2">
        {title}
      </h3>

      <p className="font-body-sm text-xs sm:text-sm text-[#59413b] font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}
