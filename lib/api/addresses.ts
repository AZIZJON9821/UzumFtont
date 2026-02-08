import api from './axios';

export interface Address {
    id: string;
    city: string;
    district: string;
    street: string;
    house: string;
    isDefault: boolean;
    latitude?: number;
    longitude?: number;
}

export interface CreateAddressDto {
    city: string;
    district: string;
    street: string;
    house: string;
    isDefault?: boolean;
    latitude?: number;
    longitude?: number;
}

export const addressesApi = {
    // Get all user addresses
    getAll: async (): Promise<Address[]> => {
        const { data } = await api.get('/addresses');
        return data;
    },

    // Create new address
    create: async (dto: CreateAddressDto): Promise<Address> => {
        const { data } = await api.post('/addresses', dto);
        return data;
    },

    // Update address
    update: async (id: string, dto: Partial<CreateAddressDto>): Promise<Address> => {
        const { data } = await api.patch(`/addresses/${id}`, dto);
        return data;
    },

    // Delete address
    delete: async (id: string): Promise<void> => {
        await api.delete(`/addresses/${id}`);
    },

    // Set default address
    setDefault: async (id: string): Promise<Address> => {
        const { data } = await api.patch(`/addresses/${id}/default`);
        return data;
    },
};
