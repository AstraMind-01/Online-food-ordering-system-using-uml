import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SIZZLE_ACTIVITIES = [
  {
    id: 1,
    icon: '🍔',
    customer: 'Johnny Nitro (Booth 4)',
    action: 'ordered 2x Route 66 Triple Bacon Stack',
    time: 'Just now',
    tag: 'SIZZLE SPECIAL',
    tagColor: 'bg-[#cb4926] text-white',
    link: '/restaurants',
    foodItem: {
      id: 1,
      name: 'Route 66 Triple Bacon Stack',
      description: 'Crispy smoked bacon, grilled brioche & diner secret relish',
      price: 12.45,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3gOc_Q6ygkb7n_hqwJ3U-ORWKkntTOOGhLzXCY7w7zE8ZIAMcTArnzI5AiQhtlb6S97YTvzTIJg3E6Ef6Ppa7XebuYRoPk03AyqM0Uu_1UnhRJBdqVHOr04O8sxMQ0eQA-lUgXwWihIJihPRARMWV0vxaSj_OSs7L69fxR5VXq8IfkyIToffa4_XVklL3DHglyFCZtEW5b59gciF3srC_dZHBiHIaR4uZ2QT_439NZmWtE6qxF1h',
    }
  },
  {
    id: 2,
    icon: '🌶️',
    customer: 'Marco V. (Counter)',
    action: 'ordered Jukebox Jalapeño Melt (Extra Spicy)',
    time: '1 min ago',
    tag: 'HOT & SIZZLING',
    tagColor: 'bg-[#5e7d56] text-[#f8fff0]',
    link: '/restaurants',
    foodItem: {
      id: 2,
      name: 'Jukebox Jalapeño Melt',
      description: 'Fire-roasted jalapeños, melted pepper jack & spiced secret aioli on sourdough',
      price: 11.95,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh',
    }
  },
  {
    id: 3,
    icon: '👥',
    customer: 'Sally Brady',
    action: 'started Collaborative Booth "Friday Feast"',
    time: '2 mins ago',
    tag: 'GROUP BOOTH',
    tagColor: 'bg-[#fdc65c] text-[#231916]',
    link: '/group-ordering',
  },
  {
    id: 4,
    icon: '🍟',
    customer: 'Booth 8 Crew',
    action: 'added Neon Night Chili Cheese Fries to tray',
    time: '3 mins ago',
    tag: 'CRISPY FRESH',
    tagColor: 'bg-[#ffdea7] text-[#231916]',
    link: '/restaurants',
    foodItem: {
      id: 4,
      name: 'Neon Night Chili Cheese Fries',
      description: 'Golden crinkle fries smothered in Texas road chili, aged cheddar & green onions',
      price: 7.95,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh',
    }
  },
  {
    id: 5,
    icon: '🥤',
    customer: 'Diner Bar Stool 2',
    action: 'ordered 2x Frosty Cherry Cola Floats',
    time: '4 mins ago',
    tag: 'MALT SPECIAL',
    tagColor: 'bg-[#ffdad6] text-[#93000a]',
    link: '/restaurants',
    foodItem: {
      id: 3,
      name: 'Cherry Cola Float',
      description: 'Fountain cherry cola topped with Madagascar vanilla bean ice cream & maraschino',
      price: 5.50,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZxQuCZjoebNJODjhyJESxQlYgLaQhRW4-fIUfUeotsVlQkgH7_gntG2dBgZR9IRR88WjdrI1XyZhS4en_jc71O1JcOlOxo3L-FFCdLuXLMshNc9blA52EBvk3ZiD3nu3LpR7gSxwoCCQVYWa2SNrV5BHfoOGNbAOtFoVJJhe1geLoWc0YB2dB0ffgqzH7rAYQcWePhpujhpyNXr1zm9St7Qi8M9PWxd3hbLCDrJWf6Mt4g4dasuH',
    }
  },
  {
    id: 6,
    icon: '🍗',
    customer: 'Table 12',
    action: 'ordered Drive-In Chicken Basket + Ranch',
    time: '5 mins ago',
    tag: 'CROWD FAVORITE',
    tagColor: 'bg-[#ffdea7] text-[#231916]',
    link: '/restaurants',
    foodItem: {
      id: 5,
      name: 'Drive-In Chicken Basket',
      description: 'Crispy buttermilk fried chicken tenders served with honey mustard & diner slaw',
      price: 13.50,
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    }
  },
];

export default function ScrollingOrderPopup({ onSelectFood }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrollPulse, setScrollPulse] = useState(false);

  // Monitor scroll: show popup smoothly as user scrolls down page
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      if (isDismissed) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Show popup once user starts scrolling past 90px
      if (scrollY > 90) {
        setIsVisible(true);
        setScrollPulse(true);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => setScrollPulse(false), 600);
      }
    };

    // Auto-show after 2.5s even if user doesn't scroll right away
    const autoTimer = setTimeout(() => {
      if (!isDismissed) setIsVisible(true);
    }, 2500);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(autoTimer);
      clearTimeout(scrollTimeout);
    };
  }, [isDismissed]);

  // Progress bar countdown between popup alerts
  useEffect(() => {
    if (!isVisible || isDismissed || isMinimized) return;

    setProgress(0);
    const stepTime = 100;
    const totalDuration = 5200;
    const increment = (stepTime / totalDuration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentIndex((curr) => (curr + 1) % SIZZLE_ACTIVITIES.length);
            setIsTransitioning(false);
          }, 300);
          return 0;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [isVisible, isDismissed, isMinimized, currentIndex]);

  if (!isVisible || isDismissed) return null;

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 left-6 z-40 px-3.5 py-2 rounded-full bg-[#231916] text-[#fed388] border-2 border-[#fed388] shadow-[3px_3px_0px_#231916] font-label-md text-xs font-black uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer anim-scroll-popup"
        title="Click to view live diner order sizzle feed"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cb4926] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cb4926]"></span>
        </span>
        <span>🔥 Live Sizzle ({SIZZLE_ACTIVITIES.length})</span>
        <span className="material-symbols-outlined text-xs">expand_less</span>
      </button>
    );
  }

  const current = SIZZLE_ACTIVITIES[currentIndex];

  return (
    <aside
      aria-label="Live Diner Sizzle Alert"
      className={`fixed bottom-6 left-6 z-40 max-w-sm w-[calc(100vw-3rem)] sm:w-auto transition-transform duration-300 ${
        scrollPulse ? 'scale-[1.03]' : 'scale-100'
      } anim-scroll-popup`}
    >
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-4 shadow-[5px_5px_0px_#231916] relative overflow-hidden transition-all duration-300">
        {/* Animated Progress Bar along top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#f7e4de] overflow-hidden">
          <div
            className="h-full bg-[#cb4926] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-dashed border-[#231916]/30 pt-0.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cb4926] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#cb4926]"></span>
            </span>
            <span className="font-label-sm text-[10px] font-black uppercase tracking-wider text-[#231916]">
              HIGHWAY SIZZLE FEED • LIVE
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="w-5 h-5 rounded-md bg-[#f7e4de] border border-[#231916] text-[#231916] flex items-center justify-center text-[11px] font-black hover:bg-[#ffdea7] active:scale-95 transition-all cursor-pointer"
              title="Minimize to floating pill"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="w-5 h-5 rounded-md bg-[#f7e4de] border border-[#231916] text-[#231916] flex items-center justify-center text-[10px] font-black hover:bg-[#ffdad6] active:scale-95 transition-all cursor-pointer"
              title="Dismiss popup"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div
          className={`flex items-start gap-3 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          {/* Circular Emoji Badge with pulse */}
          <div className="w-12 h-12 rounded-full bg-[#ffdea7] border-2 border-[#231916] shadow-[2px_2px_0px_#231916] flex items-center justify-center text-2xl shrink-0">
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

              {current.foodItem && onSelectFood ? (
                <button
                  type="button"
                  onClick={() => onSelectFood(current.foodItem)}
                  className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-[#cb4926] hover:underline cursor-pointer"
                >
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              ) : (
                <Link
                  to={current.link}
                  className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-[#cb4926] hover:underline"
                >
                  <span>View Now</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
