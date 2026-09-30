import React, { useState, useEffect, useRef, useCallback } from 'react';
import { menuService } from '../services/api';

export const MENU_ITEMS = [
  {
    id: 1,
    name: 'Route 66 Triple Bacon Stack',
    description: 'Crispy smoked bacon, grilled brioche & diner secret relish',
    price: '₹12.45',
    ribbon: '★ Classic Special',
    prep: 'Cooked to Order in 8 Mins',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3gOc_Q6ygkb7n_hqwJ3U-ORWKkntTOOGhLzXCY7w7zE8ZIAMcTArnzI5AiQhtlb6S97YTvzTIJg3E6Ef6Ppa7XebuYRoPk03AyqM0Uu_1UnhRJBdqVHOr04O8sxMQ0eQA-lUgXwWihIJihPRARMWV0vxaSj_OSs7L69fxR5VXq8IfkyIToffa4_XVklL3DHglyFCZtEW5b59gciF3srC_dZHBiHIaR4uZ2QT_439NZmWtE6qxF1h',
    sticker: {
      top: 'SAVE ₹5',
      bottom: 'GROUPS 3+',
      icon: 'savings',
    },
  },
  {
    id: 2,
    name: 'Jukebox Jalapeño Melt',
    description: 'Fire-roasted jalapeños, melted pepper jack & spiced secret aioli on sourdough',
    price: '₹11.95',
    ribbon: '★ Spicy Pick',
    prep: 'Griddled to Order in 7 Mins',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh',
    sticker: null,
  },
  {
    id: 3,
    name: 'Cherry Cola Float',
    description: 'Fountain cherry cola topped with Madagascar vanilla bean ice cream & maraschino',
    price: '₹5.50',
    ribbon: '★ Sweet Treat',
    prep: 'Spun to Order in 5 Mins',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZxQuCZjoebNJODjhyJESxQlYgLaQhRW4-fIUfUeotsVlQkgH7_gntG2dBgZR9IRR88WjdrI1XyZhS4en_jc71O1JcOlOxo3L-FFCdLuXLMshNc9blA52EBvk3ZiD3nu3LpR7gSxwoCCQVYWa2SNrV5BHfoOGNbAOtFoVJJhe1geLoWc0YB2dB0ffgqzH7rAYQcWePhpujhpyNXr1zm9St7Qi8M9PWxd3hbLCDrJWf6Mt4g4dasuH',
    sticker: null,
  },
  {
    id: 4,
    name: 'Neon Night Chili Cheese Fries',
    description: 'Golden crinkle fries smothered in Texas road chili, aged cheddar & green onions',
    price: '₹7.95',
    ribbon: '★ Shareable',
    prep: 'Crisped in 6 Mins',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh',
    sticker: {
      top: 'SAVE ₹3',
      bottom: 'SHAREABLES',
      icon: 'fastfood',
    },
  },
  {
    id: 5,
    name: 'Drive-In Chicken Basket',
    description: 'Crispy buttermilk fried chicken tenders served with honey mustard & diner slaw',
    price: '₹13.50',
    ribbon: '★ Crowd Favorite',
    prep: 'Fried Golden in 10 Mins',
    photo:
      'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    sticker: null,
  },
  {
    id: 6,
    name: 'Malt Shop Vanilla Shake',
    description: 'Thick malted barley shake spun in classic steel cans with whipped cream peak',
    price: '₹6.25',
    ribbon: '★ Old School',
    prep: 'Hand-Spun in 5 Mins',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD',
    sticker: null,
  },
  {
    id: 7,
    name: 'Blue Plate Meatloaf Melt',
    description: 'Home-style glazed beef meatloaf on griddled caraway rye with melted Swiss',
    price: '₹12.95',
    ribbon: '★ Diner Staple',
    prep: 'Sizzled in 12 Mins',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAepflTShAE-KO4FlAI2SAZ96L-3fC_ab7LReW5F-kCX1z_fEga8NAE2c0p3bS-LsqXlnca1wPZvVop1jPWOOaUq0r6Bzs3zebF8yACt5gSBVH91ymVOFHqI_pXr4Qfr8Lok8-KqMTHOpcWxd-I8uF3aMfUOeC2s5jUbhoEPbOjAHeJIU9uFfMjJWywbH6hxQ3H4-2yEAG--OX2hf6-i1v2MrQh_k_4bJ1_MY785LPVGBjlZ6iwxd2G',
    sticker: {
      top: "CHEF'S PICK",
      bottom: 'SAVE ₹4',
      icon: 'star',
    },
  },
  {
    id: 8,
    name: 'Sunrise Pancake Tower',
    description: 'Fluffy buttermilk pancake stack with whipped sweet butter & warm maple drizzle',
    price: '₹9.95',
    ribbon: '★ All-Day Breakfast',
    prep: 'Griddled Fresh in 9 Mins',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7BfWUcq0oXoxSGCSZBxjEZFpOEBbKDYqXilK4ZSz-UTW1l2mDVIKpjf3LqqrIeTuI1ylkU1rwoqkU6B-T1qImlaueT2CVn7uChQueSjuXVXFxZqW907GsrdWxdnGPlcKwW1hHI6-_QrasZ7Ywu6d4UawaQUkw1zsNcmM779AK2NPrkXkJtbm7es7hLCRqwsAhJ-vN8fXnGmVFTLSSfl-IAdJMGdeXPbYsQaK-dmTGpQ_MyVmlOiDL',
    sticker: null,
  },
  {
    id: 9,
    name: 'Chicago Dog Deluxe',
    description: 'All-beef frank on poppy seed bun with yellow mustard, neon relish, sport peppers',
    price: '₹8.50',
    ribbon: '★ Street Style',
    prep: 'Steamed & Dressed in 6 Mins',
    photo:
      'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
    sticker: null,
  },
  {
    id: 10,
    name: 'Golden Onion Ring Tower',
    description: 'Beer-battered jumbo Vidalia onions stacked high with smoky campfire campfire dip',
    price: '₹6.75',
    ribbon: '★ Crunch Alert',
    prep: 'Dipped & Fried in 7 Mins',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_a9lG45cMxCs_SujnGOD789YutO6YkVHMYmPAQZ_Zbjbabsl8qn9rt7lyJLbWC5sJHQP-S-WYQOm2BpnCMaOH4NiVJ7eQWEMARYOo-TtIaPTyGTGRYDkc0RIQQ7XcShzpFwKmzb2YWel9YCmCtoPLYkv7aPe3mQde-EsZhX7KgxmIDJyg4mVCxtK8cIyVEDsW6B2Q6cVah83eNG3u2wTUaAjbrdTLLrZMuJlWNUV8OtfiWD33OScA',
    sticker: null,
  },
  {
    id: 11,
    name: 'Apple Pie à la Mode',
    description: 'Flaky double-crust cinnamon spiced apples with a scoop of vanilla bean cream',
    price: '₹7.25',
    ribbon: '★ Homemade',
    prep: 'Warmed in 5 Mins',
    photo:
      'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
    sticker: {
      top: 'FRESH BAKED',
      bottom: '20% OFF',
      icon: 'savings',
    },
  },
  {
    id: 12,
    name: 'Coney Island Loaded Hot Dog',
    description: 'Charred beef dog loaded with hearty beef chili, diced sweet onions, yellow mustard',
    price: '₹8.95',
    ribbon: '★ Hot Seller',
    prep: 'Loaded in 6 Mins',
    photo:
      'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?auto=format&fit=crop&w=800&q=80',
    sticker: null,
  },
];

export default function HeroMenuCarousel({ onSelectFood }) {
  const [items, setItems] = useState(MENU_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const dragStartX = useRef(null);
  const dragDeltaX = useRef(0);
  const transitionTimeout = useRef(null);

  const total = items.length;

  useEffect(() => {
    menuService.getAll()
      .then((apiItems) => {
        if (apiItems && apiItems.length > 0) {
          const mapped = apiItems.map((apiItem, idx) => {
            const fallback = MENU_ITEMS[idx % MENU_ITEMS.length];
            return {
              id: apiItem.id || fallback.id,
              name: apiItem.name || fallback.name,
              description: apiItem.description || fallback.description,
              price: typeof apiItem.price === 'number' ? `₹${apiItem.price.toFixed(2)}` : (apiItem.price || fallback.price),
              ribbon: apiItem.badgeText || fallback.ribbon,
              prep: apiItem.prepTimeMins ? `Cooked to Order in ${apiItem.prepTimeMins} Mins` : fallback.prep,
              photo: apiItem.imageUrl || fallback.photo,
              sticker: fallback.sticker,
            };
          });
          setItems(mapped);
        }
      })
      .catch(() => {
        // Fallback to static items
      });
  }, []);

  const changeSlide = useCallback(
    (newIndex, dir) => {
      if (isTransitioning || newIndex === currentIndex) return;
      setPrevIndex(currentIndex);
      setCurrentIndex(newIndex);
      setDirection(dir);
      setIsTransitioning(true);

      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => {
        setIsTransitioning(false);
        setPrevIndex(null);
      }, 1000);
    },
    [currentIndex, isTransitioning],
  );

  const goToNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % total;
    changeSlide(nextIdx, 'next');
  }, [currentIndex, total, changeSlide]);

  const goToPrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + total) % total;
    changeSlide(prevIdx, 'prev');
  }, [currentIndex, total, changeSlide]);

  // Autoplay every 4 seconds, pause on hover or drag
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch and mouse drag handlers
  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    dragDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    if (dragStartX.current !== null) {
      dragDeltaX.current = e.touches[0].clientX - dragStartX.current;
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragDeltaX.current) > 40) {
      if (dragDeltaX.current < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    dragStartX.current = null;
    dragDeltaX.current = 0;
    setIsPaused(false);
  };

  const handleMouseDown = (e) => {
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleMouseMove = (e) => {
    if (dragStartX.current !== null) {
      dragDeltaX.current = e.clientX - dragStartX.current;
    }
  };

  const handleMouseUp = () => {
    if (Math.abs(dragDeltaX.current) > 40) {
      if (dragDeltaX.current < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    dragStartX.current = null;
    dragDeltaX.current = 0;
    setIsPaused(false);
  };

  const currentItem = items[currentIndex] || items[0];
  const prevItem = prevIndex !== null ? (items[prevIndex] || items[0]) : null;

  const renderCardContent = (item, isIncoming) => (
    <div className="relative w-full max-w-md">
      {/* Floating Sticker if item has one */}
      {item.sticker && (
        <div
          className={`absolute -top-4 -right-2 z-20 w-24 h-24 rounded-full bg-secondary-fixed diner-tag flex flex-col items-center justify-center text-center p-2 transform rotate-12 ${
            isIncoming ? 'anim-pop-sticker' : 'animate-pulse'
          }`}
        >
          <span className="material-symbols-outlined text-primary text-xl">
            {item.sticker.icon || 'savings'}
          </span>
          <span className="font-label-sm text-[10px] uppercase font-bold text-on-secondary-fixed leading-tight">
            {item.sticker.top}
          </span>
          <span className="font-label-sm text-[9px] uppercase tracking-tighter text-on-secondary-container font-bold">
            {item.sticker.bottom}
          </span>
        </div>
      )}

      {/* Main Card Frame */}
      <div
        className={`w-full max-w-md bg-surface-container rounded-2xl diner-border p-space-md transform -rotate-1 hover:rotate-0 transition-transform duration-300 ${onSelectFood ? 'cursor-pointer group/hero' : ''}`}
        onClick={() => {
          if (onSelectFood) {
            onSelectFood({
              id: item.id,
              name: item.name,
              description: item.description,
              price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, '')) || 12.5 : item.price,
              imageUrl: item.photo || item.imageUrl,
              badgeText: item.ribbon,
              prepTimeMins: parseInt(item.prep) || 8,
            });
          }
        }}
        title={onSelectFood ? "Click to view full recipe details, ingredients & customization" : undefined}
      >
        <div className="relative overflow-hidden rounded-xl diner-tag mb-space-sm bg-surface-container-high">
          <img
            className={`w-full h-64 object-cover ${isIncoming ? 'anim-photo' : ''}`}
            alt={item.name}
            src={item.photo}
            loading="eager"
          />
          <div
            className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-on-surface/85 backdrop-blur-sm text-surface font-label-sm text-label-sm uppercase flex items-center gap-1 font-bold ${
              isIncoming ? 'anim-slide-pill' : ''
            }`}
          >
            <span className="material-symbols-outlined text-sm text-secondary-container">alarm_on</span>
            {item.prep}
          </div>
          <div
            className={`absolute top-2 right-2 px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm uppercase font-bold diner-tag ${
              isIncoming ? 'anim-drop-badge' : ''
            }`}
          >
            {item.ribbon}
          </div>
        </div>

        <div className="flex items-center justify-between border-t-2 border-dashed border-on-surface/30 pt-space-sm">
          <div className={isIncoming ? 'anim-content' : ''}>
            <p className="font-headline-sm text-headline-sm uppercase text-on-surface leading-tight">
              {item.name}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {item.description}
            </p>
          </div>
          <span
            className={`font-headline-md text-headline-md text-primary font-bold shrink-0 ${
              isIncoming ? 'anim-price-pop' : ''
            }`}
          >
            {item.price}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full max-w-md select-none outline-none focus:ring-2 focus:ring-primary/40 rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        dragStartX.current = null;
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Diner specialties menu carousel"
    >
      {/* Sliding Viewport Container */}
      <div className="relative w-full max-w-md overflow-visible min-h-[385px] flex items-center justify-center">
        {/* Exiting Slide */}
        {prevItem && (
          <div
            key={`prev-${prevItem.id}`}
            className={`absolute inset-0 z-0 pointer-events-none ${
              direction === 'next' ? 'anim-slide-out-left' : 'anim-slide-out-right'
            }`}
          >
            {renderCardContent(prevItem, false)}
          </div>
        )}

        {/* Entering / Current Active Slide */}
        <div
          key={`current-${currentItem.id}`}
          className={`relative z-10 w-full ${
            isTransitioning
              ? direction === 'next'
                ? 'anim-slide-in-right'
                : 'anim-slide-in-left'
              : ''
          }`}
        >
          {renderCardContent(currentItem, isTransitioning)}
        </div>
      </div>

      {/* Chunky Retro Controls Below the Card */}
      <div className="flex items-center justify-center gap-2.5 mt-3 z-30 select-none">
        {/* Prev Button */}
        <button
          type="button"
          id="carousel-btn-prev"
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface diner-tag flex items-center justify-center hover:bg-secondary-container active:scale-90 transition-all cursor-pointer shadow-sm"
          aria-label="Previous menu item"
        >
          <span className="material-symbols-outlined text-base font-bold">arrow_back</span>
        </button>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container-lowest/90 rounded-full diner-tag">
          {items.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={i}
                id={`carousel-dot-${i}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  changeSlide(i, i > currentIndex ? 'next' : 'prev');
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-5 h-2 bg-primary shadow-xs'
                    : 'w-2 h-2 bg-on-surface/20 hover:bg-on-surface/50'
                }`}
                aria-label={`Go to slide ${i + 1}: ${items[i]?.name}`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          id="carousel-btn-next"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface diner-tag flex items-center justify-center hover:bg-secondary-container active:scale-90 transition-all cursor-pointer shadow-sm"
          aria-label="Next menu item"
        >
          <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
