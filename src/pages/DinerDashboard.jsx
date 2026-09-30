import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, orderService } from '../services/api';

export default function DinerDashboard() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    if (authService.isAuthenticated()) {
      setLoadingOrders(true);
      orderService.getMyOrders()
        .then((orders) => {
          if (Array.isArray(orders)) {
            setMyOrders(orders);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, []);

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* Header Banner */}
      <section className="w-full mb-space-xl">
        <div className="bg-secondary-fixed rounded-xl p-space-md lg:p-space-lg diner-border shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md relative z-10">
            <div className="space-y-space-xs">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider diner-tag font-black">
                  ★ CUSTOMER PORTAL ★
                </span>
                <span className="font-label-md text-label-md text-secondary font-bold tracking-wide">
                  MEMBER #{currentUser?.id ? `CHOW-${currentUser.id}` : 'CHOW-1974'}
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight">
                Customer Portal • Welcome, {currentUser?.name || 'Sally Brady'}!
              </h1>
              <p className="font-body-md text-body-md text-on-surface">
                Manage your active personal orders, collaborative table booths, check split receipts, and track live deliveries.
              </p>
            </div>

            <div className="flex items-center gap-space-sm shrink-0">
              <Link
                to="/group-ordering"
                className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase font-bold diner-tag hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-lg">group_add</span>
                <span>Active Table Feasts</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mb-space-2xl">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg diner-border flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center diner-tag mb-space-md">
              <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase text-on-surface mb-1">
              Diner Menus
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Browse Big Bill's burgers, hand-spun malts, and classic roadside diner sides.
            </p>
          </div>
          <Link
            to="/restaurants-and-menus"
            className="mt-space-md px-3 py-2 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-label-sm text-label-sm uppercase font-bold diner-tag text-center transition-colors"
          >
            Browse Menus →
          </Link>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg diner-border flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center diner-tag mb-space-md">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase text-on-surface mb-1">
              Group Booth Feasts
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Live collaboration session #CHOW-7492 with Dave, Priya, and Marco.
            </p>
          </div>
          <Link
            to="/group-ordering"
            className="mt-space-md px-3 py-2 rounded-lg bg-surface-container-high hover:bg-secondary-container hover:text-on-secondary-container text-on-surface font-label-sm text-label-sm uppercase font-bold diner-tag text-center transition-colors"
          >
            Join Table Session →
          </Link>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg diner-border flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center diner-tag mb-space-md">
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <h3 className="font-headline-md text-headline-md uppercase text-on-surface mb-1">
              Live Delivery Transit
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Hank &quot;Speedy&quot; Miller is en route in the 1978 Vista Cruiser wagon (ETA: 12:42 PM).
            </p>
          </div>
          <Link
            to="/track-order?orderId=1"
            className="mt-space-md px-3 py-2 rounded-lg bg-surface-container-high hover:bg-tertiary hover:text-on-tertiary text-on-surface font-label-sm text-label-sm uppercase font-bold diner-tag text-center transition-colors"
          >
            Track Delivery →
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg diner-border">
        <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cb4926] text-2xl">receipt_long</span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              Your Diner Receipts &amp; Active Orders
            </h2>
          </div>
          <span className="font-label-sm text-xs font-bold uppercase text-[#8d716a]">
            {myOrders.length > 0 ? `${myOrders.length} Orders Logged` : 'Highway 66 Ledger'}
          </span>
        </div>

        {loadingOrders ? (
          <p className="text-xs text-[#8d716a] py-4">Checking active tickets...</p>
        ) : myOrders.length > 0 ? (
          <div className="divide-y divide-[#231916]/10">
            {myOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#cb4926]">Order #{ord.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ffdea7] text-[#231916] border border-[#231916]">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#59413b] mt-0.5">
                    {ord.restaurantName || "Big Bill's Burger Emporium"} &bull; {ord.deliveryAddress || 'Route 66 Stop'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-headline-sm text-sm font-bold text-[#231916]">
                    ₹{Number(ord.totalAmount || 0).toFixed(2)}
                  </span>
                  <Link
                    to={`/track-order?orderId=${ord.id}`}
                    className="px-3 py-1.5 rounded-lg bg-[#fdc65c] text-[#231916] font-bold text-xs uppercase border border-[#231916] shadow-[2px_2px_0px_#231916] hover:bg-[#ffdea7]"
                  >
                    Track Live Map →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-[#8d716a]">
            <p>No recent orders found on this table. Ready for hot smash burgers?</p>
            <Link
              to="/track-order?orderId=1"
              className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-[#ffdea7] text-[#231916] font-bold text-xs uppercase border border-[#231916]"
            >
              View Route 66 Live Map Demo
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
