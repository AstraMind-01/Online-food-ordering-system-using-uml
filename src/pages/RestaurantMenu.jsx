import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { menuService, cartService, orderService, authService } from '../services/api';

export default function RestaurantMenu() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState({
    'item-1': 1,
    'item-2': 1,
    'item-3': 1,
    'item-4': 1,
    'item-5': 1,
    'item-6': 1,
  });
  const [trayCount, setTrayCount] = useState(5);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleQtyChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddToTray = async (name, itemBackendId = 1) => {
    setTrayCount((prev) => prev + 1);
    triggerToast(`Added ${name} to Sally's Group Tray!`);
    try {
      if (authService.isAuthenticated()) {
        await cartService.addItem(itemBackendId, quantities[`item-${itemBackendId}`] || 1);
      }
    } catch {}
  };

  const handleDirectCheckout = async () => {
    setIsOrdering(true);
    try {
      if (!authService.isAuthenticated()) {
        try {
          await authService.login('customer1@chowchow.com', 'admin123');
        } catch {}
      }
      try {
        await cartService.addItem(1, 1);
        await cartService.addItem(3, 1);
      } catch {}

      const res = await orderService.create({
        restaurantId: 1,
        deliveryAddress: '742 Evergreen Terrace, Floor 3, Buzz #04',
        deliveryLatitude: 35.5385,
        deliveryLongitude: -86.5825,
      });

      if (res && res.id) {
        navigate(`/track-order?orderId=${res.id}`);
        return;
      }
    } catch (e) {
      console.error('Failed to create order', e);
    } finally {
      setIsOrdering(false);
    }
    navigate('/track-order?orderId=1');
  };

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('https://chowchow.eat/booth-942').catch(() => {});
    triggerToast('Invite link copied! Share with your lunch crew.');
  };

  // Filter conditions
  const showSmash = selectedCategory === 'all' || selectedCategory === 'smash' || selectedCategory === 'vegetarian';
  const showSides = selectedCategory === 'all' || selectedCategory === 'sides' || selectedCategory === 'vegetarian';
  const showShakes = selectedCategory === 'all' || selectedCategory === 'shakes' || selectedCategory === 'vegetarian';

  return (
    <div className="flex flex-col w-full">
      {/* Top Marquee / Highway Diner Banner */}
      <section className="w-full mb-space-lg">
        {/* Collaborative Order Ribbon */}
        <div className="w-full bg-secondary-container text-on-secondary-container diner-border rounded-xl p-space-sm mb-space-md flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="w-3.5 h-3.5 rounded-full bg-primary animate-ping inline-block"></span>
            <span className="font-label-md text-label-md uppercase tracking-wider font-bold">
              Collab Group Mode: ON
            </span>
            <span className="hidden sm:inline font-body-sm text-body-sm text-on-secondary-container">
              Sally's Office Lunch session active • 4 diner pals picking together!
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              className="px-space-md py-1 rounded-full bg-surface text-on-surface font-label-sm text-label-sm diner-tag hover:bg-surface-bright transition-all flex items-center gap-1"
              id="copyInviteBtn"
              type="button"
              onClick={handleCopyInvite}
            >
              <span className="material-symbols-outlined text-sm">link</span>
              <span>Copy Invite Link</span>
            </button>
            <span className="px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm diner-tag">
              Cart Sync Live
            </span>
          </div>
        </div>

        {/* Restaurant Header Card */}
        <div className="bg-surface-container-low rounded-2xl diner-border p-space-md lg:p-space-lg relative overflow-hidden">
          {/* Decorative Retro Watermark */}
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
            <span className="material-symbols-outlined text-[240px] text-on-surface">lunch_dining</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10">
            {/* Brand Title & Details */}
            <div className="flex flex-col gap-space-xs max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm uppercase diner-tag tracking-wider">
                  Highway 66 Flavor Stop
                </span>
                <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm diner-tag flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs">star</span> 4.9 (420 reviews)
                </span>
                <span className="px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm diner-tag">
                  Open Late 'til 2 AM
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg uppercase tracking-tight text-on-surface mt-1">
                Big Bill's Burger Emporium
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Fresh griddled smash patties, house relish, toasted potato buns, and fountain malts spun on genuine 1958 Hamilton Beach mixers.
              </p>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-space-md text-on-surface-variant font-label-sm text-label-sm mt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-primary">timer</span> Avg Prep: 15–25 min
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-secondary">local_shipping</span> Free Delivery over ₹35
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-tertiary">check_circle</span> Contactless Group Handoff
                </span>
              </div>
            </div>

            {/* Action Pill Group */}
            <div className="flex flex-wrap lg:flex-col gap-space-xs shrink-0 items-start lg:items-end">
              <Link
                to="/group-ordering"
                className="px-space-md py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase diner-tag hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">person_add</span>
                <span>Invite Friend to Table</span>
              </Link>
              <a
                className="px-space-md py-2.5 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md diner-tag hover:bg-secondary-fixed transition-all flex items-center gap-2"
                href="#shared-ticket"
              >
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                <span>Group Bill (<span id="trayCounter">{trayCount} items</span>)</span>
              </a>
              <button
                className="px-space-md py-2 rounded-full bg-surface-bright text-on-surface font-label-sm text-label-sm diner-tag hover:bg-surface-container transition-all flex items-center gap-1.5"
                type="button"
                onClick={() => triggerToast('Displaying dietary and vibe filters!')}
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                <span>Dietary &amp; Vibe Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Dietary Pill Strip */}
      <section className="w-full mb-space-lg flex items-center gap-space-xs overflow-x-auto pb-2 scrollbar-none">
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('all')}
        >
          All Diner Goodies (6)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all ${
            selectedCategory === 'smash'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('smash')}
        >
          Smash Burgers &amp; Melts (3)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all ${
            selectedCategory === 'sides'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('sides')}
        >
          Baskets &amp; Sides (2)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all ${
            selectedCategory === 'shakes'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('shakes')}
        >
          Fountain Malts &amp; Shakes (1)
        </button>
        <button
          className={`px-4 py-1.5 rounded-full font-label-md text-label-md diner-tag shrink-0 transition-all flex items-center gap-1 ${
            selectedCategory === 'vegetarian'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
          }`}
          type="button"
          onClick={() => setSelectedCategory('vegetarian')}
        >
          <span className="w-2 h-2 rounded-full bg-tertiary"></span> Veggie Friendly
        </button>
      </section>

      {/* Main Body Grid: 8 Columns Menu Cards + 4 Columns Sticky Guest Check Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Menu Items Board (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Section: Smash Burgers & Melts */}
          {showSmash && (
            <section className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-1 border-b-2 border-dashed border-on-surface/40">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-2xl">lunch_dining</span>
                  <h2 className="font-headline-xl text-headline-xl uppercase tracking-tight text-on-surface">
                    Smash Burgers &amp; Melts
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm uppercase bg-surface-container px-2 py-0.5 rounded diner-tag font-bold">
                  100% Certified Angus
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Item 1: The Route 66 Double Smash */}
                {selectedCategory !== 'vegetarian' && (
                  <article className="bg-surface-container-lowest rounded-xl diner-border p-space-md flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group">
                    <div className="flex flex-col">
                      <div className="relative w-full h-44 rounded-lg overflow-hidden diner-border mb-space-sm bg-surface-container">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt="The Route 66 Double Smash"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold diner-tag tracking-wider">
                          ★ Diner Special
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold diner-tag">
                          ₹12.95
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                          The Route 66 Double Smash
                        </h3>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Double smashed beef patties, griddled onions, thick sharp cheddar, crispy pickles, and Bill's secret 1974 spiced relish on toasted brioche.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-label-sm text-[10px] uppercase text-on-surface font-semibold">
                          House Favorite
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-secondary-fixed font-label-sm text-[10px] uppercase text-on-secondary-fixed font-semibold">
                          Double Patty
                        </span>
                      </div>
                    </div>
                    {/* Stepper and Add Bar */}
                    <div className="mt-space-md pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between gap-space-xs">
                      <div className="flex items-center diner-tag rounded-full bg-surface-container-low p-0.5">
                        <button
                          className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                          type="button"
                          onClick={() => handleQtyChange('item-1', -1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-label-md text-label-md font-bold">
                          {quantities['item-1']}
                        </span>
                        <button
                          className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                          type="button"
                          onClick={() => handleQtyChange('item-1', 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="flex-1 py-1.5 px-3 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase diner-tag hover:bg-primary-container transition-colors flex items-center justify-center gap-1"
                        type="button"
                        onClick={() => handleAddToTray('The Route 66 Double Smash')}
                      >
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        <span>Add to Group Tray</span>
                      </button>
                    </div>
                  </article>
                )}

                {/* Item 2: Avocado Green Goddess Burger */}
                <article className="bg-surface-container-lowest rounded-xl diner-border p-space-md flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group">
                  <div className="flex flex-col">
                    <div className="relative w-full h-44 rounded-lg overflow-hidden diner-border mb-space-sm bg-surface-container">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt="Avocado Green Goddess"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUDrljKVytOGjUw1TO1Ki6e2JT0fcDAgQ4dpMy0NAm-0mo6Rh5JJzhqDTz0l6Ir3qtyERVD_Fqi7lOQJfqhqPB_kBiv070gWa3PSCgOOPn7wrfltXoQ9rg5Cab2j_-dC50_aDSHlvCElYHQ6Xe86F585Eh7EOpJMNHHbIJRzUg6t86wCFv1hLaqjZ_ji4F95yxlbODsyjwhmO98yw8ZqsWQ2LSo8UtQau1Xdad5fl5jbdtqg3xrSzX"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-tertiary text-on-tertiary font-label-sm text-[10px] uppercase font-bold diner-tag tracking-wider">
                        Veggie Pick
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold diner-tag">
                        ₹14.25
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                        Avocado Green Goddess
                      </h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Charred turkey or hand-formed plant patty, ripe avocado spread, green tomato chow-chow, and crisp iceberg on potato roll.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed font-label-sm text-[10px] uppercase text-on-tertiary-fixed font-bold">
                        Plant Option
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-label-sm text-[10px] uppercase text-on-surface font-semibold">
                        Fresh Herbs
                      </span>
                    </div>
                  </div>
                  {/* Stepper and Add Bar */}
                  <div className="mt-space-md pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between gap-space-xs">
                    <div className="flex items-center diner-tag rounded-full bg-surface-container-low p-0.5">
                      <button
                        className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                        type="button"
                        onClick={() => handleQtyChange('item-2', -1)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-label-md text-label-md font-bold">
                        {quantities['item-2']}
                      </span>
                      <button
                        className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                        type="button"
                        onClick={() => handleQtyChange('item-2', 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="flex-1 py-1.5 px-3 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase diner-tag hover:bg-primary-container transition-colors flex items-center justify-center gap-1"
                      type="button"
                      onClick={() => handleAddToTray('Avocado Green Goddess')}
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>Add to Group Tray</span>
                    </button>
                  </div>
                </article>

                {/* Item 5: Classic Patty Melt on Rye */}
                {selectedCategory !== 'vegetarian' && (
                  <article className="bg-surface-container-lowest rounded-xl diner-border p-space-md flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
                      <div className="md:col-span-5 relative h-44 rounded-lg overflow-hidden diner-border bg-surface-container">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt="Classic Patty Melt on Rye"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAepflTShAE-KO4FlAI2SAZ96L-3fC_ab7LReW5F-kCX1z_fEga8NAE2c0p3bS-LsqXlnca1wPZvVop1jPWOOaUq0r6Bzs3zebF8yACt5gSBVH91ymVOFHqI_pXr4Qfr8Lok8-KqMTHOpcWxd-I8uF3aMfUOeC2s5jUbhoEPbOjAHeJIU9uFfMjJWywbH6hxQ3H4-2yEAG--OX2hf6-i1v2MrQh_k_4bJ1_MY785LPVGBjlZ6iwxd2G"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-[10px] uppercase font-bold diner-tag tracking-wider">
                          Retro Classic '74
                        </span>
                      </div>
                      <div className="md:col-span-7 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                              Classic Patty Melt on Rye
                            </h3>
                            <span className="font-label-lg text-label-lg font-bold text-primary">
                              ₹11.50
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                            Butter-toasted caraway seed rye bread, heavy griddled Swiss, slowly caramelized sweet vidalia onions, and special black pepper diner dressing.
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="px-2 py-0.5 rounded bg-surface-container-high font-label-sm text-[10px] uppercase font-semibold">
                              Griddled to Order
                            </span>
                            <span className="px-2 py-0.5 rounded bg-secondary-fixed-dim font-label-sm text-[10px] uppercase font-semibold">
                              Swiss Cheese
                            </span>
                          </div>
                        </div>
                        <div className="mt-space-sm pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between gap-space-xs">
                          <div className="flex items-center diner-tag rounded-full bg-surface-container-low p-0.5">
                            <button
                              className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                              type="button"
                              onClick={() => handleQtyChange('item-5', -1)}
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-label-md text-label-md font-bold">
                              {quantities['item-5']}
                            </span>
                            <button
                              className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                              type="button"
                              onClick={() => handleQtyChange('item-5', 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="py-1.5 px-4 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase diner-tag hover:bg-primary-container transition-colors flex items-center gap-1.5"
                            type="button"
                            onClick={() => handleAddToTray('Classic Patty Melt on Rye')}
                          >
                            <span className="material-symbols-outlined text-sm">add_circle</span>
                            <span>Add to Group Tray</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )}
              </div>
            </section>
          )}

          {/* Section: Diner Baskets & Sides */}
          {showSides && (
            <section className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-1 border-b-2 border-dashed border-on-surface/40">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-2xl">fastfood</span>
                  <h2 className="font-headline-xl text-headline-xl uppercase tracking-tight text-on-surface">
                    Diner Baskets &amp; Sides
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm uppercase bg-surface-container px-2 py-0.5 rounded diner-tag font-bold">
                  Made For Sharing
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Item 3: Crinkle-Cut Loaded Diner Fries */}
                {selectedCategory !== 'vegetarian' && (
                  <article className="bg-surface-container-lowest rounded-xl diner-border p-space-md flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group">
                    <div className="flex flex-col">
                      <div className="relative w-full h-44 rounded-lg overflow-hidden diner-border mb-space-sm bg-surface-container">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt="Crinkle-Cut Loaded Diner Fries"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold diner-tag tracking-wider">
                          Crowd Favorite
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold diner-tag">
                          ₹6.50
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                          Crinkle-Cut Loaded Fries
                        </h3>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Extra crispy crinkle fries, spiced sea salt, velvety yellow cheddar cheese sauce, bacon crumble, and snipped scallions.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-secondary-fixed font-label-sm text-[10px] uppercase font-semibold">
                          Loaded Basket
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-label-sm text-[10px] uppercase font-semibold">
                          Serves 2–3
                        </span>
                      </div>
                    </div>
                    {/* Stepper and Add Bar */}
                    <div className="mt-space-md pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between gap-space-xs">
                      <div className="flex items-center diner-tag rounded-full bg-surface-container-low p-0.5">
                        <button
                          className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                          type="button"
                          onClick={() => handleQtyChange('item-3', -1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-label-md text-label-md font-bold">
                          {quantities['item-3']}
                        </span>
                        <button
                          className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                          type="button"
                          onClick={() => handleQtyChange('item-3', 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="flex-1 py-1.5 px-3 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase diner-tag hover:bg-primary-container transition-colors flex items-center justify-center gap-1"
                        type="button"
                        onClick={() => handleAddToTray('Crinkle Loaded Fries')}
                      >
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        <span>Add to Group Tray</span>
                      </button>
                    </div>
                  </article>
                )}

                {/* Item 6: Crispy Vidalia Onion Ring Tower */}
                <article className="bg-surface-container-lowest rounded-xl diner-border p-space-md flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group">
                  <div className="flex flex-col">
                    <div className="relative w-full h-44 rounded-lg overflow-hidden diner-border mb-space-sm bg-surface-container">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        alt="Crispy Onion Ring Tower"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_a9lG45cMxCs_SujnGOD789YutO6YkVHMYmPAQZ_Zbjbabsl8qn9rt7lyJLbWC5sJHQP-S-WYQOm2BpnCMaOH4NiVJ7eQWEMARYOo-TtIaPTyGTGRYDkc0RIQQ7XcShzpFwKmzb2YWel9YCmCtoPLYkv7aPe3mQde-EsZhX7KgxmIDJyg4mVCxtK8cIyVEDsW6B2Q6cVah83eNG3u2wTUaAjbrdTLLrZMuJlWNUV8OtfiWD33OScA"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-tertiary text-on-tertiary font-label-sm text-[10px] uppercase font-bold diner-tag tracking-wider">
                        Hand-Dipped
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold diner-tag">
                        ₹6.00
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                        Crispy Onion Ring Tower
                      </h3>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Beer-battered thick sweet Vidalia onion rings served with Big Bill's tangy, smoky campfire dip.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed font-label-sm text-[10px] uppercase font-bold">
                        Vegetarian
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-label-sm text-[10px] uppercase font-semibold">
                        Campfire Dip
                      </span>
                    </div>
                  </div>
                  {/* Stepper and Add Bar */}
                  <div className="mt-space-md pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between gap-space-xs">
                    <div className="flex items-center diner-tag rounded-full bg-surface-container-low p-0.5">
                      <button
                        className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                        type="button"
                        onClick={() => handleQtyChange('item-6', -1)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-label-md text-label-md font-bold">
                        {quantities['item-6']}
                      </span>
                      <button
                        className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                        type="button"
                        onClick={() => handleQtyChange('item-6', 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="flex-1 py-1.5 px-3 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase diner-tag hover:bg-primary-container transition-colors flex items-center justify-center gap-1"
                      type="button"
                      onClick={() => handleAddToTray('Crispy Onion Rings')}
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>Add to Group Tray</span>
                    </button>
                  </div>
                </article>
              </div>
            </section>
          )}

          {/* Section: Fountain Malts & Shakes */}
          {showShakes && (
            <section className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-1 border-b-2 border-dashed border-on-surface/40">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-2xl">local_cafe</span>
                  <h2 className="font-headline-xl text-headline-xl uppercase tracking-tight text-on-surface">
                    Fountain Malts &amp; Shakes
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm uppercase bg-surface-container px-2 py-0.5 rounded diner-tag font-bold">
                  16oz Metal Can Included
                </span>
              </div>
              <article className="bg-surface-container-lowest rounded-xl diner-border p-space-md flex flex-col md:flex-row gap-space-md items-center hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform group">
                <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden diner-border bg-surface-container shrink-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt="Tall Boy Neapolitan Malted Milkshake"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold diner-tag tracking-wider">
                    Hand-Spun
                  </span>
                </div>
                <div className="flex flex-col justify-between flex-1 w-full h-full">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                        Tall Boy Neapolitan Malted Milkshake
                      </h3>
                      <span className="font-label-lg text-label-lg font-bold text-primary">₹7.00</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Real dairy vanilla bean, Dutch cocoa, and sweet macerated strawberry spun with malted barley powder. Poured into an icy fluted glass, finished with real whipped cream and a stem-on maraschino cherry.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                        Extra Thick
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm font-semibold">
                        Classic Malt
                      </span>
                      <span className="px-2 py-0.5 rounded bg-tertiary-fixed font-label-sm text-label-sm font-semibold">
                        Vegetarian
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md pt-space-xs border-t-2 border-dashed border-outline-variant flex items-center justify-between gap-space-xs">
                    <div className="flex items-center diner-tag rounded-full bg-surface-container-low p-0.5">
                      <button
                        className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                        type="button"
                        onClick={() => handleQtyChange('item-4', -1)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-label-md text-label-md font-bold">
                        {quantities['item-4']}
                      </span>
                      <button
                        className="w-7 h-7 rounded-full bg-surface flex items-center justify-center font-bold text-on-surface hover:bg-secondary-fixed text-sm transition-colors"
                        type="button"
                        onClick={() => handleQtyChange('item-4', 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="py-1.5 px-4 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase diner-tag hover:bg-primary-container transition-colors flex items-center gap-1.5"
                      type="button"
                      onClick={() => handleAddToTray('Neapolitan Malt Shake')}
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>Add to Group Tray</span>
                    </button>
                  </div>
                </div>
              </article>
            </section>
          )}

          {/* Retro Diner Fun Fact / Placemat Callout */}
          <div className="w-full bg-secondary-fixed/50 rounded-xl diner-border p-space-md flex items-center gap-space-md">
            <span className="material-symbols-outlined text-4xl text-secondary shrink-0">
              sentiment_very_satisfied
            </span>
            <div>
              <h4 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                The 100% Diner Table Guarantee
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                All group items are cooked synchronously so no one's burgers get cold while waiting for the shakes. If it isn't piping hot, Bill makes it twice.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Collaborative Group Guest Check (4 Cols) */}
        <aside className="lg:col-span-4 w-full sticky top-24 self-start" id="shared-ticket">
          <div className="bg-surface-container-low rounded-t-xl diner-border-thick relative overflow-hidden">
            {/* Scalloped Top Ticket Header */}
            <div className="bg-secondary-container p-space-sm diner-border-thick border-x-0 border-t-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary font-bold">receipt</span>
                <span className="font-label-md text-label-md uppercase font-bold tracking-wider text-on-secondary-container">
                  Guest Check • Shared Table
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface text-primary font-label-sm text-label-sm font-bold diner-tag">
                #TABLE-04
              </span>
            </div>
            <div className="p-space-md flex flex-col gap-space-sm bg-surface-bright">
              {/* Session Meta */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-outline/30 pb-space-xs">
                <div>
                  <p className="font-headline-sm text-headline-sm uppercase leading-tight text-on-surface">
                    Sally's Office Lunch
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Host: Sally W. • 4 Friends
                  </p>
                </div>
                <div className="flex -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-sm flex items-center justify-center diner-tag font-bold">
                    S
                  </span>
                  <span className="w-7 h-7 rounded-full bg-secondary text-on-secondary font-label-sm flex items-center justify-center diner-tag font-bold">
                    D
                  </span>
                  <span className="w-7 h-7 rounded-full bg-tertiary text-on-tertiary font-label-sm flex items-center justify-center diner-tag font-bold">
                    P
                  </span>
                  <span className="w-7 h-7 rounded-full bg-surface-dim text-on-surface font-label-sm flex items-center justify-center diner-tag font-bold">
                    M
                  </span>
                </div>
              </div>

              {/* Per-Member Item Breakdown */}
              <div className="flex flex-col gap-space-sm max-h-96 overflow-y-auto pr-1">
                {/* Member 1: Sally (Host) */}
                <div className="bg-surface-container rounded-lg p-2.5 diner-tag">
                  <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                    <span className="flex items-center gap-1.5 text-primary">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      Sally (Host)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px]">
                      Locked • ₹19.45
                    </span>
                  </div>
                  <ul className="font-body-sm text-body-sm text-on-surface space-y-1">
                    <li className="flex justify-between">
                      <span>1x The Route 66 Double Smash</span>
                      <span className="font-label-sm font-bold">₹12.95</span>
                    </li>
                    <li className="flex justify-between text-on-surface-variant">
                      <span>1x Crinkle Loaded Fries</span>
                      <span className="font-label-sm font-bold">₹6.50</span>
                    </li>
                  </ul>
                </div>

                {/* Member 2: Dave */}
                <div className="bg-surface-container rounded-lg p-2.5 diner-tag">
                  <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                    <span className="flex items-center gap-1.5 text-secondary">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      Dave
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px]">
                      Ready • ₹14.25
                    </span>
                  </div>
                  <ul className="font-body-sm text-body-sm text-on-surface space-y-1">
                    <li className="flex justify-between">
                      <span>1x Avocado Green Goddess</span>
                      <span className="font-label-sm font-bold">₹14.25</span>
                    </li>
                  </ul>
                </div>

                {/* Member 3: Priya */}
                <div className="bg-surface-container rounded-lg p-2.5 diner-tag">
                  <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                    <span className="flex items-center gap-1.5 text-tertiary">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                      Priya
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] animate-pulse">
                      Picking... • ₹13.00
                    </span>
                  </div>
                  <ul className="font-body-sm text-body-sm text-on-surface space-y-1">
                    <li className="flex justify-between">
                      <span>1x Neapolitan Malt Shake</span>
                      <span className="font-label-sm font-bold">₹7.00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>1x Crispy Onion Rings</span>
                      <span className="font-label-sm font-bold">₹6.00</span>
                    </li>
                  </ul>
                </div>

                {/* Member 4: Marco (Live Typing indicator) */}
                <div className="bg-surface-container-high/60 rounded-lg p-2.5 diner-tag border-dashed">
                  <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                    <span className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                      Marco
                    </span>
                    <span className="text-[10px] text-primary italic font-normal flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                      Browsing shakes...
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                    No items yet
                  </p>
                </div>
              </div>

              {/* Perforated Bill Tear-Line */}
              <div className="relative py-2 border-t-2 border-dashed border-on-surface/40 my-1">
                <span className="absolute -top-2 -left-6 w-4 h-4 rounded-full bg-surface-container-highest"></span>
                <span className="absolute -top-2 -right-6 w-4 h-4 rounded-full bg-surface-container-highest"></span>
              </div>

              {/* Bill Calculation */}
              <div className="flex flex-col gap-1 font-label-md text-label-md text-on-surface">
                <div className="flex justify-between">
                  <span>Items Subtotal ({trayCount})</span>
                  <span>₹46.70</span>
                </div>
                <div className="flex justify-between text-tertiary font-bold">
                  <span>Group Perk (4+ Diners)</span>
                  <span>-₹5.00</span>
                </div>
                <div className="flex justify-between text-on-surface-variant text-xs">
                  <span>Estimated Tax &amp; Route Fee</span>
                  <span>₹4.15</span>
                </div>
                <div className="flex justify-between text-on-surface-variant text-xs">
                  <span>Shared Delivery</span>
                  <span className="text-tertiary font-bold">FREE (₹0.00)</span>
                </div>
                <div className="pt-2 border-t-2 border-on-surface flex justify-between items-baseline font-headline-sm text-headline-sm">
                  <span className="uppercase">Table Total</span>
                  <span className="text-primary font-bold" id="billTotalAmount">₹45.85</span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant text-center mt-0.5">
                  Split equally: ~<span className="font-bold text-on-surface">₹11.46 / diner</span>
                </p>
              </div>

              {/* Checkout & Host Approval Button */}
              <div className="pt-space-xs flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleDirectCheckout}
                  disabled={isOrdering}
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg uppercase tracking-wider diner-border hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70"
                >
                  <span className="material-symbols-outlined">receipt_long</span>
                  <span>{isOrdering ? 'Dispatching Order...' : 'Place Delivery Order (₹45.85)'}</span>
                </button>
                <Link
                  to="/group-ordering"
                  className="w-full py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md uppercase diner-tag hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 text-center"
                >
                  <span className="material-symbols-outlined text-base">diversity_3</span>
                  <span>Open Collab Booth Table (₹45.85)</span>
                </Link>
                <button
                  className="w-full py-2 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm diner-tag hover:bg-secondary-fixed transition-colors flex items-center justify-center gap-1.5"
                  type="button"
                  onClick={() => triggerToast('Split method changed between Equal and Itemized.')}
                >
                  <span className="material-symbols-outlined text-sm">call_split</span>
                  <span>Change Bill Split Method (Equal vs Itemized)</span>
                </button>
              </div>
            </div>
            {/* Serrated Zig-zag Bottom Cut Ticket */}
            <div className="w-full h-3 bg-repeat-x scallop-divider opacity-80 rotate-180"></div>
          </div>

          {/* Quick Delivery Pin Note */}
          <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-high diner-tag flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-xl">pin_drop</span>
            <div className="text-left font-body-sm text-body-sm">
              <p className="font-bold text-on-surface">Delivering to Table:</p>
              <p className="text-on-surface-variant text-xs">742 Evergreen Terrace, Floor 3 • Buzz #04</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Notification Toast */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-transform duration-300 pointer-events-none ${
          showToast ? 'translate-y-0' : 'translate-y-32'
        }`}
      >
        <div className="bg-secondary-container text-on-secondary-container px-space-md py-3 rounded-xl diner-border-thick flex items-center gap-3 shadow-2xl">
          <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
          <p className="font-label-md text-label-md font-bold">{toastMessage}</p>
        </div>
      </div>
    </div>
  );
}
