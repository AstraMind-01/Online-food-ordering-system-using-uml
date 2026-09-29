import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { restaurantService, menuService } from '../../services/api';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';
import RetroModal from '../../components/restaurant/RetroModal';

export default function RestaurantMenu() {
  const { restaurant } = useOutletContext();
  const restaurantId = restaurant?.id || 1;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Form modal state (Add & Edit)
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Juicy Burgers',
    badgeText: '★ SPECIAL',
    prepTimeMins: 8,
    imageUrl: '',
    available: true,
  });

  // Delete confirm modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      let menu = await restaurantService.getMenu(restaurantId);
      if (!menu || menu.length === 0) {
        menu = await menuService.getAll();
      }
      setItems(menu || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Open modal for adding
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Juicy Burgers',
      badgeText: '★ SPECIAL',
      prepTimeMins: 8,
      imageUrl: '',
      available: true,
    });
    setFormModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || 'Juicy Burgers',
      badgeText: item.badgeText || '★ SPECIAL',
      prepTimeMins: item.prepTimeMins || 8,
      imageUrl: item.imageUrl || '',
      available: item.available ?? true,
    });
    setFormModalOpen(true);
  };

  // Submit form (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        badgeText: formData.badgeText,
        prepTimeMins: parseInt(formData.prepTimeMins, 10) || 8,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        available: formData.available,
      };

      if (editingItem) {
        await restaurantService.updateMenuItem(restaurantId, editingItem.id, payload);
      } else {
        await restaurantService.addMenuItem(restaurantId, payload);
      }

      setFormModalOpen(false);
      await fetchMenu();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving menu item');
    }
  };

  // Toggle availability switch
  const handleToggleAvailability = async (item) => {
    setActionLoadingId(item.id);
    try {
      await restaurantService.toggleAvailability(restaurantId, item.id);
      await fetchMenu();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not toggle item availability');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open delete confirm
  const handleOpenDelete = (item) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await restaurantService.deleteMenuItem(restaurantId, deletingItem.id);
      setDeleteModalOpen(false);
      setDeletingItem(null);
      await fetchMenu();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete item');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm bg-[#ffdea7] text-[#231916] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
            ★ DINER CATALOG & GRIDDLE
          </span>
          <h1 className="font-headline-xl text-3xl font-black uppercase text-[#231916] tracking-tight mt-1">
            Menu Items Manager
          </h1>
          <p className="font-body-md text-sm text-[#59413b]">
            Manage prices, 80s diner badges, kitchen prep times, and live in-stock availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#cb4926] text-white font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Add New Dish</span>
          </button>
          <button
            onClick={fetchMenu}
            className="w-10 h-10 bg-[#fff8f6] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] flex items-center justify-center hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            title="Refresh Menu"
          >
            <span className="material-symbols-outlined text-[#231916]">refresh</span>
          </button>
        </div>
      </div>

      {/* MENU GRID (Reusing hero menu card design) */}
      {loading ? (
        <div className="p-12 text-center text-sm font-bold text-[#59413b]">
          Spinning up diner recipes...
        </div>
      ) : items.length === 0 ? (
        <RetroEmptyState
          icon="restaurant_menu"
          title="No Dishes on Menu"
          message="Your diner catalog is empty. Click 'Add New Dish' to put burgers, malts, and fries on the griddle!"
          actionText="Add First Dish"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isToggling = actionLoadingId === item.id;
            const isAvailable = item.available ?? true;

            return (
              <div
                key={item.id}
                className={`bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl shadow-[4px_4px_0px_#231916] flex flex-col justify-between overflow-hidden transition-all hover:-translate-y-0.5 ${
                  !isAvailable ? 'opacity-70 bg-[#f1dfd8]' : ''
                }`}
              >
                {/* Photo & Ribbons */}
                <div className="relative h-44 w-full bg-[#fdeae3] border-b-2 border-[#231916] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Ribbon Badge (olive green) */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#5e7d56] text-[#f8fff0] font-label-sm text-[10px] font-extrabold uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916]">
                    {item.badgeText || '★ CLASSIC SPECIAL'}
                  </div>

                  {/* Prep-time pill */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#fff8f6]/95 backdrop-blur-xs text-[#231916] font-label-sm text-[10px] font-bold uppercase border-2 border-[#231916] rounded-full shadow-[2px_2px_0px_#231916] flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-[#cb4926]">timer</span>
                    <span>{item.prepTimeMins || 8} Mins Prep</span>
                  </div>

                  {/* Availability Stamp */}
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="px-3 py-1 bg-[#ba1a1a] text-white font-extrabold text-xs uppercase border-2 border-white rounded-md shadow-md rotate-[-8deg]">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-headline-md text-base font-black text-[#231916] leading-snug">
                        {item.name}
                      </h3>
                      <span className="font-headline-lg text-base font-black text-[#cb4926] flex-shrink-0">
                        ₹{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      </span>
                    </div>

                    <p className="font-body-sm text-xs text-[#59413b] line-clamp-2 leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Controls & Action Buttons */}
                  <div className="pt-3 border-t-2 border-dashed border-[#231916] flex items-center justify-between gap-2">
                    {/* Availability Toggle */}
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      disabled={isToggling}
                      className={`px-2.5 py-1 text-[11px] font-black uppercase rounded-lg border-2 border-[#231916] shadow-[1px_1px_0px_#231916] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-[#caecbe] text-[#062105]'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      {isToggling ? '...' : isAvailable ? '● In Stock' : '○ Unavailable'}
                    </button>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 bg-[#fff8f6] border-2 border-[#231916] rounded-lg shadow-[1px_1px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-[#231916]"
                        title="Edit Dish"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>

                      <button
                        onClick={() => handleOpenDelete(item)}
                        className="p-1.5 bg-[#ffdad6] text-[#93000a] border-2 border-[#231916] rounded-lg shadow-[1px_1px_0px_#231916] hover:bg-[#ffb4a1] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                        title="Delete Dish"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <RetroModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingItem ? 'Edit Diner Dish' : 'Add New Diner Dish'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
                Dish Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Route 66 Triple Bacon Stack"
                className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
                Price (₹ INR) *
              </label>
              <input
                type="number"
                step="0.05"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="12.45"
                className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Description *
            </label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Crispy smoked bacon, grilled brioche & diner secret relish..."
              className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none"
              >
                <option value="Juicy Burgers">Juicy Burgers</option>
                <option value="Thick Malts & Shakes">Thick Malts & Shakes</option>
                <option value="Crinkle Fries">Crinkle Fries</option>
                <option value="Fried Chicken Baskets">Fried Chicken Baskets</option>
                <option value="All-Day Breakfast">All-Day Breakfast</option>
                <option value="Warm Diner Pies">Warm Diner Pies</option>
                <option value="Street Style">Street Style</option>
              </select>
            </div>

            <div>
              <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
                Prep Time (Mins)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.prepTimeMins}
                onChange={(e) => setFormData({ ...formData, prepTimeMins: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
                Ribbon Badge Text
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                placeholder="★ SPECIAL"
                className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Food Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isAvailableCheckbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4 accent-[#cb4926] rounded border-[#231916]"
            />
            <label htmlFor="isAvailableCheckbox" className="text-xs font-bold uppercase text-[#231916]">
              Available immediately on customer menu
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-dashed border-[#231916]">
            <button
              type="button"
              onClick={() => setFormModalOpen(false)}
              className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-bold text-xs uppercase rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#fff1ec]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#cb4926] text-white font-bold text-xs uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {editingItem ? 'Save Changes' : 'Add to Menu'}
            </button>
          </div>
        </form>
      </RetroModal>

      {/* DELETE CONFIRM MODAL */}
      <RetroModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Menu Dish"
      >
        <div className="space-y-4">
          <p className="font-body-md text-sm text-[#59413b]">
            Are you sure you want to remove <strong>{deletingItem?.name}</strong> from the diner catalog? This dish will no longer be available for customer or group orders.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-dashed border-[#231916]">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-bold text-xs uppercase rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#fff1ec]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-[#ba1a1a] text-white font-bold text-xs uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#93000a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Confirm Deletion
            </button>
          </div>
        </div>
      </RetroModal>
    </div>
  );
}
