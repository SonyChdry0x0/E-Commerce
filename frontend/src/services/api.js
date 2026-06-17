// import axios from 'axios';

// const api = axios.create({ baseURL: 'http://localhost:8080/api' });

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const getProducts = (params) => api.get('/products', { params });
// export const getProduct = (id) => api.get(`/products/${id}`);
// export const loginUser = (data) => api.post('/users/login', data);
// export const registerUser = (data) => api.post('/users/register', data);
// export const createOrder = (data) => api.post('/orders', data);
// export const getMyOrders = () => api.get('/orders/myorders');



// import axios from 'axios';

// const api = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api` });

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // ─── Products ────────────────────────────────────────────
// export const getProducts  = (params) => api.get('/products', { params });
// export const getProduct   = (id)     => api.get(`/products/${id}`);
// export const createProduct = (data)  => api.post('/products', data);
// export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
// export const deleteProduct = (id)    => api.delete(`/products/${id}`);

// // ─── Users ───────────────────────────────────────────────
// export const loginUser    = (data)   => api.post('/users/login', data);
// export const registerUser = (data)   => api.post('/users/register', data);
// export const getUsers     = ()       => api.get('/users');
// export const deleteUser   = (id)     => api.delete(`/users/${id}`);
// export const toggleAdmin  = (id)     => api.put(`/users/${id}/admin`);

// // ─── Orders ──────────────────────────────────────────────
// export const createOrder  = (data)   => api.post('/orders', data);
// export const getMyOrders  = ()       => api.get('/orders/myorders');
// export const getAllOrders  = ()       => api.get('/orders');
// export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
// export const deleteOrder  = (id)     => api.delete(`/orders/${id}`);

// export default api;

import axios from 'axios';

// Detect if running on localhost or a network device
const BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : `http://${window.location.hostname}:8080`;

const api = axios.create({ baseURL: `${BASE}/api` });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Products ────────────────────────────────────────────
export const getProducts     = (params)     => api.get('/products', { params });
export const getProduct      = (id)         => api.get(`/products/${id}`);
export const createProduct   = (data)       => api.post('/products', data);
export const updateProduct   = (id, data)   => api.put(`/products/${id}`, data);
export const deleteProduct   = (id)         => api.delete(`/products/${id}`);

// ─── Users ───────────────────────────────────────────────
export const loginUser       = (data)       => api.post('/users/login', data);
export const registerUser    = (data)       => api.post('/users/register', data);
export const getUsers        = ()           => api.get('/users');
export const deleteUser      = (id)         => api.delete(`/users/${id}`);
export const toggleAdmin     = (id)         => api.put(`/users/${id}/admin`);

// ─── Orders ──────────────────────────────────────────────
export const createOrder     = (data)       => api.post('/orders', data);
export const getMyOrders     = ()           => api.get('/orders/myorders');
export const getAllOrders     = ()           => api.get('/orders');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const deleteOrder     = (id)         => api.delete(`/orders/${id}`);

export default api;