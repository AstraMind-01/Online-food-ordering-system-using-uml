import React, { useState, useEffect, useCallback } from 'react';
import { groupOrderService } from '../../services/api';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';
import RetroModal from '../../components/restaurant/RetroModal';

export default function RestaurantGroupOrders() {
  const [groupOrders, setGroupOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchGroupOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await groupOrderService.getAll();
      setGroupOrders(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroupOrders();
    const interval = setInterval(fetchGroupOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchGroupOrders]);

  const handleAction = async (groupOrderId, action, reason) => {
    setActionLoadingId(groupOrderId);
    try {
      const res = await groupOrderService.restaurantAction(groupOrderId, action, reason);
      alert(res?.message || `Group order ${action.toLowerCase()}ed.`);
      await fetchGroupOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not process action');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openReviewModal = (grp) => {
    setReviewOrder(grp);
    setReviewModalOpen(true);
  };

  const openRejectModal = (grp) => {
    setRejectingOrder(grp);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectingOrder) return;
    setRejectModalOpen(false);
    await handleAction(rejectingOrder.id, 'REJECT', rejectReason || 'Kitchen unavailable');
    setRejectingOrder(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm bg-[#fdc65c] text-[#231916] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
            ★ COLLABORATIVE BOOTHS
          </span>
          <h1 className="font-headline-xl text-3xl font-black uppercase text-[#231916] tracking-tight mt-1">
            Group Order Dispatch
          </h1>
          <p className="font-body-md text-sm text-[#59413b]">
            Review shared carts, verify kitchen capacity, and approve or refund collective booth sessions.
          </p>
        </div>

        <button
          onClick={fetchGroupOrders}
          className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-bold font-label-md text-xs uppercase rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          <span>Refresh Booths</span>
        </button>
      </div>

      {/* GROUP ORDERS LIST */}
      {loading ? (
        <div className="p-12 text-center text-sm font-bold text-[#59413b]">
          Loading collaborative booth orders...
        </div>
      ) : groupOrders.length === 0 ? (
        <RetroEmptyState
          icon="groups"
          title="No Active Group Orders"
          message="No customer booths have placed collaborative orders yet. When road-trippers invite friends and submit a shared cart, it appears right here!"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupOrders.map((grp) => {
            const isActing = actionLoadingId === grp.id;
            const isLockedOrPlaced = grp.status === 'LOCKED' || grp.status === 'PLACED';

            return (
              <div
                key={grp.id}
                className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col justify-between"
              >
                <div>
                  {/* Booth Header */}
                  <div className="flex items-start justify-between pb-3 border-b-2 border-dashed border-[#231916]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-xs font-black uppercase bg-[#fdc65c] text-[#231916] border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916]">
                          {grp.groupCode}
                        </span>
                        <h3 className="font-headline-md text-lg font-black text-[#231916]">
                          {grp.name || 'Road Trip Diner Booth'}
                        </h3>
                      </div>
                      <span className="text-xs text-[#59413b] font-medium block mt-1">
                        Host: <strong>{grp.organizerName || 'Customer'}</strong>
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916] ${
                          grp.deliveryMode === 'COMMON'
                            ? 'bg-[#caecbe] text-[#062105]'
                            : 'bg-[#ffdea7] text-[#271900]'
                        }`}
                      >
                        {grp.deliveryMode === 'COMMON' ? 'COMMON ADDRESS' : 'INDIVIDUAL ADDRESSES'}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#8d716a]">
                        STATUS: {grp.status}
                      </span>
                    </div>
                  </div>

                  {/* Members & Items Breakdown */}
                  <div className="py-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#231916]">
                      <span>Booth Members ({grp.members?.length || 1}):</span>
                      <span className="text-[#cb4926]">
                        {grp.cartItems?.length || 0} Total Dishes
                      </span>
                    </div>

                    {/* Member chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {grp.members && grp.members.length > 0 ? (
                        grp.members.map((m) => (
                          <span
                            key={m.id}
                            className="px-2.5 py-1 text-xs font-semibold bg-[#fff1ec] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916] flex items-center gap-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#cb4926]"></span>
                            <span>{m.userName}</span>
                            {m.isOrganizer && (
                              <span className="text-[10px] text-[#cb4926] font-extrabold">(Host)</span>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic text-[#8d716a]">1 Host</span>
                      )}
                    </div>

                    {/* Preview of Cart Items */}
                    <div className="mt-3 p-3 bg-[#fff1ec] border-2 border-[#231916] rounded-xl space-y-1.5 max-h-36 overflow-y-auto">
                      {grp.cartItems && grp.cartItems.length > 0 ? (
                        grp.cartItems.map((ci) => (
                          <div key={ci.id} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-[#231916]">
                              <strong className="text-[#cb4926] mr-1">{ci.quantity}x</strong>
                              {ci.foodItemName}
                              <span className="text-[10px] text-[#8d716a] ml-1.5 font-normal">
                                (by {ci.addedByName})
                              </span>
                            </span>
                            <span className="font-mono text-[#59413b]">
                              ₹{((ci.price || 0) * ci.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs italic text-[#8d716a]">No items added yet</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer with Group Total and Actions */}
                <div className="pt-3 border-t-2 border-dashed border-[#231916]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold font-label-md uppercase text-[#59413b]">
                      Booth Total:
                    </span>
                    <span className="font-headline-lg text-xl font-black text-[#cb4926]">
                      ₹{grp.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => openReviewModal(grp)}
                      className="py-2 bg-[#fff8f6] text-[#231916] font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      REVIEW
                    </button>

                    <button
                      disabled={isActing || grp.status === 'CANCELLED'}
                      onClick={() => handleAction(grp.id, 'ACCEPT')}
                      className={`py-2 font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                        grp.status === 'CANCELLED'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400 shadow-none'
                          : 'bg-[#5e7d56] text-[#f8fff0] hover:bg-[#46633f]'
                      }`}
                    >
                      {isActing ? '...' : 'ACCEPT'}
                    </button>

                    <button
                      disabled={isActing || grp.status === 'CANCELLED'}
                      onClick={() => openRejectModal(grp)}
                      className={`py-2 font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
                        grp.status === 'CANCELLED'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-400 shadow-none'
                          : 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4a1]'
                      }`}
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REVIEW DETAILS MODAL */}
      <RetroModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Booth Review: ${reviewOrder?.groupCode || ''}`}
      >
        {reviewOrder && (
          <div className="space-y-4">
            <div className="p-3 bg-[#fdeae3] border-2 border-[#231916] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-[#8d716a] block">
                  Delivery Mode
                </span>
                <span className="font-bold text-sm text-[#231916]">
                  {reviewOrder.deliveryMode === 'COMMON' ? 'Single Drop-off (Common)' : 'Individual Addresses'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase text-[#8d716a] block">
                  Booth Total
                </span>
                <span className="font-headline-md text-base font-black text-[#cb4926]">
                  ₹{reviewOrder.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Member Addresses (if individual) */}
            {reviewOrder.deliveryMode === 'INDIVIDUAL' && (
              <div>
                <span className="text-xs font-bold uppercase text-[#231916] block mb-1">
                  Member Delivery Addresses:
                </span>
                <div className="space-y-1.5">
                  {reviewOrder.members?.map((m) => (
                    <div key={m.id} className="p-2 bg-white border border-[#231916] rounded-md text-xs">
                      <strong>{m.userName}:</strong> {m.deliveryAddress || 'No address specified'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Line items list */}
            <div>
              <span className="text-xs font-bold uppercase text-[#231916] block mb-1">
                Full Shared Cart:
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {reviewOrder.cartItems?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-white border border-[#231916] rounded-md text-xs">
                    <span>
                      <strong>{item.quantity}x</strong> {item.foodItemName} ({item.addedByName})
                    </span>
                    <span className="font-mono">₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t-2 border-dashed border-[#231916] flex justify-end">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 bg-[#fdc65c] text-[#231916] font-bold text-xs uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#ffdea7]"
              >
                Close Review
              </button>
            </div>
          </div>
        )}
      </RetroModal>

      {/* REJECT & REFUND MODAL */}
      <RetroModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Group Order & Refund Members"
      >
        <div className="space-y-4">
          <p className="font-body-md text-sm text-[#59413b]">
            Rejecting group booth <strong>{rejectingOrder?.groupCode}</strong> will cancel all associated tickets and automatically trigger a full refund for every contributing member.
          </p>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Kitchen Rejection Reason:
            </label>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Griddle at maximum capacity, running low on brioche buns..."
              className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-dashed border-[#231916]">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-bold text-xs uppercase rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#fff1ec]"
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              className="px-4 py-2 bg-[#cb4926] text-white font-bold text-xs uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#a9310f]"
            >
              Confirm Rejection & Refund
            </button>
          </div>
        </div>
      </RetroModal>
    </div>
  );
}
