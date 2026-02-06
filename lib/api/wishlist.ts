import api from './axios';
import type { Wishlist } from '../types';

export const wishlistApi = {
    // Sevimlilarni olish
    get: async () => {
        const { data } = await api.get<Wishlist>('/wishlist');
        return data;
    },

    // Sevimlilar qo'shish/o'chirish (toggle)
    toggle: async (productId: string) => {
        const { data } = await api.post(`/wishlist/toggle/${productId}`);
        return data;
    },
};
