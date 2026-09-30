import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/restaurant/dashboard';

  const [email, setEmail] = useState('owner@chowchow.com');
  const [password, setPassword] = useState('owner123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.error || '');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login(email, password);
      const role = res?.data?.role || authService.getUserRole();

      if (role === 'RESTAURANT') {
        navigate('/restaurant/dashboard', { replace: true });
      } else if (role === 'DELIVERY_PARTNER') {
        navigate('/delivery/dashboard', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'CUSTOMER') {
        navigate(from && from !== '/restaurant/dashboard' && from !== '/login' ? from : '/diner-dashboard', { replace: true });
      } else {
        navigate(from === '/restaurant/dashboard' ? '/' : from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setLoading(true);
    setError('');

    try {
      const res = await authService.login(userEmail, userPass);
      const role = res?.data?.role || authService.getUserRole();
      if (role === 'RESTAURANT') {
        navigate('/restaurant/dashboard', { replace: true });
      } else if (role === 'DELIVERY_PARTNER') {
        navigate('/delivery/dashboard', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'CUSTOMER') {
        navigate('/diner-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-[#fff8f6] border-[3px] border-[#231916] rounded-2xl p-8 shadow-[8px_8px_0px_#231916] relative overflow-hidden">
        {/* Top retro badge */}
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-[#ffdea7] text-[#231916] font-label-sm text-xs font-black uppercase border-2 border-[#231916] rounded-full shadow-[2px_2px_0px_#231916] mb-3">
            ★ CHOW CHOW DINER PORTAL ★
          </div>
          <h1 className="font-headline-xl text-3xl font-black uppercase text-[#231916] tracking-tight">
            Sign In to Diner
          </h1>
          <p className="font-body-md text-xs text-[#59413b] mt-1">
            Access kitchen dispatch, orders, collaborative booths, and menu items.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#ffdad6] text-[#93000a] text-xs font-bold border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916]">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@chowchow.com"
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-sm text-xs uppercase font-bold text-[#231916] block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-[#231916] rounded-xl shadow-[2px_2px_0px_#231916] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#cb4926] text-white font-extrabold font-label-md text-xs uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#a9310f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
          </button>
        </form>

        {/* 1-CLICK DEMO LOGINS */}
        <div className="mt-6 pt-5 border-t-2 border-dashed border-[#231916]">
          <span className="font-label-sm text-[11px] font-black uppercase text-[#8d716a] block text-center mb-3">
            Quick 1-Click Test Logins:
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('owner@chowchow.com', 'owner123')}
              className="px-2.5 py-2 bg-[#fdc65c] text-[#231916] font-bold text-[11px] uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#ffdea7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-center cursor-pointer"
            >
              👨‍🍳 Restaurant Owner
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('customer1@chowchow.com', 'cust123')}
              className="px-2.5 py-2 bg-[#caecbe] text-[#062105] font-bold text-[11px] uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#aed0a3] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-center cursor-pointer"
            >
              🍔 Customer 1
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('driver@chowchow.com', 'driver123')}
              className="px-2.5 py-2 bg-[#fff1ec] text-[#231916] font-bold text-[11px] uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#fdeae3] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-center cursor-pointer"
            >
              🏍️ Delivery Partner
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@chowchow.com', 'admin123')}
              className="px-2.5 py-2 bg-[#ffdbd1] text-[#881f00] font-bold text-[11px] uppercase border-2 border-[#231916] rounded-lg shadow-[2px_2px_0px_#231916] hover:bg-[#ffb4a1] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-center cursor-pointer"
            >
              ⚡ Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
