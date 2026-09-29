import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderService, cartService, authService, groupOrderService } from '../services/api';

export default function GroupOrder() {
  const navigate = useNavigate();
  const [billingMode, setBillingMode] = useState('host');
  const [autoLock, setAutoLock] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(12 * 60 + 45);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [tipPercent, setTipPercent] = useState(18);
  const [isLocking, setIsLocking] = useState(false);
  const [banterMessages, setBanterMessages] = useState([
    {
      id: 1,
      type: 'pin',
      author: 'Sally (Host Pinned Note):',
      text: '“Order milkshakes quickly folks so they stay cold on highway delivery! I am ordering onion rings for the table too.”',
      time: '12:38 PM',
    },
    {
      id: 2,
      type: 'action',
      author: 'Priya Kapoor',
      text: 'added Triple Malt Shake to tray',
      time: '12:40 PM',
    },
    {
      id: 3,
      type: 'poll',
      author: 'Dave Miller',
      text: 'voted for House Tangy BBQ Dip',
      time: '12:41 PM',
    },
    {
      id: 4,
      type: 'chat',
      author: 'Priya',
      avatar: 'PK',
      text: 'Can someone get an extra ranch? Happy to split it!',
      time: '12:43 PM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://chowchow.diner/group/CHOW-7492').catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    setBanterMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'chat',
        author: 'You',
        avatar: 'YOU',
        isUser: true,
        text: chatInput.trim(),
        time: 'Just now',
      },
    ]);
    setChatInput('');
  };

  const handleLockAndPay = async () => {
    setIsLocking(true);
    try {
      if (!authService.isAuthenticated()) {
        try {
          await authService.login('customer1@chowchow.com', 'admin123');
        } catch {}
      }
      try {
        await cartService.addItem(1, 2);
        await cartService.addItem(2, 1);
      } catch {}

      const res = await orderService.create({
        restaurantId: 1,
        deliveryAddress: '742 Evergreen Terrace, Floor 3, Table Booth 4',
        deliveryLatitude: 35.5385,
        deliveryLongitude: -86.5825,
      });

      if (res && res.id) {
        navigate(`/track-order?orderId=${res.id}`);
        return;
      }
    } catch (e) {
      console.error('Failed to create order from group feast', e);
    } finally {
      setIsLocking(false);
    }
    navigate('/track-order?orderId=1');
  };

  const subtotal = 46.7;
  const tax = 3.85;
  const tipAmount = subtotal * (tipPercent / 100);
  const grandTotal = subtotal + tax + tipAmount;
  const perPerson = grandTotal / 4;

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* Room Control Marquee Header */}
      <section className="w-full mb-space-xl">
        <div className="bg-secondary-fixed rounded-xl p-space-md lg:p-space-lg diner-border shadow-xl relative overflow-hidden">
          {/* Background pattern accent */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-secondary-container/40 pointer-events-none"></div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md relative z-10">
            <div className="space-y-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider diner-tag">
                  Live Order Session
                </span>
                <span className="font-label-md text-label-md text-secondary font-bold tracking-wide">
                  ROOM #CHOW-7492
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight">
                Friday Office Diner Feasts
              </h1>
              <div className="flex items-center gap-space-sm pt-1">
                <div className="relative">
                  <img
                    className="w-9 h-9 rounded-full diner-tag object-cover bg-secondary-container"
                    alt="Sally Jenkins"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4u1qJhZkBfTjuxkPvkkZcL2HAVpI6Nhx9jYHf5mssHi-Bm7SnDg3rQWnSmGp9vzs2MX275zZHBFTaBLDvzg-C5xHZQpXLwbVg7b7YmGbiQm3Y8RpvaQfgLS6fqxdecS1NTxffHA1g9qRaPKvzzVLpa46ay6GU-HJ0jwRuafPdDa_xMyMwkmAWykaZ9iKGEH4RTA4a-Va--SznG57qWb7jHzjP0Yrliaa6cS6sHtCaJKISof7jsTSE"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary text-[9px] font-bold px-1 rounded-full diner-tag">
                    HOST
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface">
                  Ordered by <strong className="font-bold">Sally Jenkins</strong> (Table Captain)
                </p>
              </div>
            </div>

            {/* Mechanical Timer Widget & Status */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md shrink-0">
              <div className="bg-surface-container-lowest p-space-sm rounded-lg diner-border flex items-center gap-space-sm">
                <div className="flex flex-col text-left">
                  <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                    Room Closes In
                  </span>
                  <span className="font-label-sm text-xs text-primary font-bold">
                    Status: Open For Picks
                  </span>
                </div>
                {/* Countdown Display */}
                <div
                  className="flex items-center gap-1 bg-on-surface text-surface-bright px-3 py-1.5 rounded diner-tag font-label-lg text-label-lg tracking-widest font-mono font-bold"
                  id="session-countdown"
                >
                  <span>{formatTime(timerSeconds)}</span>
                </div>
              </div>

              {/* Share Button & Code */}
              <div className="flex items-center gap-space-xs">
                <button
                  className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase font-bold diner-tag hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-1.5 shadow-md"
                  type="button"
                  onClick={handleCopyLink}
                >
                  <span className="material-symbols-outlined text-lg">
                    {copiedLink ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedLink ? 'Copied! ✓' : 'Copy Link'}</span>
                </button>
                <button
                  className="p-2.5 rounded-lg bg-surface-container-high text-on-surface diner-tag hover:bg-surface-container-highest transition-all"
                  title="Show Table QR"
                  type="button"
                  onClick={() => setShowQrModal(true)}
                >
                  <span className="material-symbols-outlined text-xl">qr_code_2</span>
                </button>
              </div>
            </div>
          </div>

          {/* Marquee Options Ribbon */}
          <div className="mt-space-md pt-space-md border-t-2 border-dashed border-on-surface/20 flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex flex-wrap items-center gap-space-md">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                Billing Mode:
              </span>
              <div className="flex items-center gap-space-sm bg-surface-container-low p-1 rounded-full diner-tag">
                <label
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer font-label-sm text-label-sm font-bold transition-all ${
                    billingMode === 'host'
                      ? 'bg-secondary-container text-on-secondary-container diner-tag'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <input
                    className="accent-primary"
                    name="billing-split"
                    type="radio"
                    value="host"
                    checked={billingMode === 'host'}
                    onChange={() => setBillingMode('host')}
                  />
                  <span>Host Pays All</span>
                </label>
                <label
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer font-label-sm text-label-sm font-bold transition-all ${
                    billingMode === 'split'
                      ? 'bg-secondary-container text-on-secondary-container diner-tag'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <input
                    className="accent-primary"
                    name="billing-split"
                    type="radio"
                    value="split"
                    checked={billingMode === 'split'}
                    onChange={() => setBillingMode('split')}
                  />
                  <span>Split Per Person</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-4 h-4 rounded accent-primary diner-tag cursor-pointer"
                id="auto-lock"
                type="checkbox"
                checked={autoLock}
                onChange={(e) => setAutoLock(e.target.checked)}
              />
              <label className="font-label-sm text-label-sm text-on-surface cursor-pointer select-none" htmlFor="auto-lock">
                Auto-lock room once all 4 members mark <span className="text-tertiary font-bold">READY</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: 8 Columns Trays & Chat, 4 Columns Checkout Paper Ticket */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Member Trays & Live Feed (Cols 1-8) */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Section Title & Participants Pill Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="w-4 h-4 rounded-full bg-primary inline-block"></span>
              <h2 className="font-headline-lg text-headline-lg uppercase text-on-surface">
                Collaborative Table Trays
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full diner-tag">
              <span className="font-label-sm text-label-sm font-bold text-on-surface">
                4 of 8 Seats Occupied
              </span>
            </div>
          </div>

          {/* Trays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* Tray 1: Sally Jenkins (Host) */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md diner-border flex flex-col justify-between relative group hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-2 border-b-2 border-dashed border-outline-variant/60 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed diner-tag flex items-center justify-center font-headline-sm text-on-secondary-fixed">
                    SJ
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-headline-sm text-headline-sm leading-none text-on-surface">
                        Sally Jenkins
                      </h3>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                        Host
                      </span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Booth Seat #1 • 2 items
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold diner-tag flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                  READY
                </span>
              </div>
              {/* Items Ordered */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center font-label-sm text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-headline-sm text-sm font-bold text-on-surface">
                        Route 66 Classic Burger
                      </p>
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        Medium Rare • Brioche Bun
                      </p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">₹12.50</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center font-label-sm text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-headline-sm text-sm font-bold text-on-surface">
                        Diner Golden Loaded Fries
                      </p>
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        Cheddar Dust • Chives
                      </p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">₹6.95</span>
                </div>
              </div>
              <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Tray Subtotal
                </span>
                <span className="font-headline-sm text-headline-sm text-primary">₹19.45</span>
              </div>
            </div>

            {/* Tray 2: Dave (Product) */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md diner-border flex flex-col justify-between relative group hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-2 border-b-2 border-dashed border-outline-variant/60 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed diner-tag flex items-center justify-center font-headline-sm text-on-tertiary-fixed">
                    DM
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm leading-none text-on-surface">
                      Dave Miller
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Booth Seat #2 • 1 item
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold diner-tag flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                  READY
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center font-label-sm text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-headline-sm text-sm font-bold text-on-surface">
                        California Avocado Melt
                      </p>
                      <p className="font-body-sm text-xs text-primary font-medium">
                        Extra dill pickles please!
                      </p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">₹14.25</span>
                </div>
                <div className="p-2 rounded border border-dashed border-outline-variant text-center">
                  <p className="font-label-sm text-xs text-on-surface-variant italic">
                    No beverages selected
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Tray Subtotal
                </span>
                <span className="font-headline-sm text-headline-sm text-primary">₹14.25</span>
              </div>
            </div>

            {/* Tray 3: Priya (Design) */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md diner-border flex flex-col justify-between relative group hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-2 border-b-2 border-dashed border-outline-variant/60 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-secondary-container diner-tag flex items-center justify-center font-headline-sm text-on-secondary-container">
                    PK
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm leading-none text-on-surface">
                      Priya Kapoor
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Booth Seat #3 • 2 items
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold diner-tag flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  PICKING
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center font-label-sm text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-headline-sm text-sm font-bold text-on-surface">
                        Triple Malt Shake (Vanilla)
                      </p>
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        Maraschino Cherry Top
                      </p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">₹7.50</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-variant flex items-center justify-center font-label-sm text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-headline-sm text-sm font-bold text-on-surface">
                        Crispy Beer-Battered Rings
                      </p>
                      <p className="font-body-sm text-xs text-on-surface-variant">
                        With Remoulade dip
                      </p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">₹5.50</span>
                </div>
              </div>
              <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Tray Subtotal
                </span>
                <span className="font-headline-sm text-headline-sm text-primary">₹13.00</span>
              </div>
            </div>

            {/* Tray 4: Marco (Engineering) */}
            <div className="bg-surface-container rounded-xl p-space-md diner-border flex flex-col justify-between relative border-dashed">
              <div className="flex items-start justify-between gap-2 border-b-2 border-dashed border-outline-variant/60 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-surface-dim diner-tag flex items-center justify-center font-headline-sm text-on-surface-variant">
                    MS
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm leading-none text-on-surface">
                      Marco Santos
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Booth Seat #4 • Empty Tray
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold diner-tag flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  BROWSING MENU
                </span>
              </div>
              <div className="py-6 flex flex-col items-center justify-center text-center px-4">
                <span className="material-symbols-outlined text-3xl text-outline-variant animate-bounce mb-1">
                  restaurant_menu
                </span>
                <p className="font-headline-sm text-sm text-on-surface">
                  Marco is looking at Burgers...
                </p>
                <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                  Items will appear here live when selected.
                </p>
              </div>
              <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between opacity-60">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Tray Subtotal
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant">₹0.00</span>
              </div>
            </div>

            {/* Card 5: + Invite Another Buddy */}
            <button
              className="w-full h-full min-h-[180px] rounded-xl border-2 border-dashed border-outline hover:border-primary bg-surface-container-low hover:bg-secondary-fixed/30 p-space-md flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer text-left"
              type="button"
              onClick={() => setShowQrModal(true)}
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest diner-tag flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-primary font-bold">
                  person_add
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface uppercase group-hover:text-primary transition-colors">
                + Invite Coworker
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant text-center">
                Share link with your team to hop in
              </span>
            </button>

            {/* Quick Dish Recommendation Spotlight */}
            <div className="rounded-xl bg-secondary-fixed/50 p-space-md diner-border flex items-center gap-space-sm">
              <img
                className="w-20 h-20 rounded-lg object-cover diner-tag shrink-0"
                alt="Double Chocolate Malt"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2p8o1NiA7N4W0Ryo5m2kq4sL9IsoICkp8ziyLxBBnfydSGHwoPJs6Dm__8is2ynYzXtZWOXDHIuIa-guqzasNnZP6IFm5CIx2lxXu8-J1DpUZYTYWKPU-5gl6wi1to5zByAGYM6_H9m15EKvHEgiI-nEJyboBu761QpiimJpONTUkLNGGjq9d--oxde81ApfL32gE3eFzMRf7eNH5S1ZZqvBfInu1DA4KcMn4DaKjh8ODf-wolRWv"
              />
              <div className="min-w-0">
                <span className="font-label-sm text-[10px] uppercase font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                  Special Suggestion
                </span>
                <h4 className="font-headline-sm text-sm font-bold text-on-surface truncate">
                  Double Chocolate Malt
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant line-clamp-1">
                  Pairs great with Sally's Route 66 Burger.
                </p>
                <button
                  className="mt-1 text-xs font-label-sm font-bold text-primary uppercase underline hover:text-on-surface cursor-pointer"
                  type="button"
                  onClick={() => {
                    setBanterMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now(),
                        type: 'action',
                        author: 'You',
                        text: 'added Double Chocolate Malt (+₹6.50) to tray',
                        time: 'Just now',
                      },
                    ]);
                  }}
                >
                  Add to my tray (+₹6.50)
                </button>
              </div>
            </div>
          </div>

          {/* Live Activity & Food Banter Log Section */}
          <div className="bg-surface-container-low rounded-xl p-space-md diner-border">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">forum</span>
                <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface">
                  Table Banter &amp; Live Kitchen Ticker
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping" title="Live stream active"></span>
            </div>

            {/* Chat / Event List */}
            <div className="space-y-space-sm max-h-56 overflow-y-auto pr-1" id="chat-stream">
              {banterMessages.map((msg) => {
                if (msg.type === 'pin') {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5 bg-secondary-fixed/40 p-2.5 rounded-lg diner-tag">
                      <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">
                        push_pin
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-label-sm text-label-sm font-bold text-on-secondary-fixed">
                          {msg.author}
                        </p>
                        <p className="font-body-sm text-xs text-on-surface font-medium">{msg.text}</p>
                      </div>
                      <span className="font-label-sm text-[10px] text-on-surface-variant shrink-0">
                        {msg.time}
                      </span>
                    </div>
                  );
                }
                if (msg.type === 'action') {
                  return (
                    <div key={msg.id} className="flex items-center gap-2 text-xs font-body-sm text-on-surface-variant px-1">
                      <span className="material-symbols-outlined text-tertiary text-sm">add_circle</span>
                      <span>
                        <strong className="text-on-surface">{msg.author}</strong> {msg.text}
                      </span>
                      <span className="text-[10px] ml-auto">{msg.time}</span>
                    </div>
                  );
                }
                if (msg.type === 'poll') {
                  return (
                    <div key={msg.id} className="flex items-center gap-2 text-xs font-body-sm text-on-surface-variant px-1">
                      <span className="material-symbols-outlined text-primary text-sm">thumb_up</span>
                      <span>
                        <strong className="text-on-surface">{msg.author}</strong> {msg.text}
                      </span>
                      <span className="text-[10px] ml-auto">{msg.time}</span>
                    </div>
                  );
                }
                return (
                  <div key={msg.id} className="flex items-start gap-2 px-1 animate-fadeIn">
                    <div
                      className={`w-6 h-6 rounded-full diner-tag flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        msg.isUser ? 'bg-primary text-on-primary' : 'bg-secondary-container'
                      }`}
                    >
                      {msg.avatar}
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-lg diner-tag text-xs flex-1">
                      <span className="font-bold text-on-surface">{msg.author}:</span> {msg.text}
                    </div>
                    <span className="font-label-sm text-[10px] text-on-surface-variant shrink-0 self-center">
                      {msg.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Box for Table Banter */}
            <form onSubmit={handleSendMessage} className="mt-space-sm pt-space-xs flex items-center gap-space-xs">
              <input
                className="flex-1 bg-surface-container-lowest px-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline diner-border focus:outline-none focus:ring-2 focus:ring-primary"
                id="banter-input"
                placeholder="Drop a note, request sauces, or cheer on Marco..."
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                className="px-space-md py-2 bg-primary text-on-primary font-label-md text-label-md uppercase font-bold rounded-lg diner-tag hover:bg-primary-container transition-colors shrink-0"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sticky Diner Paper Guest Check Ticket (Cols 9-12) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-surface-container-lowest rounded-xl diner-border p-space-md relative overflow-hidden shadow-xl">
            {/* Paper Check Scallop Header */}
            <div className="h-3 w-full bg-repeat-x scallop-divider -mt-space-md -mx-space-md mb-space-md opacity-70"></div>
            <div className="text-center border-b-2 border-on-surface pb-3 mb-4">
              <span className="font-label-sm text-[10px] tracking-widest uppercase font-bold text-primary block">
                Official Guest Check
              </span>
              <h3 className="font-headline-lg text-headline-lg uppercase tracking-tight text-on-surface leading-tight">
                Chow Chow Diner
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Table #4 • Server: Betty • 4 Guests
              </p>
            </div>

            {/* Perforated Line Decoration */}
            <div className="w-full border-t-2 border-dashed border-on-surface/30 my-3"></div>

            {/* Order Items Breakdown */}
            <div className="space-y-2 mb-4 font-body-sm text-sm">
              <div className="flex justify-between items-center text-on-surface">
                <span>Route 66 Classic Burger</span>
                <span className="font-bold font-label-md">₹12.50</span>
              </div>
              <div className="flex justify-between items-center text-on-surface">
                <span>Diner Golden Loaded Fries</span>
                <span className="font-bold font-label-md">₹6.95</span>
              </div>
              <div className="flex justify-between items-center text-on-surface">
                <span>California Avocado Melt</span>
                <span className="font-bold font-label-md">₹14.25</span>
              </div>
              <div className="flex justify-between items-center text-on-surface">
                <span>Triple Malt Shake</span>
                <span className="font-bold font-label-md">₹7.50</span>
              </div>
              <div className="flex justify-between items-center text-on-surface">
                <span>Crispy Beer-Battered Rings</span>
                <span className="font-bold font-label-md">₹5.50</span>
              </div>
            </div>

            {/* Receipt Cost Details */}
            <div className="border-t-2 border-dashed border-on-surface/30 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-on-surface-variant font-body-sm">
                <span>Food &amp; Drinks Subtotal</span>
                <span className="font-bold text-on-surface font-label-md" id="subtotal-val">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-tertiary font-body-sm">
                <span className="flex items-center gap-1 font-medium">
                  Highway Delivery Tier
                  <span className="material-symbols-outlined text-xs">verified</span>
                </span>
                <span className="font-bold font-label-md uppercase bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded diner-tag text-xs">
                  FREE (₹0.00)
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant font-body-sm">
                <span>Estimated Local Tax (8.25%)</span>
                <span className="font-bold text-on-surface font-label-md">
                  ₹{tax.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Tip Selector (Retro Coin Buttons) */}
            <div className="mt-4 pt-3 border-t border-outline-variant/60">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-xs uppercase font-bold text-on-surface">
                  Add Diner Tip:
                </span>
                <span className="font-label-sm text-xs font-bold text-primary" id="selected-tip-display">
                  {tipPercent}% (₹{tipAmount.toFixed(2)})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5" id="tip-selector">
                {[15, 18, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    className={`py-1.5 rounded-lg font-label-sm text-xs font-bold diner-tag transition-colors ${
                      tipPercent === pct
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container hover:bg-secondary-fixed text-on-surface'
                    }`}
                    type="button"
                    onClick={() => setTipPercent(pct)}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Total Grand Highlight */}
            <div className="my-4 p-3 bg-secondary-fixed rounded-lg diner-border flex items-center justify-between">
              <div>
                <span className="font-label-sm text-xs uppercase font-bold text-on-secondary-fixed block">
                  Total Check
                </span>
                <span className="font-body-sm text-[11px] text-on-surface-variant">
                  Incl. all taxes &amp; tip
                </span>
              </div>
              <div className="text-right">
                <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight" id="grand-total-val">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Split calculation pill */}
            <div className="mb-4 bg-tertiary-fixed/60 p-2.5 rounded-lg diner-tag flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-lg">pie_chart</span>
                <span className="font-label-sm text-xs font-bold text-on-tertiary-fixed">
                  4-Way Split Cost:
                </span>
              </div>
              <span className="font-headline-sm text-sm font-bold text-tertiary" id="split-per-person">
                ₹{perPerson.toFixed(2)} / person
              </span>
            </div>

            {/* Primary Action Squish Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleLockAndPay}
                disabled={isLocking}
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg uppercase tracking-wider font-bold diner-tag hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-lg active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 text-center shadow-md cursor-pointer disabled:opacity-70"
              >
                <span className="material-symbols-outlined text-xl">lock</span>
                <span>{isLocking ? 'Locking & Creating Order...' : `Lock Room & Pay (₹${grandTotal.toFixed(2)})`}</span>
              </button>
              <Link
                to="/restaurants-and-menus"
                className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md uppercase font-bold diner-tag hover:bg-secondary-fixed transition-all flex items-center justify-center gap-1.5 text-center"
              >
                <span className="material-symbols-outlined text-base">restaurant</span>
                <span>Keep Adding Diner Items</span>
              </Link>
            </div>

            {/* Micro Guarantees */}
            <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-center gap-4 text-center">
              <div className="flex items-center gap-1 text-[11px] font-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-primary">local_shipping</span>
                <span>All food arrives together</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-tertiary">receipt_long</span>
                <span>Itemized receipts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Pop-up Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-space-lg diner-border shadow-2xl relative text-center">
            <button
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-high diner-tag flex items-center justify-center hover:bg-error hover:text-on-error transition-colors"
              type="button"
              onClick={() => setShowQrModal(false)}
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
            <div className="w-16 h-16 rounded-full bg-secondary-fixed diner-tag mx-auto mb-3 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">qr_code_scanner</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase text-on-surface mb-1">
              Scan To Join Table
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant mb-4">
              Anyone with this code can add items directly to Sally's Friday Diner Feast.
            </p>
            {/* Vintage styled QR frame */}
            <div className="p-4 bg-surface rounded-xl diner-border inline-block mb-4">
              <svg className="w-40 h-40 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                <rect fill="currentColor" height="30" rx="4" width="30" x="0" y="0"></rect>
                <rect fill="#fff8f6" height="20" rx="2" width="20" x="5" y="5"></rect>
                <rect fill="currentColor" height="10" width="10" x="10" y="10"></rect>
                <rect fill="currentColor" height="30" rx="4" width="30" x="70" y="0"></rect>
                <rect fill="#fff8f6" height="20" rx="2" width="20" x="75" y="5"></rect>
                <rect fill="currentColor" height="10" width="10" x="80" y="10"></rect>
                <rect fill="currentColor" height="30" rx="4" width="30" x="0" y="70"></rect>
                <rect fill="#fff8f6" height="20" rx="2" width="20" x="5" y="75"></rect>
                <rect fill="currentColor" height="10" width="10" x="10" y="80"></rect>
                <rect fill="currentColor" height="8" width="8" x="36" y="8"></rect>
                <rect fill="currentColor" height="6" width="12" x="48" y="12"></rect>
                <rect fill="#cb4926" height="24" rx="3" width="24" x="38" y="38"></rect>
                <circle cx="50" cy="50" fill="#fff8f6" r="5"></circle>
                <rect fill="currentColor" height="8" width="14" x="12" y="44"></rect>
                <rect fill="currentColor" height="8" width="18" x="72" y="44"></rect>
                <rect fill="currentColor" height="16" width="12" x="42" y="72"></rect>
                <rect fill="currentColor" height="15" width="25" x="65" y="75"></rect>
              </svg>
            </div>
            <div className="bg-surface-container p-2.5 rounded-lg diner-tag flex items-center justify-between text-left mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant font-label-sm block">
                  Direct Room Link
                </span>
                <span className="text-xs font-mono text-primary font-bold">
                  chowchow.diner/room/7492
                </span>
              </div>
              <button
                className="px-2 py-1 rounded bg-surface-container-highest text-on-surface font-label-sm text-xs font-bold diner-tag"
                type="button"
                onClick={handleCopyLink}
              >
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button
              className="w-full py-2.5 rounded-lg bg-on-surface text-surface-bright font-label-sm uppercase font-bold diner-tag hover:opacity-90"
              type="button"
              onClick={() => setShowQrModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
