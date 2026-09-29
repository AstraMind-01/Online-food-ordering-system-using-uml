import React, { useState, useEffect, useCallback } from 'react';
import { deliveryService } from '../../services/api';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';

export default function DeliveryHistory() {
  const [period, setPeriod] = useState('ALL');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async (selectedPeriod) => {
    try {
      setLoading(true);
      const data = await deliveryService.getHistory(selectedPeriod);
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch delivery history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(period);
  }, [fetchHistory, period]);

  // Aggregate stats
  const totalValue = history.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header & Period Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#231916]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#5e7d56] border border-[#231916]"></span>
            <span className="font-label-sm text-xs uppercase font-extrabold text-[#5e7d56] tracking-wider">
              ROAD LOGS & DISPATCH LEDGER
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-black uppercase text-[#231916] tracking-wide">
            Delivery History
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#59413b] mt-0.5">
            Archive of all completed runs, handoffs, and delivered customer meals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-[#f7e4de] p-1.5 rounded-xl border-2 border-[#231916] shadow-[2px_2px_0px_#231916]">
          {[
            { id: 'TODAY', label: 'Today' },
            { id: 'WEEK', label: 'This Week' },
            { id: 'ALL', label: 'All Runs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                period === tab.id
                  ? 'bg-[#231916] text-[#fff8f6] shadow-[1px_1px_0px_#231916]'
                  : 'text-[#59413b] hover:text-[#231916] hover:bg-[#ffece6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Milestone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-xl p-5 shadow-[3px_3px_0px_#231916] flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase text-[#8d716a] block">
              Completed Deliveries ({period === 'TODAY' ? 'Today' : period === 'WEEK' ? 'This Week' : 'All Time'})
            </span>
            <h3 className="font-headline-lg text-3xl font-black text-[#231916] mt-1">
              {history.length} Runs
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#5e7d56] border-2 border-[#231916] text-white flex items-center justify-center font-bold text-xl shadow-[2px_2px_0px_#231916]">
            ✓
          </div>
        </div>

        <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-xl p-5 shadow-[3px_3px_0px_#231916] flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase text-[#8d716a] block">
              Total Order Volume Handled
            </span>
            <h3 className="font-headline-lg text-3xl font-black text-[#cb4926] mt-1">
              ₹{totalValue.toFixed(2)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fdc65c] border-2 border-[#231916] text-[#231916] flex items-center justify-center font-bold text-xl shadow-[2px_2px_0px_#231916]">
            ₹
          </div>
        </div>
      </div>

      {/* History Ledger Table */}
      {history.length > 0 ? (
        <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl shadow-[4px_4px_0px_#231916] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7e4de] border-b-2 border-[#231916] text-xs font-black uppercase text-[#231916]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Delivered Time</th>
                  <th className="py-3 px-4">Customer & Drop Address</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8d6d0] text-xs">
                {history.map((del) => {
                  const isMultiDrop = del.deliveryType === 'GROUP_INDIVIDUAL';
                  const isGroup = del.deliveryType?.startsWith('GROUP');

                  return (
                    <tr key={del.id} className="hover:bg-[#fff1ec] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#231916]">
                        #{del.orderId || del.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#59413b]">
                        {del.deliveredAt
                          ? new Date(del.deliveredAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) +
                            ' ' +
                            new Date(del.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Recorded'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#231916] block uppercase">
                          {del.customerName || 'Customer'}
                        </span>
                        <span className="text-[#59413b] text-[11px] block truncate max-w-xs">
                          {del.dropAddress || 'Address on file'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-[#231916] ${
                          isMultiDrop
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : isGroup
                            ? 'bg-[#ffdea7] text-[#231916]'
                            : 'bg-[#f7e4de] text-[#231916]'
                        }`}>
                          {isMultiDrop ? 'Multi-Drop' : isGroup ? 'Group Common' : 'Single'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#59413b]">
                        {del.items && del.items.length > 0 ? (
                          <span>{del.items.map(it => `${it.quantity}x ${it.menuItemName}`).join(', ')}</span>
                        ) : (
                          <span>1 Meal Package</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-[#cb4926] text-sm">
                        ₹{del.totalAmount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-[#5e7d56] text-[#f8fff0] font-black text-[10px] uppercase rounded border border-[#231916] shadow-[1px_1px_0px_#231916]">
                          DELIVERED
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <RetroEmptyState
          icon="history_edu"
          title={`No Runs Recorded (${period === 'TODAY' ? 'Today' : period === 'WEEK' ? 'This Week' : 'All Time'})`}
          message="Your completed trips and customer drops will appear in this ledger once you mark your deliveries completed."
        />
      )}
    </div>
  );
}
