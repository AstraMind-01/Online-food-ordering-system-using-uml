import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { deliveryService } from '../../services/api';
import RetroStatCard from '../../components/restaurant/RetroStatCard';
import RetroModal from '../../components/restaurant/RetroModal';

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const { isOnline, handleToggleOnline, refreshData } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [allDeliveries, setAllDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [assigned, available, today, all] = await Promise.all([
        deliveryService.getAssigned().catch(() => []),
        deliveryService.getAvailable().catch(() => []),
        deliveryService.getHistory('TODAY').catch(() => []),
        deliveryService.getHistory('ALL').catch(() => []),
      ]);

      setActiveDeliveries(Array.isArray(assigned) ? assigned : []);
      setAvailableOrders(Array.isArray(available) ? available : []);
      setTodayDeliveries(Array.isArray(today) ? today : []);
      setAllDeliveries(Array.isArray(all) ? all : []);
    } catch (err) {
      console.error('Failed to load delivery dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Current primary delivery (first active one if any)
  const currentDelivery = activeDeliveries.length > 0 ? activeDeliveries[0] : null;

  // Handle Mark Picked Up directly from current delivery card
  const handleMarkPickedUp = async (deliveryId) => {
    setUpdating(true);
    try {
      await deliveryService.updateStatus(deliveryId, 'PICKED_UP');
      setStatusMessage('Order picked up from diner! Safe travels on Route 66.');
      await fetchDashboardData();
      if (refreshData) refreshData();
    } catch (err) {
      console.error('Error marking picked up:', err);
      alert(err.response?.data?.message || 'Could not update delivery status.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle Mark Delivered confirm
  const handleConfirmDelivered = async () => {
    if (!selectedDelivery) return;
    setUpdating(true);
    try {
      await deliveryService.updateStatus(selectedDelivery.id, 'DELIVERED');
      setStatusMessage('Order delivered successfully! Customer receipt updated.');
      setConfirmModalOpen(false);
      setSelectedDelivery(null);
      await fetchDashboardData();
      if (refreshData) refreshData();
    } catch (err) {
      console.error('Error completing delivery:', err);
      alert(err.response?.data?.message || 'Could not mark delivery as delivered.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#fdc65c] text-[#231916] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
              COURIER STATUS
            </span>
            <span className={`px-2 py-0.5 text-[11px] font-black uppercase rounded-md border border-[#231916] ${
              isOnline ? 'bg-[#5e7d56] text-[#f8fff0]' : 'bg-[#cb4926] text-white'
            }`}>
              {isOnline ? 'READY ON SHIFT' : 'OFFLINE (TAKING BREAK)'}
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-black uppercase text-[#231916] tracking-wide">
            Route 66 Dispatch Overview
          </h1>
          <p className="text-sm font-medium text-[#59413b] mt-1">
            Keep the wheels turning! Fast pickup, warm deliveries, and happy diner customers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/delivery/available')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#cb4926] text-white font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#b03a19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">delivery_dining</span>
            <span>View Available ({availableOrders.length})</span>
          </button>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#fff8f6] text-[#231916] font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-[#e4f3de] border-2 border-[#231916] p-4 rounded-xl shadow-[3px_3px_0px_#231916] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5e7d56] font-bold">check_circle</span>
            <span className="text-sm font-bold text-[#231916]">{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage('')}
            className="text-xs font-bold uppercase underline hover:text-[#cb4926] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <RetroStatCard
          title="Active Deliveries"
          value={activeDeliveries.length}
          subtitle="Currently assigned to you"
          icon="sports_motorsports"
          badgeColor="bg-[#fdc65c]"
          badgeText={activeDeliveries.length > 0 ? "RUN IN PROGRESS" : "NO ACTIVE RUN"}
        />
        <RetroStatCard
          title="Completed Today"
          value={todayDeliveries.length}
          subtitle="Runs marked delivered today"
          icon="task_alt"
          badgeColor="bg-[#5e7d56]"
          badgeText="TODAY'S SHIFT"
        />
        <RetroStatCard
          title="Pending Pickups"
          value={availableOrders.length}
          subtitle="Orders waiting at kitchen"
          icon="inventory_2"
          badgeColor="bg-[#cb4926]"
          badgeText={availableOrders.length > 0 ? "CLAIM AVAILABLE" : "NO WAITERS"}
        />
        <RetroStatCard
          title="Total Delivered"
          value={allDeliveries.length}
          subtitle="All-time completed orders"
          icon="history_edu"
          badgeColor="bg-[#ffdea7]"
          badgeText="ALL-TIME MILESTONE"
        />
      </div>

      {/* CURRENT DELIVERY HERO CARD */}
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 lg:p-7 shadow-[4px_4px_0px_#231916] relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[#231916] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fdc65c] border-2 border-[#231916] shadow-[2px_2px_0px_#231916] flex items-center justify-center font-bold">
              ★
            </div>
            <div>
              <h2 className="font-headline-md text-xl uppercase font-black text-[#231916] tracking-wide">
                Current Active Delivery
              </h2>
              <p className="text-xs font-medium text-[#59413b]">
                Your top-priority road run on the asphalt right now
              </p>
            </div>
          </div>

          {currentDelivery && (
            <span className={`px-3 py-1 text-xs font-black uppercase rounded-lg border-2 border-[#231916] shadow-[2px_2px_0px_#231916] ${
              currentDelivery.status === 'PICKED_UP'
                ? 'bg-[#fdc65c] text-[#231916]'
                : 'bg-[#ffdea7] text-[#231916]'
            }`}>
              {currentDelivery.status === 'PICKED_UP' ? '⚡ OUT FOR DELIVERY' : '📦 ASSIGNED / PICKUP PENDING'}
            </span>
          )}
        </div>

        {currentDelivery ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Run Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-[#231916] text-[#fff8f6] font-mono font-bold text-sm rounded-lg border border-[#231916]">
                  ORDER #{currentDelivery.orderId || currentDelivery.id}
                </span>
                
                {/* Delivery Type Badge */}
                <span className={`px-2.5 py-1 text-xs font-extrabold uppercase rounded-lg border border-[#231916] shadow-[1px_1px_0px_#231916] ${
                  currentDelivery.deliveryType === 'GROUP_INDIVIDUAL'
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : currentDelivery.deliveryType === 'GROUP_COMMON'
                    ? 'bg-[#ffdea7] text-[#231916]'
                    : 'bg-[#f7e4de] text-[#59413b]'
                }`}>
                  {currentDelivery.deliveryType === 'GROUP_INDIVIDUAL'
                    ? '👥 GROUP MULTI-DROP'
                    : currentDelivery.deliveryType === 'GROUP_COMMON'
                    ? '👥 GROUP COMMON DROP'
                    : '👤 SINGLE RUN'}
                </span>

                <span className="font-bold text-sm text-[#231916]">
                  Total: <span className="font-extrabold text-[#cb4926]">₹{currentDelivery.totalAmount?.toFixed(2) || '0.00'}</span>
                </span>
              </div>

              {/* Waypoints Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Pick up */}
                <div className="bg-[#f7e4de] border-2 border-[#231916] rounded-xl p-4 shadow-[2px_2px_0px_#231916]">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#cb4926] mb-1">
                    <span className="material-symbols-outlined text-base">storefront</span>
                    <span>1. Pickup From</span>
                  </div>
                  <h4 className="font-headline-sm font-black uppercase text-sm text-[#231916]">
                    {currentDelivery.restaurantName || 'Chow Chow Retro Diner & Eats'}
                  </h4>
                  <p className="text-xs text-[#59413b] mt-1 font-medium">
                    {currentDelivery.restaurantAddress || '742 Evergreen Terrace, Springfield'}
                  </p>
                </div>

                {/* Drop off */}
                <div className="bg-[#ffdea7] border-2 border-[#231916] rounded-xl p-4 shadow-[2px_2px_0px_#231916]">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#231916] mb-1">
                    <span className="material-symbols-outlined text-base">home_pin</span>
                    <span>2. Deliver To</span>
                  </div>
                  <h4 className="font-headline-sm font-black uppercase text-sm text-[#231916]">
                    {currentDelivery.customerName || 'Hungry Diner Guest'}
                  </h4>
                  <p className="text-xs text-[#59413b] mt-1 font-medium">
                    {currentDelivery.dropAddress || 'Customer Address'}
                  </p>
                  {currentDelivery.customerPhone && (
                    <p className="text-xs text-[#8d716a] font-mono mt-1 font-bold">
                      ☎ {currentDelivery.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Manifest summary */}
              {currentDelivery.items && currentDelivery.items.length > 0 && (
                <div className="text-xs font-medium text-[#59413b] bg-[#fff8f6] border border-[#231916] p-2.5 rounded-lg flex flex-wrap gap-2">
                  <span className="font-bold text-[#231916] uppercase">Manifest:</span>
                  {currentDelivery.items.map((item, idx) => (
                    <span key={idx} className="bg-[#f7e4de] px-2 py-0.5 rounded border border-[#e8d6d0]">
                      {item.quantity}x {item.menuItemName}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Card */}
            <div className="bg-[#fff8f6] border-2 border-[#231916] rounded-xl p-5 shadow-[3px_3px_0px_#231916] flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="text-xs font-black uppercase text-[#8d716a] tracking-wider block mb-1">
                  CURRENT RUN STAGE
                </span>
                <p className="text-sm font-bold text-[#231916]">
                  {currentDelivery.status === 'ASSIGNED'
                    ? 'Drive to the diner and pick up the freshly packed order.'
                    : 'Ride to customer location and safely hand off the diner bag.'}
                </p>
              </div>

              <div className="space-y-2">
                {currentDelivery.status === 'ASSIGNED' ? (
                  <button
                    onClick={() => handleMarkPickedUp(currentDelivery.id)}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#fdc65c] text-[#231916] font-black font-label-md text-sm uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">takeout_dining</span>
                    <span>{updating ? 'Updating...' : 'Mark Picked Up'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedDelivery(currentDelivery);
                      setConfirmModalOpen(true);
                    }}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#5e7d56] text-[#f8fff0] font-black font-label-md text-sm uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#4d6846] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Mark Delivered</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/delivery/deliveries')}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#f7e4de] text-[#231916] font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#ffece6] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <span>Open Full Route & Drops</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#f7e4de] border-2 border-[#231916] shadow-[2px_2px_0px_#231916] flex items-center justify-center mx-auto text-[#cb4926]">
              <span className="material-symbols-outlined text-3xl">sports_motorsports</span>
            </div>
            <div>
              <h3 className="font-headline-md text-lg uppercase font-black text-[#231916]">
                No Active Delivery In Progress
              </h3>
              <p className="text-xs font-medium text-[#59413b] mt-1">
                You are currently idle at the depot. Ready orders are waiting for pickup from the diner kitchen!
              </p>
            </div>
            <button
              onClick={() => navigate('/delivery/available')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#cb4926] text-white font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#b03a19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">search</span>
              <span>Find & Claim Available Run</span>
            </button>
          </div>
        )}
      </div>

      {/* RECENT ROAD TRIPS / RECENT COMPLETED RUNS */}
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916]">
        <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-[#231916]">history</span>
            <h3 className="font-headline-md text-lg uppercase font-black text-[#231916] tracking-wide">
              Recent Road Trips
            </h3>
          </div>
          <button
            onClick={() => navigate('/delivery/history')}
            className="text-xs font-bold uppercase text-[#cb4926] hover:underline cursor-pointer"
          >
            View Full Ledger →
          </button>
        </div>

        {todayDeliveries.length > 0 ? (
          <div className="space-y-3">
            {todayDeliveries.slice(0, 5).map((del) => (
              <div
                key={del.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#f7e4de] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#5e7d56] border-2 border-[#231916] text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#231916]">
                        ORDER #{del.orderId || del.id}
                      </span>
                      <span className="px-1.5 py-0.2 text-[10px] font-extrabold uppercase bg-[#5e7d56] text-[#f8fff0] rounded border border-[#231916]">
                        DELIVERED
                      </span>
                    </div>
                    <p className="text-xs text-[#59413b] font-medium mt-0.5">
                      Dropoff: {del.dropAddress || 'Customer Address'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="font-extrabold text-[#cb4926]">
                    ${del.totalAmount?.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-[#8d716a] font-mono">
                    {del.deliveredAt ? new Date(del.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#59413b] font-medium py-3 text-center">
            No completed deliveries recorded yet today. Complete your first run!
          </p>
        )}
      </div>

      {/* CONFIRM DELIVERED MODAL */}
      <RetroModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Delivery Completion"
      >
        <div className="space-y-4">
          <p className="text-sm font-medium text-[#231916]">
            Are you sure you want to mark Order <strong className="font-mono">#{selectedDelivery?.orderId || selectedDelivery?.id}</strong> as safely delivered to the customer?
          </p>

          <div className="bg-[#f7e4de] border-2 border-[#231916] rounded-xl p-3.5 text-xs space-y-1">
            <p><strong>Customer:</strong> {selectedDelivery?.customerName}</p>
            <p><strong>Address:</strong> {selectedDelivery?.dropAddress}</p>
            <p><strong>Total Amount:</strong> ₹{selectedDelivery?.totalAmount?.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-dashed border-[#231916]">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#f7e4de] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelivered}
              disabled={updating}
              className="px-5 py-2 bg-[#5e7d56] text-[#f8fff0] border-2 border-[#231916] rounded-xl text-xs font-black uppercase shadow-[3px_3px_0px_#231916] hover:bg-[#4d6846] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              {updating ? 'Marking...' : 'Yes, Confirm Delivered!'}
            </button>
          </div>
        </div>
      </RetroModal>
    </div>
  );
}
