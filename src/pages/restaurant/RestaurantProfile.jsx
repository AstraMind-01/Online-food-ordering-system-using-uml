import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { restaurantService } from '../../services/api';

export default function RestaurantProfile() {
  const { restaurant, setRestaurant, reloadData } = useOutletContext();
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    address: '',
    imageUrl: '',
    open: true,
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        cuisine: restaurant.cuisine || '',
        address: restaurant.address || '',
        imageUrl: restaurant.imageUrl || '',
        open: restaurant.open ?? true,
      });
    }
  }, [restaurant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurant) return;
    setSaving(true);
    setSuccessMsg('');

    try {
      const updated = await restaurantService.updateProfile(restaurant.id, formData);
      if (updated) {
        setRestaurant(updated);
      }
      setSuccessMsg('Diner profile updated successfully!');
      if (reloadData) reloadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update restaurant profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm bg-[#ffdea7] text-[#231916] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
            ★ RESTAURANT BRAND & SETTINGS
          </span>
          <h1 className="font-headline-xl text-3xl font-black uppercase text-[#231916] tracking-tight mt-1">
            Diner Profile Settings
          </h1>
          <p className="font-body-md text-sm text-[#59413b]">
            Update your retro diner branding, street location, banner imagery, and operating status.
          </p>
        </div>

        {successMsg && (
          <div className="px-4 py-2 bg-[#caecbe] text-[#062105] font-bold text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] animate-bounce">
            ✓ {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] space-y-5"
        >
          <div className="pb-3 border-b-2 border-dashed border-[#231916]">
            <h3 className="font-headline-md text-lg font-black uppercase text-[#231916]">
              Store Information
            </h3>
            <p className="text-xs text-[#59413b]">
              Visible to all customers on the browse and checkout screens.
            </p>
          </div>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Diner Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Chow Chow Retro Diner & Eats"
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Cuisine Specialty
            </label>
            <input
              type="text"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              placeholder="American Diner, Malts & Smash Burgers"
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Diner Street Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="7700 Neon Parkway, Route 66, Austin, TX"
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Storefront / Banner Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          {/* Operating Status Toggle */}
          <div className="p-4 bg-[#fdeae3] border-2 border-[#231916] rounded-xl flex items-center justify-between">
            <div>
              <span className="font-headline-md text-sm font-bold uppercase text-[#231916] block">
                Operating Status
              </span>
              <span className="text-xs text-[#59413b]">
                Accepting new orders from customers right now
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.open}
                onChange={(e) => setFormData({ ...formData, open: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-[#ffdad6] peer-focus:outline-none border-2 border-[#231916] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:border-2 after:border-[#231916] after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-[#5e7d56]"></div>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#cb4926] text-white font-extrabold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Diner Settings'}
            </button>
          </div>
        </form>

        {/* Right Col: Live Card Preview */}
        <div className="space-y-4">
          <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916]">
            <span className="font-label-sm text-[11px] font-black uppercase text-[#8d716a] block mb-2">
              Live Customer Preview
            </span>

            <div className="bg-white border-2 border-[#231916] rounded-xl overflow-hidden shadow-[2px_2px_0px_#231916]">
              <div className="h-32 bg-[#ffdea7] relative overflow-hidden">
                <img
                  src={formData.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
                  alt="Diner storefront"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-black uppercase rounded-md border border-[#231916] bg-white shadow-[1px_1px_0px_#231916]">
                  ★ 4.9 (1,200+)
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-headline-md text-base font-black text-[#231916]">
                    {formData.name || 'Chow Chow Retro Diner'}
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border border-[#231916] ${
                      formData.open ? 'bg-[#caecbe] text-[#062105]' : 'bg-[#ffdad6] text-[#93000a]'
                    }`}
                  >
                    {formData.open ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>

                <p className="text-xs text-[#cb4926] font-bold">
                  {formData.cuisine || 'American Diner'}
                </p>

                <p className="text-[11px] text-[#59413b] mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <span className="truncate">{formData.address || 'Route 66'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
