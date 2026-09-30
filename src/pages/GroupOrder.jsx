import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { orderService, cartService, authService, groupOrderService } from '../services/api';

export default function GroupOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room') || 'CHOW-7492';

  const [billingMode, setBillingMode] = useState('host');
  const [autoLock, setAutoLock] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(12 * 60 + 45);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [inviteModalTab, setInviteModalTab] = useState('qr'); // 'qr' | 'link' | 'direct'
  const [coworkerName, setCoworkerName] = useState('');
  const [coworkerEmail, setCoworkerEmail] = useState('');
  const [inviteFeedback, setInviteFeedback] = useState('');
  const [toastMessage, setToastMessage] = useState('');
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

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getInviteUrl = () => {
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.origin}/group-ordering?room=${roomCode}`;
    }
    return `http://localhost:3000/group-ordering?room=${roomCode}`;
  };

  // Generate genuine high-resolution scannable QR Code
  useEffect(() => {
    const url = getInviteUrl();
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: '#231916',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((dataUri) => {
        setQrDataUrl(dataUri);
      })
      .catch((err) => {
        console.error('QR generation failed:', err);
      });
  }, [roomCode]);

  useEffect(() => {
    if (searchParams.get('room')) {
      triggerToast(`Welcome! You joined booth table #${roomCode}`);
    }
  }, [searchParams]);

  const handleCopyLink = () => {
    const url = getInviteUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopiedLink(true);
          triggerToast('Table invite link copied to clipboard!');
          setTimeout(() => setCopiedLink(false), 2500);
        })
        .catch(() => {
          setCopiedLink(true);
          triggerToast('Table invite link copied to clipboard!');
          setTimeout(() => setCopiedLink(false), 2500);
        });
    } else {
      setCopiedLink(true);
      triggerToast('Table invite link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShare = async () => {
    const url = getInviteUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join Diner Booth Feast #${roomCode}`,
          text: `Hey! Hop onto our Chow Chow Diner collaborative tray: ${url}`,
          url: url,
        });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  const handleDirectInvite = (e) => {
    e?.preventDefault();
    const name = coworkerName.trim() || 'Coworker';
    const email = coworkerEmail.trim();
    if (!name && !email) return;

    setBanterMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'action',
        author: 'Sally (Host)',
        text: `sent booth invitation to ${name}${email ? ` (${email})` : ''}`,
        time: 'Just now',
      },
    ]);

    setInviteFeedback(`✓ Invitation created for ${name}! They can join booth #${roomCode}.`);
    triggerToast(`Invite sent to ${name}!`);
    setCoworkerName('');
    setCoworkerEmail('');
    setTimeout(() => setInviteFeedback(''), 4000);
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
    <div className="flex flex-col w-full pt-8 sm:pt-10 pb-space-2xl">
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
                  ROOM #{roomCode}
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
            <div
              className="w-full h-full min-h-[190px] rounded-xl border-2 border-dashed border-[#231916]/40 hover:border-[#cb4926] bg-surface-container-low hover:bg-[#ffdea7]/30 p-space-md flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer text-left relative"
              onClick={() => setShowQrModal(true)}
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest diner-tag flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-2xl text-primary font-bold">
                  person_add
                </span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface uppercase group-hover:text-primary transition-colors font-black">
                + Invite Coworker
              </span>
              <span className="font-body-sm text-xs text-on-surface-variant text-center">
                Share live link or scan QR code to hop in
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInviteModalTab('qr');
                    setShowQrModal(true);
                  }}
                  className="px-3 py-1 rounded-full bg-[#cb4926] text-white font-label-sm text-[11px] font-black uppercase diner-tag hover:bg-[#a9310f] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">qr_code_2</span>
                  <span>View QR</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyLink();
                  }}
                  className="px-3 py-1 rounded-full bg-white text-[#231916] font-label-sm text-[11px] font-black uppercase diner-tag hover:bg-[#ffdea7] transition-all flex items-center gap-1 border border-[#231916] shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">
                    {copiedLink ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

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

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#231916] text-[#fed388] px-4 py-2.5 rounded-xl diner-tag font-label-md text-xs font-bold shadow-2xl flex items-center gap-2 border-2 border-[#fed388] animate-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-sm text-[#ffdea7]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* QR Code & Coworker Invite Pop-up Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fff8f6] max-w-lg w-full rounded-2xl diner-border-thick shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Scalloped Header */}
            <div className="bg-[#ffdea7] p-3.5 px-5 diner-border-thick border-x-0 border-t-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#cb4926] text-2xl font-bold">
                  group_add
                </span>
                <div>
                  <h3 className="font-headline-sm text-sm uppercase font-black text-[#231916] leading-none">
                    Invite Coworkers To Table
                  </h3>
                  <span className="font-label-sm text-[10px] text-[#59413b] font-bold">
                    Room #{roomCode} • Collaborative Feast Tray
                  </span>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#231916] border-2 border-[#231916] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                type="button"
                onClick={() => setShowQrModal(false)}
                title="Close"
              >
                <span className="material-symbols-outlined text-base font-bold">close</span>
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 bg-[#f2dfd7] p-1.5 border-b-2 border-[#231916] gap-1.5">
              <button
                type="button"
                onClick={() => setInviteModalTab('qr')}
                className={`py-2 px-2 rounded-lg font-label-md text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inviteModalTab === 'qr'
                    ? 'bg-[#cb4926] text-white shadow-[2px_2px_0px_#231916]'
                    : 'bg-transparent text-[#231916] hover:bg-[#ffdea7]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
                <span>Scan QR</span>
              </button>
              <button
                type="button"
                onClick={() => setInviteModalTab('link')}
                className={`py-2 px-2 rounded-lg font-label-md text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inviteModalTab === 'link'
                    ? 'bg-[#cb4926] text-white shadow-[2px_2px_0px_#231916]'
                    : 'bg-transparent text-[#231916] hover:bg-[#ffdea7]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">link</span>
                <span>Direct Link</span>
              </button>
              <button
                type="button"
                onClick={() => setInviteModalTab('direct')}
                className={`py-2 px-2 rounded-lg font-label-md text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inviteModalTab === 'direct'
                    ? 'bg-[#cb4926] text-white shadow-[2px_2px_0px_#231916]'
                    : 'bg-transparent text-[#231916] hover:bg-[#ffdea7]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                <span>Send Invite</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {inviteModalTab === 'qr' && (
                <div className="flex flex-col items-center text-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e8d5be] text-[#231916] font-label-sm text-[10px] uppercase font-bold diner-tag mb-2">
                    Scannable with Any Camera Phone
                  </span>
                  <p className="font-body-sm text-xs text-[#59413b] max-w-xs mb-3">
                    Hold your phone camera or QR scanner up to this code to join Booth #{roomCode} instantly.
                  </p>

                  {/* Real Scannable QR Code Frame */}
                  <div className="p-3 bg-white rounded-2xl diner-border-thick shadow-md inline-block relative group">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR Code for room ${roomCode}`}
                        className="w-52 h-52 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-52 h-52 flex flex-col items-center justify-center bg-surface-container rounded-lg">
                        <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-2">
                          sync
                        </span>
                        <span className="text-xs font-bold text-[#59413b]">Generating QR Code...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 w-full">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#cb4926] text-white font-label-md text-xs font-black uppercase diner-tag hover:bg-[#a9310f] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <span className="material-symbols-outlined text-base">
                        {copiedLink ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedLink ? 'Link Copied! ✓' : 'Copy Table Link'}</span>
                    </button>
                    {qrDataUrl && (
                      <a
                        href={qrDataUrl}
                        download={`chowchow-table-${roomCode}-qr.png`}
                        className="py-2.5 px-3 rounded-xl bg-[#ffdea7] text-[#231916] font-label-md text-xs font-black uppercase diner-tag hover:bg-[#fed388] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#231916] shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                        title="Download QR image to share in Slack or print"
                      >
                        <span className="material-symbols-outlined text-base">download</span>
                        <span>Save QR</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {inviteModalTab === 'link' && (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="text-xs font-black uppercase text-[#231916] flex items-center gap-1 mb-1.5">
                      <span className="material-symbols-outlined text-sm text-[#cb4926]">link</span>
                      Live Table URL:
                    </label>
                    <div className="p-3 bg-white rounded-xl border-2 border-[#231916] shadow-sm flex items-center justify-between gap-2">
                      <a
                        href={getInviteUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-[#cb4926] hover:underline font-bold truncate flex items-center gap-1 group"
                        title="Click to open table in new window"
                      >
                        <span className="truncate">{getInviteUrl()}</span>
                        <span className="material-symbols-outlined text-xs shrink-0 group-hover:translate-x-0.5 transition-transform">
                          open_in_new
                        </span>
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 rounded-lg bg-[#cb4926] text-white font-label-sm text-xs font-black uppercase diner-tag hover:bg-[#a9310f] transition-all shrink-0 cursor-pointer shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                      >
                        {copiedLink ? 'Copied! ✓' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Actions: Test link / Open New Tab / Share */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                      href={getInviteUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-white text-[#231916] font-label-md text-xs font-black uppercase diner-tag hover:bg-[#ffdea7] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#231916] shadow-sm text-center"
                    >
                      <span className="material-symbols-outlined text-base text-[#cb4926]">open_in_new</span>
                      <span>Test / Open Link</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="py-2.5 px-3 rounded-xl bg-[#ffdea7] text-[#231916] font-label-md text-xs font-black uppercase diner-tag hover:bg-[#fed388] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#231916] shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base text-[#cb4926]">share</span>
                      <span>Share With Apps</span>
                    </button>
                  </div>

                  <div className="bg-[#f2dfd7] p-3 rounded-xl diner-tag text-xs text-[#59413b] space-y-1">
                    <p className="font-bold text-[#231916] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#cb4926]">info</span>
                      How Coworkers Join:
                    </p>
                    <p>
                      Anyone opening this link hops straight into Booth #{roomCode}. They can browse burgers, shakes, and sides, and their selections appear live on this screen.
                    </p>
                  </div>
                </div>
              )}

              {inviteModalTab === 'direct' && (
                <form onSubmit={handleDirectInvite} className="space-y-3.5 text-left">
                  {inviteFeedback && (
                    <div className="p-2.5 rounded-xl bg-[#caecbe] text-[#062105] text-xs font-bold diner-tag flex items-center gap-2 border border-[#062105]/20 animate-in fade-in">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>{inviteFeedback}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-black uppercase text-[#231916] block mb-1">
                      Coworker or Pal's Name:
                    </label>
                    <input
                      type="text"
                      value={coworkerName}
                      onChange={(e) => setCoworkerName(e.target.value)}
                      placeholder="e.g. Alex, Sam, Dev Team..."
                      className="w-full text-xs font-bold bg-white text-[#231916] px-3.5 py-2.5 rounded-xl border-2 border-[#231916]/40 focus:outline-none focus:border-[#cb4926]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-[#231916] block mb-1">
                      Email Address (Optional):
                    </label>
                    <input
                      type="email"
                      value={coworkerEmail}
                      onChange={(e) => setCoworkerEmail(e.target.value)}
                      placeholder="e.g. alex@company.com"
                      className="w-full text-xs font-bold bg-white text-[#231916] px-3.5 py-2.5 rounded-xl border-2 border-[#231916]/40 focus:outline-none focus:border-[#cb4926]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#cb4926] text-white font-label-md text-xs font-black uppercase diner-tag hover:bg-[#a9310f] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Dispatch Table Invite</span>
                  </button>
                </form>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="bg-[#f7e4de] p-3 px-5 diner-border-thick border-x-0 border-b-0 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#59413b]">
                Booth Table: <strong>#{roomCode}</strong> (Max 8 diner guests)
              </span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="py-1.5 px-4 rounded-lg bg-[#231916] text-white font-label-sm text-xs font-bold diner-tag hover:bg-[#3d2c27] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
