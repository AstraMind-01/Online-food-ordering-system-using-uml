import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SIZZLE_ACTIVITIES = [
  {
    id: 1,
    icon: '🍔',
    customer: 'Johnny Nitro (Table 4)',
    action: 'ordered 2x Route 66 Triple Bacon Stack',
    time: 'Just now',
    tag: 'SIZZLE SPECIAL',
    tagColor: 'bg-[#cb4926] text-white',
    link: '/restaurants',
  },
  {
    id: 2,
    icon: '🏍️',
    customer: 'Speedy Sam',
    action: 'picked up Order #742 for Sunset Motel dropoff',
    time: '2 mins ago',
    tag: 'OUT ON ROUTE 66',
    tagColor: 'bg-[#5e7d56] text-[#f8fff0]',
    link: '/track-order',
  },
  {
    id: 3,
    icon: '👥',
    customer: 'Sally Brady',
    action: 'started Collaborative Booth "Weekend Road Crew"',
    time: '3 mins ago',
    tag: 'GROUP BOOTH',
    tagColor: 'bg-[#fdc65c] text-[#231916]',
    link: '/group-ordering',
  },
  {
    id: 4,
    icon: '🍟',
    customer: 'Booth 8',
    action: 'added Neon Night Chili Cheese Fries to cart',
    time: '4 mins ago',
    tag: 'CRISPY FRESH',
    tagColor: 'bg-[#ffdea7] text-[#231916]',
    link: '/restaurants',
  },
  {
    id: 5,
    icon: '🥤',
    customer: 'Diner Bar Stool 2',
    action: 'ordered 2x Frosty Cherry Cola Floats',
    time: '5 mins ago',
    tag: 'MALT SPECIAL',
    tagColor: 'bg-[#ffdad6] text-[#93000a]',
    link: '/restaurants',
  },
];

export default function ScrollingOrderPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 220) {
        setIsVisible(true);
      } else if (scrollY < 80) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  // Rotate through activities every 5.5s
  useEffect(() => {
    if (!isVisible || isDismissed) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SIZZLE_ACTIVITIES.length);
        setIsTransitioning(false);
      }, 250);
    }, 5500);

    return () => clearInterval(interval);
  }, [isVisible, isDismissed]);

  if (!isVisible || isDismissed) return null;

  const current = SIZZLE_ACTIVITIES[currentIndex];

  return (
    <aside
      aria-label="Live Diner Sizzle Alert"
      className="fixed bottom-6 left-6 z-40 max-w-sm w-[calc(100vw-3rem)] sm:w-auto anim-scroll-popup"
    >
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-4 shadow-[5px_5px_0px_#231916] relative overflow-hidden transition-all duration-300">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-dashed border-[#231916]/30">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cb4926] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#cb4926]"></span>
            </span>
            <span className="font-label-sm text-[10px] font-black uppercase tracking-wider text-[#231916]">
              HIGHWAY SIZZLE FEED • LIVE
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-5 h-5 rounded-md bg-[#f7e4de] border border-[#231916] text-[#231916] flex items-center justify-center text-[10px] font-black hover:bg-[#ffdad6] active:scale-95 transition-all cursor-pointer"
            title="Dismiss popup"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div
          className={`flex items-start gap-3 transition-opacity duration-200 ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Circular Emoji Badge */}
          <div className="w-11 h-11 rounded-full bg-[#ffdea7] border-2 border-[#231916] shadow-[2px_2px_0px_#231916] flex items-center justify-center text-xl shrink-0">
            {current.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-headline-sm text-xs font-black uppercase text-[#231916] truncate">
                {current.customer}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase border border-[#231916] ${current.tagColor}`}
              >
                {current.tag}
              </span>
            </div>

            <p className="font-body-sm text-xs text-[#59413b] font-medium leading-snug line-clamp-2">
              {current.action}
            </p>

            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-dashed border-[#e8d6d0]">
              <span className="text-[10px] font-mono font-bold text-[#8d716a]">
                ⏱ {current.time}
              </span>

              <Link
                to={current.link}
                className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-[#cb4926] hover:underline"
              >
                <span>View Now</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
