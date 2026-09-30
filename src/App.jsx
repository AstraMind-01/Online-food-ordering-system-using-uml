import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RestaurantListing from './pages/RestaurantListing';
import RestaurantMenuPage from './pages/RestaurantMenuPage';
import RestaurantMenu from './pages/RestaurantMenu';
import GroupOrder from './pages/GroupOrder';
import TrackOrder from './pages/TrackOrder';
import DinerDashboard from './pages/DinerDashboard';
import Login from './pages/Login';

// Restaurant Owner Panel Components
import RestaurantLayout from './components/restaurant/RestaurantLayout';
import RestaurantProtectedRoute from './components/restaurant/RestaurantProtectedRoute';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import RestaurantOrders from './pages/restaurant/RestaurantOrders';
import RestaurantGroupOrders from './pages/restaurant/RestaurantGroupOrders';
import OwnerRestaurantMenu from './pages/restaurant/RestaurantMenu';
import RestaurantPayments from './pages/restaurant/RestaurantPayments';
import RestaurantDeliveries from './pages/restaurant/RestaurantDeliveries';
import RestaurantProfile from './pages/restaurant/RestaurantProfile';

// Delivery Partner Panel Components
import DeliveryLayout from './components/delivery/DeliveryLayout';
import DeliveryProtectedRoute from './components/delivery/DeliveryProtectedRoute';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import DeliveryAvailable from './pages/delivery/DeliveryAvailable';
import DeliveryActive from './pages/delivery/DeliveryActive';
import DeliveryHistory from './pages/delivery/DeliveryHistory';
import DeliveryProfile from './pages/delivery/DeliveryProfile';

// Admin Panel Components
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';

function CustomerLayout() {
  return (
    <div className="retro-halftone font-body-md text-body-md text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-container selection:text-on-secondary-container">
      <Navbar />
      <main className="w-full pt-20 max-w-7xl mx-auto px-margin-mobile lg:px-margin min-h-[calc(100vh-20rem)] flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Facing Pages */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantListing />} />
          <Route path="/restaurants/:id" element={<RestaurantMenuPage />} />
          <Route path="/restaurants-and-menus" element={<RestaurantListing />} />
          <Route path="/restaurant-menu" element={<RestaurantListing />} />
          <Route path="/group-ordering" element={<GroupOrder />} />
          <Route path="/group-order" element={<GroupOrder />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/diner-dashboard" element={<DinerDashboard />} />
          <Route path="/customer-portal" element={<DinerDashboard />} />
          <Route path="/customer-dashboard" element={<DinerDashboard />} />
          <Route path="/customer/dashboard" element={<DinerDashboard />} />
          <Route path="/customer" element={<DinerDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
        </Route>

        {/* Protected Restaurant Owner Panel */}
        <Route
          path="/restaurant"
          element={
            <RestaurantProtectedRoute>
              <RestaurantLayout />
            </RestaurantProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/restaurant/dashboard" replace />} />
          <Route path="dashboard" element={<RestaurantDashboard />} />
          <Route path="orders" element={<RestaurantOrders />} />
          <Route path="group-orders" element={<RestaurantGroupOrders />} />
          <Route path="menu" element={<OwnerRestaurantMenu />} />
          <Route path="payments" element={<RestaurantPayments />} />
          <Route path="deliveries" element={<RestaurantDeliveries />} />
          <Route path="profile" element={<RestaurantProfile />} />
        </Route>

        {/* Protected Delivery Partner Panel */}
        <Route
          path="/delivery"
          element={
            <DeliveryProtectedRoute>
              <DeliveryLayout />
            </DeliveryProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/delivery/dashboard" replace />} />
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="available" element={<DeliveryAvailable />} />
          <Route path="deliveries" element={<DeliveryActive />} />
          <Route path="history" element={<DeliveryHistory />} />
          <Route path="profile" element={<DeliveryProfile />} />
        </Route>

        {/* Protected System Admin Panel */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
