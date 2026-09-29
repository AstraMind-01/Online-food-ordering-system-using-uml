import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { deliveryService, deliveryLocationService } from '../../services/api';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';
import RetroModal from '../../components/restaurant/RetroModal';

export default function DeliveryActive() {
  const navigate = useNavigate();
  const { refreshData } = useOutletContext();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const fetchActiveDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await deliveryService.getAssigned();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching assigned deliveries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveDeliveries();

    const interval = setInterval(() => {
      fetchActiveDeliveries();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchActiveDeliveries]);

  // Handle Mark Picked Up
  const handleMarkPickedUp = async (deliveryId) => {
    setUpdatingId(deliveryId);
    try {
      await deliveryService.updateStatus(deliveryId, 'PICKED_UP');
      // Record initial diner depot coordinate
      try {
        await deliveryLocationService.recordLocation(deliveryId, {
          latitude: 30.2672,
          longitude: -97.7431,
          heading: 45.0,
          speed: 25.0,
        });
      } catch (locErr) {
        console.warn('Initial GPS ping failed:', locErr);
      }
      setSuccessToast('Order picked up! Food is now OUT FOR DELIVERY on Route 66.');
      await fetchActiveDeliveries();
      if (refreshData) refreshData();
    } catch (err) {
      console.error('Failed to mark picked up:', err);
      alert(err.response?.data?.message || 'Failed to update delivery status to Picked Up.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Broadcast simulated or active GPS waypoint along Route 66
  const handleSendGpsPing = async (deliveryId) => {
    try {
      const randomProgress = 0.35 + Math.random() * 0.45;
      const lat = 30.2672 + (30.2849 - 30.2672) * randomProgress;
      const lng = -97.7431 + (-97.7341 - -97.7431) * randomProgress;
      await deliveryLocationService.recordLocation(deliveryId, {
        latitude: lat,
        longitude: lng,
        heading: 48.0,
        speed: 32.5,
      });
      setSuccessToast(`📡 Live GPS beacon broadcast to Highway 66 (${(randomProgress * 100).toFixed(0)}% to dropoff)!`);
    } catch (err) {
      console.warn('GPS ping failed:', err);
    }
  };

  // Open Confirm Delivered Modal
  const openConfirmDelivered = (delivery) => {
    setSelectedDelivery(delivery);
    setConfirmModalOpen(true);
  };

  // Handle Mark Delivered
  const handleConfirmDelivered = async () => {
    if (!selectedDelivery) return;
    setUpdatingId(selectedDelivery.id);
    try {
      await deliveryService.updateStatus(selectedDelivery.id, 'DELIVERED');
      setConfirmModalOpen(false);
      setSelectedDelivery(null);
      setSuccessToast('Delivery completed successfully! Great job on Route 66.');
      await fetchActiveDeliveries();
      if (refreshData) refreshData();
    } catch (err) {
      console.error('Failed to mark delivered:', err);
      alert(err.response?.data?.message || 'Failed to complete delivery.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#231916]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#fdc65c] border border-[#231916]"></span>
            <span className="font-label-sm text-xs uppercase font-extrabold text-[#231916] tracking-wider">
              ACTIVE RUNS ON THE ROAD
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-black uppercase text-[#231916] tracking-wide">
            My Active Deliveries
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#59413b] mt-0.5">
            Follow the sequential stages: Pick up at diner kitchen, then deliver hot to customer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-[#fdc65c] border-2 border-[#231916] rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_#231916]">
            {deliveries.length} Active Run{deliveries.length === 1 ? '' : 's'}
          </div>

          <button
            onClick={fetchActiveDeliveries}
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

      {/* Success Toast */}
      {successToast && (
        <div className="bg-[#e4f3de] border-2 border-[#231916] p-4 rounded-xl shadow-[3px_3px_0px_#231916] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5e7d56] font-bold">check_circle</span>
            <span className="text-sm font-bold text-[#231916]">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast('')}
            className="text-xs font-bold uppercase underline hover:text-[#cb4926] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Deliveries List */}
      {deliveries.length > 0 ? (
        <div className="space-y-6">
          {deliveries.map((delivery) => {
            const isPickedUp = delivery.status === 'PICKED_UP';
            const isMultiDrop = delivery.deliveryType === 'GROUP_INDIVIDUAL';
            const isGroupCommon = delivery.deliveryType === 'GROUP_COMMON';

            return (
              <div
                key={delivery.id}
                className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 lg:p-7 shadow-[5px_5px_0px_#231916] space-y-6"
              >
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-[#231916]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-black text-base px-3 py-1 bg-[#231916] text-[#fff8f6] rounded-lg">
                      ORDER #{delivery.orderId || delivery.id}
                    </span>

                    {/* Stage Badge */}
                    <span className={`px-3 py-1 text-xs font-black uppercase rounded-lg border-2 border-[#231916] shadow-[2px_2px_0px_#231916] ${
                      isPickedUp
                        ? 'bg-[#fdc65c] text-[#231916]'
                        : 'bg-[#ffdea7] text-[#231916]'
                    }`}>
                      {isPickedUp ? '⚡ STAGE 2: OUT FOR DELIVERY' : '📦 STAGE 1: PICKUP PENDING'}
                    </span>

                    {/* Delivery Type Badge */}
                    <span className={`px-2.5 py-1 text-xs font-black uppercase rounded-lg border border-[#231916] ${
                      isMultiDrop
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : isGroupCommon
                        ? 'bg-[#ffdea7] text-[#231916]'
                        : 'bg-[#f7e4de] text-[#231916]'
                    }`}>
                      {isMultiDrop ? '👥 Group Multi-Drop' : isGroupCommon ? '👥 Group Common Drop' : '👤 Single Order'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase text-[#8d716a]">
                      Bill Amount:
                    </span>
                    <span className="font-headline-lg text-2xl font-black text-[#cb4926]">
                      ₹{delivery.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                {/* Road Steps Indicator */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#f7e4de] border-2 border-[#231916] rounded-xl text-center">
                  <div className={`p-2 rounded-lg border border-[#231916] font-bold text-xs uppercase ${
                    !isPickedUp ? 'bg-[#fdc65c] text-[#231916] shadow-[2px_2px_0px_#231916]' : 'bg-[#e4f3de] text-[#5e7d56]'
                  }`}>
                    {isPickedUp ? '✓ 1. Picked Up from Diner' : '▶ 1. Head to Diner for Pickup'}
                  </div>
                  <div className={`p-2 rounded-lg border border-[#231916] font-bold text-xs uppercase ${
                    isPickedUp ? 'bg-[#5e7d56] text-[#f8fff0] shadow-[2px_2px_0px_#231916] animate-pulse' : 'bg-[#fff8f6] text-[#8d716a]'
                  }`}>
                    {isPickedUp ? '▶ 2. In Transit to Customer' : '2. Awaiting Pickup First'}
                  </div>
                </div>

                {/* Waypoints & Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Pickup Depot / Diner */}
                  <div className="bg-[#f7e4de] border-2 border-[#231916] rounded-xl p-4 shadow-[3px_3px_0px_#231916] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase text-[#cb4926] flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">storefront</span>
                          Pickup Spot
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#fff8f6] border border-[#231916] rounded">
                          Diner Kitchen
                        </span>
                      </div>
                      <h4 className="font-headline-sm font-black text-base uppercase text-[#231916]">
                        {delivery.restaurantName || 'Chow Chow Retro Diner & Eats'}
                      </h4>
                      <p className="text-xs text-[#59413b] font-medium mt-1">
                        {delivery.restaurantAddress || '742 Evergreen Terrace, Springfield'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-[#231916] flex items-center gap-2">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(delivery.restaurantAddress || '742 Evergreen Terrace')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-[#fff8f6] border border-[#231916] rounded-lg text-[11px] font-bold uppercase hover:bg-[#fff1ec] flex items-center gap-1 shadow-[1px_1px_0px_#231916]"
                      >
                        <span className="material-symbols-outlined text-sm">navigation</span>
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>

                  {/* Customer Drop Location */}
                  <div className="bg-[#ffdea7] border-2 border-[#231916] rounded-xl p-4 shadow-[3px_3px_0px_#231916] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase text-[#231916] flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">home_pin</span>
                          Delivery Destination
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#fff8f6] border border-[#231916] rounded">
                          {isMultiDrop ? 'Multi-Stop' : 'Direct Drop'}
                        </span>
                      </div>
                      <h4 className="font-headline-sm font-black text-base uppercase text-[#231916]">
                        {delivery.customerName || 'Customer'}
                      </h4>
                      <p className="text-xs text-[#59413b] font-medium mt-1">
                        {delivery.dropAddress || 'Address on file'}
                      </p>
                      {delivery.customerPhone && (
                        <p className="text-xs font-mono font-bold text-[#231916] mt-1">
                          ☎ {delivery.customerPhone}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-[#231916] flex items-center gap-2">
                      {delivery.customerPhone && (
                        <a
                          href={`tel:${delivery.customerPhone}`}
                          className="px-2.5 py-1 bg-[#fff8f6] border border-[#231916] rounded-lg text-[11px] font-bold uppercase hover:bg-[#fff1ec] flex items-center gap-1 shadow-[1px_1px_0px_#231916]"
                        >
                          <span className="material-symbols-outlined text-sm">call</span>
                          <span>Call Guest</span>
                        </a>
                      )}
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(delivery.dropAddress || '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-[#fff8f6] border border-[#231916] rounded-lg text-[11px] font-bold uppercase hover:bg-[#fff1ec] flex items-center gap-1 shadow-[1px_1px_0px_#231916]"
                      >
                        <span className="material-symbols-outlined text-sm">navigation</span>
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* MULTI-DROP DETAILS FOR GROUP INDIVIDUAL */}
                {isMultiDrop && delivery.groupDrops && delivery.groupDrops.length > 0 && (
                  <div className="bg-[#fff1ec] border-2 border-[#231916] rounded-xl p-5 shadow-[3px_3px_0px_#231916]">
                    <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#231916] mb-3">
                      <span className="text-xs font-black uppercase text-[#cb4926] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">fork_right</span>
                        Multi-Drop Stop Breakdown ({delivery.groupDrops.length} Addresses)
                      </span>
                      <span className="text-[11px] font-bold text-[#8d716a] uppercase">
                        Group Individual Mode
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {delivery.groupDrops.map((drop, idx) => (
                        <div
                          key={idx}
                          className="bg-[#fff8f6] border-2 border-[#231916] rounded-xl p-3.5 shadow-[2px_2px_0px_#231916] space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-[#231916]">
                              Stop #{idx + 1}: {drop.participantName}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#5e7d56] text-[#f8fff0] rounded border border-[#231916]">
                              {drop.status || 'READY'}
                            </span>
                          </div>

                          <p className="text-xs text-[#59413b] font-medium">
                            📍 {drop.dropAddress}
                          </p>

                          {drop.phone && (
                            <p className="text-[11px] font-mono text-[#8d716a]">
                              ☎ {drop.phone}
                            </p>
                          )}

                          {drop.items && drop.items.length > 0 && (
                            <div className="pt-1.5 border-t border-dashed border-[#e8d6d0] text-[11px] text-[#59413b]">
                              <span className="font-bold">Items: </span>
                              {drop.items.map((it, i) => `${it.quantity}x ${it.menuItemName}`).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items Manifest */}
                {delivery.items && delivery.items.length > 0 && (
                  <div className="bg-[#fff8f6] border-2 border-[#231916] rounded-xl p-4 shadow-[2px_2px_0px_#231916]">
                    <span className="text-xs font-black uppercase text-[#8d716a] block mb-2">
                      Order Manifest ({delivery.items.length} items to hand over):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {delivery.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-[#f7e4de] border border-[#231916] rounded-lg p-2 flex items-center justify-between text-xs"
                        >
                          <span className="font-bold text-[#231916]">
                            {item.quantity}x {item.menuItemName}
                          </span>
                          <span className="font-extrabold text-[#cb4926]">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Controls */}
                <div className="pt-4 border-t-2 border-dashed border-[#231916] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#59413b] font-medium">
                    {!isPickedUp ? (
                      <span>Step 1: Check bags at the diner counter and click <strong>Mark Picked Up</strong>.</span>
                    ) : (
                      <span>Step 2: Deliver bags to destination and click <strong>Mark Delivered</strong>.</span>
                    )}
                  </div>

                  <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
                    {!isPickedUp ? (
                      <button
                        onClick={() => handleMarkPickedUp(delivery.id)}
                        disabled={updatingId === delivery.id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#fdc65c] text-[#231916] font-black font-label-md text-sm uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">takeout_dining</span>
                        <span>{updatingId === delivery.id ? 'Updating...' : 'Mark Picked Up'}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSendGpsPing(delivery.id)}
                          title="Simulate or broadcast live GPS coordinates to customer tracker"
                          className="flex items-center justify-center gap-1.5 px-4 py-3 bg-[#fff8f6] text-[#231916] font-black font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#f7e4de] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base text-[#cb4926] animate-pulse">radar</span>
                          <span>Ping GPS</span>
                        </button>

                        <button
                          onClick={() => openConfirmDelivered(delivery)}
                          disabled={updatingId === delivery.id}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#5e7d56] text-[#f8fff0] font-black font-label-md text-sm uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#4d6846] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          <span>{updatingId === delivery.id ? 'Updating...' : 'Mark Delivered'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <RetroEmptyState
          icon="sports_motorsports"
          title="No Active Deliveries In Progress"
          message="Your sidecar is empty and ready for the next run! Head to the Available Orders board to claim a delivery."
          actionText="Browse Available Orders"
          onAction={() => navigate('/delivery/available')}
        />
      )}

      {/* CONFIRM DELIVERED MODAL */}
      <RetroModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Dropoff & Handover"
      >
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#5e7d56] border-2 border-[#231916] text-white flex items-center justify-center text-3xl font-black mx-auto shadow-[3px_3px_0px_#231916]">
            ★
          </div>
          <div className="text-center">
            <h4 className="font-headline-md text-lg uppercase font-black text-[#231916]">
              Complete Order #{selectedDelivery?.orderId || selectedDelivery?.id}
            </h4>
            <p className="text-xs text-[#59413b] font-medium mt-1">
              Have you safely handed the diner food bags to <strong>{selectedDelivery?.customerName}</strong> at <strong>{selectedDelivery?.dropAddress}</strong>?
            </p>
          </div>

          <div className="bg-[#f7e4de] border-2 border-[#231916] rounded-xl p-3.5 text-xs space-y-1">
            <p><strong>Customer:</strong> {selectedDelivery?.customerName}</p>
            <p><strong>Address:</strong> {selectedDelivery?.dropAddress}</p>
            <p><strong>Total Value:</strong> ₹{selectedDelivery?.totalAmount?.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-dashed border-[#231916]">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] rounded-xl text-xs font-bold uppercase shadow-[2px_2px_0px_#231916] hover:bg-[#f7e4de] cursor-pointer"
            >
              Not Yet
            </button>
            <button
              onClick={handleConfirmDelivered}
              disabled={updatingId === selectedDelivery?.id}
              className="px-5 py-2 bg-[#5e7d56] text-[#f8fff0] border-2 border-[#231916] rounded-xl text-xs font-black uppercase shadow-[3px_3px_0px_#231916] hover:bg-[#4d6846] cursor-pointer"
            >
              {updatingId === selectedDelivery?.id ? 'Completing...' : 'Yes, Handed Off!'}
            </button>
          </div>
        </div>
      </RetroModal>
    </div>
  );
}
