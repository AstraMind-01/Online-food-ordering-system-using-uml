import React, { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../../services/api';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';

export default function RestaurantPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentService.getAll();
      setPayments(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return { text: 'PAID', color: 'bg-[#caecbe] text-[#062105]' };
      case 'PENDING':
        return { text: 'PENDING', color: 'bg-[#ffdea7] text-[#271900]' };
      case 'REFUNDED':
        return { text: 'REFUNDED', color: 'bg-[#ffdad6] text-[#93000a]' };
      case 'FAILED':
        return { text: 'FAILED', color: 'bg-[#ffdad6] text-[#93000a]' };
      default:
        return { text: status, color: 'bg-[#f1dfd8] text-[#231916]' };
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalRefunded = payments
    .filter((p) => p.status === 'REFUNDED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm bg-[#caecbe] text-[#062105] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
            ★ CASH REGISTER & LEDGER
          </span>
          <h1 className="font-headline-xl text-3xl font-black uppercase text-[#231916] tracking-tight mt-1">
            Diner Payment Transactions
          </h1>
          <p className="font-body-md text-sm text-[#59413b]">
            Simulated settlement log for individual diner tickets and collaborative booth splittings.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="px-4 py-2 bg-[#fff8f6] border-2 border-[#231916] text-[#231916] font-bold font-label-md text-xs uppercase rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fff8f6] border-2 border-[#231916] rounded-xl p-4 shadow-[2px_2px_0px_#231916]">
          <span className="font-label-sm text-[11px] uppercase font-bold text-[#59413b] block">Total Settled</span>
          <span className="font-headline-lg text-2xl font-black text-[#5e7d56]">₹{totalPaid.toFixed(2)}</span>
        </div>
        <div className="bg-[#fff8f6] border-2 border-[#231916] rounded-xl p-4 shadow-[2px_2px_0px_#231916]">
          <span className="font-label-sm text-[11px] uppercase font-bold text-[#59413b] block">Total Refunded</span>
          <span className="font-headline-lg text-2xl font-black text-[#cb4926]">₹{totalRefunded.toFixed(2)}</span>
        </div>
        <div className="bg-[#fff8f6] border-2 border-[#231916] rounded-xl p-4 shadow-[2px_2px_0px_#231916]">
          <span className="font-label-sm text-[11px] uppercase font-bold text-[#59413b] block">Transactions Count</span>
          <span className="font-headline-lg text-2xl font-black text-[#231916]">{payments.length}</span>
        </div>
      </div>

      {/* Payments Table with Thick Outlines */}
      <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl shadow-[4px_4px_0px_#231916] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm font-bold text-[#59413b]">
            Auditing cash register transactions...
          </div>
        ) : payments.length === 0 ? (
          <RetroEmptyState
            icon="payments"
            title="No Transactions Logged"
            message="No payment transactions recorded yet. When customers check out orders, payments will appear in this ledger."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7e4de] border-b-[2.5px] border-[#231916] font-label-md text-xs uppercase font-black text-[#231916]">
                  <th className="py-3.5 px-4 border-r-2 border-[#231916]">Order ID</th>
                  <th className="py-3.5 px-4 border-r-2 border-[#231916]">Customer / Ref</th>
                  <th className="py-3.5 px-4 border-r-2 border-[#231916]">Amount</th>
                  <th className="py-3.5 px-4 border-r-2 border-[#231916]">Payment Method</th>
                  <th className="py-3.5 px-4 border-r-2 border-[#231916]">Status Tag</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[#231916] font-body-sm text-xs">
                {payments.map((p) => {
                  const badge = getStatusBadge(p.status);
                  return (
                    <tr key={p.id} className="hover:bg-[#fff1ec] transition-colors">
                      <td className="py-3.5 px-4 border-r-2 border-[#231916] font-bold font-mono text-[#231916]">
                        #{p.orderId ? `ORD-${p.orderId}` : `TXN-${p.id}`}
                      </td>
                      <td className="py-3.5 px-4 border-r-2 border-[#231916]">
                        <span className="font-bold text-[#231916] block">
                          {p.customerName || 'Diner Customer'}
                        </span>
                        {p.transactionRef && (
                          <span className="font-mono text-[10px] text-[#8d716a]">
                            {p.transactionRef}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 border-r-2 border-[#231916] font-headline-md text-sm font-black text-[#cb4926]">
                        ₹{p.amount?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 border-r-2 border-[#231916] font-bold uppercase text-[#59413b]">
                        {p.method || 'CARD'}
                      </td>
                      <td className="py-3.5 px-4 border-r-2 border-[#231916]">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-black uppercase font-label-sm border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916] ${badge.color}`}
                        >
                          {badge.text}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#59413b]">
                        {p.paidAt ? new Date(p.paidAt).toLocaleString() : 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
