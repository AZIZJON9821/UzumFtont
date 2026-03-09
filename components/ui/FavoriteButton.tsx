"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlistQuery, useWishlistMutation } from '@/lib/hooks/useWishlist';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { showToast } from './Toast';

interface FavoriteButtonProps {
    productId: string;
    className?: string;
}

export function FavoriteButton({ productId, className = "" }: FavoriteButtonProps) {
    const { user } = useAuth();
    const router = useRouter();
    const { data: wishlist } = useWishlistQuery(!!user);
    const mutation = useWishlistMutation();

    const isLiked = wishlist?.products?.some(p => p.id === productId) || false;

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            showToast('Iltimos, avval tizimga kiring', 'error');
            router.push('/auth/login');
            return;
        }

        // Optimistik update boshlandi
        mutation.mutate(productId);

        // Toast xabari (ixtiyoriy, lekin foydalanuvchiga tasdiq kerak)
        // setIsLiked(!isLiked) -> Bu state React Query orqali boshqariladi
    };

    return (
        <button
            onClick={handleToggle}
            disabled={mutation.isPending}
            className={`bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${className}`}
            aria-label={isLiked ? "O'chirish" : "Qo'shish"}
        >
            <Heart
                className={`h-5 w-5 transition-colors duration-200 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'
                    }`}
            />
        </button>
    );
}
