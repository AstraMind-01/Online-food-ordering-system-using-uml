import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { orderService, groupOrderService, menuService } from '../../services/api';
import RetroStatCard from '../../components/restaurant/RetroStatCard';
import RetroEmptyState from '../../components/restaurant/RetroEmptyState';

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const { restaurant } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [groupOrders, setGroupOrders] = useState([]);
  const [menuItemsCount, setMenuItemsCount] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [allOrders, allGroupOrders, menuList] = await Promise.all([
        orderService.getOrders().catch(() => []),
        groupOrderService.getAll().catch(() => []),
        menuService.getAll().catch(() => []),
      ]);

      setOrders(allOrders || []);
      setGroupOrders(allGroupOrders || []);
      setMenuItemsCount(Array.isArray(menuList) ? menuList.length : 12);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived metrics
  const todayOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PLACED' || o.status === 'CONFIRMED');
  const pendingCount = pendingOrders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Incoming latest 5 orders
  const incomingPreview = orders.slice(0, 5);

  // Group orders waiting for review/kitchen action
  const waitingGroupOrders = groupOrders.filter(
    (g) => g.status === 'OPEN' || g.status === 'LOCKED'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-black uppercase font-label-sm bg-[#ffdea7] text-[#231916] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
              ★ KITCHEN COMMAND CENTER
            </span>
            <span className="text-xs text-[#59413b] font-medium">
              Live Synchronized Dashboard
            </span>
          </div>
          <h1 className="font-headline-xl text-3xl md:text-4xl font-black uppercase text-[#231916] tracking-tight">
            Diner Shift Overview
          </h1>
          <p className="font-body-md text-sm text-[#59413b] mt-1">
            Managing tickets, griddle queues, and booth orders for <strong className="text-[#cb4926]">{restaurant?.name || 'Chow Chow Retro Diner'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/restaurant/orders')}
            className="px-4 py-2.5 bg-[#cb4926] text-white font-bold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">receipt_long</span>
            <span>View All Orders</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="w-10 h-10 bg-[#fff8f6] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] flex items-center justify-center hover:bg-[#fff1ec] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            title="Refresh Shift Data"
          >
            <span className="material-symbols-outlined text-[#231916]">refresh</span>
          </button>
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <RetroStatCard
          title="Today's Orders"
          value={todayOrdersCount}
          subtitle="Total tickets placed today"
          icon="receipt"
          badgeColor="bg-[#caecbe]"
          badgeText="Active Shift"
        />
        <RetroStatCard
          title="Pending Tickets"
          value={pendingCount}
          subtitle="Orders waiting for kitchen"
          icon="skillet"
          badgeColor="bg-[#ffdea7]"
          badgeText={pendingCount > 0 ? "Needs Action" : "All Clear"}
        />
        <RetroStatCard
          title="Revenue Today"
          value={`₹${totalRevenue.toFixed(2)}`}
          subtitle="Gross sales (excl. cancelled)"
          icon="payments"
          badgeColor="bg-[#fdc65c]"
          badgeText="Live Register"
        />
        <RetroStatCard
          title="Menu Items"
          value={menuItemsCount}
          subtitle="Dishes on the diner catalog"
          icon="restaurant_menu"
          badgeColor="bg-[#caecbe]"
          badgeText="Catalog Ready"
        />
      </div>

      {/* INCOMING ORDERS & GROUP ORDERS WAITING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Latest Incoming Orders */}
        <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[#231916] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#cb4926]">
                  notifications_active
                </span>
                <h3 className="font-headline-md text-xl font-bold uppercase text-[#231916]">
                  Incoming Orders (Latest 5)
                </h3>
              </div>
              <button
                onClick={() => navigate('/restaurant/orders')}
                className="text-xs font-bold font-label-md uppercase text-[#cb4926] hover:underline"
              >
                See All →
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm font-bold text-[#59413b]">
                Loading incoming diner tickets...
              </div>
            ) : incomingPreview.length === 0 ? (
              <RetroEmptyState
                icon="check_circle"
                title="No Incoming Tickets"
                message="Your kitchen is caught up! Ready for new burger and shake orders."
              />
            ) : (
              <div className="space-y-3">
                {incomingPreview.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-[#fff1ec] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] flex items-center justify-between hover:bg-[#fdeae3] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#231916]">
                          #{order.orderNumber || `ORD-${order.id}`}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md border border-[#231916] shadow-[1px_1px_0px_#231916] ${
                            order.status === 'PLACED'
                              ? 'bg-[#fdc65c] text-[#231916]'
                              : order.status === 'CONFIRMED'
                              ? 'bg-[#caecbe] text-[#062105]'
                              : order.status === 'PREPARING'
                              ? 'bg-[#ffdea7] text-[#271900]'
                              : order.status === 'READY_FOR_PICKUP'
                              ? 'bg-[#caecbe] text-[#062105]'
                              : 'bg-[#fff8f6] text-[#231916]'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#59413b] mt-1">
                        <strong>{order.customerName || 'Customer'}</strong> • {order.items?.length || 0} item(s)
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-headline-md text-base font-black text-[#cb4926]">
                        ₹{order.totalAmount?.toFixed(2)}
                      </div>
                      <button
                        onClick={() => navigate('/restaurant/orders')}
                        className="mt-1 text-[11px] font-bold font-label-sm uppercase text-[#231916] underline hover:text-[#cb4926]"
                      >
                        Manage Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Group Orders Waiting */}
        <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[4px_4px_0px_#231916] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[#231916] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-[#fdc65c]">
                  groups
                </span>
                <h3 className="font-headline-md text-xl font-bold uppercase text-[#231916]">
                  Group Orders Waiting
                </h3>
              </div>
              <button
                onClick={() => navigate('/restaurant/group-orders')}
                className="text-xs font-bold font-label-md uppercase text-[#cb4926] hover:underline"
              >
                View Booths →
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm font-bold text-[#59413b]">
                Checking collaborative booths...
              </div>
            ) : waitingGroupOrders.length === 0 ? (
              <RetroEmptyState
                icon="table_restaurant"
                title="No Booths Pending"
                message="No collaborative group orders are waiting for kitchen confirmation right now."
              />
            ) : (
              <div className="space-y-3">
                {waitingGroupOrders.map((grp) => (
                  <div
                    key={grp.id}
                    className="p-4 bg-[#fdeae3] border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[11px] font-black uppercase bg-[#ffdea7] text-[#231916] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
                          {grp.groupCode}
                        </span>
                        <span className="font-bold text-sm text-[#231916]">
                          {grp.name || 'Road Trip Booth'}
                        </span>
                      </div>
                      <div className="text-xs text-[#59413b] mt-1">
                        Host: <strong>{grp.organizerName || 'Organizer'}</strong> • {grp.memberCount || 1} guest(s)
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase bg-[#fff8f6] border border-[#231916] rounded-md shadow-[1px_1px_0px_#231916]">
                        {grp.deliveryMode || 'COMMON'}
                      </span>
                      <div className="mt-1 font-headline-md text-sm font-bold text-[#231916]">
                        ${grp.totalAmount?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
