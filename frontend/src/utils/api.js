// api.js - Frontend API wrapper for ecommerce application

import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token to requests
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (expired token)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    // Store token and user data in local storage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  logout: async () => {
    // Call the logout endpoint
    await api.get('/auth/logout');
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { success: true };
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from local storage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authAPI.getUser();
    return user && user.role === 'admin';
  }
};

// Products API
const productsAPI = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product with image upload
  create: async (productData) => {
    // Create form data for file uploads
    const formData = new FormData();
    
    // Add product data
    for (const key in productData) {
      if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    }
    
    // Add images
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },

  // Update product
  update: async (id, productData) => {
    // Create form data for file uploads
    const formData = new FormData();
    
    // Add product data
    for (const key in productData) {
      if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    }
    
    // Add images if provided
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get product image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return '';
    
    // Handle full URLs or relative paths
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If the path already contains "/uploads/", extract just the filename
    const filename = imagePath.includes('/uploads/') 
      ? imagePath.split('/uploads/')[1] 
      : imagePath;
      
    return `${api.defaults.baseURL}/products/images/${filename}`;
  }
};

// Orders API
const ordersAPI = {
  // Create a new order
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get all orders (admin only)
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get logged in user's orders
  getMyOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },

  // Get order by ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (admin only)
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/orders/${id}`, statusData);
    return response.data;
  }
};

// Contact API
const contactAPI = {
  // Submit contact form
  submit: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get all contact submissions (admin only)
  getAll: async () => {
    const response = await api.get('/contact');
    return response.data;
  }
};

// Combine all APIs
const apiService = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  contact: contactAPI
};

export default apiService;