import axios from 'axios';

// Backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uzumbec.onrender.com';

// Axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - token qo'shish
api.interceptors.request.use(
    (config) => {
        // LocalStorage'dan token olish
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xatolarni boshqarish
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Auto retry logic (max 3 retries)
        if (config && (!config._retryCount || config._retryCount < 3)) {
            // Check if it's a network error or 5xx server error
            if (!error.response || error.code === 'ERR_NETWORK' || error.response.status >= 500) {
                config._retryCount = config._retryCount ? config._retryCount + 1 : 1;

                // Backoff delay: 1s, 2s, 3s...
                const delayRetryRequest = new Promise<void>((resolve) => {
                    setTimeout(() => resolve(), config._retryCount * 1200);
                });

                await delayRetryRequest;
                return api(config);
            }
        }

        // 401 bo'lganda avtomatik redirectni olib tashlaymiz, 
        // chunki bu AuthProvider'da boshqariladi.
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
