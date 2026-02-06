import api from './axios';
import type { Order, CreateOrderDto } from '../types';

export const ordersApi = {
    // Buyurtmalar ro'yxati
    getAll: async () => {
        const { data } = await api.get<Order[]>('/orders');
        return data;
    },

    // Bitta buyurtma
    getById: async (id: string) => {
        const { data } = await api.get<Order>(`/orders/${id}`);
        return data;
    },

    // Buyurtma yaratish
    create: async (dto: CreateOrderDto) => {
        const { data } = await api.post<Order>('/orders', dto);
        return data;
    },

    // Buyurtmani bekor qilish
    cancel: async (id: string) => {
        const { data } = await api.patch(`/orders/${id}/cancel`);
        return data;
    },
};
