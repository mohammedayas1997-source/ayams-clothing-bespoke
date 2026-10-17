import axios from 'axios';

// Yana duba ko akwai URL na Vercel / Live Server, idan babu sai ya dauki na gida (localhost)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Zuba Token kai tsaye idan ma'aikaci ya yi login
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ayams_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchCustomer = (query) => API.get(`/customers/search?q=${query}`);
export const getCustomerDetails = (id) => API.get(`/customers/${id}`);
export const createCustomer = (data) => API.post('/customers', data);
export const createOrder = (orderData) => API.post('/orders', orderData);
export const recordPayment = (paymentData) => API.post('/payments/record', paymentData);
export const reprintReceipt = (orderId) => API.post(`/staff/reprint/${orderId}`);

// Gallery & Client Portal APIs
export const getGalleryStyles = () => API.get('/gallery');
export const addGalleryStyle = (data) => API.post('/gallery', data);
export const updateGalleryStyle = (id, data) => API.put(`/gallery/${id}`, data);
export const deleteGalleryStyle = (id) => API.delete(`/gallery/${id}`);
export const customerPortalAuth = (data) => API.post('/shop/auth', data);
export const createDirectPurchase = (data) => API.post('/shop/buy', data);

export default API;