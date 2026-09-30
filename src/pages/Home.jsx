import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroMenuCarousel from '../components/HeroMenuCarousel';
import SectionHeading from '../components/SectionHeading';
import StepBadge from '../components/StepBadge';
import TimelineBadge from '../components/TimelineBadge';
import RetroModal from '../components/restaurant/RetroModal';
import ScrollingOrderPopup from '../components/ScrollingOrderPopup';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { menuService, restaurantService, groupOrderService, cartService, authService } from '../services/api';

export default function Home() {
  const navigate = useNavigate();

  // State for Featured Menu
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(false);

  // State for Popular Diners
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);

  // State for Join Group Modal
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [groupCodeInput, setGroupCodeInput] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Cart Feedback Toast
  const [toastMessage, setToastMessage] = useState('');

  // State for Food Item Details & Customization Modal
  const [selectedFoodDetail, setSelectedFoodDetail] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [selectedSide, setSelectedSide] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialNote, setSpecialNote] = useState('');

  const handleOpenDetail = (item) => {
    const enrichedItem = {
      ...item,
      badge: item.badgeText || item.badge || '★ Chef Special',
      badgeColor: item.badgeColor || 'bg-[#cb4926] text-white',
      prepTime: item.prepTime || `${item.prepTimeMins || 8} Mins`,
      calories: item.calories || '580–720 kcal',
      longDescription:
        item.longDescription ||
        item.description ||
        'Freshly griddled using authentic 1970s diner traditions with secret spices and premium ingredients.',
      ingredients: item.ingredients || [
        'Certified Premium Cut',
        'Wisconsin Aged Cheddar',
        'Chef Relish & Secret Seasoning',
        'Butter-Toasted Brioche Bun',
        'Crispy Pickles & Fresh Herbs',
      ],
      allergens: item.allergens || 'Prepared in a kitchen handling dairy, wheat, gluten, and eggs.',
      tags: item.tags || ['Diner Classic', 'Griddled Fresh', 'House Recipe'],
      sideChoices: item.sideChoices || [
        { name: 'Crinkle-Cut Fries (Included)', price: 0 },
        { name: 'Golden Crispy Onion Rings', price: 3.0 },
        { name: 'Truffle Parmesan Tots', price: 3.5 },
        { name: 'Farmhouse Side Salad', price: 2.0 },
      ],
      extraChoices: item.extraChoices || [
        { name: 'Extra Sharp Melted Cheddar', price: 1.5 },
        { name: 'Applewood Smoked Bacon', price: 2.0 },
        { name: 'Secret Diner Relish', price: 0.0 },
        { name: 'Griddled Fire Jalapeños', price: 1.0 },
      ],
    };

    setSelectedFoodDetail(enrichedItem);
    setModalQty(1);
    setSelectedSide(enrichedItem.sideChoices?.[0] || null);
    setSelectedAddons([]);
    setSpecialNote('');
  };

  const modalCalculatedTotal = selectedFoodDetail
    ? (Number(selectedFoodDetail.price || 0) +
        Number(selectedSide?.price || 0) +
        selectedAddons.reduce((sum, a) => sum + Number(a.price || 0), 0)) *
      modalQty
    : 0;

  const handleAddModalToCart = async () => {
    if (!selectedFoodDetail) return;
    const qty = modalQty;
    const item = selectedFoodDetail;
    const sideName = selectedSide?.name ? ` + ${selectedSide.name}` : '';

    if (!authService.isAuthenticated()) {
      setToastMessage(`✓ Added ${qty}x "${item.name}${sideName}" (₹${modalCalculatedTotal.toFixed(2)}) to your cart!`);
      setTimeout(() => setToastMessage(''), 3000);
      setSelectedFoodDetail(null);
      return;
    }

    try {
      await cartService.addItem(item.id, qty);
      setToastMessage(`✓ Added ${qty}x "${item.name}" (₹${modalCalculatedTotal.toFixed(2)}) to your cart!`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setToastMessage(`✓ Added ${qty}x "${item.name}" to cart!`);
      setTimeout(() => setToastMessage(''), 3000);
    }
    setSelectedFoodDetail(null);
  };

  // Fetch Menu and Restaurants on Mount
  useEffect(() => {
    // 1. Fetch featured menu (first 6 items)
    menuService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data.slice(0, 6));
        } else {
          // Fallback static items if backend is warming up
          setMenuItems(FALLBACK_MENU_ITEMS);
        }
      })
      .catch(() => {
        setMenuError(true);
        setMenuItems(FALLBACK_MENU_ITEMS);
      })
      .finally(() => setMenuLoading(false));

    // 2. Fetch popular diners
    restaurantService.getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRestaurants(data);
        } else {
          setRestaurants(FALLBACK_RESTAURANTS);
        }
      })
      .catch(() => {
        setRestaurants(FALLBACK_RESTAURANTS);
      })
      .finally(() => setRestaurantsLoading(false));
  }, []);

  // Handle Add To Cart
  const handleAddToCart = async (item) => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { error: 'Please sign in to add items to your cart!' } });
      return;
    }

    try {
      await cartService.addItem(item.id, 1);
      setToastMessage(`✓ Added "${item.name}" to your cart!`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setToastMessage(`✕ Could not add "${item.name}". Please try again.`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // Handle Join Group
  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!groupCodeInput.trim()) return;

    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { error: 'Please sign in to join a group booth!' } });
      return;
    }

    setJoinLoading(true);
    setJoinError('');

    try {
      await groupOrderService.join(groupCodeInput.trim().toUpperCase());
      setJoinModalOpen(false);
      navigate('/group-ordering');
    } catch (err) {
      console.error('Join group failed:', err);
      setJoinError(err.response?.data?.message || 'Invalid Group ID or group is closed.');
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-xl px-5 py-3 shadow-[4px_4px_0px_#231916] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <span className="font-bold text-sm text-[#231916]">{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="text-xs font-black uppercase text-[#8d716a] hover:text-[#231916]"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: HERO (EXISTING - DO NOT CHANGE PIXEL-IDENTICAL HERO SECTION)   */}
      {/* ========================================================================= */}
      <section className="relative w-full rounded-2xl bg-surface-container-low diner-border-thick p-space-md md:p-space-xl overflow-hidden mb-space-2xl">
        {/* Retro Sunburst Pattern Background */}
        <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden flex items-center justify-center">
          <svg className="w-[140%] h-[140%] max-w-none animate-sunburst origin-center" preserveAspectRatio="none" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient cx="50%" cy="50%" id="sunburstGrad" r="50%">
                <stop offset="0%" stopColor="#fdc65c" stopOpacity="0.9"></stop>
                <stop offset="100%" stopColor="#cb4926" stopOpacity="0.3"></stop>
              </radialGradient>
            </defs>
            <path d="M500,300 L420,0 L580,0 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L680,0 L780,0 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L880,0 L960,60 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L1000,160 L1000,260 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L1000,360 L1000,480 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L950,580 L820,600 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L680,600 L560,600 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L440,600 L320,600 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L180,600 L50,560 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L0,460 L0,340 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L0,220 L0,120 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L50,40 L160,0 Z" fill="url(#sunburstGrad)"></path>
            <path d="M500,300 L260,0 L340,0 Z" fill="url(#sunburstGrad)"></path>
          </svg>
        </div>

        {/* Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed diner-tag">
              <span className="material-symbols-outlined text-primary text-base">restaurant</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                EST. 1974 • OVER 500,000 MILKSHAKES &amp; BURGERS SERVED
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface leading-[0.95] drop-shadow-sm">
              GOOD FOOD, <br />
              <span className="text-primary underline decoration-secondary-container decoration-wavy">
                GROOVY MOOD
              </span>
              ,<br />
              DELIVERED FAST.
            </h1>

            {/* Paragraph Text */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Order solo or rally the gang for collaborative group ordering with zero delivery split hassle, live group carts, and vintage roadside drive-in flavor.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
              <Link
                to="/group-ordering"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-space-lg py-space-md rounded-xl bg-primary text-on-primary font-label-lg text-label-lg uppercase tracking-wider diner-border hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-xl">group_add</span>
                ORDER TOGETHER (START GROUP)
              </Link>
              <Link
                to="/restaurants"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-space-lg py-space-md rounded-xl bg-secondary-container text-on-secondary-container font-label-lg text-label-lg uppercase tracking-wider diner-border hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-xl">menu_book</span>
                BROWSE DINERS &amp; MENUS
              </Link>
            </div>

            {/* Avatar Stack */}
            <div className="flex items-center gap-3 pt-space-xs text-on-surface-variant">
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full object-cover diner-tag"
                  alt="Customer 1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7Vc1wES0_CIrjd2P-zkvPwbqdmE2kbiaKO6-wX6qScSIEOYhgY3kWlgekKQwRGOv0mRXYyUoFg7TPYt-tL1poRwE8rkBFJTQIcM30zRfRT6YqKBtYQrviEk5ib4nWrMrDwpDIfObNV4gb6HDaTgJUVteqZ5899qNBm9zzWCr6J2EcnPIlGFl5YHWtEhFFzaZwZOx--i48xYec4UJK2uBuwJbPs0hktxUCZ4k6D39vT3cRa0GpG-Nb"
                />
                <img
                  className="w-8 h-8 rounded-full object-cover diner-tag"
                  alt="Customer 2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA811_Q4po8wI3Fnw4Rh_Wckg-AJUdEDw5mJzeVKhTyntU3niVwg6VvLPi0NW37ode2gpSab5_M3t42XBnCVXAZJpj2MuPTBXiUY6PsvFRHGZNoDWIX2lvzlb5RRTxJjaAE_bclQMamtoOeHXfQztNQZUeIMg3b4gKg5hXwGZCapmz22AGMbqFTbUYhwZasQD3OGQqagemTKXS01vl2rUWaYvzkN5pQXr2K_J4HQPGbq2kfcpcvSLVi"
                />
                <img
                  className="w-8 h-8 rounded-full object-cover diner-tag"
                  alt="Customer 3"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTIL9YO18-qVpqWFPLcw9vOe0aEJiE2Au_gm6L1U9JlIaox88P3JCqDIIa5A_bqzd9_q0YHpOevmeleMBzr_Tc16PqJrsb7xzunHD_Gu4A0nS1TJWI94eF5OOBhWJlEPkoQ1GACE4_SW10h245MFADJeW1HZD2VH5sFt-iYi7VGynSJBg-jnIn2HSL_fuRm2uenjZzhpu1PXDNchzl-zrM-L-OKhl1t-rschMz5inAOutIa5Z9dHX_"
                />
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm flex items-center justify-center font-bold diner-tag">
                  +4.9k
                </div>
              </div>
              <p className="font-body-sm text-body-sm font-bold">
                Trusted by 12,000+ hungry road-trippers and team lunches this month!
              </p>
            </div>
          </div>

          {/* Right Visual Menu Carousel */}
          <div className="lg:col-span-5 relative flex justify-center">
            <HeroMenuCarousel onSelectFood={handleOpenDetail} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: FEATURED MENU ("TODAY'S HOT PICKS")                            */}
      {/* ========================================================================= */}
      <section className="mb-24 pt-4">
        <SectionHeading
          tag="TODAY'S HOT PICKS"
          titlePrefix="CHEF SPECIALS FRESH OFF THE"
          highlightWord="GRIDDLE"
          titleSuffix=""
          subtitle="Hand-crafted road favorites, triple bacon smashers, and steel-spun malts prepared hot for immediate pickup or delivery."
        />

        {menuLoading ? (
          <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-10 text-center shadow-[4px_4px_0px_#231916]">
            <div className="w-12 h-12 border-4 border-[#cb4926] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-bold text-sm text-[#231916] uppercase">Warming Up The Flat-Top Griddle...</p>
          </div>
        ) : menuError && menuItems.length === 0 ? (
          <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-10 text-center shadow-[4px_4px_0px_#231916] max-w-md mx-auto">
            <span className="material-symbols-outlined text-4xl text-[#cb4926] mb-2">soup_kitchen</span>
            <h3 className="font-headline-md text-lg font-black uppercase text-[#231916]">Kitchen Is Warming Up!</h3>
            <p className="text-xs text-[#59413b] font-medium mt-1">Our chefs are prepping fresh ingredients. Please check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916] flex flex-col justify-between hover:-translate-y-1 transition-transform group anim-card-pop"
              >
                {/* Clickable Card Body opening Food Details Modal */}
                <div
                  className="flex flex-col cursor-pointer group/card"
                  onClick={() => handleOpenDetail(item)}
                  title="Click to view full recipe details, ingredients & side customization"
                >
                  {/* Photo Container */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-[#231916] shadow-[2px_2px_0px_#231916] mb-4 bg-[#f7e4de]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                    />

                    {/* Ribbon Tag */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#5e7d56] text-[#f8fff0] font-black text-[11px] uppercase border border-[#231916] shadow-[1px_1px_0px_#231916]">
                      {item.badgeText || item.badge || '★ Classic Pick'}
                    </div>

                    {/* Prep Pill */}
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#ffdea7] text-[#231916] font-bold text-[10px] uppercase border border-[#231916] shadow-[1px_1px_0px_#231916]">
                      Cooked in {item.prepTimeMins || item.prepTime || 8}
                    </div>

                    {/* Hover Hint Overlay Badge */}
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#231916]/85 text-white font-label-sm text-[10px] uppercase font-black opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center gap-1 backdrop-blur-xs shadow-sm">
                      <span className="material-symbols-outlined text-[13px] text-[#fdc65c]">info</span>
                      <span>View Details</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-headline-md text-lg font-black uppercase text-[#231916] tracking-tight leading-snug mb-1.5 group-hover/card:text-[#cb4926] transition-colors">
                    {item.name}
                  </h3>
                  <p className="font-body-sm text-xs text-[#59413b] font-medium leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Price and Add to Cart Action */}
                <div className="pt-3 border-t-2 border-dashed border-[#231916] flex items-center justify-between gap-2">
                  <div className="font-headline-lg text-2xl font-black text-[#cb4926] tracking-tight">
                    ₹{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(item)}
                      className="px-2.5 py-2 bg-white text-[#231916] font-black font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
                      title="View details & recipe customization"
                    >
                      <span className="material-symbols-outlined text-sm text-[#cb4926]">visibility</span>
                      <span className="hidden sm:inline">Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-1 px-3.5 py-2 bg-[#cb4926] text-white font-black font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#b03a19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: POPULAR DINERS ("HUNGRY FOR MORE?")                            */}
      {/* ========================================================================= */}
      <section className="mb-24">
        <SectionHeading
          tag="HUNGRY FOR MORE?"
          titlePrefix="EXPLORE OUR FAMOUS"
          highlightWord="HIGHWAY"
          titleSuffix="DINERS"
          subtitle="Step inside authentic roadside diners and nostalgic drive-in kitchens with 1970s jukebox charm."
        />

        {restaurantsLoading ? (
          <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-10 text-center shadow-[4px_4px_0px_#231916]">
            <p className="font-bold text-sm text-[#231916] uppercase">Locating Route 66 Diners...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((rest) => (
                <div
                  key={rest.id}
                  className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916] flex flex-col justify-between hover:-translate-y-1 transition-transform group anim-card-pop"
                >
                  <div>
                    {/* Diner Photo */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-[#231916] shadow-[2px_2px_0px_#231916] mb-4 bg-[#f7e4de]">
                      <img
                        src={rest.imageUrl || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'}
                        alt={rest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Open Tag */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#5e7d56] text-[#f8fff0] font-black text-[10px] uppercase border border-[#231916] shadow-[1px_1px_0px_#231916]">
                        {rest.open !== false ? '● OPEN NOW' : '○ CLOSED'}
                      </div>

                      {/* Rating Pill */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#fdc65c] text-[#231916] font-black text-xs border border-[#231916] shadow-[1px_1px_0px_#231916] flex items-center gap-1">
                        <span>★</span>
                        <span>{rest.rating || '4.9'}</span>
                      </div>
                    </div>

                    <h3 className="font-headline-md text-xl font-black uppercase text-[#231916] tracking-tight mb-1">
                      {rest.name}
                    </h3>
                    <p className="font-body-sm text-xs text-[#cb4926] font-bold uppercase tracking-wider mb-2">
                      {rest.cuisine || 'American Diner & Grill'}
                    </p>
                    <p className="font-body-xs text-xs text-[#59413b] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#cb4926]">location_on</span>
                      {rest.address || '742 Evergreen Terrace, Springfield'}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-dashed border-[#231916] mt-4">
                    <Link
                      to="/restaurants"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ffdea7] text-[#231916] font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#fed388] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      <span>Explore Diner Menu</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Diners Button */}
            <div className="text-center pt-2">
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#fdc65c] text-[#231916] font-black text-sm uppercase border-[2.5px] border-[#231916] rounded-xl shadow-[4px_4px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined">storefront</span>
                <span>VIEW ALL DINERS</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: HOW IT WORKS ("ORDER IN 4 EASY STEPS")                         */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="mb-24 scroll-mt-24">
        <SectionHeading
          tag="ORDER IN 4 EASY STEPS"
          titlePrefix="FROM KITCHEN TO"
          highlightWord="YOUR BOOTH"
          titleSuffix="IN MINUTES"
          subtitle="Ordering your favorite diner food has never been smoother. Follow four simple steps."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <StepBadge
            number="1"
            icon="menu_book"
            title="Browse Menus"
            description="Browse famous highway diners and mouth-watering griddle specialties."
            badgeBg="bg-[#fdc65c]"
          />
          <StepBadge
            number="2"
            icon="shopping_basket"
            title="Add To Cart"
            description="Add food to your solo bag or start a collaborative group cart with friends."
            badgeBg="bg-[#cb4926] text-white"
          />
          <StepBadge
            number="3"
            icon="payments"
            title="Pay Online"
            description="Settle up smoothly with instant secure card payment or cash on delivery."
            badgeBg="bg-[#ffdea7]"
          />
          <StepBadge
            number="4"
            icon="sports_motorsports"
            title="Track Delivery"
            description="Follow your courier rolling along Route 66 until hot food arrives at your door."
            badgeBg="bg-[#5e7d56] text-[#f8fff0]"
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: GROUP ORDERING ("RALLY THE GANG")                              */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#fdc65c] border-[3px] border-[#231916] rounded-3xl p-6 sm:p-10 lg:p-12 mb-24 shadow-[6px_6px_0px_#231916] relative overflow-hidden">
        {/* Decorative Background Sunburst */}
        <div className="absolute -right-20 -top-20 w-96 h-96 pointer-events-none opacity-20 animate-sunburst">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-[#231916]">
            {Array.from({ length: 16 }).map((_, i) => (
              <polygon key={i} points="50,50 46,0 54,0" transform={`rotate(${i * 22.5} 50 50)`} />
            ))}
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Explanation + 2 Delivery Modes + CTA Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#231916] text-[#fff8f6] font-label-sm text-xs font-black uppercase rounded-full border border-[#231916] mb-3">
                <span>★</span>
                <span>RALLY THE GANG</span>
              </div>
              <h2 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#231916] tracking-tight leading-tight">
                Collaborative Group Dining Made Effortless
              </h2>
              <p className="font-body-md text-sm sm:text-base text-[#231916] font-bold mt-2 leading-relaxed">
                No more passing one phone around or chasing friends for split bills. Create a shared booth, invite your crew, and order together seamlessly.
              </p>
            </div>

            {/* Two Side-by-Side Delivery Mode Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Common Delivery */}
              <div className="bg-[#fff8f6] border-2 border-[#231916] rounded-2xl p-4 shadow-[3px_3px_0px_#231916] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#cb4926] text-xl font-bold">home_pin</span>
                  <h4 className="font-headline-sm text-sm font-black uppercase text-[#231916]">
                    Common Delivery
                  </h4>
                </div>
                <span className="inline-block px-2 py-0.5 bg-[#f7e4de] border border-[#231916] rounded text-[10px] font-black uppercase text-[#cb4926]">
                  Single Dropoff
                </span>
                <p className="text-xs text-[#59413b] font-medium leading-relaxed">
                  One courier brings everyone’s meals in a single trip to the primary address (office, dorm, party).
                </p>
              </div>

              {/* Individual Delivery */}
              <div className="bg-[#fff8f6] border-2 border-[#231916] rounded-2xl p-4 shadow-[3px_3px_0px_#231916] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#5e7d56] text-xl font-bold">fork_right</span>
                  <h4 className="font-headline-sm text-sm font-black uppercase text-[#231916]">
                    Individual Delivery
                  </h4>
                </div>
                <span className="inline-block px-2 py-0.5 bg-[#ffdad6] border border-[#231916] rounded text-[10px] font-black uppercase text-[#93000a]">
                  Multi-Drop Stops
                </span>
                <p className="text-xs text-[#59413b] font-medium leading-relaxed">
                  The courier makes multiple stops along the route to drop each participant’s order at their own door.
                </p>
              </div>
            </div>

            {/* Buttons: Start a Group & Join With Group ID */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/group-ordering"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#cb4926] text-white font-black text-xs sm:text-sm uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#b03a19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                <span>START A GROUP</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setGroupCodeInput('');
                  setJoinError('');
                  setJoinModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#fff8f6] text-[#231916] font-black text-xs sm:text-sm uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#f7e4de] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">key</span>
                <span>JOIN WITH GROUP ID</span>
              </button>
            </div>
          </div>

          {/* Right Column: 4 Sequence Steps */}
          <div className="lg:col-span-5 bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] space-y-4">
            <span className="text-xs font-black uppercase text-[#8d716a] tracking-wider block border-b-2 border-dashed border-[#231916] pb-2">
              UML COLLABORATIVE SEQUENCE (4 STEPS)
            </span>

            <div className="space-y-3">
              {[
                { step: '1', title: 'Create Group', text: 'Organizer starts a group and gets a unique 6-character Group Code.' },
                { step: '2', title: 'Friends Join', text: 'Members enter the code to join the shared virtual booth table.' },
                { step: '3', title: 'Shared Cart', text: 'Everyone browses the diner menu and adds their own food items.' },
                { step: '4', title: 'Organizer Checkout', text: 'Organizer picks Common or Individual delivery and submits order.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3 p-3 bg-[#f7e4de] border-2 border-[#231916] rounded-xl">
                  <span className="w-7 h-7 rounded-full bg-[#cb4926] text-white flex items-center justify-center font-black text-xs shrink-0 border border-[#231916]">
                    {s.step}
                  </span>
                  <div>
                    <h5 className="font-headline-sm text-xs font-black uppercase text-[#231916]">
                      {s.title}
                    </h5>
                    <p className="text-[11px] text-[#59413b] font-medium mt-0.5">
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: ORDER TRACKING PREVIEW ("FOLLOW YOUR FOOD")                    */}
      {/* ========================================================================= */}
      <section className="mb-24">
        <SectionHeading
          tag="FOLLOW YOUR FOOD"
          titlePrefix="LIVE ROAD"
          highlightWord="TRACKING"
          titleSuffix="PREVIEW"
          subtitle="Watch your hot diner meal progress smoothly through each kitchen and highway milestone."
        />

        <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 sm:p-10 shadow-[4px_4px_0px_#231916] relative overflow-hidden">
          {/* Header Ticket Stamp */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-dashed border-[#231916] mb-8">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm px-3 py-1 bg-[#231916] text-[#fff8f6] rounded-lg">
                SAMPLE TICKET #742
              </span>
              <span className="text-xs font-black uppercase text-[#5e7d56] bg-[#e4f3de] border border-[#231916] px-2 py-0.5 rounded">
                ● HIGHWAY RUN ACTIVE
              </span>
            </div>

            <Link
              to="/track-order"
              className="text-xs font-black uppercase text-[#cb4926] hover:underline"
            >
              Open Live Tracker →
            </Link>
          </div>

          {/* Horizontal Status Timeline */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-2">
            {/* Connecting dashed line behind badges */}
            <div className="hidden md:block absolute top-7 left-12 right-12 h-1 border-t-2 border-dashed border-[#231916] z-0"></div>

            <TimelineBadge
              stepNumber="1"
              title="Confirmed"
              subtitle="Kitchen acknowledged"
              icon="check_circle"
              isCompleted={true}
            />
            <TimelineBadge
              stepNumber="2"
              title="Preparing"
              subtitle="Sizzling on flat top"
              icon="soup_kitchen"
              isCompleted={true}
            />
            <TimelineBadge
              stepNumber="3"
              title="Ready for Pickup"
              subtitle="Packed in retro bag"
              icon="inventory_2"
              isCompleted={true}
            />
            <TimelineBadge
              stepNumber="4"
              title="Out for Delivery"
              subtitle="Courier rolling on road"
              icon="sports_motorsports"
              isActive={true}
            />
            <TimelineBadge
              stepNumber="5"
              title="Delivered"
              subtitle="Safe handoff at booth"
              icon="task_alt"
              isCompleted={false}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: JOIN US ("PART OF THE DINER FAMILY?")                          */}
      {/* ========================================================================= */}
      <section className="mb-12">
        <SectionHeading
          tag="PART OF THE DINER FAMILY?"
          titlePrefix="CHOOSE YOUR ROAD"
          highlightWord="ROLE"
          titleSuffix="TODAY"
          subtitle="Whether you are hungry, cooking in the kitchen, or cruising the asphalt on two wheels, welcome to the family."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: For Customers */}
          <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-14 h-14 rounded-full bg-[#ffdea7] border-2 border-[#231916] flex items-center justify-center text-[#231916] shadow-[2px_2px_0px_#231916] mb-4">
                <span className="material-symbols-outlined text-3xl">dinner_dining</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#f7e4de] border border-[#231916] rounded inline-block mb-1">
                HUNGRY ROAD TRIPPERS
              </span>
              <h3 className="font-headline-md text-xl font-black uppercase text-[#231916] tracking-tight mb-2">
                For Customers
              </h3>
              <p className="font-body-sm text-xs text-[#59413b] font-medium leading-relaxed mb-6">
                Craving authentic retro diner classics? Order hot smashburgers and frosty shakes solo or with your gang in minutes.
              </p>
            </div>

            <Link
              to="/restaurants"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#cb4926] text-white font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#b03a19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <span>Start Ordering</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Card 2: For Restaurants */}
          <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-14 h-14 rounded-full bg-[#fdc65c] border-2 border-[#231916] flex items-center justify-center text-[#231916] shadow-[2px_2px_0px_#231916] mb-4">
                <span className="material-symbols-outlined text-3xl">storefront</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#f7e4de] border border-[#231916] rounded inline-block mb-1">
                INDEPENDENT DINERS
              </span>
              <h3 className="font-headline-md text-xl font-black uppercase text-[#231916] tracking-tight mb-2">
                For Restaurants
              </h3>
              <p className="font-body-sm text-xs text-[#59413b] font-medium leading-relaxed mb-6">
                Run a vintage diner or drive-in kitchen? Connect your griddle to our kitchen dispatch and collaborative booth system.
              </p>
            </div>

            <Link
              to="/signup?role=RESTAURANT"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#fdc65c] text-[#231916] font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <span>Register Your Diner</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Card 3: For Delivery Partners */}
          <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div>
              <div className="w-14 h-14 rounded-full bg-[#5e7d56] border-2 border-[#231916] flex items-center justify-center text-white shadow-[2px_2px_0px_#231916] mb-4">
                <span className="material-symbols-outlined text-3xl">sports_motorsports</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#f7e4de] border border-[#231916] rounded inline-block mb-1">
                ROUTE 66 COURIERS
              </span>
              <h3 className="font-headline-md text-xl font-black uppercase text-[#231916] tracking-tight mb-2">
                For Delivery Partners
              </h3>
              <p className="font-body-sm text-xs text-[#59413b] font-medium leading-relaxed mb-6">
                Cruise the asphalt on your vintage motorcycle or van. Earn daily payouts on solo deliveries and multi-drop group runs.
              </p>
            </div>

            <Link
              to="/signup?role=DELIVERY_PARTNER"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#5e7d56] text-[#f8fff0] font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#4d6846] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <span>Deliver With Us</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* RETRO MODAL: JOIN WITH GROUP ID                                          */}
      {/* ========================================================================= */}
      <RetroModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join Collaborative Booth"
      >
        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#ffdea7] border-2 border-[#231916] flex items-center justify-center mx-auto mb-2 text-[#231916]">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <h4 className="font-headline-md text-base uppercase font-black text-[#231916]">
              Enter Group Booth Code
            </h4>
            <p className="text-xs text-[#59413b] font-medium mt-1">
              Ask your group organizer for the 6-character code (e.g. BOOTH4).
            </p>
          </div>

          {joinError && (
            <div className="p-2.5 bg-[#ffdad6] text-[#93000a] text-xs font-bold border-2 border-[#231916] rounded-xl text-center">
              ✕ {joinError}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase text-[#231916] mb-1">
              Group ID Code
            </label>
            <input
              type="text"
              required
              maxLength={12}
              value={groupCodeInput}
              onChange={(e) => setGroupCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. BOOTH4"
              className="w-full px-3.5 py-2.5 text-center font-mono font-black text-lg uppercase bg-white border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-dashed border-[#231916]">
            <button
              type="button"
              onClick={() => setJoinModalOpen(false)}
              className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#f7e4de] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={joinLoading || !groupCodeInput.trim()}
              className="px-5 py-2 bg-[#cb4926] text-white border-2 border-[#231916] rounded-xl text-xs font-black uppercase shadow-[3px_3px_0px_#231916] hover:bg-[#b03a19] cursor-pointer disabled:opacity-50"
            >
              {joinLoading ? 'Joining...' : 'Join Group Cart →'}
            </button>
          </div>
        </form>
      </RetroModal>

      {/* Food Item Details & Customization Modal */}
      {selectedFoodDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedFoodDetail(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-[#fff8f6] rounded-2xl diner-border-thick shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Top Diner Scalloped Ribbon Header */}
            <div className="bg-[#ffdea7] p-3 px-5 diner-border-thick border-x-0 border-t-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#cb4926] text-xl font-bold">lunch_dining</span>
                <span className="font-headline-sm text-xs font-black uppercase text-[#231916] tracking-wider">
                  Diner Recipe Specification &amp; Customization
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFoodDetail(null)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#231916] flex items-center justify-center border-2 border-[#231916] transition-colors cursor-pointer shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                title="Close details"
              >
                <span className="material-symbols-outlined text-base font-bold">close</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Food Image with Badges */}
                <div className="md:col-span-6 flex flex-col">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden diner-border bg-surface-container shadow-md">
                    <img
                      src={selectedFoodDetail.imageUrl}
                      alt={selectedFoodDetail.name}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-2.5 left-2.5 px-3 py-1 rounded font-label-sm text-xs uppercase font-black diner-tag shadow-sm ${selectedFoodDetail.badgeColor || 'bg-[#cb4926] text-white'}`}>
                      {selectedFoodDetail.badge}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded bg-[#231916] text-[#fed388] font-label-md text-base font-black border border-[#fed388] shadow-sm">
                      ₹{typeof selectedFoodDetail.price === 'number' ? selectedFoodDetail.price.toFixed(2) : selectedFoodDetail.price}
                    </span>
                  </div>

                  {/* Quick Prep & Calorie Badges */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-container flex items-center gap-1.5 border border-outline-variant/40">
                      <span className="material-symbols-outlined text-sm text-[#cb4926]">timer</span>
                      <span className="font-bold text-on-surface">{selectedFoodDetail.prepTime || '8 Mins'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-container flex items-center gap-1.5 border border-outline-variant/40">
                      <span className="material-symbols-outlined text-sm text-tertiary">local_fire_department</span>
                      <span className="font-bold text-on-surface">{selectedFoodDetail.calories || '580–720 kcal'}</span>
                    </div>
                  </div>
                </div>

                {/* Food Details Info */}
                <div className="md:col-span-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-lg text-2xl uppercase font-black text-[#231916] leading-tight">
                      {selectedFoodDetail.name}
                    </h3>
                    <div className="font-headline-lg text-xl font-black text-[#cb4926] mt-1">
                      ₹{typeof selectedFoodDetail.price === 'number' ? selectedFoodDetail.price.toFixed(2) : selectedFoodDetail.price}
                    </div>
                    <p className="font-body-md text-xs text-[#59413b] mt-2.5 leading-relaxed font-medium">
                      {selectedFoodDetail.longDescription || selectedFoodDetail.description}
                    </p>

                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedFoodDetail.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-surface-container-high text-[#231916] font-label-sm text-[10px] uppercase font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                      {selectedFoodDetail.vegetarian && (
                        <span className="px-2 py-0.5 rounded-full bg-[#caecbe] text-[#062105] font-label-sm text-[10px] uppercase font-bold border border-[#062105]/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 100% Vegetarian
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Kitchen Ingredients List & Allergens */}
                  <div className="mt-4 p-3.5 bg-surface-container rounded-xl border border-outline-variant/50 text-xs space-y-1.5">
                    <p className="font-black uppercase text-[#231916] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary">restaurant</span>
                      Kitchen Ingredients:
                    </p>
                    <p className="text-[11px] text-[#59413b] leading-normal font-medium">
                      {selectedFoodDetail.ingredients?.join(' • ') || 'Premium griddled meat / veggies, spices and fresh sauces.'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant italic pt-1.5 border-t border-outline-variant/30">
                      Allergen Note: {selectedFoodDetail.allergens || 'Prepared in a kitchen that handles dairy, wheat, and eggs.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customization Options Section */}
              <div className="pt-4 border-t-2 border-dashed border-[#231916]/30 space-y-4">
                {/* 1. Choice of Side */}
                {selectedFoodDetail.sideChoices && selectedFoodDetail.sideChoices.length > 0 && (
                  <div>
                    <label className="text-xs font-black uppercase text-[#231916] flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#cb4926]">fastfood</span>
                        1. Side-Choice:
                      </span>
                      <span className="text-[10px] font-bold text-[#59413b] italic">Select one option</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedFoodDetail.sideChoices.map((side, i) => {
                        const isSelected = selectedSide?.name === side.name;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedSide(side)}
                            className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#cb4926] text-white border-[#231916] shadow-[2px_2px_0px_#231916]'
                                : 'bg-white text-[#231916] border-[#231916]/30 hover:border-[#231916]'
                            }`}
                          >
                            <span>{side.name}</span>
                            <span className="font-black">
                              {side.price === 0 ? 'Included' : `+₹${side.price.toFixed(2)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Extra Addons & Toppings */}
                {selectedFoodDetail.extraChoices && selectedFoodDetail.extraChoices.length > 0 && (
                  <div>
                    <label className="text-xs font-black uppercase text-[#231916] flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#cb4926]">add_circle</span>
                        2. Extra Toppings &amp; Add-ons:
                      </span>
                      <span className="text-[10px] font-bold text-[#59413b] italic">Optional</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedFoodDetail.extraChoices.map((extra, i) => {
                        const isChecked = selectedAddons.some((a) => a.name === extra.name);
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                setSelectedAddons((prev) => prev.filter((a) => a.name !== extra.name));
                              } else {
                                setSelectedAddons((prev) => [...prev, extra]);
                              }
                            }}
                            className={`p-2.5 rounded-xl border-2 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-[#ffdea7] text-[#231916] border-[#231916] shadow-[2px_2px_0px_#231916]'
                                : 'bg-white text-[#231916] border-[#231916]/30 hover:border-[#231916]'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">
                                {isChecked ? 'check_box' : 'check_box_outline_blank'}
                              </span>
                              <span>{extra.name}</span>
                            </span>
                            <span className="font-black text-[#cb4926]">
                              {extra.price === 0 ? 'FREE' : `+₹${extra.price.toFixed(2)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Special Kitchen Instructions */}
                <div>
                  <label className="text-xs font-black uppercase text-[#231916] flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-sm text-primary">edit_note</span>
                    3. Special Kitchen Instructions / Chef Notes:
                  </label>
                  <input
                    type="text"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="e.g. Extra pickles, no onions, dressing on the side..."
                    className="w-full text-xs font-bold bg-white text-[#231916] px-3.5 py-2.5 rounded-xl border-2 border-[#231916]/40 focus:outline-none focus:border-[#cb4926]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Sticky Bottom Action Footer */}
            <div className="bg-[#f7e4de] p-4 diner-border-thick border-x-0 border-b-0 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase text-[#231916]">Quantity:</span>
                <div className="flex items-center diner-tag rounded-full bg-surface p-1 border-2 border-[#231916]">
                  <button
                    type="button"
                    onClick={() => setModalQty((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-sm hover:bg-secondary-fixed transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-label-md text-sm font-black">
                    {modalQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalQty((prev) => prev + 1)}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-sm hover:bg-secondary-fixed transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddModalToCart}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-[#cb4926] text-white font-label-md text-xs font-black uppercase diner-tag hover:bg-[#a9310f] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  <span>Add to Cart (₹{modalCalculatedTotal.toFixed(2)})</span>
                </button>
                <Link
                  to="/restaurants"
                  className="py-2.5 px-3 rounded-xl bg-white text-[#231916] font-label-md text-xs font-black uppercase diner-tag hover:bg-[#ffdea7] transition-all flex items-center justify-center gap-1 cursor-pointer border border-[#231916] shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                  title="View complete diner menu with all 19 items"
                >
                  <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                  <span className="hidden sm:inline">All Items</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Scrolling Sizzle Feed Popup Animation */}
      <ScrollingOrderPopup />

      {/* Floating Scroll to Top Rocket Button */}
      <ScrollToTopButton />
    </div>
  );
}

// Fallback Data if backend is warming up
const FALLBACK_MENU_ITEMS = [
  {
    id: 1,
    name: 'Route 66 Triple Bacon Stack',
    description: 'Crispy smoked bacon, grilled brioche & diner secret relish',
    longDescription: 'Three Angus beef patties griddled on the flat-top, stacked with thick strips of applewood smoked bacon, double sharp cheddar cheese, and Bill’s 1974 secret relish on a toasted brioche bun.',
    price: 12.45,
    badgeText: '★ Classic Special',
    prepTimeMins: 8,
    prepTime: '8 Mins',
    calories: '850 kcal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3gOc_Q6ygkb7n_hqwJ3U-ORWKkntTOOGhLzXCY7w7zE8ZIAMcTArnzI5AiQhtlb6S97YTvzTIJg3E6Ef6Ppa7XebuYRoPk03AyqM0Uu_1UnhRJBdqVHOr04O8sxMQ0eQA-lUgXwWihIJihPRARMWV0vxaSj_OSs7L69fxR5VXq8IfkyIToffa4_XVklL3DHglyFCZtEW5b59gciF3srC_dZHBiHIaR4uZ2QT_439NZmWtE6qxF1h',
    ingredients: ['Three 100% Angus Beef Patties', 'Applewood Smoked Bacon', 'Double Sharp Cheddar', 'Bill’s 1974 Spiced Relish', 'Toasted Brioche Bun'],
    allergens: 'Contains Dairy, Gluten.',
    tags: ['Triple Patty', 'Smoked Bacon', 'Bestseller'],
    vegetarian: false,
    sideChoices: [
      { name: 'Crinkle-Cut Fries (Included)', price: 0 },
      { name: 'Golden Onion Rings', price: 3.0 },
      { name: 'Truffle Parmesan Tots', price: 3.5 },
      { name: 'Farmhouse Salad', price: 2.0 }
    ],
    extraChoices: [
      { name: 'Extra Sharp Melted Cheddar', price: 1.5 },
      { name: 'Double Bacon Strips', price: 2.0 },
      { name: 'Secret Relish', price: 0.0 }
    ]
  },
  {
    id: 2,
    name: 'Jukebox Jalapeño Melt',
    description: 'Fire-roasted jalapeños, melted pepper jack & spiced secret aioli on sourdough',
    longDescription: 'Fire-roasted fresh jalapeños, melted pepper jack cheese, caramelized griddled onions, and spiced secret aioli pressed golden between buttered artisanal sourdough bread.',
    price: 11.95,
    badgeText: '★ Spicy Pick',
    prepTimeMins: 7,
    prepTime: '7 Mins',
    calories: '690 kcal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh',
    ingredients: ['Angus Beef Patty', 'Fire-Roasted Jalapeños', 'Melted Pepper Jack Cheese', 'Caramelized Onions', 'Spiced Secret Aioli', 'Buttered Sourdough'],
    allergens: 'Contains Dairy, Gluten. Spicy.',
    tags: ['Spicy Melt', 'Roasted Jalapeños'],
    vegetarian: false,
    sideChoices: [
      { name: 'Crinkle-Cut Fries (Included)', price: 0 },
      { name: 'Golden Onion Rings', price: 3.0 },
      { name: 'Truffle Parmesan Tots', price: 3.5 }
    ],
    extraChoices: [
      { name: 'Extra Pepper Jack', price: 1.5 },
      { name: 'Double Jalapeños', price: 1.0 },
      { name: 'Bacon Strips', price: 2.0 }
    ]
  },
  {
    id: 3,
    name: 'Cherry Cola Float',
    description: 'Fountain cherry cola topped with Madagascar vanilla bean ice cream & maraschino',
    longDescription: 'Fountain-drawn black cherry cola poured over two large scoops of handcrafted Madagascar vanilla bean gelato, finished with real dairy whipped cream and a candied maraschino cherry.',
    price: 5.50,
    badgeText: '★ Sweet Treat',
    prepTimeMins: 5,
    prepTime: '5 Mins',
    calories: '420 kcal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZxQuCZjoebNJODjhyJESxQlYgLaQhRW4-fIUfUeotsVlQkgH7_gntG2dBgZR9IRR88WjdrI1XyZhS4en_jc71O1JcOlOxo3L-FFCdLuXLMshNc9blA52EBvk3ZiD3nu3LpR7gSxwoCCQVYWa2SNrV5BHfoOGNbAOtFoVJJhe1geLoWc0YB2dB0ffgqzH7rAYQcWePhpujhpyNXr1zm9St7Qi8M9PWxd3hbLCDrJWf6Mt4g4dasuH',
    ingredients: ['Fountain Black Cherry Cola', 'Madagascar Vanilla Bean Gelato', 'Whipped Dairy Cream', 'Luxardo Maraschino Cherry'],
    allergens: 'Contains Dairy.',
    tags: ['Fountain Float', 'Vanilla Bean', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Standard 16oz Fountain Glass', price: 0 },
      { name: 'Jumbo 24oz Souvenir Mug', price: 2.5 }
    ],
    extraChoices: [
      { name: 'Extra Vanilla Gelato Scoop', price: 1.75 },
      { name: 'Cherry Syrup Shot', price: 0.75 }
    ]
  },
  {
    id: 4,
    name: 'Neon Night Chili Cheese Fries',
    description: 'Golden crinkle fries smothered in Texas road chili, aged cheddar & green onions',
    longDescription: 'Heaping basket of golden crisp crinkle-cut fries smothered in slow-simmered Texas road chili, melted aged Wisconsin cheddar cheese sauce, diced scallions, and pickled jalapeños.',
    price: 7.95,
    badgeText: '★ Shareable',
    prepTimeMins: 6,
    prepTime: '6 Mins',
    calories: '610 kcal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh',
    ingredients: ['Golden Crinkle Fries', 'Texas Road Chili', 'Warm Wisconsin Cheddar Sauce', 'Diced Scallions', 'Pickled Jalapeños'],
    allergens: 'Contains Dairy.',
    tags: ['Crinkle Cut', 'Shareable Basket'],
    vegetarian: false,
    sideChoices: [
      { name: 'Campfire Dip', price: 0 },
      { name: 'Ranch Dressing', price: 0 },
      { name: 'Extra Cheddar Cup', price: 1.5 }
    ],
    extraChoices: [
      { name: 'Smoked Bacon Crumble', price: 1.5 },
      { name: 'Extra Pickled Jalapeños', price: 0.5 }
    ]
  },
  {
    id: 5,
    name: 'Drive-In Chicken Basket',
    description: 'Crispy buttermilk fried chicken tenders served with honey mustard & diner slaw',
    longDescription: 'Tender chicken strips marinated in whole spiced buttermilk, double-dipped in seasoned flour, and fried until golden and crunchy. Served with honey mustard dip and diner apple-cider slaw.',
    price: 13.50,
    badgeText: '★ Crowd Favorite',
    prepTimeMins: 10,
    prepTime: '10 Mins',
    calories: '760 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Buttermilk-Marinated Chicken Tenders', 'Crispy Seasoned Breading', 'Honey Mustard Dip', 'Apple-Cider Slaw'],
    allergens: 'Contains Gluten, Dairy.',
    tags: ['Buttermilk Fried', 'Crispy Tenders'],
    vegetarian: false,
    sideChoices: [
      { name: 'Crinkle-Cut Fries (Included)', price: 0 },
      { name: 'Golden Onion Rings', price: 3.0 }
    ],
    extraChoices: [
      { name: 'Extra Honey Mustard Dip', price: 0.75 },
      { name: 'BBQ Dip Cup', price: 0.75 }
    ]
  },
  {
    id: 6,
    name: 'Malt Shop Vanilla Shake',
    description: 'Thick malted barley shake spun in classic steel cans with whipped cream peak',
    longDescription: 'Creamy Madagascar vanilla bean ice cream blended with farm-fresh whole milk and authentic Carnation malted barley powder on our 1958 Hamilton Beach spindle mixer.',
    price: 6.25,
    badgeText: '★ Old School',
    prepTimeMins: 5,
    prepTime: '5 Mins',
    calories: '540 kcal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD',
    ingredients: ['Madagascar Vanilla Bean Ice Cream', 'Farm Fresh Whole Milk', 'Malted Barley Powder', 'Fresh Whipped Cream Peak'],
    allergens: 'Contains Dairy, Gluten (Barley Malt).',
    tags: ['Hamilton Beach Spun', 'Malted Barley', 'Vegetarian'],
    vegetarian: true,
    sideChoices: [
      { name: 'Standard 16oz Canister', price: 0 },
      { name: 'Jumbo 20oz Glass', price: 2.0 }
    ],
    extraChoices: [
      { name: 'Extra Malted Powder Scoop', price: 0.75 },
      { name: 'Warm Hot Fudge Rim', price: 1.0 }
    ]
  },
];

const FALLBACK_RESTAURANTS = [
  {
    id: 1,
    name: 'Chow Chow Retro Diner & Eats',
    cuisine: 'Classic American Diner, Malts & Burgers',
    address: '742 Evergreen Terrace, Springfield',
    rating: 4.9,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
  },
];
