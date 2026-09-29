import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { deliveryService } from '../../services/api';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';
import RetroModal from '../../components/restaurant/RetroModal';

export default function DeliveryAvailable() {
  const navigate = useNavigate();
  const { isOnline, handleToggleOnline, refreshData } = useOutletContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [acceptedOrder, setAcceptedOrder] = useState(null);

  const fetchAvailable = useCallback(async () => {
    try {
      setLoading(true);
      const data = await deliveryService.getAvailable();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching available deliveries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailable();

    // Auto poll every 15s for new pickup orders
    const interval = setInterval(() => {
      fetchAvailable();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchAvailable]);

  // Handle Accept Delivery
  const handleAccept = async (orderId) => {
    setAcceptingId(orderId);
    try {
      const result = await deliveryService.accept(orderId);
      setAcceptedOrder(result);
      setSuccessModalOpen(true);
      await fetchAvailable();
      if (refreshData) refreshData();
    } catch (err) {
      console.error('Accept delivery failed:', err);
      const msg = err.response?.data?.message || 'Another courier may have already claimed this order or you are offline.';
      setErrorMessage(msg);
      setErrorModalOpen(true);
      await fetchAvailable();
      if (refreshData) refreshData();
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#231916]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#cb4926] border border-[#231916]"></span>
            <span className="font-label-sm text-xs uppercase font-extrabold text-[#cb4926] tracking-wider">
              ROAD RUN DISPATCH POOL
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-black uppercase text-[#231916] tracking-wide">
            Available Orders For Pickup
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#59413b] mt-0.5">
            Hot food ready at the kitchen counter. Claim a run to start moving!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#ffdea7] border-2 border-[#231916] rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#231916]">
            {orders.length} Run{orders.length === 1 ? '' : 's'} Ready
          </div>

          <button
            onClick={fetchAvailable}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#fff8f6] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Offline Alert Box if courier is offline */}
      {!isOnline && (
        <div className="bg-[#ffdad6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#cb4926] border-2 border-[#231916] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              !
            </div>
            <div>
              <h3 className="font-headline-md text-base uppercase font-black text-[#93000a]">
                You Are Currently Offline!
              </h3>
              <p className="text-xs font-medium text-[#59413b] mt-0.5">
                Couriers on break cannot view or claim active dispatches. Switch your status to Online to start accepting orders.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleOnline}
            className="px-5 py-2.5 bg-[#5e7d56] text-[#f8fff0] font-black font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#4d6846] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
          >
            ● Go Online Now
          </button>
        </div>
      )}

      {/* Orders List / Grid */}
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => {
            const isGroup = order.deliveryType?.startsWith('GROUP');
            const isMultiDrop = order.deliveryType === 'GROUP_INDIVIDUAL';

            return (
              <div
                key={order.orderId || order.id}
                className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col justify-between hover:-translate-y-0.5 transition-all relative overflow-hidden"
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-dashed border-[#231916] mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm px-2.5 py-0.5 bg-[#231916] text-white rounded-md">
                          #{order.orderId || order.id}
                        </span>
                        
                        {/* Delivery Type Badge */}
                        <span className={`px-2 py-0.5 text-[11px] font-black uppercase rounded-md border border-[#231916] shadow-[1px_1px_0px_#231916] ${
                          isMultiDrop
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : isGroup
                            ? 'bg-[#ffdea7] text-[#231916]'
                            : 'bg-[#f7e4de] text-[#231916]'
                        }`}>
                          {isMultiDrop
                            ? '👥 Group (Multi-Drop)'
                            : isGroup
                            ? '👥 Group (Common Drop)'
                            : '👤 Single Order'}
                        </span>
                      </div>

                      <span className="inline-block mt-2 text-xs font-bold text-[#5e7d56] uppercase">
                        ● READY FOR PICKUP AT DINER
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-headline-lg text-2xl font-black text-[#cb4926] tracking-tight block">
                        ₹{order.totalAmount?.toFixed(2) || '0.00'}
                      </span>
                      <span className="text-[11px] font-bold text-[#8d716a] uppercase">
                        {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>

                  {/* Pick & Drop Addresses */}
                  <div className="space-y-3 mb-4">
                    {/* Pickup */}
                    <div className="bg-[#f7e4de] border-2 border-[#231916] rounded-xl p-3 shadow-[2px_2px_0px_#231916]">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#cb4926] mb-0.5">
                        <span className="material-symbols-outlined text-base">storefront</span>
                        <span>Pickup Location</span>
                      </div>
                      <p className="font-bold text-xs uppercase text-[#231916]">
                        {order.restaurantName || 'Chow Chow Retro Diner & Eats'}
                      </p>
                      <p className="text-xs text-[#59413b] font-medium">
                        {order.restaurantAddress || '742 Evergreen Terrace, Springfield'}
                      </p>
                    </div>

                    {/* Dropoff */}
                    <div className="bg-[#ffdea7] border-2 border-[#231916] rounded-xl p-3 shadow-[2px_2px_0px_#231916]">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#231916] mb-0.5">
                        <span className="material-symbols-outlined text-base">home_pin</span>
                        <span>Delivery Destination</span>
                      </div>
                      <p className="font-bold text-xs uppercase text-[#231916]">
                        {order.customerName || 'Customer'}
                      </p>
                      <p className="text-xs text-[#59413b] font-medium">
                        {order.dropAddress || 'Address on file'}
                      </p>
                      {order.customerPhone && (
                        <p className="text-xs font-mono font-bold text-[#8d716a] mt-0.5">
                          ☎ {order.customerPhone}
                        </p>
                      )}
                    </div>

                    {/* Multi drop indicator */}
                    {isMultiDrop && order.groupDrops && order.groupDrops.length > 0 && (
                      <div className="bg-[#fff1ec] border border-[#231916] rounded-xl p-2.5 text-xs">
                        <span className="font-bold text-[#cb4926] uppercase block mb-1">
                          📍 Multi-Stop Route ({order.groupDrops.length} Participants):
                        </span>
                        <div className="space-y-1">
                          {order.groupDrops.map((drop, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] text-[#59413b]">
                              <span>• {drop.participantName}</span>
                              <span className="font-mono text-[#8d716a] truncate max-w-[150px]">{drop.dropAddress}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Items Manifest */}
                    {order.items && order.items.length > 0 && (
                      <div className="p-2.5 bg-[#fff8f6] border border-[#231916] rounded-lg">
                        <span className="text-[11px] font-bold uppercase text-[#8d716a] block mb-1">
                          Bag Contents:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {order.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-[#f7e4de] border border-[#e8d6d0] px-2 py-0.5 rounded font-medium text-[#231916]"
                            >
                              {item.quantity}x {item.menuItemName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Accept Button */}
                <div className="pt-3 border-t-2 border-dashed border-[#231916]">
                  <button
                    onClick={() => handleAccept(order.orderId || order.id)}
                    disabled={acceptingId === (order.orderId || order.id) || !isOnline}
                    className={`w-full flex items-center justify-center gap-2 py-3 font-black font-label-md text-xs sm:text-sm uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] transition-all ${
                      !isOnline
                        ? 'bg-[#d8c2bd] text-[#59413b] cursor-not-allowed opacity-60'
                        : 'bg-[#cb4926] text-white hover:bg-[#b03a19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">electric_moped</span>
                    <span>
                      {acceptingId === (order.orderId || order.id)
                        ? 'Claiming Run...'
                        : !isOnline
                        ? 'Go Online To Accept'
                        : 'Accept Delivery'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <RetroEmptyState
          icon="moped"
          title="No Available Orders For Pickup Right Now"
          message={
            isOnline
              ? "All diner orders are either cooking or already claimed by fellow couriers. We'll automatically ping this board every 15 seconds!"
              : "You are currently offline. Flip your toggle to 'Online & Ready' in the top bar to receive new incoming runs."
          }
          actionText={isOnline ? "Refresh Now" : "Go Online Now"}
          onAction={isOnline ? fetchAvailable : handleToggleOnline}
        />
      )}

      {/* SUCCESS CLAIM MODAL */}
      <RetroModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Delivery Run Claimed!"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#5e7d56] border-2 border-[#231916] text-white flex items-center justify-center text-3xl font-black mx-auto shadow-[3px_3px_0px_#231916]">
            ✓
          </div>
          <div className="text-center">
            <h4 className="font-headline-md text-lg uppercase font-black text-[#231916]">
              Order #{acceptedOrder?.orderId || acceptedOrder?.id} Assigned To You!
            </h4>
            <p className="text-xs text-[#59413b] font-medium mt-1">
              Head over to Chow Chow Diner kitchen to pick up the order, then proceed along Route 66.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 border-t-2 border-dashed border-[#231916]">
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#f7e4de] cursor-pointer"
            >
              Stay on Available
            </button>
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                navigate('/delivery/deliveries');
              }}
              className="px-5 py-2 bg-[#fdc65c] text-[#231916] border-2 border-[#231916] rounded-xl text-xs font-black uppercase shadow-[3px_3px_0px_#231916] hover:bg-[#ffdea7] cursor-pointer"
            >
              Open My Deliveries →
            </button>
          </div>
        </div>
      </RetroModal>

      {/* ERROR COLLISION MODAL */}
      <RetroModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="Could Not Claim Run"
      >
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#cb4926] border-2 border-[#231916] text-white flex items-center justify-center text-2xl font-black mx-auto shadow-[2px_2px_0px_#231916]">
            !
          </div>
          <div className="text-center">
            <h4 className="font-headline-md text-base uppercase font-black text-[#231916]">
              Order Unavailable
            </h4>
            <p className="text-xs text-[#59413b] font-medium mt-1">
              {errorMessage}
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setErrorModalOpen(false)}
              className="px-6 py-2 bg-[#cb4926] text-white border-2 border-[#231916] rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#b03a19] cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      </RetroModal>
    </div>
  );
}
