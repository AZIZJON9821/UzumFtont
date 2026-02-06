import api from './axios';
import type { Review, CreateReviewDto } from '../types';

export const reviewsApi = {
    // Mahsulot sharhlari
    getByProduct: async (productId: string) => {
        const { data } = await api.get<Review[]>(`/reviews/product/${productId}`);
        return data;
    },

    // Sharh qoldirish
    create: async (dto: CreateReviewDto) => {
        const { data } = await api.post<Review>('/reviews', dto);
        return data;
    },

    // Sharhni o'chirish
    delete: async (id: string) => {
        const { data } = await api.delete(`/reviews/${id}`);
        return data;
    },
};
