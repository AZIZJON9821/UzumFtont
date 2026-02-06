import api from './axios';
import type { Cart, AddToCartDto, UpdateCartItemDto } from '../types';

export const cartApi = {
    // Savatni olish
    get: async () => {
        const { data } = await api.get<Cart>('/cart');
        return data;
    },

    // Savatga qo'shish
    addItem: async (dto: AddToCartDto) => {
        const { data } = await api.post('/cart/add', dto);
        return data;
    },

    // Mahsulot sonini o'zgartirish
    updateItem: async (itemId: string, dto: UpdateCartItemDto) => {
        const { data } = await api.patch(`/cart/item/${itemId}`, dto);
        return data;
    },

    // Mahsulotni o'chirish
    removeItem: async (itemId: string) => {
        const { data } = await api.delete(`/cart/item/${itemId}`);
        return data;
    },

    // Savatni tozalash
    clear: async () => {
        const { data } = await api.delete('/cart/clear');
        return data;
    },
};
