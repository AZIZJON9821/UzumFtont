import api from './axios';
import type { Category, Color, Size, Brand } from '../types';

export const categoriesApi = {
    // Barcha kategoriyalar
    getAll: async () => {
        const { data } = await api.get<Category[]>('/categories');
        return data;
    },

    // Bitta kategoriya
    getById: async (id: string) => {
        const { data } = await api.get<Category>(`/categories/${id}`);
        return data;
    },
};

export const colorsApi = {
    getAll: async () => {
        const { data } = await api.get<Color[]>('/colors');
        return data;
    },
};

export const sizesApi = {
    getAll: async () => {
        const { data } = await api.get<Size[]>('/sizes');
        return data;
    },
};

export const brandsApi = {
    getAll: async () => {
        const { data } = await api.get<Brand[]>('/brands');
        return data;
    },
};
