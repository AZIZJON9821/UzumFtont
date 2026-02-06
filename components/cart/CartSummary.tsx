"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { Truck, Tag } from 'lucide-react';

export function CartSummary() {
    const router = useRouter();
    const { cart, totalAmount, itemCount } = useCart();

    const deliveryFee = totalAmount >= 50000 ? 0 : 15000;
    const finalTotal = totalAmount + deliveryFee;

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <div className="bg-white rounded-lg p-6 sticky top-20">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Buyurtma</h3>

            {/* Items count */}
            <div className="flex justify-between text-slate-700 mb-3">
                <span>Mahsulotlar ({itemCount} ta):</span>
                <span className="font-semibold">{totalAmount.toLocaleString('uz-UZ')} so'm</span>
            </div>

            {/* Delivery */}
            <div className="flex justify-between text-slate-700 mb-4">
                <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Yetkazib berish:
                </span>
                <span className="font-semibold">
                    {deliveryFee === 0 ? (
                        <span className="text-green-600">Bepul</span>
                    ) : (
                        `${deliveryFee.toLocaleString('uz-UZ')} so'm`
                    )}
                </span>
            </div>

            {/* Free delivery notice */}
            {deliveryFee > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                        <Tag className="h-4 w-4 text-blue-600 mt-0.5" />
                        <p className="text-xs text-blue-700">
                            Yana <strong>{(50000 - totalAmount).toLocaleString('uz-UZ')} so'm</strong> xarid
                            qiling va bepul yetkazib berishdan foydalaning!
                        </p>
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-200 my-4" />

            {/* Total */}
            <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
                <span>Jami:</span>
                <span className="text-2xl text-[#7000ff]">{finalTotal.toLocaleString('uz-UZ')} so'm</span>
            </div>

            {/* Checkout Button */}
            <button
                onClick={handleCheckout}
                className="w-full bg-[#7000ff] hover:bg-[#5c00d9] text-white py-4 rounded-lg font-bold text-lg transition-colors"
            >
                Rasmiylashtirish
            </button>

            {/* Info */}
            <div className="mt-4 space-y-2 text-xs text-slate-500">
                <p className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-400 rounded-full" />
                    Xavfsiz to'lov
                </p>
                <p className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-400 rounded-full" />
                    14 kun ichida qaytarish
                </p>
            </div>
        </div>
    );
}
