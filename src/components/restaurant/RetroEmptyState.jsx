import React from 'react';

export default function RetroEmptyState({
  icon = 'receipt_long',
  title = 'No Orders Here Right Now!',
  message = 'All tickets are clear, chef! New customer and booth orders will pop right up here.',
  actionText,
  onAction,
}) {
  return (
    <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-xl p-10 text-center shadow-[4px_4px_0px_#231916] max-w-lg mx-auto my-8">
      {/* Vintage diner badge icon */}
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#ffdea7] border-[2.5px] border-[#231916] shadow-[3px_3px_0px_#231916] flex items-center justify-center relative">
        <span className="material-symbols-outlined text-[#231916] text-4xl">
          {icon}
        </span>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#cb4926] rounded-full border-2 border-[#231916] flex items-center justify-center text-[10px] text-white font-bold">
          ★
        </div>
      </div>

      <h4 className="font-headline-lg text-xl uppercase font-bold text-[#231916] tracking-wide mb-2">
        {title}
      </h4>
      <p className="font-body-md text-sm text-[#59413b] leading-relaxed max-w-sm mx-auto mb-6">
        {message}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#fdc65c] text-[#231916] font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-lg shadow-[3px_3px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
