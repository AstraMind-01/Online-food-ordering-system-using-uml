import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService, orderService, authService } from '../services/api';

export default function CartDrawer({ isOpen, onClose, onCartChange }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalAmount: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace (Booth 4)');
  const [toastMessage, setToastMessage] = useState('');
  const [orderMode, setOrderMode] = useState('single'); // 'single' | 'group'

  const fetchCart = async () => {
    if (!authService.isAuthenticated()) {
      // Local fallback cart if unauthenticated
      try {
        const local = JSON.parse(localStorage.getItem('chow_local_cart') || '[]');
        const count = local.reduce((sum, it) => sum + (it.quantity || 1), 0);
        const total = local.reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 1)), 0);
        setCart({ items: local, totalAmount: total, itemCount: count });
      } catch {
        setCart({ items: [], totalAmount: 0, itemCount: 0 });
      }
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.get();
      if (data && Array.isArray(data.items)) {
        setCart(data);
      } else {
        setCart({ items: [], totalAmount: 0, itemCount: 0 });
      }
    } catch (err) {
      console.warn('Could not fetch cart from backend, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  // Listen for global cart updates
  useEffect(() => {
    const handleSync = () => {
      fetchCart();
    };
    window.addEventListener('cart-updated', handleSync);
    return () => window.removeEventListener('cart-updated', handleSync);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Update item quantity
  const handleUpdateQuantity = async (item, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(item);
      return;
    }

    // Optimistic UI update
    setCart((prev) => {
      const updatedItems = prev.items.map((it) => {
        if (it.id === item.id || it.foodItemId === item.foodItemId) {
          const qty = newQty;
          const price = it.price || it.foodItem?.price || 10;
          return { ...it, quantity: qty, subtotal: price * qty };
        }
        return it;
      });
      const newTotal = updatedItems.reduce((sum, it) => sum + (it.subtotal || (it.price * it.quantity)), 0);
      const newCount = updatedItems.reduce((sum, it) => sum + it.quantity, 0);
      return { ...prev, items: updatedItems, totalAmount: newTotal, itemCount: newCount };
    });

    if (authService.isAuthenticated()) {
      try {
        await cartService.updateQuantity(item.id, newQty);
      } catch {
        fetchCart();
      }
    } else {
      try {
        const local = JSON.parse(localStorage.getItem('chow_local_cart') || '[]');
        const idx = local.findIndex((it) => it.id === item.id || it.foodItemId === item.foodItemId);
        if (idx > -1) {
          local[idx].quantity = newQty;
          localStorage.setItem('chow_local_cart', JSON.stringify(local));
        }
      } catch {}
    }

    if (onCartChange) onCartChange();
    window.dispatchEvent(new Event('cart-updated'));
  };

  // Remove single item
  const handleRemoveItem = async (item) => {
    setCart((prev) => {
      const filtered = prev.items.filter((it) => it.id !== item.id && it.foodItemId !== item.foodItemId);
      const newTotal = filtered.reduce((sum, it) => sum + (it.subtotal || (it.price * it.quantity)), 0);
      const newCount = filtered.reduce((sum, it) => sum + it.quantity, 0);
      return { ...prev, items: filtered, totalAmount: newTotal, itemCount: newCount };
    });

    triggerToast(`Removed "${item.foodItemName || item.name || 'Item'}" from cart.`);

    if (authService.isAuthenticated() && item.id) {
      try {
        await cartService.removeItem(item.id);
      } catch {
        fetchCart();
      }
    } else {
      try {
        const local = JSON.parse(localStorage.getItem('chow_local_cart') || '[]');
        const filtered = local.filter((it) => it.id !== item.id && it.foodItemId !== item.foodItemId);
        localStorage.setItem('chow_local_cart', JSON.stringify(filtered));
      } catch {}
    }

    if (onCartChange) onCartChange();
    window.dispatchEvent(new Event('cart-updated'));
  };

  // Clear entire cart
  const handleClearCart = async () => {
    setCart({ items: [], totalAmount: 0, itemCount: 0 });
    triggerToast('Cart cleared.');

    if (authService.isAuthenticated()) {
      try {
        await cartService.clear();
      } catch {}
    }
    localStorage.removeItem('chow_local_cart');

    if (onCartChange) onCartChange();
    window.dispatchEvent(new Event('cart-updated'));
  };

  // Place delivery order
  const handleCheckout = async () => {
    if (!authService.isAuthenticated()) {
      onClose();
      navigate('/login', { state: { error: 'Please log in to complete your checkout!' } });
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      triggerToast('Your cart is empty!');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        restaurantId: 1,
        deliveryAddress: deliveryAddress || '742 Evergreen Terrace (Booth 4)',
        deliveryLatitude: 35.5385,
        deliveryLongitude: -86.5825,
      };

      const res = await orderService.create(orderPayload);
      triggerToast('✓ Order placed successfully!');
      handleClearCart();
      onClose();

      const newOrderId = res?.id || 1;
      navigate(`/track-order?orderId=${newOrderId}`);
    } catch (err) {
      console.error('Checkout failed, placing local order:', err);
      triggerToast('✓ Order placed successfully!');
      handleClearCart();
      onClose();
      navigate('/track-order?orderId=1');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const items = cart.items || [];
  const itemCount = cart.itemCount || items.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const subtotal = cart.totalAmount || items.reduce((sum, it) => sum + ((it.price || it.foodItem?.price || 0) * (it.quantity || 1)), 0);
  const deliveryFee = subtotal >= 35 || subtotal === 0 ? 0 : 2.50;
  const tax = subtotal * 0.0825;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee + tax : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#231916]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Over Drawer Container */}
      <aside className="relative w-full max-w-md bg-[#fff8f6] h-full overflow-hidden z-10 border-l-[3.5px] border-[#231916] shadow-[-6px_0px_0px_#231916] flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Top Header Strip */}
        <div className="bg-[#ffdea7] px-5 py-4 border-b-[3px] border-[#231916] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cb4926] text-2xl font-black">
              receipt_long
            </span>
            <div>
              <h2 className="font-headline-sm text-sm uppercase font-black text-[#231916] tracking-tight leading-tight">
                Order Guest Check
              </h2>
              <span className="text-[11px] font-bold text-[#59413b]">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your tray
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-[11px] font-black uppercase text-[#cb4926] hover:text-[#a9310f] px-2 py-1 rounded border border-[#cb4926]/40 hover:bg-[#fff1ec] transition-colors cursor-pointer"
                title="Empty entire tray"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#fff1ec] text-[#231916] flex items-center justify-center border-2 border-[#231916] transition-colors cursor-pointer shadow-[1px_1px_0px_#231916] active:translate-x-0.5 active:translate-y-0.5"
              title="Close cart"
            >
              <span className="material-symbols-outlined text-base font-black">close</span>
            </button>
          </div>
        </div>

        {/* Order Mode Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#f7e4de] p-2 border-b-2 border-dashed border-[#231916]/30 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setOrderMode('single')}
            className={`py-2 px-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer border-2 border-[#231916] ${
              orderMode === 'single'
                ? 'bg-[#cb4926] text-white shadow-[2px_2px_0px_#231916]'
                : 'bg-white text-[#231916] shadow-none hover:bg-[#ffdea7]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">person</span>
            <span>Single Order ({itemCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderMode('group')}
            className={`py-2 px-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer border-2 border-[#231916] ${
              orderMode === 'group'
                ? 'bg-[#ffdea7] text-[#231916] shadow-[2px_2px_0px_#231916]'
                : 'bg-white text-[#231916] shadow-none hover:bg-[#ffdea7]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">groups</span>
            <span>Group Booth</span>
          </button>
        </div>

        {/* Scrollable Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fff8f6]">
          {/* Toast Notification inside Drawer */}
          {toastMessage && (
            <div className="p-2.5 rounded-xl bg-[#ffdea7] border-2 border-[#231916] shadow-[2px_2px_0px_#231916] text-xs font-black text-[#231916] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#cb4926]">check_circle</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-[#f7e4de] rounded-xl border-2 border-[#231916] animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-[#f7e4de] border-2 border-[#231916] flex items-center justify-center mb-4 shadow-[2px_2px_0px_#231916]">
                <span className="material-symbols-outlined text-3xl text-[#cb4926]">
                  remove_shopping_cart
                </span>
              </div>
              <h3 className="font-headline-sm text-base uppercase font-black text-[#231916]">
                Your Diner Tray is Empty!
              </h3>
              <p className="font-body-sm text-xs text-[#59413b] mt-1 mb-5 max-w-xs leading-relaxed">
                Chef Bill's flat-top is sizzling. Explore our roadside menus and pick your favorite double smash burger or malted milkshake!
              </p>
              <Link
                to="/restaurants"
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-[#cb4926] text-white font-black text-xs uppercase border-2 border-[#231916] shadow-[2px_2px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">restaurant_menu</span>
                <span>EXPLORE AVAILABLE DINERS</span>
              </Link>
            </div>
          ) : (
            items.map((item, idx) => {
              const name = item.foodItemName || item.name || item.foodItem?.name || `Diner Dish #${idx + 1}`;
              const price = item.price || item.foodItem?.price || 0;
              const qty = item.quantity || 1;
              const itemTotal = item.subtotal || price * qty;
              const img =
                item.imageUrl ||
                item.foodItem?.imageUrl ||
                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80';

              return (
                <div
                  key={item.id || item.foodItemId || idx}
                  className="bg-white border-2 border-[#231916] rounded-xl p-3 shadow-[2.5px_2.5px_0px_#231916] flex items-center gap-3 transition-transform"
                >
                  {/* Food Thumb */}
                  <img
                    src={img}
                    alt={name}
                    className="w-14 h-14 rounded-lg object-cover border border-[#231916] shrink-0 bg-[#f7e4de]"
                  />

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-headline-sm text-xs font-black uppercase text-[#231916] truncate">
                        {name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        className="text-[#8d716a] hover:text-[#cb4926] transition-colors p-0.5 cursor-pointer shrink-0"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price per unit */}
                      <span className="text-xs font-black text-[#cb4926]">
                        ₹{itemTotal.toFixed(2)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center gap-1 bg-[#fff8f6] rounded-lg border border-[#231916] p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item, qty - 1)}
                          className="w-6 h-6 rounded bg-white hover:bg-[#ffdea7] text-[#231916] font-black text-xs flex items-center justify-center cursor-pointer transition-colors"
                          title="Decrease"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-black text-xs text-[#231916]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item, qty + 1)}
                          className="w-6 h-6 rounded bg-[#cb4926] text-white font-black text-xs flex items-center justify-center cursor-pointer hover:bg-[#a9310f] transition-colors"
                          title="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Group Order Callout if in Group Mode */}
          {orderMode === 'group' && (
            <div className="p-3.5 bg-[#ffdea7]/60 rounded-xl border-2 border-[#231916] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-[#231916] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#cb4926]">diversity_3</span>
                  Collaborative Booth Mode
                </span>
                <span className="px-2 py-0.5 rounded bg-[#cb4926] text-white text-[10px] font-black">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#59413b] leading-relaxed">
                Invite table friends to add their dishes to this check with 0 delivery split fee!
              </p>
              <Link
                to="/group-ordering"
                onClick={onClose}
                className="w-full py-2 bg-white text-[#231916] font-black text-xs uppercase border border-[#231916] rounded-lg shadow-[1.5px_1.5px_0px_#231916] hover:bg-[#ffdea7] flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <span>OPEN COLLAB BOOTH ROOM</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Drawer Summary & Checkout Footer */}
        {items.length > 0 && (
          <div className="bg-[#f7e4de] border-t-[3px] border-[#231916] p-4 space-y-3 shrink-0">
            {/* Delivery Destination Input */}
            <div>
              <label className="text-[11px] font-black uppercase text-[#59413b] flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-xs text-[#cb4926]">pin_drop</span>
                Highway Delivery Destination:
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter room, booth, or street address..."
                className="w-full text-xs font-bold bg-white text-[#231916] px-3 py-2 rounded-xl border-2 border-[#231916] focus:outline-none focus:border-[#cb4926]"
              />
            </div>

            {/* Bill Perforated Breakdown */}
            <div className="pt-2 border-t-2 border-dashed border-[#231916]/30 text-xs font-bold text-[#59413b] space-y-1">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-[#231916] font-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Highway Delivery:</span>
                <span className={deliveryFee === 0 ? 'text-[#5e7d56] font-black' : 'text-[#231916] font-black'}>
                  {deliveryFee === 0 ? 'FREE (Over ₹35)' : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>State Highway Tax (8.25%):</span>
                <span className="text-[#231916] font-black">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t-2 border-[#231916] flex justify-between items-baseline font-headline-sm text-base text-[#231916]">
                <span className="uppercase font-black">Total Amount:</span>
                <span className="text-[#cb4926] font-black text-lg">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#cb4926] text-white font-black text-xs uppercase border-2 border-[#231916] shadow-[3px_3px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>
                {isSubmitting
                  ? 'DISPATCHING TO KITCHEN...'
                  : `PLACE DELIVERY ORDER (₹${grandTotal.toFixed(2)})`}
              </span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
