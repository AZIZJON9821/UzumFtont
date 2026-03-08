"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { wishlistApi } from '@/lib/api/wishlist';
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
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Wishlist ma'lumotlari
    const itemCount = wishlist?.products?.length || 0;

    // Mahsulot wishlist'da bormi tekshirish
    const isInWishlist = (productId: string): boolean => {
        return wishlist?.products?.some((p: Product) => p.id === productId) || false;
    };

    // Wishlist'ni yuklash
    const refreshWishlist = async () => {
        if (!user) {
            setWishlist(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await wishlistApi.get();
            setWishlist(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Sevimlilarni yuklashda xatolik');
            console.error('Wishlist load error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Toggle (qo'shish yoki o'chirish)
    const toggleWishlist = async (productId: string): Promise<boolean> => {
        if (!user) {
            setError('Iltimos, avval tizimga kiring');
            return false;
        }

        try {
            setLoading(true);
            setError(null);
            const updatedWishlist = await wishlistApi.toggle(productId);
            setWishlist(updatedWishlist);
            return updatedWishlist.products.some((p: Product) => p.id === productId);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Amalni bajarishda xatolik');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // User o'zgarganda wishlist'ni yuklash
    useEffect(() => {
        refreshWishlist();
    }, [user]);

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                error,
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
