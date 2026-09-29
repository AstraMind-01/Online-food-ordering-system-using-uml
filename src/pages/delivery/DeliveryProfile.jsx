import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { authService } from '../../services/api';

export default function DeliveryProfile() {
  const { isOnline, handleToggleOnline } = useOutletContext();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: 'Vintage Motorcycle',
    vehicleNumber: 'TX-ROAD-77',
    online: true,
  });
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setFormData({
        name: user.name || 'Speedy Sam',
        phone: user.phone || '555-0104',
        vehicleType: user.vehicleType || 'Vintage Motorcycle',
        vehicleNumber: user.vehicleNumber || 'TX-ROAD-77',
        online: typeof user.online === 'boolean' ? user.online : true,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessToast('');
    setErrorMessage('');

    try {
      const updated = await authService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        online: formData.online,
      });

      if (updated) {
        setSuccessToast('Courier Profile & Vehicle successfully updated!');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err.response?.data?.message || 'Could not update profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b-2 border-dashed border-[#231916]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-[#cb4926] border border-[#231916]"></span>
          <span className="font-label-sm text-xs uppercase font-extrabold text-[#cb4926] tracking-wider">
            OFFICIAL DRIVER DISPATCH CREDENTIALS
          </span>
        </div>
        <h1 className="font-headline-lg text-2xl lg:text-3xl font-black uppercase text-[#231916] tracking-wide">
          Courier Profile & Vehicle Info
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#59413b] mt-0.5">
          Manage your contact information, delivery vehicle registration, and shift status.
        </p>
      </div>

      {successToast && (
        <div className="bg-[#e4f3de] border-2 border-[#231916] p-4 rounded-xl shadow-[3px_3px_0px_#231916] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5e7d56] font-bold">check_circle</span>
            <span className="text-sm font-bold text-[#231916]">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast('')}
            className="text-xs font-bold uppercase underline hover:text-[#cb4926] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-[#ffdad6] border-2 border-[#231916] p-4 rounded-xl shadow-[3px_3px_0px_#231916] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cb4926] font-bold">error</span>
            <span className="text-sm font-bold text-[#93000a]">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-xs font-bold uppercase underline hover:text-[#cb4926] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* EDIT FORM */}
        <div className="lg:col-span-2 bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 lg:p-7 shadow-[5px_5px_0px_#231916]">
          <h3 className="font-headline-md text-lg uppercase font-black text-[#231916] tracking-wide pb-3 border-b-2 border-dashed border-[#231916] mb-5">
            Update Dispatch Record
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase text-[#231916] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#f7e4de] border-2 border-[#231916] rounded-xl px-4 py-2.5 text-sm font-bold text-[#231916] shadow-[2px_2px_0px_#231916] focus:outline-none focus:bg-[#fff8f6]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#231916] mb-1.5">
                Contact Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#f7e4de] border-2 border-[#231916] rounded-xl px-4 py-2.5 text-sm font-bold text-[#231916] shadow-[2px_2px_0px_#231916] focus:outline-none focus:bg-[#fff8f6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#231916] mb-1.5">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full bg-[#f7e4de] border-2 border-[#231916] rounded-xl px-4 py-2.5 text-sm font-bold text-[#231916] shadow-[2px_2px_0px_#231916] focus:outline-none focus:bg-[#fff8f6]"
                >
                  <option value="Vintage Motorcycle">Vintage Motorcycle</option>
                  <option value="Retro Moped">Retro Moped</option>
                  <option value="Route 66 Van">Route 66 Van</option>
                  <option value="Classic Sedan">Classic Sedan</option>
                  <option value="Bicycle Courier">Bicycle Courier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#231916] mb-1.5">
                  Vehicle License Plate #
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g. TX-ROAD-77"
                  className="w-full bg-[#f7e4de] border-2 border-[#231916] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-[#231916] shadow-[2px_2px_0px_#231916] focus:outline-none focus:bg-[#fff8f6]"
                />
              </div>
            </div>

            {/* Shift Duty Toggle inside Form */}
            <div className="bg-[#ffdea7] border-2 border-[#231916] rounded-xl p-4 shadow-[2px_2px_0px_#231916] flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-[#231916] block">
                  Active Shift Status
                </span>
                <span className="text-xs text-[#59413b] font-medium">
                  {formData.online
                    ? 'You are active and ready to receive available pickup runs.'
                    : 'You are off duty or taking a lunch break.'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, online: !prev.online }));
                  handleToggleOnline();
                }}
                className={`px-4 py-1.5 rounded-lg border-2 border-[#231916] text-xs font-black uppercase shadow-[2px_2px_0px_#231916] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                  formData.online
                    ? 'bg-[#5e7d56] text-[#f8fff0]'
                    : 'bg-[#cb4926] text-white'
                }`}
              >
                {formData.online ? '● ONLINE' : '○ OFFLINE'}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#cb4926] text-white font-black font-label-md text-sm uppercase border-2 border-[#231916] rounded-xl shadow-[3px_3px_0px_#231916] hover:bg-[#b03a19] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                <span>{loading ? 'Saving Changes...' : 'Save Profile & Vehicle'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* VINTAGE COURIER BADGE ID PREVIEW */}
        <div className="bg-[#fff8f6] border-[2.5px] border-[#231916] rounded-2xl p-6 shadow-[5px_5px_0px_#231916] relative overflow-hidden">
          {/* Halftone texture */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#231916] mb-4">
            <span className="text-[11px] font-black uppercase text-[#8d716a] tracking-wider">
              OFFICIAL DRIVER BADGE
            </span>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-[#fdc65c] border border-[#231916] rounded">
              CHOW CHOW DEPOT
            </span>
          </div>

          <div className="text-center py-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#ffdea7] border-3 border-[#231916] shadow-[3px_3px_0px_#231916] flex items-center justify-center text-4xl mb-3 relative">
              ⚡
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#cb4926] border-2 border-[#231916] text-white flex items-center justify-center text-xs font-bold">
                ★
              </div>
            </div>

            <h4 className="font-headline-lg text-xl uppercase font-black text-[#231916]">
              {formData.name || 'Speedy Sam'}
            </h4>
            <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-black uppercase bg-[#5e7d56] text-[#f8fff0] rounded-full border border-[#231916]">
              LICENSED COURIER
            </span>
          </div>

          <div className="bg-[#f7e4de] border-2 border-[#231916] rounded-xl p-3.5 text-xs space-y-2 mb-4">
            <div className="flex justify-between border-b border-dashed border-[#e8d6d0] pb-1">
              <span className="font-bold text-[#8d716a] uppercase">Vehicle:</span>
              <span className="font-black text-[#231916]">{formData.vehicleType}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-[#e8d6d0] pb-1">
              <span className="font-bold text-[#8d716a] uppercase">Plate ID:</span>
              <span className="font-mono font-black text-[#cb4926]">{formData.vehicleNumber}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-[#e8d6d0] pb-1">
              <span className="font-bold text-[#8d716a] uppercase">Phone:</span>
              <span className="font-mono font-bold text-[#231916]">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-[#8d716a] uppercase">Status:</span>
              <span className={`font-black uppercase ${formData.online ? 'text-[#5e7d56]' : 'text-[#cb4926]'}`}>
                {formData.online ? '● ON SHIFT' : '○ OFF DUTY'}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-[#8d716a] text-center font-mono">
            CERTIFIED BY CHOW CHOW DINER ROAD SERVICES • 1974
          </p>
        </div>
      </div>
    </div>
  );
}
