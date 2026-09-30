import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import RestaurantCard from '../components/RestaurantCard';
import RetroEmptyState from '../components/restaurant/RetroEmptyState';
import { restaurantService } from '../services/api';

// Fallback Route 66 Diner Roster if backend is warming up
const FALLBACK_RESTAURANTS = [
  {
    id: 1,
    name: "Big Bill's Burger Emporium",
    cuisine: 'Smash Burgers, Melts & Crinkle Fries',
    address: '742 Evergreen Terrace, Route 66 Mile 42',
    rating: 4.9,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Neon Route 66 Smokehouse & BBQ',
    cuisine: 'Texas BBQ, Smoked Bacon & Loaded Baskets',
    address: '888 Neon Boulevard, Route 66 Mile 58',
    rating: 4.8,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: "Sally's Sweet Malts & Soda Fountain",
    cuisine: 'Handcrafted Malts, Floats & Skillet Desserts',
    address: '505 Soda Springs Way, Route 66 Mile 19',
    rating: 5.0,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Drive-In Fried Chicken & Baskets',
    cuisine: '24-Hr Buttermilk Crispy Chicken & Golden Baskets',
    address: '102 Starlight Drive-In Lane, Route 66 Mile 35',
    rating: 4.9,
    open: true,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Route 66 All-Day Breakfast & Bakery',
    cuisine: 'All-Day Pancakes, Sourdough Melts & Fresh Pies',
    address: '220 Sunrise Highway, Route 66 Mile 12',
    rating: 4.8,
    open: false,
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
  },
];

export default function RestaurantListing() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await restaurantService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        // Merge backend data with fallback details so all 5 iconic highway diners are always populated
        const merged = FALLBACK_RESTAURANTS.map((fb) => {
          const match = data.find((d) => d.id === fb.id);
          return match ? { ...fb, ...match } : fb;
        });
        setRestaurants(merged);
      } else {
        setRestaurants(FALLBACK_RESTAURANTS);
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      // If server error occurs, check if we have offline fallback or set error
      if (FALLBACK_RESTAURANTS && FALLBACK_RESTAURANTS.length > 0) {
        setRestaurants(FALLBACK_RESTAURANTS);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="flex flex-col w-full pt-8 sm:pt-10 pb-20">
      {/* Retro Section Heading with Zigzag Underline */}
      <section className="mb-10 text-center">
        <SectionHeading
          tag="ROUTE 66 DINER DIRECTORY"
          titlePrefix="HUNGRY DINERS"
          highlightWord="AWAIT"
          subtitle="Explore authentic roadside diners, sizzling flat-top smash burgers, smoky barbecue pits & vintage soda counters."
        />
      </section>

      {/* Main Content Area */}
      <main className="w-full">
        {/* Loading State: Skeletons in retro outline style */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916] flex flex-col justify-between animate-pulse"
              >
                <div>
                  <div className="w-full h-48 rounded-xl bg-[#f7e4de] border-2 border-[#231916] shadow-[2px_2px_0px_#231916] mb-4" />
                  <div className="h-6 bg-[#ffdea7] rounded-md border border-[#231916] w-3/4 mb-2" />
                  <div className="h-4 bg-[#f7e4de] rounded-md border border-[#231916] w-1/2 mb-3" />
                  <div className="h-3 bg-[#f7e4de] rounded-md w-2/3" />
                </div>
                <div className="pt-4 border-t-2 border-dashed border-[#231916]/30 mt-4 flex items-center justify-between">
                  <div className="h-4 bg-[#f7e4de] rounded-md w-1/3" />
                  <div className="h-8 bg-[#ffdea7] rounded-xl border border-[#231916] w-28" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State: "Kitchen is warming up" retry card */}
        {!loading && error && (
          <RetroEmptyState
            icon="soup_kitchen"
            title="Kitchen is Warming Up!"
            message="We couldn't connect to our Route 66 diner network. Please check your connection and give it another spin."
            actionText="RETRY CONNECTION"
            onAction={fetchRestaurants}
          />
        )}

        {/* Empty State: "No diners found" card */}
        {!loading && !error && restaurants.length === 0 && (
          <RetroEmptyState
            icon="storefront"
            title="No Diners Found"
            message="All highway diners are currently closed or tucked away for the night. Check back soon for hot griddle specials!"
            actionText="REFRESH DIRECTORY"
            onAction={fetchRestaurants}
          />
        )}

        {/* Success Grid: List of Diners */}
        {!loading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((rest) => (
              <RestaurantCard key={rest.id} restaurant={rest} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
