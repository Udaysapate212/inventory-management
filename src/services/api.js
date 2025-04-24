import axios from 'axios';
import { toast } from 'sonner';

// Combat-ready Axios instance
const api = axios.create({
  baseURL: 'https://67f7183e42d6c71cca6403bd.mockapi.io/v1/api',
  timeout: 10000, // 10s timeout
});

// Interceptor: Auto-retry failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Retry only on network errors or 5xx status
    if (!error.response || error.response.status >= 500) {
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }
      
      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount++;
        const delay = Math.min(1000 * originalRequest._retryCount, 5000); // Exponential backoff
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return api(originalRequest);
      }
    }

    // Critical error handling
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error('Session expired - Please login');
          break;
        case 403:
          toast.error('Permission denied');
          break;
        default:
          toast.error(`Server error: ${error.response.status}`);
      }
    } else {
      toast.error('Network error - Check connection');
    }

    return Promise.reject(error);
  }
);

// Nuclear launch codes
export const productAPI = {
  fetchAll: () => api.get('/products'),
  fetchById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, updates) => api.put(`/products/${id}`, updates),
  delete: (id) => api.delete(`/products/${id}`),
};

// Network status monitor
window.addEventListener('offline', () => {
  toast.warning('You are offline - Data may be stale', {
    duration: Infinity,
    action: {
      label: 'Retry',
      onClick: () => window.location.reload(),
    },
  });
});