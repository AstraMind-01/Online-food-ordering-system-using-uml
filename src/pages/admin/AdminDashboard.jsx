import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalRestaurants: 0,
    totalDeliveryPartners: 0,
    totalOrders: 0,
    totalRevenue: 0.0,
    activeDeliveries: 0,
  });
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'users', 'restaurants', 'deliveries', 'payments'
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const statsRes = await adminService.getStats();
      if (statsRes) setStats(statsRes);
    } catch (e) {
      console.error('Failed to load admin stats', e);
    }

    try {
      const [u, o, r, d, p] = await Promise.allSettled([
        adminService.getUsers(),
        adminService.getOrders(),
        adminService.getRestaurants(),
        adminService.getDeliveries(),
        adminService.getPayments(),
      ]);

      if (u.status === 'fulfilled' && Array.isArray(u.value)) setUsers(u.value);
      if (o.status === 'fulfilled' && Array.isArray(o.value)) setOrders(o.value);
      if (r.status === 'fulfilled' && Array.isArray(r.value)) setRestaurants(r.value);
      if (d.status === 'fulfilled' && Array.isArray(d.value)) setDeliveries(d.value);
      if (p.status === 'fulfilled' && Array.isArray(p.value)) setPayments(p.value);
    } catch (err) {
      console.error('Failed to load table datasets', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 12000);
    return () => clearInterval(interval);
  }, [loadAll]);

  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      const updated = await adminService.setUserActive(userId, !currentActive);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, active: !currentActive } : u))
      );
      setActionMsg(`User #${userId} active status changed to ${!currentActive}`);
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setActionMsg('Failed to update user active status');
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner / Title Header */}
      <div className="bg-[#fff8f6] border-[3px] border-[#231916] rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_#231916] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffdea7] text-[#231916] font-black text-xs uppercase border-2 border-[#231916] rounded-full shadow-[2px_2px_0px_#231916] mb-2">
            ★ SYSTEM OVERSEER ★
          </div>
          <h1 className="font-headline-xl text-3xl font-black uppercase tracking-tight text-[#231916]">
            Diner System Operations Console
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-[#59413b] mt-0.5">
            Single Unified Database (MySQL 8 <code className="bg-[#ffdbd1] px-1 py-0.5 rounded font-mono">food_ordering_db</code>) &bull; Live Telemetry Broker
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAll}
            className="px-3.5 py-2 bg-[#fdc65c] text-[#231916] font-bold text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Sync Live DB</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-[#caecbe] text-[#062105] font-bold text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916]">
          ✓ {actionMsg}
        </div>
      )}

      {/* METRIC SCORECARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-[#fff8f6] border-[3px] border-[#231916] rounded-2xl p-4 shadow-[4px_4px_0px_#231916] relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8d716a] text-xs font-bold uppercase mb-1">
            <span>Total System Revenue</span>
            <span className="material-symbols-outlined text-[#cb4926]">payments</span>
          </div>
          <div className="font-headline-xl text-2xl sm:text-3xl font-black text-[#231916]">
            ₹{Number(stats.totalRevenue || 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-[#59413b] mt-1 font-medium">
            Across all diner customer checkouts
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-[#fff8f6] border-[3px] border-[#231916] rounded-2xl p-4 shadow-[4px_4px_0px_#231916] relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8d716a] text-xs font-bold uppercase mb-1">
            <span>Total Orders Placed</span>
            <span className="material-symbols-outlined text-[#cb4926]">receipt_long</span>
          </div>
          <div className="font-headline-xl text-2xl sm:text-3xl font-black text-[#231916]">
            {stats.totalOrders || 0}
          </div>
          <div className="text-[11px] text-[#59413b] mt-1 font-medium">
            Single &amp; Collaborative group feasts
          </div>
        </div>

        {/* Card 3: Active Deliveries */}
        <div className="bg-[#fff8f6] border-[3px] border-[#231916] rounded-2xl p-4 shadow-[4px_4px_0px_#231916] relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8d716a] text-xs font-bold uppercase mb-1">
            <span>Active In-Transit</span>
            <span className="material-symbols-outlined text-[#358b28]">local_shipping</span>
          </div>
          <div className="font-headline-xl text-2xl sm:text-3xl font-black text-[#358b28] flex items-center gap-2">
            <span>{stats.activeDeliveries || 0}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#358b28] animate-ping"></span>
          </div>
          <div className="text-[11px] text-[#59413b] mt-1 font-medium">
            GPS STOMP tracking live on Highway 66
          </div>
        </div>

        {/* Card 4: Platform Users */}
        <div className="bg-[#fff8f6] border-[3px] border-[#231916] rounded-2xl p-4 shadow-[4px_4px_0px_#231916] relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8d716a] text-xs font-bold uppercase mb-1">
            <span>Total Accounts</span>
            <span className="material-symbols-outlined text-[#cb4926]">group</span>
          </div>
          <div className="font-headline-xl text-2xl sm:text-3xl font-black text-[#231916]">
            {stats.totalUsers || 0}
          </div>
          <div className="text-[11px] text-[#59413b] mt-1 font-medium flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 bg-[#caecbe] text-[#062105] rounded text-[10px] font-bold">
              {stats.totalCustomers || 0} Diners
            </span>
            <span className="px-1.5 py-0.5 bg-[#fdc65c] text-[#231916] rounded text-[10px] font-bold">
              {stats.totalRestaurants || 0} Kitchens
            </span>
            <span className="px-1.5 py-0.5 bg-[#ffdbd1] text-[#881f00] rounded text-[10px] font-bold">
              {stats.totalDeliveryPartners || 0} Couriers
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'orders', label: 'All Orders', count: orders.length, icon: 'receipt_long' },
          { key: 'deliveries', label: 'Live Deliveries', count: deliveries.length, icon: 'two_wheeler' },
          { key: 'users', label: 'Registered Users', count: users.length, icon: 'badge' },
          { key: 'restaurants', label: 'Kitchens', count: restaurants.length, icon: 'storefront' },
          { key: 'payments', label: 'Payment Ledger', count: payments.length, icon: 'account_balance' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-xl font-headline-sm text-xs uppercase font-extrabold border-2 border-[#231916] flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#cb4926] text-white shadow-[3px_3px_0px_#231916] translate-x-[-1px] translate-y-[-1px]'
                : 'bg-[#fff8f6] text-[#231916] shadow-[2px_2px_0px_#231916] hover:bg-[#ffece6]'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === tab.key ? 'bg-white text-[#cb4926]' : 'bg-[#ffdea7] text-[#231916]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-[#fff8f6] border-[3px] border-[#231916] rounded-2xl p-5 shadow-[5px_5px_0px_#231916]">
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916]">
              <h2 className="font-headline-lg text-lg uppercase font-black text-[#231916]">
                Global Orders Ledger ({orders.length})
              </h2>
              <span className="text-xs text-[#59413b]">Real-time synchronization</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-[#231916] font-label-md uppercase text-[#8d716a]">
                    <th className="py-2 px-3">Order #</th>
                    <th className="py-2 px-3">Customer</th>
                    <th className="py-2 px-3">Kitchen</th>
                    <th className="py-2 px-3">Drop Lat/Lng</th>
                    <th className="py-2 px-3">Total (₹)</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#231916]/10">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#ffece6]/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#cb4926]">#{ord.id}</td>
                      <td className="py-3 px-3 font-bold text-[#231916]">{ord.customerName}</td>
                      <td className="py-3 px-3 text-[#59413b]">{ord.restaurantName}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#59413b]">
                        {ord.deliveryLatitude?.toFixed(4)}, {ord.deliveryLongitude?.toFixed(4)}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#231916]">
                        ₹{Number(ord.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ffdea7] text-[#231916] border border-[#231916]">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={`/track-order?orderId=${ord.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#fdc65c] text-[#231916] font-bold text-[10px] uppercase border border-[#231916] rounded-lg shadow-[1px_1px_0px_#231916] hover:bg-[#ffdea7]"
                        >
                          <span className="material-symbols-outlined text-xs">location_searching</span>
                          <span>Track Map</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-[#8d716a] italic">
                        No orders recorded in database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DELIVERIES TAB */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916]">
              <h2 className="font-headline-lg text-lg uppercase font-black text-[#231916]">
                Courier Dispatches &amp; Live Waypoints ({deliveries.length})
              </h2>
              <span className="text-xs text-[#59413b]">STOMP over SockJS enabled</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-[#231916] font-label-md uppercase text-[#8d716a]">
                    <th className="py-2 px-3">Dispatch #</th>
                    <th className="py-2 px-3">Order ID</th>
                    <th className="py-2 px-3">Courier Partner</th>
                    <th className="py-2 px-3">Courier Phone</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Picked Up At</th>
                    <th className="py-2 px-3 text-right">Live View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#231916]/10">
                  {deliveries.map((del) => (
                    <tr key={del.id} className="hover:bg-[#ffece6]/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#cb4926]">#{del.id}</td>
                      <td className="py-3 px-3 font-mono font-bold">#{del.orderId}</td>
                      <td className="py-3 px-3 font-bold text-[#231916]">{del.deliveryPartnerName}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#59413b]">
                        {del.deliveryPartnerPhone || 'N/A'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#231916] ${
                            del.status === 'DELIVERED'
                              ? 'bg-[#caecbe] text-[#062105]'
                              : del.status === 'OUT_FOR_DELIVERY' || del.status === 'PICKED_UP'
                              ? 'bg-[#ffdea7] text-[#231916]'
                              : 'bg-[#fff1ec] text-[#231916]'
                          }`}
                        >
                          {del.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#59413b]">
                        {del.pickedUpAt ? new Date(del.pickedUpAt).toLocaleTimeString() : 'Pending'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={`/track-order?orderId=${del.orderId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#358b28] text-white font-bold text-[10px] uppercase border border-[#231916] rounded-lg shadow-[1px_1px_0px_#231916] hover:bg-[#2e7d23]"
                        >
                          <span className="material-symbols-outlined text-xs">radar</span>
                          <span>Watch Transit</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {deliveries.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-[#8d716a] italic">
                        No delivery assignments active.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916]">
              <h2 className="font-headline-lg text-lg uppercase font-black text-[#231916]">
                Directory of Registered Accounts ({users.length})
              </h2>
              <span className="text-xs text-[#59413b]">Full Access Control</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-[#231916] font-label-md uppercase text-[#8d716a]">
                    <th className="py-2 px-3">User ID</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3">Phone</th>
                    <th className="py-2 px-3">Online</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#231916]/10">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-[#ffece6]/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#cb4926]">#{usr.id}</td>
                      <td className="py-3 px-3 font-bold text-[#231916]">{usr.name}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#59413b]">{usr.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#231916] ${
                            usr.role === 'ADMIN'
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : usr.role === 'RESTAURANT'
                              ? 'bg-[#fdc65c] text-[#231916]'
                              : usr.role === 'DELIVERY_PARTNER'
                              ? 'bg-[#caecbe] text-[#062105]'
                              : 'bg-[#ffdea7] text-[#231916]'
                          }`}
                        >
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#59413b]">{usr.phone || '—'}</td>
                      <td className="py-3 px-3">
                        {usr.online ? (
                          <span className="flex items-center gap-1 text-[#358b28] font-bold text-[10px]">
                            <span className="w-2 h-2 rounded-full bg-[#358b28]"></span> Online
                          </span>
                        ) : (
                          <span className="text-[#8d716a] text-[10px]">Offline</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            usr.active ? 'bg-[#caecbe] text-[#062105]' : 'bg-[#ffdad6] text-[#93000a]'
                          }`}
                        >
                          {usr.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleToggleUserActive(usr.id, usr.active)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border border-[#231916] shadow-[1px_1px_0px_#231916] cursor-pointer ${
                            usr.active
                              ? 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab]'
                              : 'bg-[#caecbe] text-[#062105] hover:bg-[#b8e2aa]'
                          }`}
                        >
                          {usr.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RESTAURANTS TAB */}
        {activeTab === 'restaurants' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916]">
              <h2 className="font-headline-lg text-lg uppercase font-black text-[#231916]">
                Kitchen Franchises &amp; Griddle Stalls ({restaurants.length})
              </h2>
              <span className="text-xs text-[#59413b]">Route 66 Locations</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map((rest) => (
                <div
                  key={rest.id}
                  className="bg-white border-2 border-[#231916] rounded-xl p-4 shadow-[3px_3px_0px_#231916] flex items-start gap-4"
                >
                  <img
                    src={
                      rest.imageUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuC1PZc7d1eE-ZJ3x_oK-L6U4X4h0YtXnCg'
                    }
                    alt={rest.name}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-[#231916] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-headline-sm text-sm font-bold uppercase text-[#231916] truncate">
                        {rest.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border border-[#231916] shrink-0 ${
                          rest.open ? 'bg-[#caecbe] text-[#062105]' : 'bg-[#ffdad6] text-[#93000a]'
                        }`}
                      >
                        {rest.open ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-xs text-[#8d716a] font-medium mt-0.5">{rest.cuisine}</p>
                    <p className="text-[11px] text-[#59413b] mt-1 truncate">{rest.address}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#8d716a]">
                      <span>
                        GPS: {rest.latitude?.toFixed(4)}, {rest.longitude?.toFixed(4)}
                      </span>
                      <span className="font-bold text-[#cb4926]">★ {rest.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916]">
              <h2 className="font-headline-lg text-lg uppercase font-black text-[#231916]">
                Master Settlement Ledger ({payments.length})
              </h2>
              <span className="text-xs text-[#59413b]">Automatic Audit Log</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-[#231916] font-label-md uppercase text-[#8d716a]">
                    <th className="py-2 px-3">Payment #</th>
                    <th className="py-2 px-3">Order #</th>
                    <th className="py-2 px-3">Transaction Ref</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Settled At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#231916]/10">
                  {payments.map((pmt) => (
                    <tr key={pmt.id} className="hover:bg-[#ffece6]/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#cb4926]">#{pmt.id}</td>
                      <td className="py-3 px-3 font-mono font-bold">#{pmt.orderId}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#59413b]">
                        {pmt.transactionRef}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#231916] uppercase">{pmt.method}</td>
                      <td className="py-3 px-3 font-bold text-[#231916]">
                        ₹{Number(pmt.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#caecbe] text-[#062105] border border-[#231916]">
                          {pmt.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-[#59413b]">
                        {pmt.paidAt ? new Date(pmt.paidAt).toLocaleString() : 'Pending'}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-[#8d716a] italic">
                        No transactions recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
