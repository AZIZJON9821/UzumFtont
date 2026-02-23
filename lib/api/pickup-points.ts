import api from './axios';

export interface PickupPoint {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePickupPointDto {
    name: string;
    address: string;
    lat: number;
    lng: number;
    isActive?: boolean;
}

export const pickupPointsApi = {
    getAll: async (params?: { isActive?: boolean }) => {
        const { data } = await api.get<PickupPoint[]>('/pickup-points', { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get<PickupPoint>(`/pickup-points/${id}`);
        return data;
    },

    create: async (payload: CreatePickupPointDto) => {
        const { data } = await api.post<PickupPoint>('/pickup-points', payload);
        return data;
    },

    update: async (id: string, payload: Partial<CreatePickupPointDto>) => {
        const { data } = await api.patch<PickupPoint>(`/pickup-points/${id}`, payload);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/pickup-points/${id}`);
        return data;
    },
};
