import React, { useEffect } from 'react';

export default function RetroModal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full ${maxWidth} bg-[#fff8f6] border-[3px] border-[#231916] rounded-2xl shadow-[8px_8px_0px_#231916] overflow-hidden transform transition-all animate-in fade-in zoom-in-95`}
      >
        {/* Header */}
        <div className="bg-[#f7e4de] px-6 py-4 border-b-2 border-dashed border-[#231916] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#cb4926] border border-[#231916]"></span>
            <span className="w-3 h-3 rounded-full bg-[#fdc65c] border border-[#231916]"></span>
            <span className="w-3 h-3 rounded-full bg-[#5e7d56] border border-[#231916]"></span>
            <h3 className="font-headline-md text-lg font-black uppercase tracking-wide text-[#231916] ml-2">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-black text-sm flex items-center justify-center shadow-[2px_2px_0px_#231916] hover:bg-[#ffdad6] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
