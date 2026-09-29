import React from 'react';

export default function TimelineBadge({
  stepNumber,
  title,
  subtitle,
  icon,
  isActive = false,
  isCompleted = false,
}) {
  return (
    <div className="flex flex-col items-center text-center relative z-10 flex-1 min-w-[130px]">
      {/* Circle Icon Badge */}
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[2.5px] border-[#231916] flex items-center justify-center transition-all ${
          isCompleted
            ? 'bg-[#5e7d56] text-[#f8fff0] shadow-[3px_3px_0px_#231916]'
            : isActive
            ? 'bg-[#fdc65c] text-[#231916] shadow-[4px_4px_0px_#231916] scale-110 ring-4 ring-[#cb4926]/30 animate-pulse'
            : 'bg-[#f7e4de] text-[#8d716a] shadow-[2px_2px_0px_#231916]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl sm:text-3xl font-bold">
          {icon}
        </span>
      </div>

      {/* Step Label */}
      <div className="mt-3">
        <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#231916] text-[#fff8f6] inline-block mb-1">
          Step {stepNumber}
        </span>
        <h4 className="font-headline-sm text-xs sm:text-sm font-black uppercase text-[#231916] tracking-wide">
          {title}
        </h4>
        {subtitle && (
          <p className="font-body-xs text-[11px] text-[#59413b] font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
