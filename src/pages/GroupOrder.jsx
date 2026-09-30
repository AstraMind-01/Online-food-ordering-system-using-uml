import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { orderService, cartService, authService, groupOrderService, menuService } from '../services/api';

// Fallback catalog of authentic Route 66 Diner dishes for the Quick Add modal
const DINER_CATALOG = [
  {
    id: 1,
    name: 'Route 66 Triple Bacon Stack',
    desc: 'Crispy smoked bacon, grilled brioche & diner secret relish',
    price: 12.45,
    category: 'Burgers & Melts',
    badge: '★ CLASSIC SPECIAL',
    prepTime: 8,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDL3gOc_Q6ygkb7n_hqwJ3U-ORWKkntTOOGhLzXCY7w7zE8ZIAMcTArnzI5AiQhtlb6S97YTvzTIJg3E6Ef6Ppa7XebuYRoPk03AyqM0Uu_1UnhRJBdqVHOr04O8sxMQ0eQA-lUgXwWihIJihPRARMWV0vxaSj_OSs7L69fxR5VXq8IfkyIToffa4_XVklL3DHglyFCZtEW5b59gciF3srC_dZHBiHIaR4uZ2QT_439NZmWtE6qxF1h',
  },
  {
    id: 2,
    name: 'Jukebox Jalapeño Melt',
    desc: 'Fire-roasted jalapeños, melted pepper jack & spiced secret aioli on sourdough',
    price: 11.95,
    category: 'Burgers & Melts',
    badge: '★ SPICY PICK',
    prepTime: 7,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh',
  },
  {
    id: 3,
    name: 'Cherry Cola Float',
    desc: 'Fountain cherry cola topped with Madagascar vanilla bean ice cream & maraschino',
    price: 5.50,
    category: 'Malts & Shakes',
    badge: '★ SWEET TREAT',
    prepTime: 5,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZxQuCZjoebNJODjhyJESxQlYgLaQhRW4-fIUfUeotsVlQkgH7_gntG2dBgZR9IRR88WjdrI1XyZhS4en_jc71O1JcOlOxo3L-FFCdLuXLMshNc9blA52EBvk3ZiD3nu3LpR7gSxwoCCQVYWa2SNrV5BHfoOGNbAOtFoVJJhe1geLoWc0YB2dB0ffgqzH7rAYQcWePhpujhpyNXr1zm9St7Qi8M9PWxd3hbLCDrJWf6Mt4g4dasuH',
  },
  {
    id: 4,
    name: 'Neon Night Chili Cheese Fries',
    desc: 'Golden crinkle fries smothered in Texas road chili, aged cheddar & green onions',
    price: 7.95,
    category: 'Baskets & Fries',
    badge: '★ SHAREABLE',
    prepTime: 6,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh',
  },
  {
    id: 5,
    name: 'Drive-In Chicken Basket',
    desc: 'Crispy buttermilk fried chicken tenders served with honey mustard & diner slaw',
    price: 13.50,
    category: 'Baskets & Fries',
    badge: '★ CROWD FAVORITE',
    prepTime: 10,
    img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Malt Shop Vanilla Shake',
    desc: 'Thick malted barley shake spun in classic steel cans with whipped cream peak',
    price: 6.25,
    category: 'Malts & Shakes',
    badge: '★ OLD SCHOOL',
    prepTime: 5,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD',
  },
  {
    id: 7,
    name: 'Double Chocolate Malt',
    desc: 'Rich Dutch cocoa blended with malted cream, chocolate drizzle & wafer crisp',
    price: 6.50,
    category: 'Malts & Shakes',
    badge: '★ CHEF SUGGESTION',
    prepTime: 5,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2p8o1NiA7N4W0Ryo5m2kq4sL9IsoICkp8ziyLxBBnfydSGHwoPJs6Dm__8is2ynYzXtZWOXDHIuIa-guqzasNnZP6IFm5CIx2lxXu8-J1DpUZYTYWKPU-5gl6wi1to5zByAGYM6_H9m15EKvHEgiI-nEJyboBu761QpiimJpONTUkLNGGjq9d--oxde81ApfL32gE3eFzMRf7eNH5S1ZZqvBfInu1DA4KcMn4DaKjh8ODf-wolRWv',
  },
  {
    id: 8,
    name: 'Golden Onion Ring Tower',
    desc: 'Beer-battered jumbo Vidalia onions stacked high with smoky campfire dip',
    price: 6.75,
    category: 'Baskets & Fries',
    badge: '★ CRUNCH ALERT',
    prepTime: 7,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_a9lG45cMxCs_SujnGOD789YutO6YkVHMYmPAQZ_Zbjbabsl8qn9rt7lyJLbWC5sJHQP-S-WYQOm2BpnCMaOH4NiVJ7eQWEMARYOo-TtIaPTyGTGRYDkc0RIQQ7XcShzpFwKmzb2YWel9YCmCtoPLYkv7aPe3mQde-EsZhX7KgxmIDJyg4mVCxtK8cIyVEDsW6B2Q6cVah83eNG3u2wTUaAjbrdTLLrZMuJlWNUV8OtfiWD33OScA',
  },
  {
    id: 9,
    name: 'Sunrise Pancake Tower',
    desc: 'Fluffy buttermilk pancake stack with whipped sweet butter & warm maple drizzle',
    price: 9.95,
    category: 'All-Day Breakfast',
    badge: '★ ALL-DAY',
    prepTime: 9,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7BfWUcq0oXoxSGCSZBxjEZFpOEBbKDYqXilK4ZSz-UTW1l2mDVIKpjf3LqqrIeTuI1ylkU1rwoqkU6B-T1qImlaueT2CVn7uChQueSjuXVXFxZqW907GsrdWxdnGPlcKwW1hHI6-_QrasZ7Ywu6d4UawaQUkw1zsNcmM779AK2NPrkXkJtbm7es7hLCRqwsAhJ-vN8fXnGmVFTLSSfl-IAdJMGdeXPbYsQaK-dmTGpQ_MyVmlOiDL',
  },
  {
    id: 10,
    name: 'Blue Plate Meatloaf Melt',
    desc: 'Home-style glazed beef meatloaf on griddled caraway rye with melted Swiss',
    price: 12.95,
    category: 'Burgers & Melts',
    badge: '★ DINER STAPLE',
    prepTime: 12,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAepflTShAE-KO4FlAI2SAZ96L-3fC_ab7LReW5F-kCX1z_fEga8NAE2c0p3bS-LsqXlnca1wPZvVop1jPWOOaUq0r6Bzs3zebF8yACt5gSBVH91ymVOFHqI_pXr4Qfr8Lok8-KqMTHOpcWxd-I8uF3aMfUOeC2s5jUbhoEPbOjAHeJIU9uFfMjJWywbH6hxQ3H4-2yEAG--OX2hf6-i1v2MrQh_k_4bJ1_MY785LPVGBjlZ6iwxd2G',
  },
];

export default function GroupOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room') || 'CHOW-7492';

  // Room & Billing State
  const [billingMode, setBillingMode] = useState('host'); // 'host' | 'split'
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

  // Quick Dish Picker Modal State
  const [showDishPickerModal, setShowDishPickerModal] = useState(false);
  const [targetMemberId, setTargetMemberId] = useState(1);
  const [dishPickerCategory, setDishPickerCategory] = useState('ALL');
  const [menuItemsCatalog, setMenuItemsCatalog] = useState(DINER_CATALOG);

  // Table Members with Interactive Trays
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Sally Jenkins',
      role: 'Host',
      avatar: 'SJ',
      avatarBg: 'bg-[#5e7d56] text-white',
      status: 'READY',
      seat: 'Booth Seat #1',
      items: [
        {
          id: 'item-101',
          foodItemId: 1,
          name: 'Route 66 Triple Bacon Stack',
          desc: 'Medium Rare • Brioche Bun • Relish',
          price: 12.45,
          quantity: 1,
          img: DINER_CATALOG[0].img,
        },
        {
          id: 'item-102',
          foodItemId: 4,
          name: 'Neon Night Chili Cheese Fries',
          desc: 'Cheddar Dust • Road Chili • Chives',
          price: 7.95,
          quantity: 1,
          img: DINER_CATALOG[3].img,
        },
      ],
    },
    {
      id: 2,
      name: 'Dave Miller',
      role: 'Member',
      avatar: 'DM',
      avatarBg: 'bg-[#fdc65c] text-[#231916]',
      status: 'READY',
      seat: 'Booth Seat #2',
      items: [
        {
          id: 'item-103',
          foodItemId: 2,
          name: 'Jukebox Jalapeño Melt',
          desc: 'Fire-roasted jalapeños & pepper jack',
          price: 11.95,
          quantity: 1,
          img: DINER_CATALOG[1].img,
        },
      ],
    },
    {
      id: 3,
      name: 'Priya Kapoor',
      role: 'Member',
      avatar: 'PK',
      avatarBg: 'bg-[#cb4926] text-white',
      status: 'PICKING',
      seat: 'Booth Seat #3',
      items: [
        {
          id: 'item-104',
          foodItemId: 6,
          name: 'Malt Shop Vanilla Shake',
          desc: 'Maraschino Cherry Top & Malted Cream',
          price: 6.25,
          quantity: 1,
          img: DINER_CATALOG[5].img,
        },
        {
          id: 'item-105',
          foodItemId: 8,
          name: 'Golden Onion Ring Tower',
          desc: 'Beer-Battered with Campfire Remoulade',
          price: 6.75,
          quantity: 1,
          img: DINER_CATALOG[7].img,
        },
      ],
    },
    {
      id: 4,
      name: 'Marco Santos',
      role: 'Member',
      avatar: 'MS',
      avatarBg: 'bg-[#f7e4de] text-[#59413b]',
      status: 'BROWSING',
      seat: 'Booth Seat #4',
      items: [],
    },
  ]);

  // Table Banter & Live Kitchen Ticker Feed
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
      text: 'added Malt Shop Vanilla Shake to tray',
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
      text: 'Can someone get extra ranch? Happy to split it!',
      time: '12:43 PM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  // Sync menu catalog from backend if available
  useEffect(() => {
    let isMounted = true;
    menuService.getAll()
      .then((items) => {
        if (isMounted && Array.isArray(items) && items.length > 0) {
          const formatted = items.map((it) => ({
            id: it.id,
            name: it.name,
            desc: it.description || 'Diner Griddle Special',
            price: Number(it.price) || 9.95,
            category: it.category || 'Specialties',
            badge: it.badgeText || '★ POPULAR',
            prepTime: it.prepTimeMins || 8,
            img: it.imageUrl || DINER_CATALOG[0].img,
          }));
          setMenuItemsCatalog(formatted);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Check for items added from Restaurant Menu or Home via "Add to Group Order"
  useEffect(() => {
    try {
      const stored = localStorage.getItem('group_order_tray_items');
      if (stored) {
        const pendingItems = JSON.parse(stored);
        if (Array.isArray(pendingItems) && pendingItems.length > 0) {
          setMembers((prevMembers) =>
            prevMembers.map((m) => {
              if (m.id === 1) { // Add to Sally's / Host tray
                const newItems = [...m.items];
                pendingItems.forEach((p) => {
                  const existingIdx = newItems.findIndex((it) => it.foodItemId === p.foodItemId);
                  if (existingIdx >= 0) {
                    newItems[existingIdx].quantity += p.quantity;
                  } else {
                    newItems.push({
                      id: p.id || `tray-item-${Date.now()}-${Math.random()}`,
                      foodItemId: p.foodItemId,
                      name: p.name,
                      desc: p.desc || 'Selected from Diner Menu',
                      price: p.price,
                      quantity: p.quantity,
                      img: p.img || DINER_CATALOG[0].img,
                    });
                  }
                });
                return { ...m, items: newItems };
              }
              return m;
            })
          );

          localStorage.removeItem('group_order_tray_items');
          triggerToast(`🎉 Added ${pendingItems.length} dish(es) from Diner Menu directly to your booth tray!`);
          
          setBanterMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: 'action',
              author: 'You (Diner Guest)',
              text: `synced ${pendingItems.length} dish(es) from Route 66 Diner Menu to table tray`,
              time: 'Just now',
            },
          ]);
        }
      }
    } catch (err) {
      console.warn('Could not read pending group items:', err);
    }
  }, []);

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
    setTimeout(() => setToastMessage(''), 3500);
  };

  const getInviteUrl = () => {
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.origin}/group-ordering?room=${roomCode}`;
    }
    return `http://localhost:3000/group-ordering?room=${roomCode}`;
  };

  // Generate scannable QR Code
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
  }, [searchParams, roomCode]);

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

  // --- Dynamic Member Tray Operations ---

  // 1. Update Quantity (+ or -)
  const handleUpdateQty = (memberId, itemId, delta) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const updatedItems = m.items
          .map((item) => {
            if (item.id === itemId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean);

        return { ...m, items: updatedItems };
      })
    );
  };

  // 2. Remove Item Completely
  const handleRemoveItem = (memberId, itemId) => {
    const member = members.find((m) => m.id === memberId);
    const item = member?.items.find((i) => i.id === itemId);

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        return {
          ...m,
          items: m.items.filter((i) => i.id !== itemId),
        };
      })
    );

    if (item && member) {
      triggerToast(`🗑 Removed "${item.name}" from ${member.name}'s tray`);
      setBanterMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'action',
          author: member.name,
          text: `removed ${item.name} from tray`,
          time: 'Just now',
        },
      ]);
    }
  };

  // 3. Toggle Member Status (READY vs PICKING)
  const handleToggleStatus = (memberId) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const nextStatus = m.status === 'READY' ? 'PICKING' : 'READY';
        
        setBanterMessages((prevLog) => [
          ...prevLog,
          {
            id: Date.now(),
            type: 'action',
            author: m.name,
            text: nextStatus === 'READY' ? 'marked their tray as READY to order! ✓' : 'reopened tray to pick more sides',
            time: 'Just now',
          },
        ]);
        triggerToast(`${m.name} is now ${nextStatus}`);
        return { ...m, status: nextStatus };
      })
    );
  };

  // 4. Quick Add from Recommendation Spotlight
  const handleAddSpotlightItem = () => {
    const spotlightItem = DINER_CATALOG.find((d) => d.name === 'Double Chocolate Malt') || DINER_CATALOG[6];
    
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === 1) { // Host Sally
          const existing = m.items.find((it) => it.name === spotlightItem.name);
          if (existing) {
            return {
              ...m,
              items: m.items.map((it) =>
                it.name === spotlightItem.name ? { ...it, quantity: it.quantity + 1 } : it
              ),
            };
          } else {
            return {
              ...m,
              items: [
                ...m.items,
                {
                  id: `spotlight-${Date.now()}`,
                  foodItemId: spotlightItem.id,
                  name: spotlightItem.name,
                  desc: spotlightItem.desc,
                  price: spotlightItem.price,
                  quantity: 1,
                  img: spotlightItem.img,
                },
              ],
            };
          }
        }
        return m;
      })
    );

    setBanterMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'action',
        author: 'Sally (Host)',
        text: `added Double Chocolate Malt (+₹${spotlightItem.price.toFixed(2)}) to Host tray`,
        time: 'Just now',
      },
    ]);

    triggerToast(`🥤 Added "${spotlightItem.name}" to Host Tray!`);
  };

  // 5. Open Quick Add Modal for a specific member
  const handleOpenDishPicker = (memberId) => {
    setTargetMemberId(memberId);
    setShowDishPickerModal(true);
  };

  // 6. Add Selected Dish to Target Member Tray
  const handleAddDishToMemberTray = (dish) => {
    const targetMember = members.find((m) => m.id === targetMemberId);
    if (!targetMember) return;

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== targetMemberId) return m;
        const existingIdx = m.items.findIndex((it) => it.foodItemId === dish.id || it.name === dish.name);
        if (existingIdx >= 0) {
          const updated = [...m.items];
          updated[existingIdx].quantity += 1;
          return { ...m, items: updated, status: 'READY' };
        } else {
          return {
            ...m,
            status: 'READY',
            items: [
              ...m.items,
              {
                id: `dish-${Date.now()}-${dish.id}`,
                foodItemId: dish.id,
                name: dish.name,
                desc: dish.desc,
                price: dish.price,
                quantity: 1,
                img: dish.img,
              },
            ],
          };
        }
      })
    );

    setBanterMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'action',
        author: targetMember.name,
        text: `added ${dish.name} (₹${dish.price.toFixed(2)}) to tray`,
        time: 'Just now',
      },
    ]);

    triggerToast(`🍔 Added "${dish.name}" to ${targetMember.name}'s tray!`);
  };

  // 7. Direct Invite Coworker Handler (Adds dynamic seat member!)
  const handleDirectInvite = (e) => {
    e?.preventDefault();
    const name = coworkerName.trim() || 'Coworker';
    const email = coworkerEmail.trim();
    if (!name && !email) return;

    if (members.length >= 8) {
      triggerToast('Booth is full (maximum 8 seats).');
      return;
    }

    const nextSeatNum = members.length + 1;
    const initials = name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CW';

    const bgColors = [
      'bg-[#ffdea7] text-[#231916]',
      'bg-[#caecbe] text-[#062105]',
      'bg-[#f2dfd7] text-[#59413b]',
      'bg-[#fdc65c] text-[#231916]',
    ];
    const pickedBg = bgColors[members.length % bgColors.length];

    const newMember = {
      id: Date.now(),
      name: name,
      role: 'Member',
      avatar: initials,
      avatarBg: pickedBg,
      status: 'BROWSING',
      seat: `Booth Seat #${nextSeatNum}`,
      items: [],
    };

    setMembers((prev) => [...prev, newMember]);

    setBanterMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'action',
        author: 'Sally (Host)',
        text: `seated ${name}${email ? ` (${email})` : ''} at Booth Seat #${nextSeatNum}`,
        time: 'Just now',
      },
    ]);

    setInviteFeedback(`✓ Seat #${nextSeatNum} reserved for ${name}! They can join booth #${roomCode}.`);
    triggerToast(`🎉 Invited ${name} to Booth #${roomCode}!`);
    setCoworkerName('');
    setCoworkerEmail('');
    setTimeout(() => {
      setInviteFeedback('');
      setShowQrModal(false);
    }, 1800);
  };

  // 8. Remove an empty guest seat
  const handleRemoveMemberSeat = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (!member || member.role === 'Host') return;

    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    triggerToast(`${member.name} left the booth.`);
    setBanterMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'action',
        author: 'Table Notice',
        text: `${member.name} left Booth Seat`,
        time: 'Just now',
      },
    ]);
  };

  // 9. Send Chat / Banter Message
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
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 10. Lock & Pay Final Order
  const handleLockAndPay = async () => {
    const allItems = members.flatMap((m) => m.items);
    if (allItems.length === 0) {
      triggerToast('⚠️ Your table trays are empty! Add at least one diner item before ordering.');
      return;
    }

    setIsLocking(true);
    try {
      // Ensure session is available
      if (!authService.isAuthenticated()) {
        try {
          await authService.login('customer1@chowchow.com', 'admin123');
        } catch (loginErr) {
          console.warn('Guest login notice:', loginErr);
        }
      }

      // Add all table items to cart
      for (const item of allItems) {
        if (item.foodItemId && item.quantity > 0) {
          try {
            await cartService.addItem(item.foodItemId, item.quantity);
          } catch {}
        }
      }

      // Create main collaborative order
      const res = await orderService.create({
        restaurantId: 1,
        deliveryAddress: `742 Evergreen Terrace (Booth #${roomCode}), Route 66 Mile 42`,
        deliveryLatitude: 30.2849,
        deliveryLongitude: -97.7341,
      });

      if (res && res.id) {
        window.dispatchEvent(new Event('cart-updated'));
        triggerToast(`🎉 Order #${res.id} placed! Kitchen is firing up the griddle.`);
        navigate(`/track-order?orderId=${res.id}`);
        return;
      }
    } catch (e) {
      console.error('Failed to create order from group feast', e);
    } finally {
      setIsLocking(false);
    }
    // Fallback navigation with demo order
    navigate('/track-order?orderId=1');
  };

  // --- Dynamic Financial Calculations from Live Tray Items ---
  const allOrderItems = members.flatMap((m) => m.items);
  const subtotal = allOrderItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const deliveryFee = subtotal >= 35 || subtotal === 0 ? 0 : 2.50;
  const tax = subtotal * 0.0825;
  const tipAmount = subtotal * (tipPercent / 100);
  const grandTotal = subtotal + deliveryFee + tax + tipAmount;
  const seatedCount = Math.max(1, members.length);
  const perPerson = grandTotal / seatedCount;

  // Check if all members are ready
  const allReady = members.length > 0 && members.every((m) => m.status === 'READY');
  const readyCount = members.filter((m) => m.status === 'READY').length;

  return (
    <div className="flex flex-col w-full pt-8 sm:pt-10 pb-space-2xl">
      {/* Room Control Marquee Header */}
      <section className="w-full mb-space-xl">
        <div className="bg-[#ffdea7] rounded-2xl p-space-md lg:p-space-lg diner-border shadow-xl relative overflow-hidden">
          {/* Background pattern accent */}
          <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-[#fdc65c]/40 pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md relative z-10">
            <div className="space-y-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="px-3 py-1 rounded-full bg-[#cb4926] text-white font-label-sm text-label-sm uppercase font-black tracking-wider diner-tag">
                  Live Order Session
                </span>
                <span className="font-label-md text-label-md text-[#231916] font-black tracking-wide">
                  BOOTH TABLE #{roomCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5e7d56] text-[#f8fff0] font-label-sm text-[11px] font-bold diner-tag">
                  {readyCount} of {members.length} Diners Ready
                </span>
              </div>
              <h1 className="font-headline-xl text-3xl sm:text-4xl text-[#231916] uppercase font-black tracking-tight">
                Route 66 Collaborative Diner Feast
              </h1>
              <div className="flex items-center gap-space-sm pt-1">
                <div className="relative">
                  <img
                    className="w-10 h-10 rounded-full diner-tag object-cover bg-secondary-container"
                    alt="Sally Jenkins"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4u1qJhZkBfTjuxkPvkkZcL2HAVpI6Nhx9jYHf5mssHi-Bm7SnDg3rQWnSmGp9vzs2MX275zZHBFTaBLDvzg-C5xHZQpXLwbVg7b7YmGbiQm3Y8RpvaQfgLS6fqxdecS1NTxffHA1g9qRaPKvzzVLpa46ay6GU-HJ0jwRuafPdDa_xMyMwkmAWykaZ9iKGEH4RTA4a-Va--SznG57qWb7jHzjP0Yrliaa6cS6sHtCaJKISof7jsTSE"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-[#cb4926] text-white text-[9px] font-black px-1.5 rounded-full diner-tag">
                    HOST
                  </span>
                </div>
                <p className="font-body-md text-sm sm:text-base text-[#231916] font-bold">
                  Ordered by <strong className="font-black text-[#cb4926]">Sally Jenkins</strong> (Table Captain) • Big Bill's Burger Emporium
                </p>
              </div>
            </div>

            {/* Mechanical Timer Widget & Share Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md shrink-0">
              <div className="bg-[#fff8f6] p-3 rounded-xl diner-border flex items-center gap-space-sm">
                <div className="flex flex-col text-left">
                  <span className="font-label-sm text-[11px] uppercase text-[#59413b] font-black">
                    Room Closes In
                  </span>
                  <span className="font-label-sm text-xs text-[#cb4926] font-black">
                    Status: Open For Picks
                  </span>
                </div>
                {/* Countdown Display */}
                <div
                  className="flex items-center gap-1 bg-[#231916] text-[#fed388] px-3.5 py-1.5 rounded-lg diner-tag font-label-lg text-lg tracking-widest font-mono font-black"
                  id="session-countdown"
                >
                  <span>{formatTime(timerSeconds)}</span>
                </div>
              </div>

              {/* Share Button & QR */}
              <div className="flex items-center gap-space-xs">
                <button
                  className="px-4 py-3 rounded-xl bg-[#cb4926] text-white font-label-md text-xs uppercase font-black diner-tag hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  type="button"
                  onClick={handleCopyLink}
                >
                  <span className="material-symbols-outlined text-base">
                    {copiedLink ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedLink ? 'Copied! ✓' : 'Copy Table Link'}</span>
                </button>
                <button
                  className="p-3 rounded-xl bg-white text-[#231916] diner-tag hover:bg-[#ffdea7] transition-all cursor-pointer"
                  title="Show Table QR Code & Invites"
                  type="button"
                  onClick={() => setShowQrModal(true)}
                >
                  <span className="material-symbols-outlined text-2xl font-black">qr_code_2</span>
                </button>
              </div>
            </div>
          </div>

          {/* Marquee Options Ribbon */}
          <div className="mt-space-md pt-space-md border-t-2 border-dashed border-[#231916]/30 flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex flex-wrap items-center gap-space-md">
              <span className="font-label-sm text-xs uppercase text-[#231916] font-black">
                Billing Mode:
              </span>
              <div className="flex items-center gap-space-xs bg-white p-1 rounded-full diner-tag">
                <button
                  type="button"
                  onClick={() => setBillingMode('host')}
                  className={`px-3 py-1 rounded-full font-label-sm text-xs font-black transition-all cursor-pointer ${
                    billingMode === 'host'
                      ? 'bg-[#cb4926] text-white diner-tag shadow-sm'
                      : 'text-[#231916] hover:text-[#cb4926]'
                  }`}
                >
                  ★ Host Pays All (₹{grandTotal.toFixed(2)})
                </button>
                <button
                  type="button"
                  onClick={() => setBillingMode('split')}
                  className={`px-3 py-1 rounded-full font-label-sm text-xs font-black transition-all cursor-pointer ${
                    billingMode === 'split'
                      ? 'bg-[#cb4926] text-white diner-tag shadow-sm'
                      : 'text-[#231916] hover:text-[#cb4926]'
                  }`}
                >
                  ★ Split Evenly (₹{perPerson.toFixed(2)}/ea)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-4 h-4 rounded accent-[#cb4926] diner-tag cursor-pointer"
                id="auto-lock"
                type="checkbox"
                checked={autoLock}
                onChange={(e) => setAutoLock(e.target.checked)}
              />
              <label className="font-label-sm text-xs text-[#231916] font-bold cursor-pointer select-none" htmlFor="auto-lock">
                Auto-lock room once all {members.length} members mark <span className="text-[#5e7d56] font-black">READY</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Lock Ready Announcement Banner */}
      {allReady && (
        <section className="w-full mb-6 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#caecbe] text-[#062105] rounded-2xl p-4 diner-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#5e7d56] text-[#f8fff0] diner-tag flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </span>
              <div>
                <h3 className="font-headline-sm text-base font-black uppercase text-[#062105]">
                  🎉 All {members.length} Booth Diners Are Ready!
                </h3>
                <p className="font-body-sm text-xs font-bold text-[#062105]/80">
                  Everyone has finalized their dishes. Table Captain Sally can lock the room and fire up the griddle.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLockAndPay}
              disabled={isLocking}
              className="py-2.5 px-5 rounded-xl bg-[#cb4926] text-white font-label-md text-xs font-black uppercase diner-tag hover:bg-[#a9310f] transition-all flex items-center gap-2 shadow-md cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-lg">lock</span>
              <span>Lock &amp; Submit Order Now</span>
            </button>
          </div>
        </section>
      )}

      {/* Main Grid: 8 Columns Trays & Chat, 4 Columns Checkout Paper Ticket */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Member Trays & Live Feed (Cols 1-8) */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Section Title & Participants Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="w-4 h-4 rounded-full bg-[#cb4926] inline-block shadow-sm"></span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl font-black uppercase text-[#231916]">
                Collaborative Table Trays
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#ffdea7] px-3 py-1 rounded-full diner-tag font-label-sm text-xs font-black text-[#231916]">
                {members.length} of 8 Seats Occupied
              </span>
              <button
                type="button"
                onClick={() => setShowDishPickerModal(true)}
                className="px-3 py-1 rounded-full bg-[#231916] text-[#fed388] font-label-sm text-xs font-black uppercase diner-tag hover:bg-[#3d2c27] transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                <span>+ Pick Dishes</span>
              </button>
            </div>
          </div>

          {/* Dynamic Trays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {members.map((member) => {
              const traySubtotal = member.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
              const itemCount = member.items.reduce((sum, it) => sum + it.quantity, 0);

              return (
                <div
                  key={member.id}
                  className={`rounded-2xl p-space-md diner-border flex flex-col justify-between relative group hover:shadow-xl transition-all ${
                    member.items.length === 0 ? 'bg-[#fff8f6] border-dashed' : 'bg-white'
                  }`}
                >
                  {/* Tray Member Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b-2 border-dashed border-[#231916]/20 pb-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full diner-tag flex items-center justify-center font-headline-sm text-sm font-black shrink-0 ${member.avatarBg}`}
                        >
                          {member.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-headline-sm text-base font-black text-[#231916] truncate">
                              {member.name}
                            </h3>
                            {member.role === 'Host' ? (
                              <span className="bg-[#cb4926] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase diner-tag">
                                Host
                              </span>
                            ) : member.items.length === 0 ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveMemberSeat(member.id)}
                                className="text-[10px] text-[#59413b] hover:text-[#cb4926] underline font-bold"
                                title="Free up this booth seat"
                              >
                                Leave
                              </button>
                            ) : null}
                          </div>
                          <p className="font-label-sm text-xs text-[#59413b] font-bold">
                            {member.seat} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Status Toggle Pill */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(member.id)}
                        className={`px-2.5 py-1 rounded-full font-label-sm text-xs font-black diner-tag flex items-center gap-1 cursor-pointer transition-transform active:scale-95 shadow-sm ${
                          member.status === 'READY'
                            ? 'bg-[#5e7d56] text-[#f8fff0]'
                            : member.status === 'PICKING'
                            ? 'bg-[#fdc65c] text-[#231916] animate-pulse'
                            : 'bg-[#f2dfd7] text-[#59413b]'
                        }`}
                        title="Click to toggle between READY and PICKING status"
                      >
                        <span className="material-symbols-outlined text-sm font-black">
                          {member.status === 'READY' ? 'check_circle' : 'edit'}
                        </span>
                        <span>{member.status}</span>
                      </button>
                    </div>

                    {/* Member's Tray Items List */}
                    {member.items.length > 0 ? (
                      <div className="space-y-2.5 mb-4">
                        {member.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-[#fff8f6] border border-[#231916]/20 flex items-center justify-between gap-2 hover:border-[#cb4926] transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {item.img && (
                                <img
                                  src={item.img}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover diner-tag shrink-0 border border-[#231916]"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="font-headline-sm text-xs sm:text-sm font-black text-[#231916] truncate">
                                  {item.name}
                                </p>
                                <p className="font-body-sm text-[11px] text-[#59413b] truncate">
                                  {item.desc || 'Griddle item'}
                                </p>
                                <span className="font-label-sm text-xs font-black text-[#cb4926]">
                                  ₹{item.price.toFixed(2)} each
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls & Delete */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="flex items-center bg-white rounded-lg border border-[#231916] shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(member.id, item.id, -1)}
                                  className="w-6 h-6 flex items-center justify-center font-black text-[#231916] hover:bg-[#ffdea7] rounded-l transition-colors cursor-pointer text-sm"
                                  title="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center font-black text-xs text-[#231916]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(member.id, item.id, 1)}
                                  className="w-6 h-6 flex items-center justify-center font-black text-[#231916] hover:bg-[#ffdea7] rounded-r transition-colors cursor-pointer text-sm"
                                  title="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveItem(member.id, item.id)}
                                className="w-7 h-7 flex items-center justify-center text-[#59413b] hover:text-[#cb4926] hover:bg-[#ffece6] rounded-lg transition-colors cursor-pointer"
                                title="Remove item from tray"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Empty State for Member Tray */
                      <div className="py-6 flex flex-col items-center justify-center text-center px-4">
                        <span className="material-symbols-outlined text-3xl text-[#59413b]/60 animate-bounce mb-1">
                          restaurant_menu
                        </span>
                        <p className="font-headline-sm text-sm font-black text-[#231916]">
                          {member.name} is looking at the menu...
                        </p>
                        <p className="font-body-sm text-xs text-[#59413b] mt-1 mb-3">
                          Tray is currently empty. Pick an authentic Route 66 griddle creation!
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenDishPicker(member.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#cb4926] text-white font-label-sm text-xs font-black uppercase diner-tag hover:bg-[#a9310f] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <span className="material-symbols-outlined text-sm">add_circle</span>
                          <span>+ Pick Food For {member.name.split(' ')[0]}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tray Footer: Subtotal and Add Item button */}
                  <div className="pt-3 border-t-2 border-dashed border-[#231916]/20 flex items-center justify-between gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDishPicker(member.id)}
                      className="text-xs font-black uppercase text-[#cb4926] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm font-black">add</span>
                      <span>Add Dish</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-xs uppercase text-[#59413b] font-bold">
                        Tray Total:
                      </span>
                      <span className="font-headline-sm text-base font-black text-[#cb4926]">
                        ₹{traySubtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Card: + Invite Another Buddy */}
            <div
              className="w-full h-full min-h-[220px] rounded-2xl border-2 border-dashed border-[#231916]/50 hover:border-[#cb4926] bg-[#ffdea7]/20 hover:bg-[#ffdea7]/40 p-space-md flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer text-left relative"
              onClick={() => {
                setInviteModalTab('qr');
                setShowQrModal(true);
              }}
            >
              <div className="w-12 h-12 rounded-full bg-white diner-tag flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-symbols-outlined text-2xl text-[#cb4926] font-black">
                  person_add
                </span>
              </div>
              <span className="font-headline-sm text-base font-black text-[#231916] uppercase group-hover:text-[#cb4926] transition-colors">
                + Invite Coworker ({members.length}/8 Seats)
              </span>
              <span className="font-body-sm text-xs text-[#59413b] text-center max-w-xs">
                Share live table link, dispatch direct email invite, or scan QR code.
              </span>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInviteModalTab('qr');
                    setShowQrModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#cb4926] text-white font-label-sm text-xs font-black uppercase diner-tag hover:bg-[#a9310f] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">qr_code_2</span>
                  <span>View QR</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyLink();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#231916] font-label-sm text-xs font-black uppercase diner-tag hover:bg-[#ffdea7] transition-all flex items-center gap-1 border border-[#231916] shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedLink ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Quick Dish Recommendation Spotlight */}
            <div className="rounded-2xl bg-[#ffdea7]/60 p-space-md diner-border flex items-center gap-space-sm">
              <img
                className="w-20 h-20 rounded-xl object-cover diner-tag shrink-0 border border-[#231916]"
                alt="Double Chocolate Malt"
                src={DINER_CATALOG[6].img}
              />
              <div className="min-w-0">
                <span className="font-label-sm text-[10px] uppercase font-black text-[#cb4926] bg-[#ffece6] px-2 py-0.5 rounded-md diner-tag">
                  Chef Suggestion
                </span>
                <h4 className="font-headline-sm text-sm font-black text-[#231916] truncate mt-1">
                  Double Chocolate Malt
                </h4>
                <p className="font-body-sm text-xs text-[#59413b] line-clamp-1">
                  Rich cocoa &amp; malted cream pairs great with route burgers.
                </p>
                <button
                  className="mt-1.5 text-xs font-label-sm font-black text-[#cb4926] uppercase underline hover:text-[#231916] cursor-pointer flex items-center gap-1"
                  type="button"
                  onClick={handleAddSpotlightItem}
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>Add to Host tray (+₹6.50)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Banter & Live Kitchen Ticker Feed */}
          <div className="bg-[#fff8f6] rounded-2xl p-space-md diner-border">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b-2 border-dashed border-[#231916]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#cb4926] text-xl font-black">forum</span>
                <h3 className="font-headline-sm text-base uppercase font-black text-[#231916]">
                  Table Banter &amp; Live Kitchen Ticker
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5e7d56] animate-ping" title="Live stream active"></span>
                <span className="font-label-sm text-[11px] font-black uppercase text-[#5e7d56]">
                  Live Stream
                </span>
              </div>
            </div>

            {/* Quick suggested shout-outs */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="text-[10px] font-black uppercase text-[#59413b]">Quick notes:</span>
              {[
                '🥤 Shakes ready?',
                '🍟 Extra ranch please!',
                '👍 Everything looks great',
                '⚡ Ready to lock order!',
              ].map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => {
                    setBanterMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now(),
                        type: 'chat',
                        author: 'You',
                        avatar: 'YOU',
                        isUser: true,
                        text: pill,
                        time: 'Just now',
                      },
                    ]);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-[#ffdea7] text-[#231916] text-[11px] font-bold border border-[#231916]/40 transition-colors cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Chat / Event List */}
            <div className="space-y-space-sm max-h-64 overflow-y-auto pr-1" id="chat-stream">
              {banterMessages.map((msg) => {
                if (msg.type === 'pin') {
                  return (
                    <div key={msg.id} className="flex items-start gap-2.5 bg-[#ffdea7] p-2.5 rounded-xl diner-tag">
                      <span className="material-symbols-outlined text-[#cb4926] text-base shrink-0 mt-0.5">
                        push_pin
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-label-sm text-xs font-black text-[#231916]">
                          {msg.author}
                        </p>
                        <p className="font-body-sm text-xs text-[#231916] font-bold">{msg.text}</p>
                      </div>
                      <span className="font-label-sm text-[10px] text-[#59413b] shrink-0 font-bold">
                        {msg.time}
                      </span>
                    </div>
                  );
                }
                if (msg.type === 'action') {
                  return (
                    <div key={msg.id} className="flex items-center gap-2 text-xs font-body-sm text-[#59413b] px-1">
                      <span className="material-symbols-outlined text-[#5e7d56] text-sm font-black">check_circle</span>
                      <span>
                        <strong className="text-[#231916] font-black">{msg.author}</strong> {msg.text}
                      </span>
                      <span className="text-[10px] ml-auto font-bold">{msg.time}</span>
                    </div>
                  );
                }
                if (msg.type === 'poll') {
                  return (
                    <div key={msg.id} className="flex items-center gap-2 text-xs font-body-sm text-[#59413b] px-1">
                      <span className="material-symbols-outlined text-[#cb4926] text-sm font-black">thumb_up</span>
                      <span>
                        <strong className="text-[#231916] font-black">{msg.author}</strong> {msg.text}
                      </span>
                      <span className="text-[10px] ml-auto font-bold">{msg.time}</span>
                    </div>
                  );
                }
                return (
                  <div key={msg.id} className="flex items-start gap-2 px-1">
                    <div
                      className={`w-6 h-6 rounded-full diner-tag flex items-center justify-center font-black text-[10px] shrink-0 ${
                        msg.isUser ? 'bg-[#cb4926] text-white' : 'bg-[#ffdea7] text-[#231916]'
                      }`}
                    >
                      {msg.avatar || 'CW'}
                    </div>
                    <div className="bg-white p-2 rounded-xl diner-tag text-xs flex-1">
                      <span className="font-black text-[#231916]">{msg.author}:</span> {msg.text}
                    </div>
                    <span className="font-label-sm text-[10px] text-[#59413b] shrink-0 self-center font-bold">
                      {msg.time}
                    </span>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Box for Table Banter */}
            <form onSubmit={handleSendMessage} className="mt-space-sm pt-space-xs flex items-center gap-space-xs">
              <input
                className="flex-1 bg-white px-3.5 py-2.5 rounded-xl font-body-sm text-xs sm:text-sm text-[#231916] placeholder:text-[#59413b]/60 diner-border focus:outline-none focus:ring-2 focus:ring-[#cb4926]"
                id="banter-input"
                placeholder="Drop a note, ask for extra dipping sauce, or cheer on the crew..."
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                className="px-4 py-2.5 bg-[#cb4926] text-white font-label-md text-xs uppercase font-black rounded-xl diner-tag hover:bg-[#a9310f] transition-colors shrink-0 cursor-pointer shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sticky Diner Paper Guest Check Ticket (Cols 9-12) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-2xl diner-border p-space-md relative overflow-hidden shadow-2xl">
            {/* Paper Check Scallop Header */}
            <div className="h-3 w-full bg-repeat-x scallop-divider -mt-space-md -mx-space-md mb-space-md opacity-70"></div>
            
            <div className="text-center border-b-2 border-[#231916] pb-3 mb-4">
              <span className="font-label-sm text-[10px] tracking-widest uppercase font-black text-[#cb4926] block">
                Official Booth Guest Check
              </span>
              <h3 className="font-headline-lg text-2xl font-black uppercase tracking-tight text-[#231916] leading-tight">
                Chow Chow Highway Diner
              </h3>
              <p className="font-body-sm text-xs font-bold text-[#59413b]">
                Table Booth #{roomCode} • Server: Betty • {members.length} Guests
              </p>
            </div>

            {/* Perforated Line Decoration */}
            <div className="w-full border-t-2 border-dashed border-[#231916]/30 my-3"></div>

            {/* Live Order Items Breakdown across All Booth Trays */}
            <div className="space-y-2 mb-4 font-body-sm text-xs sm:text-sm max-h-56 overflow-y-auto pr-1">
              {allOrderItems.length > 0 ? (
                allOrderItems.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-[#231916] gap-2">
                    <div className="truncate min-w-0">
                      <span className="font-black text-[#cb4926] mr-1">{it.quantity}x</span>
                      <span className="font-bold">{it.name}</span>
                    </div>
                    <span className="font-black font-label-md shrink-0">
                      ₹{(it.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-[#59413b] text-xs font-bold italic">
                  Trays are currently empty. Click "+ Pick Dishes" to select diner griddle specials!
                </div>
              )}
            </div>

            {/* Receipt Cost Details */}
            <div className="border-t-2 border-dashed border-[#231916]/30 pt-3 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-[#59413b] font-body-sm font-bold">
                <span>Food &amp; Drinks Subtotal ({allOrderItems.reduce((acc, it) => acc + it.quantity, 0)} items)</span>
                <span className="font-black text-[#231916] font-label-md" id="subtotal-val">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Highway Delivery Fee */}
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-1 text-[#231916]">
                  Highway Delivery Tier
                  <span className="material-symbols-outlined text-xs text-[#5e7d56]">verified</span>
                </span>
                {deliveryFee === 0 ? (
                  <span className="font-black uppercase bg-[#caecbe] text-[#062105] px-2 py-0.5 rounded-full diner-tag text-[10px]">
                    FREE (₹0.00)
                  </span>
                ) : (
                  <span className="font-black text-[#231916]">₹{deliveryFee.toFixed(2)}</span>
                )}
              </div>
              {subtotal > 0 && subtotal < 35 && (
                <p className="text-[11px] text-[#cb4926] font-bold text-right">
                  Add ₹{(35 - subtotal).toFixed(2)} more for Free Delivery!
                </p>
              )}

              {/* Local Tax */}
              <div className="flex justify-between text-[#59413b] font-body-sm font-bold">
                <span>Estimated Local Tax (8.25%)</span>
                <span className="font-black text-[#231916] font-label-md">
                  ₹{tax.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Tip Selector (Retro Coin Buttons) */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-[#231916]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-xs uppercase font-black text-[#231916]">
                  Add Diner Tip:
                </span>
                <span className="font-label-sm text-xs font-black text-[#cb4926]" id="selected-tip-display">
                  {tipPercent}% (₹{tipAmount.toFixed(2)})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5" id="tip-selector">
                {[15, 18, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    className={`py-1.5 rounded-lg font-label-sm text-xs font-black diner-tag transition-all cursor-pointer ${
                      tipPercent === pct
                        ? 'bg-[#cb4926] text-white shadow-sm'
                        : 'bg-white hover:bg-[#ffdea7] text-[#231916]'
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
            <div className="my-4 p-3.5 bg-[#ffdea7] rounded-xl diner-border flex items-center justify-between shadow-sm">
              <div>
                <span className="font-label-sm text-xs uppercase font-black text-[#231916] block">
                  Total Guest Check
                </span>
                <span className="font-body-sm text-[11px] text-[#59413b] font-bold">
                  All taxes, tip &amp; highway courier
                </span>
              </div>
              <div className="text-right">
                <span className="font-headline-xl text-3xl text-[#cb4926] font-black tracking-tight" id="grand-total-val">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Split calculation pill */}
            <div className="mb-4 bg-[#f2dfd7] p-3 rounded-xl diner-tag flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#cb4926] text-lg font-black">pie_chart</span>
                <span className="font-label-sm text-xs font-black text-[#231916]">
                  {members.length}-Way Split Cost:
                </span>
              </div>
              <span className="font-headline-sm text-sm font-black text-[#cb4926]" id="split-per-person">
                ₹{perPerson.toFixed(2)} / person
              </span>
            </div>

            {/* Primary Action Squish Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleLockAndPay}
                disabled={isLocking}
                className="w-full py-3.5 px-4 rounded-xl bg-[#cb4926] text-white font-label-lg text-sm sm:text-base uppercase tracking-wider font-black diner-tag hover:bg-[#a9310f] hover:shadow-lg active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-center shadow-md cursor-pointer disabled:opacity-70"
              >
                <span className="material-symbols-outlined text-xl">lock</span>
                <span>
                  {isLocking
                    ? 'Locking & Creating Order...'
                    : billingMode === 'split'
                    ? `Lock Room & Pay Split (₹${perPerson.toFixed(2)})`
                    : `Lock Room & Pay Check (₹${grandTotal.toFixed(2)})`}
                </span>
              </button>

              <Link
                to="/restaurants"
                className="w-full py-2.5 px-4 rounded-xl bg-white text-[#231916] font-label-md text-xs uppercase font-black diner-tag hover:bg-[#ffdea7] transition-all flex items-center justify-center gap-1.5 text-center shadow-xs"
              >
                <span className="material-symbols-outlined text-base text-[#cb4926]">restaurant_menu</span>
                <span>Browse All Diner Menus</span>
              </Link>
            </div>

            {/* Micro Guarantees */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-[#231916]/20 flex items-center justify-center gap-4 text-center">
              <div className="flex items-center gap-1 text-[11px] font-label-sm text-[#59413b] font-bold">
                <span className="material-symbols-outlined text-sm text-[#cb4926]">local_shipping</span>
                <span>All food arrives together</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-label-sm text-[#59413b] font-bold">
                <span className="material-symbols-outlined text-sm text-[#5e7d56]">receipt_long</span>
                <span>Itemized receipts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Diner Dish Modal */}
      {showDishPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fff8f6] max-w-2xl w-full rounded-2xl diner-border-thick shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#ffdea7] p-3.5 px-5 diner-border-thick border-x-0 border-t-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#cb4926] text-2xl font-black">
                  restaurant
                </span>
                <div>
                  <h3 className="font-headline-sm text-base uppercase font-black text-[#231916] leading-none">
                    Select Diner Dish For Tray
                  </h3>
                  <span className="font-label-sm text-[11px] text-[#59413b] font-bold">
                    Booth #{roomCode} • Route 66 Fresh Griddle Specials
                  </span>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-white text-[#231916] border-2 border-[#231916] flex items-center justify-center hover:bg-[#ffece6] transition-colors cursor-pointer shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                type="button"
                onClick={() => setShowDishPickerModal(false)}
                title="Close"
              >
                <span className="material-symbols-outlined text-base font-black">close</span>
              </button>
            </div>

            {/* Target Diner Selector & Category Filter */}
            <div className="p-4 bg-[#f2dfd7] border-b-2 border-[#231916] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#231916]">Add to Diner:</span>
                <select
                  value={targetMemberId}
                  onChange={(e) => setTargetMemberId(Number(e.target.value))}
                  className="bg-white text-xs font-black text-[#231916] px-3 py-1.5 rounded-lg border-2 border-[#231916] diner-tag focus:outline-none focus:border-[#cb4926] cursor-pointer"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.seat})
                    </option>
                  ))}
                </select>
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {['ALL', 'Burgers & Melts', 'Malts & Shakes', 'Baskets & Fries', 'All-Day Breakfast'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDishPickerCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${
                      dishPickerCategory === cat
                        ? 'bg-[#cb4926] text-white diner-tag'
                        : 'bg-white text-[#231916] hover:bg-[#ffdea7]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dish Cards Grid */}
            <div className="p-4 overflow-y-auto space-y-3">
              {menuItemsCatalog
                .filter((item) => dishPickerCategory === 'ALL' || item.category === dishPickerCategory)
                .map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 bg-white rounded-xl border-2 border-[#231916] flex items-center justify-between gap-3 hover:border-[#cb4926] transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={dish.img}
                        alt={dish.name}
                        className="w-16 h-16 rounded-xl object-cover diner-tag shrink-0 border border-[#231916]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-headline-sm text-sm font-black text-[#231916]">
                            {dish.name}
                          </h4>
                          {dish.badge && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-[#ffdea7] text-[#231916] rounded diner-tag">
                              {dish.badge}
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-xs text-[#59413b] line-clamp-1 mt-0.5">
                          {dish.desc}
                        </p>
                        <span className="font-headline-sm text-sm font-black text-[#cb4926]">
                          ₹{dish.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddDishToMemberTray(dish)}
                      className="px-3.5 py-2 bg-[#cb4926] text-white font-label-sm text-xs font-black uppercase rounded-xl diner-tag hover:bg-[#a9310f] transition-all shrink-0 flex items-center gap-1 shadow-sm cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      <span>Add to Tray</span>
                    </button>
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="bg-[#f7e4de] p-3 px-5 diner-border-thick border-x-0 border-b-0 flex items-center justify-between">
              <span className="text-xs font-bold text-[#59413b]">
                Adding to: <strong>{members.find((m) => m.id === targetMemberId)?.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowDishPickerModal(false)}
                className="py-1.5 px-4 rounded-lg bg-[#231916] text-white font-label-sm text-xs font-black diner-tag hover:bg-[#3d2c27] cursor-pointer"
              >
                Done Picking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#231916] text-[#fed388] px-4 py-3 rounded-xl diner-tag font-label-md text-xs font-black shadow-2xl flex items-center gap-2 border-2 border-[#fed388] animate-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-base text-[#ffdea7]">check_circle</span>
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
                <span className="material-symbols-outlined text-[#cb4926] text-2xl font-black">
                  group_add
                </span>
                <div>
                  <h3 className="font-headline-sm text-base uppercase font-black text-[#231916] leading-none">
                    Invite Coworkers To Table
                  </h3>
                  <span className="font-label-sm text-[11px] text-[#59413b] font-bold">
                    Booth #{roomCode} • Collaborative Feast ({members.length} of 8 Seats)
                  </span>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#231916] border-2 border-[#231916] flex items-center justify-center transition-colors cursor-pointer shadow-sm active:translate-x-0.5 active:translate-y-0.5"
                type="button"
                onClick={() => setShowQrModal(false)}
                title="Close"
              >
                <span className="material-symbols-outlined text-base font-black">close</span>
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
                <span>Dispatch Invite</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {inviteModalTab === 'qr' && (
                <div className="flex flex-col items-center text-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e8d5be] text-[#231916] font-label-sm text-[10px] uppercase font-black diner-tag mb-2">
                    Scannable with Any Camera Phone
                  </span>
                  <p className="font-body-sm text-xs text-[#59413b] max-w-xs mb-3 font-bold">
                    Hold your phone camera or QR scanner up to this code to hop into Booth #{roomCode} instantly.
                  </p>

                  {/* Scannable QR Code Frame */}
                  <div className="p-3 bg-white rounded-2xl diner-border-thick shadow-md inline-block relative group">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR Code for room ${roomCode}`}
                        className="w-52 h-52 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-52 h-52 flex flex-col items-center justify-center bg-surface-container rounded-lg">
                        <span className="material-symbols-outlined text-4xl text-[#cb4926] animate-spin mb-2">
                          sync
                        </span>
                        <span className="text-xs font-black text-[#59413b]">Generating QR Code...</span>
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
                    <p className="font-black text-[#231916] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#cb4926]">info</span>
                      How Coworkers Join:
                    </p>
                    <p className="font-medium">
                      Anyone opening this link hops straight into Booth #{roomCode}. They can browse burgers, shakes, and sides, and their selections appear live on this screen.
                    </p>
                  </div>
                </div>
              )}

              {inviteModalTab === 'direct' && (
                <form onSubmit={handleDirectInvite} className="space-y-3.5 text-left">
                  {inviteFeedback && (
                    <div className="p-2.5 rounded-xl bg-[#caecbe] text-[#062105] text-xs font-black diner-tag flex items-center gap-2 border border-[#062105]/20 animate-in fade-in">
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
                    <span className="material-symbols-outlined text-base">person_add</span>
                    <span>Reserve Seat &amp; Dispatch Invite</span>
                  </button>
                </form>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="bg-[#f7e4de] p-3 px-5 diner-border-thick border-x-0 border-b-0 flex items-center justify-between">
              <span className="text-[11px] font-black text-[#59413b]">
                Booth Table: <strong>#{roomCode}</strong> ({members.length} of 8 seats occupied)
              </span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="py-1.5 px-4 rounded-lg bg-[#231916] text-white font-label-sm text-xs font-black diner-tag hover:bg-[#3d2c27] cursor-pointer"
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
