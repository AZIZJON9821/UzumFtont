"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartApi } from '@/lib/api/cart';
import type { Cart, CartItem, AddToCartDto } from '@/lib/types';
import { useAuth } from '@/components/providers/AuthProvider';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    itemCount: number;
    totalAmount: number;
    addToCart: (dto: AddToCartDto) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cart ma'lumotlarini hisoblash
    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalAmount = cart?.items?.reduce((sum, item) => {
        const price = item.variant.discountPrice || item.variant.price;
        return sum + (price * item.quantity);
    }, 0) || 0;

    // Savatni yuklash
    const refreshCart = async () => {
        if (!user) {
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await cartApi.get();
            setCart(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Savatni yuklashda xatolik');
            console.error('Cart load error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Savatga qo'shish
    const addToCart = async (dto: AddToCartDto) => {
        if (!user) {
            setError('Iltimos, avval tizimga kiring');
            throw new Error('Iltimos, avval tizimga kiring');
        }

        try {
            setLoading(true);
            setError(null);
            await cartApi.addItem(dto);
            await refreshCart();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Savatga qo\'shishda xatolik');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Sonini o'zgartirish
    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) return;

        try {
            setLoading(true);
            setError(null);
            await cartApi.updateItem(itemId, { quantity });
            await refreshCart();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Yangilashda xatolik');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Mahsulotni o'chirish
    const removeItem = async (itemId: string) => {
        try {
            setLoading(true);
            setError(null);
            await cartApi.removeItem(itemId);
            await refreshCart();
        } catch (err: any) {
            setError(err.response?.data?.message || 'O\'chirishda xatolik');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Savatni tozalash
    const clearCart = async () => {
        try {
            setLoading(true);
            setError(null);
            await cartApi.clear();
            await refreshCart();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Tozalashda xatolik');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // User o'zgarganda savatni yuklash
    useEffect(() => {
        refreshCart();
    }, [user]);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                itemCount,
                totalAmount,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
