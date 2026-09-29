import React, { useState, useEffect, useCallback } from 'react';
import { deliveryService } from '../../services/api';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';

export default function RestaurantDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getAll();
      setDeliveries(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 15000);
    return () => clearInterval(interval);
  }, [fetchDeliveries]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return { text: 'COURIER ASSIGNED', color: 'bg-[#ffdea7] text-[#271900]' };
      case 'PICKED_UP':
        return { text: 'OUT ON ROAD', color: 'bg-[#fdc65c] text-[#231916]' };
      case 'DELIVERED':
        return { text: 'SUCCESSFULLY DELIVERED', color: 'bg-[#caecbe] text-[#062105]' };
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
          <span className="px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm bg-[#caecbe] text-[#062105] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
            ★ COURIER DISPATCH MONITOR
          </span>
          <h1 className="font-headline-xl text-3xl font-black uppercase text-[#231916] tracking-tight mt-1">
            Active Deliveries Tracking
          </h1>
          <p className="font-body-md text-sm text-[#59413b]">
            Real-time status of delivery partners picking up bagged griddle orders and transporting them to hungry customers. (Read-only)
          </p>
        </div>

        <button
          onClick={fetchDeliveries}
          className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-bold font-label-md text-xs uppercase rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          <span>Refresh Dispatches</span>
        </button>
      </div>

      {/* Deliveries List */}
      {loading ? (
        <div className="p-12 text-center text-sm font-bold text-[#59413b]">
          Tracking delivery motorcycles and cars...
        </div>
      ) : deliveries.length === 0 ? (
        <RetroEmptyState
          icon="two_wheeler"
          title="No Active Dispatches"
          message="When kitchen tickets reach 'READY FOR PICKUP', couriers will be assigned automatically and their live trip details will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveries.map((del) => {
            const badge = getStatusBadge(del.status);

            return (
              <div
                key={del.id}
                className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-5 shadow-[4px_4px_0px_#231916] flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b-2 border-dashed border-[#231916]">
                    <div>
                      <span className="font-headline-md text-base font-black text-[#231916]">
                        Ticket #{del.orderId ? `ORD-${del.orderId}` : del.id}
                      </span>
                      <span className="text-xs text-[#59413b] font-medium block">
                        Assigned: {del.assignedAt ? new Date(del.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-black uppercase font-label-sm border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916] ${badge.color}`}
                    >
                      {badge.text}
                    </span>
                  </div>

                  {/* Delivery Partner Details */}
                  <div className="py-3 border-b border-[#f1dfd8] space-y-1.5">
                    <span className="font-label-sm text-[10px] uppercase font-bold text-[#8d716a] tracking-wider block">
                      Assigned Courier:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#fdc65c] border-2 border-[#231916] flex items-center justify-center font-black text-xs">
                        🏍️
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#231916] block">
                          {del.deliveryPartnerName || 'Assigned Courier'}
                        </span>
                        <span className="text-[11px] text-[#59413b]">
                          {del.deliveryPartnerPhone || 'Road Partner'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Destination Address */}
                  <div className="py-3">
                    <span className="font-label-sm text-[10px] uppercase font-bold text-[#8d716a] tracking-wider block mb-1">
                      Customer Drop-off Location:
                    </span>
                    <div className="p-2.5 bg-[#fff1ec] border border-[#231916] rounded-lg text-xs font-medium text-[#231916] flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#cb4926] mt-0.5">place</span>
                      <span>{del.deliveryAddress || 'Standard Delivery Route'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Timestamps */}
                <div className="pt-3 border-t-2 border-dashed border-[#231916] text-[11px] text-[#59413b] flex items-center justify-between">
                  <span>{del.pickedUpAt ? `Picked up: ${new Date(del.pickedUpAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Awaiting pickup'}</span>
                  {del.deliveredAt && (
                    <span className="text-[#5e7d56] font-bold">
                      ✓ Delivered
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
