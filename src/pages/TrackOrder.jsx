import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { orderService, deliveryLocationService } from '../services/api';
import wsClient from '../services/websocket';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('id') || '1';

  const [order, setOrder] = useState(null);
  const [location, setLocation] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNoteDrawer, setShowNoteDrawer] = useState(false);
  const [dropoffNote, setDropoffNote] = useState(
    'Buzz suite 4B (Dial #042) • Leave at reception counter for Sally'
  );
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Fetch initial order and location
  const loadOrderData = useCallback(async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getById(orderId);
      if (orderData) {
        setOrder(orderData);
        if (orderData.deliveryAddress) {
          // If address contains instructions, prefill dropoff note
        }
      }

      // Fetch latest location
      const locData = await deliveryLocationService.getLatestByOrderId(orderId);
      if (locData) {
        setLocation(locData);
      }
    } catch (err) {
      console.warn('Could not load order #' + orderId + ' from API, using fallback diner state:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrderData();

    // Subscribe to STOMP WebSocket topics
    const unsubLocation = wsClient.subscribe(`/topic/orders/${orderId}/location`, (newLoc) => {
      setLocation(newLoc);
    });

    const unsubOrder = wsClient.subscribe(`/topic/orders/${orderId}`, (updatedOrder) => {
      setOrder(updatedOrder);
    });

    setWsConnected(true);

    // Fallback polling every 8 seconds for real-time freshness
    const interval = setInterval(() => {
      deliveryLocationService.getLatestByOrderId(orderId).then((loc) => {
        if (loc) setLocation(loc);
      }).catch(() => {});

      orderService.getById(orderId).then((ord) => {
        if (ord) setOrder(ord);
      }).catch(() => {});
    }, 8000);

    return () => {
      if (unsubLocation) unsubLocation();
      if (unsubOrder) unsubOrder();
      clearInterval(interval);
    };
  }, [orderId, loadOrderData]);

  const handleCopyTracking = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Derive status
  const currentStatus = order?.status || 'OUT_FOR_DELIVERY';

  // Calculate road progress from coordinates or status
  const calculateProgress = () => {
    if (currentStatus === 'DELIVERED') return 1.0;
    if (currentStatus === 'PLACED' || currentStatus === 'CONFIRMED' || currentStatus === 'PREPARING') return 0.05;
    if (currentStatus === 'READY_FOR_PICKUP') return 0.12;

    // OUT_FOR_DELIVERY: interpolate along Route 66
    if (location && location.latitude && location.longitude) {
      const dinerLat = order?.restaurant?.latitude || 30.2672;
      const dinerLng = order?.restaurant?.longitude || -97.7431;
      const dropLat = order?.deliveryLatitude || 30.2849;
      const dropLng = order?.deliveryLongitude || -97.7341;

      const totalDist = Math.hypot(dropLat - dinerLat, dropLng - dinerLng);
      const covered = Math.hypot(location.latitude - dinerLat, location.longitude - dinerLng);

      if (totalDist > 0) {
        return Math.min(Math.max(covered / totalDist, 0.15), 0.95);
      }
    }

    return 0.52; // midway along Highway 66 default
  };

  const progress = calculateProgress();

  // Interpolate along the Route 66 SVG Bezier path
  // SVG path: M 80 320 C 140 280, 180 310, 240 240 S 330 200, 390 140 S 480 150, 520 80
  const getWagonPosition = (t) => {
    const clamped = Math.max(0, Math.min(1, t));
    let x, y;
    if (clamped <= 0.4) {
      const u = clamped / 0.4;
      x = 80 + (240 - 80) * u;
      y = 320 - (320 - 240) * Math.sin((u * Math.PI) / 2);
    } else if (clamped <= 0.7) {
      const u = (clamped - 0.4) / 0.3;
      x = 240 + (390 - 240) * u;
      y = 240 - (240 - 140) * u;
    } else {
      const u = (clamped - 0.7) / 0.3;
      x = 390 + (520 - 390) * u;
      y = 140 - (140 - 80) * u;
    }

    return {
      left: `${((x / 600) * 100).toFixed(1)}%`,
      top: `${((y / 380) * 100).toFixed(1)}%`,
    };
  };

  const wagonCoords = getWagonPosition(progress);

  // Stepper state checks
  const isStep1Done = true; // Order Placed
  const isStep2Done = ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus);
  const isStep2Active = ['CONFIRMED', 'PREPARING'].includes(currentStatus);
  const isStep3Done = ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentStatus);
  const isStep3Active = currentStatus === 'READY_FOR_PICKUP';
  const isStep4Done = currentStatus === 'DELIVERED';
  const isStep4Active = currentStatus === 'OUT_FOR_DELIVERY';
  const isStep5Active = currentStatus === 'DELIVERED';

  // Driver details
  const driverName = order?.delivery?.deliveryPartner?.name || 'Hank "Speedy" Miller';
  const driverVehicle = order?.delivery?.deliveryPartner?.vehicleType
    ? `${order.delivery.deliveryPartner.vehicleType} (Plate: ${order.delivery.deliveryPartner.vehicleNumber || 'TX-ROAD-77'})`
    : '1978 Orange Vista Cruiser Wagon (Plate: CHOW-74)';
  const driverPhone = order?.delivery?.deliveryPartner?.phone || '555-0174';

  // Estimate arrival text
  const minsRemaining = currentStatus === 'DELIVERED'
    ? 0
    : Math.max(2, Math.round((1 - progress) * 20));

  const arrivalTimeStr = currentStatus === 'DELIVERED'
    ? 'DELIVERED'
    : '12:42 PM';

  return (
    <div className="flex flex-col w-full pt-8 sm:pt-10 pb-space-2xl">
      {/* Vintage Dispatch Marquee / Status Header */}
      <section className="w-full mb-space-lg">
        <div className="bg-surface-container p-space-md lg:p-space-lg rounded-xl diner-border relative overflow-hidden">
          {/* Halftone Accent Corner */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-secondary-fixed/50 pointer-events-none opacity-50"></div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md relative z-10">
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md diner-tag tracking-wider">
                <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                LIVE ORDER TRACKER
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md diner-tag font-bold">
                TICKET #{order?.id || '8491'}-DELIVERY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold diner-tag flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
                {currentStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-center gap-space-md self-start lg:self-auto">
              <div className="text-right">
                <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                  Estimated Arrival
                </p>
                <p className="font-headline-lg text-headline-lg text-primary tracking-tight font-extrabold leading-none">
                  {arrivalTimeStr}
                </p>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  {currentStatus === 'DELIVERED' ? 'Arrived at your desk!' : `≈ ${minsRemaining} Minutes Remaining`}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container diner-tag flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl font-bold">timer</span>
              </div>
            </div>
          </div>

          {/* Diner Ticket Info Ribbon */}
          <div className="mt-space-md pt-space-md border-t-2 border-dashed border-on-surface/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest diner-tag flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">lunch_dining</span>
              </div>
              <div>
                <h1 className="font-headline-sm text-headline-sm uppercase text-on-surface leading-tight">
                  {order?.restaurant?.name || "Chow Chow Retro Diner & Eats"}
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Drop: {order?.deliveryAddress || '742 Evergreen Terrace (Booth 4)'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg diner-tag self-start sm:self-auto">
              <span className="material-symbols-outlined text-primary text-base">groups</span>
              <span className="font-label-md text-label-md font-bold text-on-surface">Friday Diner Run</span>
              <span className="px-2 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                {order?.items?.length || 2} Items
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanical Retro Stepper Timeline */}
      <section className="w-full mb-space-xl">
        <div className="bg-surface-container-lowest p-space-md lg:p-space-lg rounded-xl diner-border">
          <div className="flex items-center justify-between mb-space-md pb-space-xs border-b-2 border-on-surface/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">conveyor_belt</span>
              <span className="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface">
                Griddle-To-Booth Dispatch Timeline
              </span>
            </div>
            <span className="hidden sm:inline-block font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-widest">
              Stage {isStep4Active ? '4 of 5 In Progress' : isStep5Active ? '5 of 5 Complete' : isStep3Active ? '3 of 5 In Progress' : '2 of 5 In Progress'}
            </span>
          </div>

          {/* Stepper Nodes Grid */}
          <div className="relative py-space-sm">
            {/* Connecting Line Background Desktop */}
            <div className="hidden lg:block absolute top-[44px] left-[7%] right-[7%] h-[4px] border-t-[4px] border-dashed border-on-surface/20 z-0"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-space-md relative z-10">
              {/* Step 1: Complete */}
              <div className="flex lg:flex-col items-center lg:text-center gap-space-sm bg-surface-container-low lg:bg-transparent p-space-sm lg:p-0 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-tertiary text-on-tertiary diner-tag flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-tertiary uppercase font-bold">
                    Placed • Done
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Order Placed</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Sent to kitchen register
                  </span>
                </div>
              </div>

              {/* Step 2: Preparing */}
              <div className={`flex lg:flex-col items-center lg:text-center gap-space-sm p-space-sm lg:p-0 rounded-lg ${
                isStep2Active ? 'bg-secondary-fixed/40 diner-border-thick relative' : 'bg-surface-container-low lg:bg-transparent'
              }`}>
                <div className={`w-14 h-14 rounded-full text-on-primary-container diner-tag flex items-center justify-center shrink-0 ${
                  isStep2Done ? 'bg-primary-container' : 'bg-surface-container-highest opacity-75'
                } ${isStep2Active ? 'animate-bounce' : ''}`}>
                  <span className="material-symbols-outlined text-2xl font-bold">skillet</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`font-label-sm text-label-sm uppercase font-bold ${isStep2Done ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {isStep2Done ? 'Griddle Done' : 'Pending'}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Sizzling on Griddle</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Patties smashed &amp; toasted
                  </span>
                </div>
              </div>

              {/* Step 3: Ready for Pickup */}
              <div className={`flex lg:flex-col items-center lg:text-center gap-space-sm p-space-sm rounded-lg ${
                isStep3Active ? 'bg-secondary-fixed/40 diner-border-thick relative' : 'bg-surface-container-low lg:bg-transparent'
              }`}>
                {isStep3Active && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] tracking-wider uppercase font-bold whitespace-nowrap shadow-sm">
                    CURRENT STATUS
                  </div>
                )}
                <div className={`w-14 h-14 rounded-full text-on-secondary-container diner-tag flex items-center justify-center shrink-0 ${
                  isStep3Done ? 'bg-secondary-container' : 'bg-surface-container-highest opacity-60'
                } ${isStep3Active ? 'animate-bounce' : ''}`}>
                  <span className="material-symbols-outlined text-2xl font-bold">takeout_dining</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`font-label-sm text-label-sm uppercase font-bold ${isStep3Done ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {isStep3Done ? 'Packed • Ready' : 'Upcoming'}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Packed in Bags</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-bold truncate">
                    Diner bagged &amp; sealed
                  </span>
                </div>
              </div>

              {/* Step 4: Out for Delivery */}
              <div className={`flex lg:flex-col items-center lg:text-center gap-space-sm p-space-sm rounded-lg ${
                isStep4Active ? 'bg-secondary-fixed/40 diner-border-thick relative' : 'bg-surface-container-low lg:bg-transparent'
              } ${!isStep4Done && !isStep4Active ? 'opacity-75' : ''}`}>
                {isStep4Active && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] tracking-wider uppercase font-bold whitespace-nowrap shadow-sm">
                    ON THE ROAD
                  </div>
                )}
                <div className={`w-14 h-14 rounded-full diner-tag flex items-center justify-center shrink-0 ${
                  isStep4Active
                    ? 'bg-primary text-on-primary animate-pulse'
                    : isStep4Done
                    ? 'bg-tertiary text-on-tertiary'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-2xl font-bold">directions_car</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`font-label-sm text-label-sm uppercase font-bold ${isStep4Active ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {isStep4Active ? 'Cruising Live' : isStep4Done ? 'Transit Complete' : 'Upcoming'}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    Cruising in Wagon
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {driverName.split(' ')[0]} rolling on highway
                  </span>
                </div>
              </div>

              {/* Step 5: Delivered */}
              <div className={`flex lg:flex-col items-center lg:text-center gap-space-sm p-space-sm rounded-lg ${
                isStep5Active ? 'bg-secondary-fixed/40 diner-border-thick relative' : 'bg-surface-container-low lg:bg-transparent'
              } ${!isStep5Active ? 'opacity-60' : ''}`}>
                <div className={`w-14 h-14 rounded-full diner-tag flex items-center justify-center shrink-0 ${
                  isStep5Active ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined text-2xl">doorbell</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                    {isStep5Active ? 'Handed Off' : 'Final Step'}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                    Ding Dong! Arrived
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    Handed hot to your desk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Panel: Stylized Map & Courier Card (8 cols) + Diner Check Ticket (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* LEFT COLUMN: Live Map View & Driver Dispatch */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Retro Stylized Road Map Canvas */}
          <div className="bg-surface-container-lowest rounded-xl diner-border p-space-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-space-sm py-2 bg-secondary-fixed/50 rounded-lg diner-tag mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">alt_route</span>
                <span className="font-label-md text-label-md uppercase font-bold text-on-secondary-fixed">
                  Analog Transit Tracker • Route 66 Express
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
                <span className="font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded-full font-bold text-primary">
                  {wsConnected ? 'LIVE GPS STOMP: SYNCED' : 'GPS SIGNAL: CONNECTED'}
                </span>
              </div>
            </div>

            {/* Visual Map Display with Route Path SVG Overlay */}
            <div
              className="relative w-full h-[320px] sm:h-[380px] rounded-lg overflow-hidden bg-[#e8e0cc] diner-tag transition-transform"
              style={{
                backgroundImage: 'radial-gradient(#baa58e 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Stylized Vintage Route Graphic Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 600 380">
                {/* Road Route Underlay */}
                <path
                  d="M 80 320 C 140 280, 180 310, 240 240 S 330 200, 390 140 S 480 150, 520 80"
                  fill="none"
                  stroke="#231916"
                  strokeLinecap="round"
                  strokeWidth="12"
                ></path>
                <path
                  d="M 80 320 C 140 280, 180 310, 240 240 S 330 200, 390 140 S 480 150, 520 80"
                  fill="none"
                  stroke="#fdc65c"
                  strokeLinecap="round"
                  strokeWidth="6"
                ></path>
                <path
                  d="M 80 320 C 140 280, 180 310, 240 240 S 330 200, 390 140 S 480 150, 520 80"
                  fill="none"
                  stroke="#cb4926"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  strokeWidth="2"
                ></path>
              </svg>

              {/* Origin Badge (Diner) */}
              <div className="absolute left-6 bottom-10 flex flex-col items-center pointer-events-auto">
                <div className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm diner-tag font-bold mb-1 shadow-md">
                  🍔 {order?.restaurant?.name || "Big Bill's Diner"}
                </div>
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center diner-tag shadow-md">
                  <span className="material-symbols-outlined text-sm font-bold">storefront</span>
                </div>
              </div>

              {/* Moving Wagon Courier Marker - Dynamically Positioned */}
              <div
                className="absolute flex flex-col items-center pointer-events-auto z-20 cursor-pointer transition-all duration-700 ease-out hover:scale-110"
                style={{
                  left: wagonCoords.left,
                  top: wagonCoords.top,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-extrabold diner-tag mb-1.5 flex items-center gap-1.5 animate-pulse shadow-md whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {currentStatus === 'DELIVERED'
                    ? 'Delivered Hot!'
                    : currentStatus === 'OUT_FOR_DELIVERY'
                    ? `${driverName.split(' ')[0]} rolling! (${(minsRemaining * 0.15).toFixed(1)} mi)`
                    : 'Courier at Diner Dispatch'}
                </div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary diner-border flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-2xl font-bold">local_shipping</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary-container text-on-secondary-container diner-tag flex items-center justify-center text-[10px] font-bold">
                    ★
                  </span>
                </div>
              </div>

              {/* Destination Office Badge */}
              <div className="absolute right-6 top-8 flex flex-col items-center pointer-events-auto">
                <div className="px-2.5 py-1 rounded bg-tertiary text-on-tertiary font-label-sm text-label-sm diner-tag font-bold mb-1 shadow-md">
                  📍 {order?.deliveryAddress ? order.deliveryAddress.substring(0, 24) : 'Booth 4 (Drop Point)'}
                </div>
                <div className="w-7 h-7 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center diner-tag shadow-md">
                  <span className="material-symbols-outlined text-sm font-bold">domain</span>
                </div>
              </div>

              {/* Map Controls Overlay */}
              <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 z-10">
                <button
                  aria-label="Zoom in"
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface diner-tag flex items-center justify-center hover:bg-secondary-fixed transition-colors font-bold text-lg cursor-pointer"
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.4))}
                >
                  +
                </button>
                <button
                  aria-label="Zoom out"
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface diner-tag flex items-center justify-center hover:bg-secondary-fixed transition-colors font-bold text-lg cursor-pointer"
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.8))}
                >
                  -
                </button>
                <button
                  aria-label="Recenter"
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface diner-tag flex items-center justify-center hover:bg-secondary-fixed transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setZoomLevel(1)}
                >
                  <span className="material-symbols-outlined text-sm">my_location</span>
                </button>
              </div>
            </div>
          </div>

          {/* Courier / Delivery Driver Dossier Card */}
          <div className="bg-surface-container p-space-md rounded-xl diner-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
              {/* Driver Info */}
              <div className="flex items-center gap-space-md">
                <div className="relative shrink-0">
                  <img
                    className="w-16 h-16 rounded-xl object-cover diner-border"
                    alt={driverName}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd9QV3j9YuD7_5U1p3az-AxNE0KU4vBKNLkWTh1oEXgMpSk_vo9ODbzKwAx0lbVrO63ZlTGUPEDx1bugZxGvCERiKhGi9ad1t6PbSfn3A4N99_rgVBNRMS_LYCcQVcTnICqrEabjHHapmzmxrM3-U8oe3_R5uh9M3cMcJsjhtCSEdytzz3rvVjbXpVP2e8VcUyVtl4zaTyS792qjgpHPdFlDTg8atEEn6mT5dIcfTR6dPpM6ftBq2o"
                  />
                  <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold diner-tag">
                    PRO
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">
                      {driverName}
                    </h3>
                    <span className="flex items-center text-primary text-sm font-bold bg-secondary-fixed/60 px-2 py-0.5 rounded-full diner-tag">
                      ★ 4.98
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-bold mt-0.5">
                    Chow Chow Certified Courier • Highway 66 Fleet
                  </p>
                  <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-extrabold mt-1">
                    Vehicle: {driverVehicle}
                  </p>
                </div>
              </div>

              {/* Driver Quick Actions */}
              <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                <a
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase diner-tag hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
                  href={`tel:${driverPhone}`}
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                  <span>Call {driverName.split(' ')[0]}</span>
                </a>
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md uppercase diner-tag hover:bg-surface-container-high transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setShowNoteDrawer(!showNoteDrawer)}
                >
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                  <span>Dropoff Note</span>
                </button>
              </div>
            </div>

            {/* Dropoff Note Quick Drawer */}
            {showNoteDrawer && (
              <div className="mt-space-md pt-space-md border-t-2 border-dashed border-on-surface/20" id="note-dialog">
                <label className="block font-label-sm text-label-sm uppercase font-bold text-on-surface mb-1">
                  Active Instructions for Courier:
                </label>
                <div className="flex gap-2">
                  <input
                    className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg diner-tag font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    type="text"
                    value={dropoffNote}
                    onChange={(e) => setDropoffNote(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-tertiary text-on-tertiary font-label-sm text-label-sm uppercase font-bold rounded-lg diner-tag shrink-0 cursor-pointer"
                    type="button"
                    onClick={() => setShowNoteDrawer(false)}
                  >
                    Update
                  </button>
                </div>
                <span className="font-body-sm text-[12px] text-on-surface-variant mt-1 block">
                  Courier receives immediate dispatch alert on wagon dashboard unit.
                </span>
              </div>
            )}
          </div>

          {/* Food Hotbox Assurance Guarantee Banner */}
          <div className="bg-surface-container-high p-space-md rounded-xl diner-border flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary diner-tag flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl font-bold">local_fire_department</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm uppercase text-on-surface leading-tight">
                  100% Sizzling Hot Guarantee
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Carried in retro thermal insulated bags. If your fries aren't hot &amp; crispy, your diner milkshake is on us!
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1 font-label-sm text-label-sm uppercase font-extrabold text-primary bg-surface-container-lowest px-3 py-1.5 rounded-full diner-tag">
              <span className="material-symbols-outlined text-sm">verified</span>
              Inspected
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Vintage Guest Check Split Receipt Ticket (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Vintage Diner Ticket Card */}
          <div className="bg-[#FFFDF7] rounded-xl diner-border-thick p-space-md flex flex-col relative shadow-xl">
            {/* Scalloped Perforated Header Motif */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-on-surface/30">
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] uppercase tracking-widest text-primary font-black">
                  CHOW CHOW GUEST CHECK
                </span>
                <span className="font-headline-md text-headline-md uppercase text-on-surface font-extrabold leading-none">
                  ORDER #{order?.id || '8491'}
                </span>
              </div>
              <div className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded font-label-sm text-[11px] font-black diner-tag">
                {currentStatus}
              </div>
            </div>

            {/* Meta Sub-bar */}
            <div className="py-2 text-[12px] font-label-sm text-on-surface-variant border-b border-on-surface/10 flex justify-between">
              <span>SERVER: {driverName.split(' ')[0].toUpperCase()}</span>
              <span>DATE: TODAY</span>
              <span>COVERS: {order?.items?.length || 2}</span>
            </div>

            {/* Real Itemized Order Breakdown */}
            <div className="py-space-md flex flex-col gap-space-md max-h-72 overflow-y-auto">
              {order?.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 pb-2 border-b border-dashed border-on-surface/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold flex items-center justify-center diner-tag">
                          {idx + 1}
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          {item.foodItem?.name || item.name || 'Diner Item'}
                        </span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface">
                        ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                    <div className="pl-8 text-body-sm text-on-surface-variant flex justify-between">
                      <span>{item.quantity}× @ ₹{Number(item.price || 0).toFixed(2)}</span>
                      <span className="text-[11px] font-bold text-tertiary">PREPARED FRESH</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col gap-1 pb-2 border-b border-dashed border-on-surface/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold flex items-center justify-center diner-tag">
                          1
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          Route 66 Triple Bacon Stack
                        </span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface">₹12.45</span>
                    </div>
                    <div className="pl-8 text-body-sm text-on-surface-variant">1× Classic Smoked Stack</div>
                  </div>

                  <div className="flex flex-col gap-1 pb-2 border-b border-dashed border-on-surface/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] font-bold flex items-center justify-center diner-tag">
                          2
                        </span>
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          Cherry Cola Float
                        </span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-on-surface">₹5.50</span>
                    </div>
                    <div className="pl-8 text-body-sm text-on-surface-variant">1× Madagascar Vanilla Scoop</div>
                  </div>
                </>
              )}
            </div>

            {/* Calculation & Bill Tally */}
            <div className="pt-space-sm border-t-2 border-dashed border-on-surface/30 flex flex-col gap-1 font-body-sm text-body-sm text-on-surface">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal:</span>
                <span className="font-bold">₹{Number(order?.totalAmount || 17.95).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tax &amp; Road Delivery:</span>
                <span className="font-bold">₹{(Number(order?.totalAmount || 17.95) * 0.0825 + 2.50).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Courier Tip (18%):</span>
                <span className="font-bold">₹{(Number(order?.totalAmount || 17.95) * 0.18).toFixed(2)}</span>
              </div>
              <div className="mt-2 pt-2 border-t-2 border-on-surface flex justify-between items-baseline">
                <span className="font-headline-sm text-headline-sm uppercase font-extrabold">Total Paid:</span>
                <span className="font-headline-xl text-headline-xl text-primary font-black leading-none">
                  ₹{(Number(order?.totalAmount || 17.95) * 1.2625 + 2.50).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Rubber Stamp Overlay */}
            <div className="my-space-md self-center rotate-[-6deg] px-4 py-1.5 border-[3px] border-tertiary text-tertiary font-headline-sm text-headline-sm uppercase font-black tracking-widest rounded-lg opacity-85 select-none">
              ★ {order?.payment?.status === 'PAID' ? 'PAID IN FULL' : 'ROAD TICKET VALIDATED'} ★
            </div>

            {/* Action Drawer & Receipts CTA */}
            <div className="flex flex-col gap-2 mt-auto pt-space-xs">
              <button
                className="w-full py-2.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md uppercase diner-tag hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                type="button"
                onClick={() => alert(`Generated receipt for Diner Ticket #${order?.id || '8491'}!`)}
              >
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                <span>Download Itemized PDF Check</span>
              </button>
              <a
                className="w-full py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md uppercase diner-tag hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2"
                href="tel:555-0100"
              >
                <span className="material-symbols-outlined text-lg">support_agent</span>
                <span>Diner Ticket Hotline (24/7)</span>
              </a>
            </div>

            {/* Bottom Perforated Receipt Teeth Decorative Line */}
            <div className="absolute -bottom-2.5 left-2 right-2 h-2.5 flex justify-between overflow-hidden pointer-events-none opacity-40">
              <span className="text-[10px] tracking-widest text-on-surface">
                vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
              </span>
            </div>
          </div>

          {/* Quick Group Share Card */}
          <div className="bg-surface-container p-space-md rounded-xl diner-border flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">
              Share Live Tracking Link
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Send this link to booth buddies so they know exactly when {driverName.split(' ')[0]} pulls up with their food.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <input
                className="w-full bg-surface-container-lowest px-3 py-1.5 rounded-lg diner-tag font-label-sm text-label-sm text-on-surface-variant select-all"
                readOnly
                type="text"
                value={window.location.href}
              />
              <button
                className="px-3 py-1.5 bg-primary text-on-primary rounded-lg diner-tag font-label-sm text-label-sm uppercase font-bold shrink-0 hover:bg-primary-container transition-colors cursor-pointer"
                type="button"
                onClick={handleCopyTracking}
              >
                {copiedTracking ? 'COPIED!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Notification Banner */}
      <div className="mt-space-lg w-full bg-tertiary-fixed text-on-tertiary-fixed p-space-md rounded-xl diner-border flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center diner-tag shrink-0">
            <span className="material-symbols-outlined text-xl">notifications_active</span>
          </div>
          <div>
            <p className="font-headline-sm text-headline-sm uppercase font-bold leading-tight">
              Live Highway Dispatch Link Active
            </p>
            <p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">
              We broadcast live GPS updates via STOMP WebSocket every time {driverName.split(' ')[0]} reports on Route 66.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm shrink-0">
          <span className="font-label-sm text-label-sm uppercase font-extrabold bg-surface-container-lowest text-on-surface px-3 py-1.5 rounded-full diner-tag">
            AUTO-UPDATES ON (LIVE)
          </span>
        </div>
      </div>
    </div>
  );
}
