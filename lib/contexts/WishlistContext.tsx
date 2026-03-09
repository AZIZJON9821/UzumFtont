"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWishlistQuery, useWishlistMutation } from '@/lib/hooks/useWishlist';
import type { Wishlist, Product } from '@/lib/types';
import { useAuth } from '@/components/providers/AuthProvider';

interface WishlistContextType {
    wishlist: Wishlist | null;
    loading: boolean;
    error: string | null;
    itemCount: number;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (productId: string) => Promise<boolean>;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const { data: wishlist, isLoading: loading, error: queryError } = useWishlistQuery(!!user);
    const mutation = useWishlistMutation();

    const [error, setError] = useState<string | null>(null);

    // Wishlist ma'lumotlari
    const itemCount = wishlist?.products?.length || 0;

    // Mahsulot wishlist'da bormi tekshirish
    const isInWishlist = (productId: string): boolean => {
        return wishlist?.products?.some((p: Product) => p.id === productId) || false;
    };

    // Wishlist'ni yangilash (Query client invalidation orqali)
    const refreshWishlist = async () => {
        // React Query'da bu avtomatik, lekin API muvofiqligi uchun qoldiramiz
    };

    // Toggle (qo'shish yoki o'chirish)
    const toggleWishlist = async (productId: string): Promise<boolean> => {
        if (!user) {
            setError('Iltimos, avval tizimga kiring');
            return false;
        }

        try {
            await mutation.mutateAsync(productId);
            // Bizga boolean qaytarish kerak, optimistic holatni tekshiramiz
            return !isInWishlist(productId);
        } catch (err: any) {
            throw err;
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist: wishlist || null,
                loading: loading || mutation.isPending,
                error: (queryError as any)?.message || error,
                itemCount,
                isInWishlist,
                toggleWishlist,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
