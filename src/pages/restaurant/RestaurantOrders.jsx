import React, { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services/api';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';
import RetroModal from '../../components/restaurant/RetroModal';

const TABS = [
  { id: 'ALL', label: 'All Orders' },
  { id: 'NEW', label: 'New / Placed', statusKey: 'PLACED' },
  { id: 'CONFIRMED', label: 'Confirmed', statusKey: 'CONFIRMED' },
  { id: 'PREPARING', label: 'Preparing', statusKey: 'PREPARING' },
  { id: 'READY_FOR_PICKUP', label: 'Ready for Pickup', statusKey: 'READY_FOR_PICKUP' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', statusKey: 'OUT_FOR_DELIVERY' },
  { id: 'DELIVERED', label: 'Delivered', statusKey: 'DELIVERED' },
  { id: 'CANCELLED', label: 'Cancelled', statusKey: 'CANCELLED' },
];

export default function RestaurantOrders() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Reject order modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'ALL') return true;
    const tabObj = TABS.find((t) => t.id === activeTab);
    return tabObj ? order.status === tabObj.statusKey : true;
  });

  // Handle status update
  const handleTransition = async (orderId, newStatus) => {
    setActionLoadingId(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update order status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectDialog = (order) => {
    setRejectingOrder(order);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectingOrder) return;
    setActionLoadingId(rejectingOrder.id);
    setRejectModalOpen(false);
    try {
      await orderService.updateStatus(rejectingOrder.id, 'CANCELLED');
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not reject order');
    } finally {
      setActionLoadingId(null);
      setRejectingOrder(null);
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return { text: '★ NEW TICKET', color: 'bg-[#fdc65c] text-[#231916]' };
      case 'CONFIRMED':
        return { text: 'CONFIRMED', color: 'bg-[#caecbe] text-[#062105]' };
      case 'PREPARING':
        return { text: 'IN KITCHEN', color: 'bg-[#ffdea7] text-[#271900]' };
      case 'READY_FOR_PICKUP':
        return { text: 'READY FOR DRIVER', color: 'bg-[#5e7d56] text-white' };
      case 'OUT_FOR_DELIVERY':
        return { text: 'OUT FOR DELIVERY', color: 'bg-[#e8d6d0] text-[#231916]' };
      case 'DELIVERED':
        return { text: 'DELIVERED', color: 'bg-[#5e7d56] text-white' };
      case 'CANCELLED':
        return { text: 'CANCELLED', color: 'bg-[#ffdad6] text-[#93000a]' };
      default:
        return { text: status, color: 'bg-[#f1dfd8] text-[#231916]' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm bg-[#ffdea7] text-[#231916] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
            ★ KITCHEN ORDER TICKETS
          </span>
          <h1 className="font-headline-xl text-3xl font-black uppercase text-[#231916] tracking-tight mt-1">
            Order Lifecycle Manager
          </h1>
          <p className="font-body-md text-sm text-[#59413b]">
            Strict state machine transitions: <code className="text-xs bg-[#f7e4de] px-1.5 py-0.5 rounded font-mono border border-[#231916]">Placed → Confirmed → Preparing → Ready for Pickup</code>
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-bold font-label-md text-xs uppercase rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TABS.map((tab) => {
          const count = orders.filter((o) => (tab.id === 'ALL' ? true : o.status === tab.statusKey)).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-label-md uppercase whitespace-nowrap border-2 border-[#231916] transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#fdc65c] text-[#231916] shadow-[3px_3px_0px_#231916] translate-y-[-2px]'
                  : 'bg-[#fff8f6] text-[#59413b] hover:bg-[#fff1ec] shadow-[2px_2px_0px_#231916]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black border border-[#231916] ${isActive ? 'bg-[#231916] text-white' : 'bg-[#f7e4de] text-[#231916]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ORDERS GRID */}
      {loading ? (
        <div className="p-12 text-center text-sm font-bold text-[#59413b]">
          Spinning up kitchen tickets...
        </div>
      ) : filteredOrders.length === 0 ? (
        <RetroEmptyState
          icon="receipt"
          title="No Orders in this Status"
          message={`There are currently no tickets matching "${TABS.find((t) => t.id === activeTab)?.label}". Check other tabs or wait for new incoming orders!`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isActing = actionLoadingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916] flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b-2 border-dashed border-[#231916]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline-md text-base font-black text-[#231916]">
                          #{order.orderNumber || `ORD-${order.id}`}
                        </span>
                      </div>
                      <span className="text-xs text-[#59413b] font-medium block mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916] ${badge.color}`}
                    >
                      {badge.text}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="py-3 border-b border-[#f1dfd8]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#231916]">
                      <span className="material-symbols-outlined text-base text-[#cb4926]">person</span>
                      <span>{order.customerName || 'Diner Customer'}</span>
                    </div>
                    {order.deliveryAddress && (
                      <div className="flex items-start gap-2 text-[11px] text-[#59413b] mt-1">
                        <span className="material-symbols-outlined text-sm text-[#8d716a]">location_on</span>
                        <span className="line-clamp-1">{order.deliveryAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="py-3 space-y-2">
                    <span className="font-label-sm text-[10px] uppercase font-bold text-[#8d716a] tracking-wider block">
                      Ordered Dishes:
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-[#231916]">
                              <strong className="text-[#cb4926] font-bold mr-1">{item.quantity}x</strong>
                              {item.foodItemName}
                            </span>
                            <span className="font-mono text-[#59413b]">
                              ${((item.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs italic text-[#8d716a]">Diner Special Combo</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price and Action Transition Buttons */}
                <div className="pt-3 border-t-2 border-dashed border-[#231916] mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold font-label-md uppercase text-[#59413b]">Grand Total:</span>
                    <span className="font-headline-lg text-lg font-black text-[#cb4926]">
                      ₹{order.totalAmount?.toFixed(2)}
                    </span>
                  </div>

                  {/* Action Transition Buttons */}
                  <div className="space-y-2">
                    {order.status === 'PLACED' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={isActing}
                          onClick={() => handleTransition(order.id, 'CONFIRMED')}
                          className="w-full py-2 bg-[#5e7d56] text-[#f8fff0] font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#46633f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          {isActing ? '...' : '✓ ACCEPT'}
                        </button>
                        <button
                          disabled={isActing}
                          onClick={() => openRejectDialog(order)}
                          className="w-full py-2 bg-[#ffdad6] text-[#93000a] font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] hover:bg-[#ffb4a1] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        >
                          ✕ REJECT
                        </button>
                      </div>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <button
                        disabled={isActing}
                        onClick={() => handleTransition(order.id, 'PREPARING')}
                        className="w-full py-2.5 bg-[#fdc65c] text-[#231916] font-extrabold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">skillet</span>
                        <span>{isActing ? 'Updating...' : 'START PREPARING'}</span>
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        disabled={isActing}
                        onClick={() => handleTransition(order.id, 'READY_FOR_PICKUP')}
                        className="w-full py-2.5 bg-[#caecbe] text-[#062105] font-extrabold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#aed0a3] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">done_all</span>
                        <span>{isActing ? 'Updating...' : 'MARK READY FOR PICKUP'}</span>
                      </button>
                    )}

                    {order.status === 'READY_FOR_PICKUP' && (
                      <div className="p-2.5 bg-[#ffdea7] border-2 border-[#231916] rounded-xl text-center">
                        <span className="text-[11px] font-bold text-[#271900] uppercase block">
                          Waiting for Courier Pickup
                        </span>
                        <span className="text-[10px] text-[#5e4200]">
                          Driver notified • Read-only
                        </span>
                      </div>
                    )}

                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <div className="p-2.5 bg-[#caecbe] border-2 border-[#231916] rounded-xl text-center">
                        <span className="text-[11px] font-bold text-[#062105] uppercase block">
                          Dispatched with Driver
                        </span>
                        <span className="text-[10px] text-[#314e2c]">
                          In-transit to destination • Read-only
                        </span>
                      </div>
                    )}

                    {order.status === 'DELIVERED' && (
                      <div className="p-2 bg-[#5e7d56] text-white border-2 border-[#231916] rounded-xl text-center">
                        <span className="text-[11px] font-extrabold uppercase">
                          ✓ Order Completed
                        </span>
                      </div>
                    )}

                    {order.status === 'CANCELLED' && (
                      <div className="p-2 bg-[#ffdad6] text-[#93000a] border-2 border-[#231916] rounded-xl text-center">
                        <span className="text-[11px] font-bold uppercase">
                          Order Cancelled (Refunded)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REJECT ORDER MODAL */}
      <RetroModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject & Cancel Order"
      >
        <div className="space-y-4">
          <p className="font-body-md text-sm text-[#59413b]">
            Are you sure you want to reject order <strong>#{rejectingOrder?.orderNumber || rejectingOrder?.id}</strong>? The customer will be notified and their payment will be automatically refunded.
          </p>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Reason for Cancellation (Optional):
            </label>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Out of bacon relish, grill maintenance..."
              className="w-full px-3 py-2 text-sm bg-white border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] focus:outline-none focus:bg-[#fff8f6]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-dashed border-[#231916]">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-bold font-label-md text-xs uppercase rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={confirmReject}
              className="px-4 py-2 bg-[#cb4926] text-white font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              Confirm Rejection & Refund
            </button>
          </div>
        </div>
      </RetroModal>
    </div>
  );
}
