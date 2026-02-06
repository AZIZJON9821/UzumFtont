"use client";

import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingCard } from '@/components/ui/Loading';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const { wishlist, loading } = useWishlist();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Sevimlilar</h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <LoadingCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const products = wishlist?.products || [];

    if (products.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Sevimlilar</h1>

                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="bg-slate-100 rounded-full p-8 mb-6">
                            <Heart className="h-20 w-20 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700 mb-2">Sevimlilar bo'sh</h2>
                        <p className="text-slate-500 mb-6">Siz hali hech qanday mahsulotni tanlamadingiz</p>
                        <a
                            href="/"
                            className="bg-[#7000ff] hover:bg-[#5c00d9] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Xarid qilishni boshlash
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Sevimlilar</h1>
                    <span className="text-slate-600">{products.length} ta mahsulot</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
