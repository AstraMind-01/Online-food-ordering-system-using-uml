import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clean handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/auth/login')) {
        // Optional session notification
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.data && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      localStorage.setItem('role', res.data.data.role);
    }
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data && res.data.data && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      localStorage.setItem('role', res.data.data.role);
    }
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },
  getCurrentUser: () => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
  getUserRole: () => localStorage.getItem('role') || 'GUEST',
  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.data && res.data.data) {
      localStorage.setItem('user', JSON.stringify(res.data.data));
    }
    return res.data;
  },
  toggleOnline: async () => {
    const res = await api.patch('/auth/toggle-online');
    if (res.data && res.data.data) {
      localStorage.setItem('user', JSON.stringify(res.data.data));
    }
    return res.data;
  },
};

export const menuService = {
  getAll: async () => {
    const res = await api.get('/menu');
    return res.data && res.data.data ? res.data.data : [];
  },
};

export const restaurantService = {
  getAll: async () => {
    const res = await api.get('/restaurants');
    return res.data && res.data.data ? res.data.data : [];
  },
  getMine: async () => {
    const res = await api.get('/restaurants/mine');
    return res.data && res.data.data ? res.data.data : null;
  },
  getById: async (id) => {
    const res = await api.get(`/restaurants/${id}`);
    return res.data && res.data.data ? res.data.data : null;
  },
  updateProfile: async (id, data) => {
    const res = await api.put(`/restaurants/${id}`, data);
    return res.data && res.data.data ? res.data.data : res.data;
  },
  toggleOpen: async (id) => {
    const res = await api.patch(`/restaurants/${id}/toggle-open`);
    return res.data && res.data.data ? res.data.data : res.data;
  },
  getMenu: async (id) => {
    const res = await api.get(`/restaurants/${id}/menu`);
    return res.data && res.data.data ? res.data.data : [];
  },
  addMenuItem: async (id, item) => {
    const res = await api.post(`/restaurants/${id}/menu`, item);
    return res.data;
  },
  updateMenuItem: async (id, itemId, item) => {
    const res = await api.put(`/restaurants/${id}/menu/${itemId}`, item);
    return res.data;
  },
  deleteMenuItem: async (id, itemId) => {
    const res = await api.delete(`/restaurants/${id}/menu/${itemId}`);
    return res.data;
  },
  toggleAvailability: async (id, itemId) => {
    const res = await api.patch(`/restaurants/${id}/menu/${itemId}/availability`);
    return res.data;
  },
};

export const cartService = {
  get: async () => {
    const res = await api.get('/cart');
    return res.data && res.data.data ? res.data.data : { items: [], totalAmount: 0, itemCount: 0 };
  },
  addItem: async (foodItemId, quantity = 1) => {
    const res = await api.post('/cart/items', { foodItemId, quantity });
    return res.data && res.data.data ? res.data.data : null;
  },
  updateQuantity: async (itemId, quantity) => {
    const res = await api.put(`/cart/items/${itemId}?quantity=${quantity}`);
    return res.data && res.data.data ? res.data.data : null;
  },
  removeItem: async (itemId) => {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data && res.data.data ? res.data.data : null;
  },
  clear: async () => {
    const res = await api.delete('/cart');
    return res.data && res.data.data ? res.data.data : null;
  },
};

export const orderService = {
  create: async (data) => {
    const res = await api.post('/orders', data);
    return res.data && res.data.data ? res.data.data : null;
  },
  getOrders: async (status) => {
    const url = status ? `/orders?status=${status}` : '/orders';
    const res = await api.get(url);
    return res.data && res.data.data ? res.data.data : [];
  },
  getMyOrders: async () => {
    const res = await api.get('/orders/my');
    return res.data && res.data.data ? res.data.data : [];
  },
  getById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data && res.data.data ? res.data.data : null;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data && res.data.data ? res.data.data : null;
  },
};

export const paymentService = {
  process: async (orderId, method = 'CARD') => {
    const res = await api.post('/payments', { orderId, method });
    return res.data && res.data.data ? res.data.data : null;
  },
  getAll: async () => {
    const res = await api.get('/payments');
    return res.data && res.data.data ? res.data.data : [];
  },
  getByOrderId: async (orderId) => {
    const res = await api.get(`/payments/order/${orderId}`);
    return res.data && res.data.data ? res.data.data : null;
  },
};

export const deliveryService = {
  getAll: async () => {
    const res = await api.get('/deliveries');
    return res.data && res.data.data ? res.data.data : [];
  },
  getAvailable: async () => {
    const res = await api.get('/deliveries/available');
    return res.data && res.data.data ? res.data.data : [];
  },
  accept: async (orderId) => {
    const res = await api.post(`/deliveries/${orderId}/accept`);
    return res.data && res.data.data ? res.data.data : res.data;
  },
  getAssigned: async () => {
    const res = await api.get('/deliveries/assigned');
    return res.data && res.data.data ? res.data.data : [];
  },
  getHistory: async (period = 'ALL') => {
    const res = await api.get(`/deliveries/history?period=${period}`);
    return res.data && res.data.data ? res.data.data : [];
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/deliveries/${id}/status`, { status });
    return res.data && res.data.data ? res.data.data : null;
  },
};

export const deliveryLocationService = {
  recordLocation: async (deliveryId, { latitude, longitude, heading = 0.0, speed = 0.0 }) => {
    const res = await api.post(`/deliveries/${deliveryId}/location`, { latitude, longitude, heading, speed });
    return res.data && res.data.data ? res.data.data : null;
  },
  getLatestByDeliveryId: async (deliveryId) => {
    const res = await api.get(`/deliveries/${deliveryId}/location`);
    return res.data && res.data.data ? res.data.data : null;
  },
  getLatestByOrderId: async (orderId) => {
    const res = await api.get(`/orders/${orderId}/delivery-location`);
    return res.data && res.data.data ? res.data.data : null;
  },
  getHistoryByOrderId: async (orderId) => {
    const res = await api.get(`/orders/${orderId}/delivery-location/history`);
    return res.data && res.data.data ? res.data.data : [];
  },
};

export const groupOrderService = {
  create: async (data) => {
    const res = await api.post('/group-orders', data);
    return res.data && res.data.data ? res.data.data : null;
  },
  getAll: async () => {
    const res = await api.get('/group-orders');
    return res.data && res.data.data ? res.data.data : [];
  },
  join: async (groupCode) => {
    const res = await api.post('/group-orders/join', { groupCode });
    return res.data && res.data.data ? res.data.data : null;
  },
  getById: async (id) => {
    const res = await api.get(`/group-orders/${id}`);
    return res.data && res.data.data ? res.data.data : null;
  },
  getByCode: async (code) => {
    const res = await api.get(`/group-orders/code/${code}`);
    return res.data && res.data.data ? res.data.data : null;
  },
  addItem: async (groupOrderId, foodItemId, quantity = 1) => {
    const res = await api.post(`/group-orders/${groupOrderId}/items`, { foodItemId, quantity });
    return res.data && res.data.data ? res.data.data : null;
  },
  removeItem: async (groupOrderId, itemId) => {
    const res = await api.delete(`/group-orders/${groupOrderId}/items/${itemId}`);
    return res.data && res.data.data ? res.data.data : null;
  },
  updateDeliveryMode: async (groupOrderId, deliveryMode) => {
    const res = await api.patch(`/group-orders/${groupOrderId}/delivery-mode`, { deliveryMode });
    return res.data && res.data.data ? res.data.data : null;
  },
  place: async (groupOrderId) => {
    const res = await api.post(`/group-orders/${groupOrderId}/place`);
    return res.data && res.data.data ? res.data.data : [];
  },
  restaurantAction: async (groupOrderId, action, reason) => {
    const res = await api.patch(`/group-orders/${groupOrderId}/restaurant-action`, { action, reason });
    return res.data;
  },
};

export const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data && res.data.data ? res.data.data : null;
  },
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data && res.data.data ? res.data.data : [];
  },
  getRestaurants: async () => {
    const res = await api.get('/admin/restaurants');
    return res.data && res.data.data ? res.data.data : [];
  },
  getOrders: async () => {
    const res = await api.get('/admin/orders');
    return res.data && res.data.data ? res.data.data : [];
  },
  getPayments: async () => {
    const res = await api.get('/admin/payments');
    return res.data && res.data.data ? res.data.data : [];
  },
  getDeliveries: async () => {
    const res = await api.get('/admin/deliveries');
    return res.data && res.data.data ? res.data.data : [];
  },
  setUserActive: async (userId, active) => {
    const res = await api.patch(`/admin/users/${userId}/active?active=${active}`);
    return res.data;
  },
};

export default api;
