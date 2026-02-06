"use client";

import React from 'react';
import Link from 'next/link';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCart } from '@/lib/contexts/CartContext';
import { LoadingPage } from '@/components/ui/Loading';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { cart, loading } = useCart();

    if (loading) {
        return <LoadingPage />;
    }

    const items = cart?.items || [];

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Savat</h1>

                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="bg-slate-100 rounded-full p-8 mb-6">
                            <ShoppingBag className="h-20 w-20 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700 mb-2">Savat bo'sh</h2>
                        <p className="text-slate-500 mb-6">Hali hech narsa qo'shilmagan</p>
                        <Link
                            href="/"
                            className="bg-[#7000ff] hover:bg-[#5c00d9] text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Xarid qilishni boshlash
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Savat</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}
