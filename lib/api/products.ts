import api from './axios';
import type { Product, ProductFilters, PaginatedResponse } from '../types';

export const productsApi = {
    // Barcha mahsulotlarni olish
    getAll: async (filters?: ProductFilters) => {
        const { data } = await api.get<Product[]>('/products', { params: filters });
        return data;
    },

    // Bitta mahsulotni olish
    getById: async (id: string) => {
        const { data } = await api.get<Product>(`/products/${id}`);
        return data;
    },

    // Kategoriya bo'yicha mahsulotlar
    getByCategory: async (categoryId: string, filters?: ProductFilters) => {
        const { data } = await api.get<Product[]>('/products', {
            params: { ...filters, categoryId },
        });
        return data;
    },

    // Qidiruv
    search: async (query: string, filters?: ProductFilters) => {
        const { data } = await api.get<Product[]>('/products', {
            params: { ...filters, search: query },
        });
        return data;
    },

    // Qidiruv takliflari
    getSuggestions: async (query: string) => {
        const { data } = await api.get<{ products: string[], categories: any[] }>('/products/suggestions', {
            params: { q: query },
        });
        return data;
    },
};
