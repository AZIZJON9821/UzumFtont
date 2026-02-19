import api from './axios';
import type { User } from '../types';

export const usersApi = {
  // Barcha foydalanuvchilarni olish
  getAll: async () => {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  // Bitta foydalanuvchini olish
  getById: async (id: string) => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  // Foydalanuvchini yangilash
  update: async (id: string, userData: any) => {
    const { data } = await api.patch<User>(`/users/${id}`, userData);
    return data;
  },

  // Foydalanuvchini o'chirish
  delete: async (id: string) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  // Foydalanuvchi yaratish
  create: async (userData: any) => {
    const { data } = await api.post<User>('/users', userData);
    return data;
  },
};
