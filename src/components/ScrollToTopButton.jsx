import React, { useState, useEffect } from 'react';

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 350) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!showButton) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#fdc65c] text-[#231916] border-[2.5px] border-[#231916] shadow-[4px_4px_0px_#231916] flex items-center justify-center anim-scroll-popup hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group"
      title="Ride Back To Top"
      aria-label="Scroll back to top"
    >
      <span className="material-symbols-outlined text-2xl font-black group-hover:-translate-y-0.5 transition-transform">
        arrow_upward
      </span>
    </button>
  );
}
