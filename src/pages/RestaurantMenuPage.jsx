import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard';
import RetroEmptyState from '../components/restaurant/RetroEmptyState';
import { restaurantService, cartService, authService } from '../services/api';

// Fallback Diner Data
const FALLBACK_RESTAURANTS_MAP = {
  1: {
    id: 1,
    name: "Big Bill's Burger Emporium",
    cuisine: 'Smash Burgers, Melts & Crinkle Fries',
    address: '742 Evergreen Terrace, Route 66 Mile 42',
    rating: 4.9,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    description: 'Fresh griddled smash patties, house relish, toasted potato buns, crispy sides, and fountain malts spun on genuine 1958 Hamilton Beach mixers.',
  },
  2: {
    id: 2,
    name: 'Neon Route 66 Smokehouse & BBQ',
    cuisine: 'Texas BBQ, Smoked Bacon & Loaded Baskets',
    address: '888 Neon Boulevard, Route 66 Mile 58',
    rating: 4.8,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    description: 'Slow-smoked Texas briskets, bourbon hickory BBQ melts, loaded chili-cheese baskets, and charred frankfurters smothered in roadhouse chili.',
  },
  3: {
    id: 3,
    name: "Sally's Sweet Malts & Soda Fountain",
    cuisine: 'Handcrafted Malts, Floats & Skillet Desserts',
    address: '505 Soda Springs Way, Route 66 Mile 19',
    rating: 5.0,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    description: 'Antique 1950s chrome soda fountain spinning thick malted barley milkshakes, fizzy root beer floats, warm skillet brownies, and grandma\'s deep-dish pies.',
  },
  4: {
    id: 4,
    name: 'Drive-In Fried Chicken & Baskets',
    cuisine: '24-Hr Buttermilk Crispy Chicken & Golden Baskets',
    address: '102 Starlight Drive-In Lane, Route 66 Mile 35',
    rating: 4.9,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80',
    description: 'Golden buttermilk chicken dredged in cayenne pepper glaze or garlic honey butter, served in paper-lined baskets with crispy fries, towers of rings, and chilled slaw.',
  },
  5: {
    id: 5,
    name: 'Route 66 All-Day Breakfast & Bakery',
    cuisine: 'All-Day Pancakes, Sourdough Melts & Fresh Pies',
    address: '220 Sunrise Highway, Route 66 Mile 12',
    rating: 4.8,
    open: false,
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80',
    description: 'Golden buttermilk pancake towers, buttery sourdough melts, fresh sliced Haas avocado stacks, warm cinnamon apple pies, and fresh-squeezed morning citrus.',
  },
};

// Fallback Menu Items Map per Restaurant (with available: true/false flags)
const FALLBACK_MENUS_MAP = {
  1: [
    {
      id: 1,
      name: 'The Route 66 Double Smash',
      description: "Double smashed beef patties, griddled onions, thick sharp cheddar, crispy pickles, and Bill's secret 1974 spiced relish on toasted brioche.",
      price: 12.95,
      badgeText: '★ DINER SPECIAL',
      prepTimeMins: 12,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDImiRou9pZncwd_QKdJwfF2oddtJM6qe9LejdjAk9kU-VmPhfGKuDeXoLdev080FIqBb3EegRlQLcgGHjSsRSJnbJHhRXHy7xAtU8li2KeNF7efW1lu3sND3NLxAFAwhFaXr4JXevPQFVmAQS9MvyOefhp7YgTSaeUE55Z-ig7gfC1AYRDUo5S5Lg6pd4EVweZatSkLqXk0OPnMIoC9DZMn-To0ejPrWSfTUWx8JOGrQp1GG8o9Cnh',
      available: true,
    },
    {
      id: 2,
      name: 'Avocado Green Goddess Burger',
      description: 'Hand-formed seasoned plant patty, ripe avocado mash, green tomato chow-chow relish, and crisp iceberg on a griddled potato bun.',
      price: 14.25,
      badgeText: '★ VEGGIE PICK',
      prepTimeMins: 10,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUDrljKVytOGjUw1TO1Ki6e2JT0fcDAgQ4dpMy0NAm-0mo6Rh5JJzhqDTz0l6Ir3qtyERVD_Fqi7lOQJfqhqPB_kBiv070gWa3PSCgOOPn7wrfltXoQ9rg5Cab2j_-dC50_aDSHlvCElYHQ6Xe86F585Eh7EOpJMNHHbIJRzUg6t86wCFv1hLaqjZ_ji4F95yxlbODsyjwhmO98yw8ZqsWQ2LSo8UtQau1Xdad5fl5jbdtqg3xrSzX',
      available: true,
    },
    {
      id: 3,
      name: 'Classic Patty Melt on Caraway Rye',
      description: 'Butter-toasted caraway seed rye bread, heavy griddled Swiss, slowly caramelized vidalia onions, and special black pepper diner dressing.',
      price: 11.50,
      badgeText: '★ RETRO 1974',
      prepTimeMins: 12,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAepflTShAE-KO4FlAI2SAZ96L-3fC_ab7LReW5F-kCX1z_fEga8NAE2c0p3bS-LsqXlnca1wPZvVop1jPWOOaUq0r6Bzs3zebF8yACt5gSBVH91ymVOFHqI_pXr4Qfr8Lok8-KqMTHOpcWxd-I8uF3aMfUOeC2s5jUbhoEPbOjAHeJIU9uFfMjJWywbH6hxQ3H4-2yEAG--OX2hf6-i1v2MrQh_k_4bJ1_MY785LPVGBjlZ6iwxd2G',
      available: true,
    },
    {
      id: 4,
      name: 'Crinkle-Cut Loaded Fries Basket',
      description: 'Extra crispy crinkle fries, spiced sea salt, velvety yellow cheddar cheese sauce, bacon crumble, and snipped scallions.',
      price: 6.50,
      badgeText: '★ LOADED BASKET',
      prepTimeMins: 7,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO2eh4PZEcyMoktobhphBW-1t_dXhmeaAnQjCiG6gnsXPCSr4CjlqgySRva2pIgwRZAe-lZ1WrnUUgIcle7zQln2mr6RLDCWBq29yqK5uR51ncwEwBEP8Ear9Eh2sAxlULwBzXEEs1v4IFOG5rtN2wh8taP6l6uSBEoNUs30eoySN90nnMgJC52ncpYiNmTOwm2TQG2Sp9Yar4Klqc9_6SRgVNSOjfjq7Fo9AbMWEbAeBzOCU5tmVh',
      available: true,
    },
    {
      id: 5,
      name: 'Crispy Vidalia Onion Ring Tower',
      description: "Beer-battered thick sweet Vidalia onion rings served with Big Bill's tangy, smoky campfire dip.",
      price: 6.00,
      badgeText: '★ HAND-DIPPED',
      prepTimeMins: 7,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_a9lG45cMxCs_SujnGOD789YutO6YkVHMYmPAQZ_Zbjbabsl8qn9rt7lyJLbWC5sJHQP-S-WYQOm2BpnCMaOH4NiVJ7eQWEMARYOo-TtIaPTyGTGRYDkc0RIQQ7XcShzpFwKmzb2YWel9YCmCtoPLYkv7aPe3mQde-EsZhX7KgxmIDJyg4mVCxtK8cIyVEDsW6B2Q6cVah83eNG3u2wTUaAjbrdTLLrZMuJlWNUV8OtfiWD33OScA',
      available: true,
    },
    {
      id: 6,
      name: 'Tall Boy Neapolitan Malted Milkshake',
      description: 'Real dairy vanilla bean, Dutch cocoa, and sweet macerated strawberry spun with malted barley powder. Finished with whipped cream.',
      price: 7.00,
      badgeText: '★ HAND-SPUN',
      prepTimeMins: 5,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD',
      available: true,
    },
    // Unavailable test item (must be filtered out)
    {
      id: 991,
      name: 'Sold Out Triple Stack Special',
      description: 'Out of stock seasonal patty melt.',
      price: 15.00,
      badgeText: '★ SOLD OUT',
      available: false,
    },
  ],
  2: [
    {
      id: 7,
      name: 'Texas Pit Smoked Brisket Platter',
      description: '14-hour hickory-smoked prime beef brisket, caramelized burnt ends, thick Texas toast, dill pickles, and sweet bourbon BBQ.',
      price: 16.95,
      badgeText: '★ 14-HR SMOKED',
      prepTimeMins: 12,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 8,
      name: 'Smokey BBQ Bacon Beast',
      description: 'Dual smashed Angus patties with crisp Applewood smoked bacon, smoked gouda, crispy vidalia onion strings, and sweet bourbon hickory BBQ.',
      price: 14.95,
      badgeText: '★ SMOKEHOUSE',
      prepTimeMins: 14,
      imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 9,
      name: 'Coney Island Loaded Chili Dog',
      description: 'Charred all-beef frankfurter smothered in slow-cooked Texas road chili, minced sweet onions, and sharp ballpark mustard on a steamed bun.',
      price: 8.95,
      badgeText: '★ BOARDWALK',
      prepTimeMins: 8,
      imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 10,
      name: 'Texas Chili Mac & Cheese Skillet',
      description: 'Cast-iron baked cavatappi pasta in rich cheddar cheese sauce, layered with slow-cooked Texas road chili and green scallions.',
      price: 8.95,
      badgeText: '★ CHEESY COMFORT',
      prepTimeMins: 10,
      imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
  ],
  3: [
    {
      id: 11,
      name: 'Tall Boy Neapolitan Malted Milkshake',
      description: 'Real dairy vanilla bean, Dutch cocoa, and sweet macerated strawberry spun with malted barley powder. Finished with whipped cream.',
      price: 7.00,
      badgeText: '★ HAND-SPUN',
      prepTimeMins: 5,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUX06h_GTrBqVutq0m2qxKzgiPInRwc9dcCz2aft0rBV29FhE3IlQml-2w9Q0Xd5bRlfNQsESdX-KSfXS2STkNzv-E6BKpgD3M1C2UAheBKLPd7hj6G3jMqd_7lPjI9J0xb1Yr02VG-NA4-Artcs91ufaKnsCHNm0jTwr4J92OK3o2zH-ng_oY_xWGf6X2-OjuK0xBkU0TMaa57qFUKIx93tBvxO2XzTVhH5OXKKJfXnsdl8EkzruD',
      available: true,
    },
    {
      id: 12,
      name: 'Salted Caramel Pretzel Crunch Shake',
      description: 'Madagascar vanilla custard blended with buttery caramel ribbon, topped with crushed salted pretzel brittle and sea salt flakes.',
      price: 7.50,
      badgeText: '★ SWEET & SALTY',
      prepTimeMins: 5,
      imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 13,
      name: 'Old School 1950s Root Beer Float',
      description: 'Frosted vintage heavy mug filled with craft draft root beer, topped with two scoops of slow-churned bourbon vanilla bean ice cream.',
      price: 5.50,
      badgeText: '★ RETRO FLOAT',
      prepTimeMins: 4,
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 14,
      name: 'Double Dutch Dark Fudge Malt',
      description: 'Decadent Dutch cocoa custard, malted milk powder, warm chocolate fudge swirl, topped with chocolate sprinkles and a maraschino cherry.',
      price: 7.25,
      badgeText: '★ CHOCO MANIA',
      prepTimeMins: 5,
      imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 15,
      name: 'Deep-Dish Cinnamon Apple Pie à la Mode',
      description: 'Flaky hand-crimped butter crust filled with spiced Granny Smith apples and cinnamon honey glaze, served warm with vanilla bean gelato.',
      price: 7.25,
      badgeText: '★ GRANDMA RECIPE',
      prepTimeMins: 6,
      imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 16,
      name: 'Skillet Hot Fudge Brownie Sundae',
      description: 'Warm gooey triple-chocolate fudge brownie in a mini cast-iron skillet, topped with double vanilla scoops, hot fudge, and toasted walnuts.',
      price: 8.50,
      badgeText: '★ SKILLET TREAT',
      prepTimeMins: 7,
      imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
  ],
  4: [
    {
      id: 17,
      name: 'Drive-In Crispy Chicken Basket',
      description: 'Crispy buttermilk fried chicken tenders served with honey mustard, seasoned crinkle fries & diner apple-cider slaw.',
      price: 13.50,
      badgeText: '★ CROWD FAVORITE',
      prepTimeMins: 10,
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 18,
      name: 'Nashville Hot Crispy Chicken Melt',
      description: 'Buttermilk-marinated chicken breast dredged in cayenne pepper glaze, spicy diner pickles, and tangy apple-cider slaw on toasted brioche.',
      price: 13.50,
      badgeText: '★ SPICY SENSATION',
      prepTimeMins: 12,
      imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 19,
      name: 'Nashville Hot Jumbo Wings (8 Pcs)',
      description: 'Eight crispy jumbo chicken wings dipped in cayenne-spiced Nashville glaze, served with buttermilk ranch and celery sticks.',
      price: 12.95,
      badgeText: '★ FIRE CRUNCH',
      prepTimeMins: 12,
      imageUrl: 'https://images.unsplash.com/photo-1527477378370-35e69e0ee25f?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
    {
      id: 20,
      name: 'Golden Truffle Parmesan Tots',
      description: 'Crunchy potato tots tossed with white truffle oil, freshly grated parmesan reggiano, sea salt herbs, and garlic aioli dip.',
      price: 7.25,
      badgeText: '★ GOURMET CRUNCH',
      prepTimeMins: 8,
      imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
      available: true,
    },
  ],
  5: [
    {
      id: 21,
      name: 'Route 66 Fluffy Buttermilk Pancake Stack',
      description: 'Triple stack of golden griddled buttermilk pancakes served with whipped sweet honey butter and warm pure Vermont maple syrup.',
      price: 9.95,
      badgeText: '★ ALL-DAY BREAKFAST',
      prepTimeMins: 8,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7BfWUcq0oXoxSGCSZBxjEZFpOEBbKDYqXilK4ZSz-UTW1l2mDVIKpjf3LqqrIeTuI1ylkU1rwoqkU6B-T1qImlaueT2CVn7uChQueSjuXVXFxZqW907GsrdWxdnGPlcKwW1hHI6-_QrasZ7Ywu6d4UawaQUkw1zsNcmM779AK2NPrkXkJtbm7es7hLCRqwsAhJ-vN8fXnGmVFTLSSfl-IAdJMGdeXPbYsQaK-dmTGpQ_MyVmlOiDL',
      available: true,
    },
    {
      id: 22,
      name: 'Avocado Green Goddess Breakfast Melt',
      description: 'Hand-formed seasoned plant patty, ripe avocado mash, green tomato chow-chow relish, and crisp iceberg on a griddled potato bun.',
      price: 14.25,
      badgeText: '★ VEGGIE MORNING',
      prepTimeMins: 10,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUDrljKVytOGjUw1TO1Ki6e2JT0fcDAgQ4dpMy0NAm-0mo6Rh5JJzhqDTz0l6Ir3qtyERVD_Fqi7lOQJfqhqPB_kBiv070gWa3PSCgOOPn7wrfltXoQ9rg5Cab2j_-dC50_aDSHlvCElYHQ6Xe86F585Eh7EOpJMNHHbIJRzUg6t86wCFv1hLaqjZ_ji4F95yxlbODsyjwhmO98yw8ZqsWQ2LSo8UtQau1Xdad5fl5jbdtqg3xrSzX',
      available: true,
    },
  ],
};

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const restaurantId = parseInt(id, 10) || 1;

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Cart Quantities state: map of { [foodItemId]: count }
  const [cartQuantities, setCartQuantities] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // Fetch Restaurant Details & Menu
  const loadData = async () => {
    setLoading(true);
    setError(false);

    try {
      // 1. Fetch Header Info
      let restData = null;
      try {
        restData = await restaurantService.getById(restaurantId);
      } catch (e) {
        console.warn('Backend restaurant fetch error, using fallback:', e);
      }
      if (!restData || !restData.name) {
        restData = FALLBACK_RESTAURANTS_MAP[restaurantId] || FALLBACK_RESTAURANTS_MAP[1];
      }
      setRestaurant(restData);

      // 2. Fetch Menu Items
      let itemsData = [];
      try {
        itemsData = await restaurantService.getMenu(restaurantId);
      } catch (e) {
        console.warn('Backend menu fetch error, using fallback:', e);
      }

      if (!Array.isArray(itemsData) || itemsData.length === 0) {
        itemsData = FALLBACK_MENUS_MAP[restaurantId] || FALLBACK_MENUS_MAP[1] || [];
      }

      // CRITICAL REQUIREMENT: Filter ONLY items where available === true
      // Unavailable items are completely hidden/omitted.
      const availableOnly = itemsData.filter((item) => item.available === true);
      setMenuItems(availableOnly);

      // 3. Load Existing Cart Quantities if Authenticated
      if (authService.isAuthenticated()) {
        try {
          const cart = await cartService.get();
          if (cart && Array.isArray(cart.items)) {
            const counts = {};
            cart.items.forEach((cItem) => {
              const fId = cItem.foodItem ? cItem.foodItem.id : cItem.foodItemId;
              if (fId) {
                counts[fId] = cItem.quantity || 1;
              }
            });
            setCartQuantities(counts);
          }
        } catch {}
      }
    } catch (err) {
      console.error('Failed to load restaurant page data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Add Item to Cart
  const handleAddToCart = async (item) => {
    const nextQty = (cartQuantities[item.id] || 0) + 1;
    setCartQuantities((prev) => ({
      ...prev,
      [item.id]: nextQty,
    }));
    triggerToast(`✓ Added "${item.name}" to cart!`);

    if (authService.isAuthenticated()) {
      try {
        await cartService.addItem(item.id, 1);
      } catch (err) {
        console.error('Error adding item to backend cart:', err);
      }
    }
  };

  // Update Item Quantity in Cart (+ or -)
  const handleUpdateQty = async (item, newQty) => {
    setCartQuantities((prev) => {
      const copy = { ...prev };
      if (newQty <= 0) {
        delete copy[item.id];
      } else {
        copy[item.id] = newQty;
      }
      return copy;
    });

    if (newQty <= 0) {
      triggerToast(`Removed "${item.name}" from cart.`);
    } else {
      triggerToast(`Updated "${item.name}" quantity to ${newQty}.`);
    }

    if (authService.isAuthenticated()) {
      try {
        if (newQty <= 0) {
          // Find cart item ID to remove
          const cart = await cartService.get();
          const found = cart.items?.find((ci) => (ci.foodItem?.id || ci.foodItemId) === item.id);
          if (found) {
            await cartService.removeItem(found.id);
          }
        } else {
          // Increment or decrement
          await cartService.addItem(item.id, 1);
        }
      } catch (err) {
        console.error('Cart sync error:', err);
      }
    }
  };

  const isOpen = restaurant ? restaurant.open !== false : true;

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-xl px-5 py-3 shadow-[4px_4px_0px_#231916] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <span className="font-black text-sm text-[#231916]">{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="text-xs font-black uppercase text-[#8d716a] hover:text-[#231916] cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Back Link / Navigation Pill */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffdea7] text-[#231916] font-black text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#fed388] active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined text-sm font-black">arrow_back</span>
          <span>BACK TO ALL DINERS</span>
        </Link>

        {restaurant && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#59413b]">
            <Link to="/" className="hover:text-[#cb4926]">Home</Link>
            <span>/</span>
            <Link to="/restaurants" className="hover:text-[#cb4926]">Diners</Link>
            <span>/</span>
            <span className="text-[#231916] font-black">{restaurant.name}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* HEADER SECTION: Diner Banner, Name, Cuisine, Rating, Address, Open/Closed */}
      {/* ========================================================================= */}
      {loading ? (
        <div className="w-full bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_#231916] mb-8 animate-pulse">
          <div className="h-44 w-full bg-[#f7e4de] rounded-xl border-2 border-[#231916] mb-4" />
          <div className="h-8 bg-[#ffdea7] rounded-md w-1/2 mb-2" />
          <div className="h-4 bg-[#f7e4de] rounded-md w-1/3 mb-2" />
          <div className="h-4 bg-[#f7e4de] rounded-md w-1/4" />
        </div>
      ) : error || !restaurant ? (
        <RetroEmptyState
          icon="soup_kitchen"
          title="Kitchen is Warming Up!"
          message="Could not load details for this diner spot. Please verify your connection and give it another try."
          actionText="RETRY"
          onAction={loadData}
        />
      ) : (
        <section className="w-full bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 md:p-8 shadow-[4px_4px_0px_#231916] mb-8 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Banner Image */}
            <div className="lg:col-span-5 relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border-2 border-[#231916] shadow-[3px_3px_0px_#231916] bg-[#f7e4de]">
              <img
                src={
                  restaurant.imageUrl ||
                  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80'
                }
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />

              {/* Status Ribbon on Image */}
              <div
                className={`absolute top-3 left-3 px-3 py-1 rounded-md font-black text-xs uppercase border border-[#231916] shadow-[2px_2px_0px_#231916] flex items-center gap-1.5 ${
                  isOpen
                    ? 'bg-[#5e7d56] text-[#f8fff0]'
                    : 'bg-[#b3a8a5] text-[#231916]'
                }`}
              >
                <span>{isOpen ? '●' : '○'}</span>
                <span>{isOpen ? 'OPEN NOW' : 'CLOSED'}</span>
              </div>

              {/* Rating Pill on Image */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#fdc65c] text-[#231916] font-black text-xs border border-[#231916] shadow-[2px_2px_0px_#231916] flex items-center gap-1">
                <span>★</span>
                <span>{restaurant.rating || 4.9}</span>
              </div>
            </div>

            {/* Restaurant Meta Details */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdea7] text-[#231916] border border-[#231916] text-[11px] font-black uppercase tracking-wider mb-2">
                  <span>★</span>
                  <span>ROUTE 66 FLAVOR STOP</span>
                </div>

                <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#231916] tracking-tight leading-tight">
                  {restaurant.name}
                </h1>

                <p className="font-body-md text-sm text-[#cb4926] font-bold uppercase tracking-wider mt-1">
                  {restaurant.cuisine || 'Classic American Diner, Malts & Burgers'}
                </p>

                <p className="font-body-sm text-xs sm:text-sm text-[#59413b] font-medium leading-relaxed mt-2">
                  {restaurant.description ||
                    'Authentic Route 66 griddle creations made from scratch using local farm produce and vintage recipes.'}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-dashed border-[#231916]/30 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-[#59413b]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#cb4926]">location_on</span>
                  <span>{restaurant.address || '742 Evergreen Terrace, Springfield'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#5e7d56]">timer</span>
                  <span>Avg Prep: 15–20 Mins</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#fdc65c]">local_shipping</span>
                  <span>Free Courier Over ₹35</span>
                </span>
              </div>
            </div>
          </div>

          {/* Notice Banner if Restaurant is Closed */}
          {!isOpen && (
            <div className="mt-5 p-3.5 bg-[#f7e4de] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] flex items-center gap-2.5 text-xs font-bold text-[#231916]">
              <span className="material-symbols-outlined text-lg text-[#cb4926]">warning</span>
              <span>
                <strong>Notice:</strong> This diner is currently <strong>CLOSED</strong>. You can still browse the available items, but ordering may be delayed until the kitchen reopens!
              </span>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* AVAILABLE FOOD ITEMS GRID                                                 */}
      {/* ========================================================================= */}
      <main className="w-full">
        {/* Section Title */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916]/40 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cb4926] text-2xl font-black">
              restaurant_menu
            </span>
            <h2 className="font-headline-lg text-xl sm:text-2xl font-black uppercase text-[#231916] tracking-tight">
              AVAILABLE FOOD ITEMS ({menuItems.length})
            </h2>
          </div>
          <span className="text-xs font-bold uppercase bg-[#ffdea7] px-3 py-1 rounded-full border border-[#231916] text-[#231916]">
            Only In-Stock Dishes
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916] flex flex-col justify-between animate-pulse"
              >
                <div>
                  <div className="w-full h-44 rounded-xl bg-[#f7e4de] border-2 border-[#231916] mb-4" />
                  <div className="h-6 bg-[#ffdea7] rounded w-3/4 mb-2" />
                  <div className="h-4 bg-[#f7e4de] rounded w-full mb-3" />
                </div>
                <div className="pt-3 border-t-2 border-dashed border-[#231916]/30 mt-2">
                  <div className="h-9 bg-[#cb4926]/30 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State: Zero available items */}
        {!loading && !error && menuItems.length === 0 && (
          <RetroEmptyState
            icon="restaurant"
            title="Kitchen's taking a break — check back soon!"
            message="Chef Bill and the diner team are prepping fresh ingredients. Available dishes will be back on the sizzling griddle shortly!"
            actionText="EXPLORE OTHER DINERS"
            onAction={() => (window.location.href = '/restaurants')}
          />
        )}

        {/* Available Food Items Grid */}
        {!loading && !error && menuItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                cartQty={cartQuantities[item.id] || 0}
                onAddToCart={handleAddToCart}
                onUpdateQty={handleUpdateQty}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
