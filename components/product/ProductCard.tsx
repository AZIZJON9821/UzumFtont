"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/types';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/components/providers/AuthProvider';
import { showToast } from '../ui/Toast';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    // Eng arzon variantni topish
    const cheapestVariant = product.variants?.reduce((min, variant) => {
        const price = variant.discountPrice || variant.price;
        const minPrice = min.discountPrice || min.price;
        return price < minPrice ? variant : min;
    }, product.variants[0]);

    const price = cheapestVariant?.discountPrice || cheapestVariant?.price || 0;
    const originalPrice = cheapestVariant?.discountPrice ? cheapestVariant.price : null;
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    // Asosiy rasmni topish
    const mainImage = cheapestVariant?.images?.find(img => img.isMain) || cheapestVariant?.images?.[0];

    const handleWishlistClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!user) {
            showToast('Iltimos, avval tizimga kiring', 'error');
            router.push('/auth/login');
            return;
        }

        try {
            const isAdded = await toggleWishlist(product.id);
            showToast(
                isAdded ? 'Sevimlilarga qo\'shildi' : 'Sevimlilardan o\'chirildi',
                'success'
            );
        } catch (error) {
            showToast('Xatolik yuz berdi', 'error');
        }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!user) {
            showToast('Iltimos, avval tizimga kiring', 'error');
            router.push('/auth/login');
            return;
        }

        if (!cheapestVariant) {
            showToast('Mahsulot mavjud emas', 'error');
            return;
        }

        try {
            await addToCart({ variantId: cheapestVariant.id, quantity: 1 });
            showToast('Savatga qo\'shildi', 'success');
        } catch (error) {
            showToast('Savatga qo\'shishda xatolik', 'error');
        }
    };

    return (
        <Link href={`/product/${product.id}`}>
            <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {/* Rasm */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {mainImage?.url ? (
                        <Image
                            src={mainImage.url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ShoppingCart className="h-16 w-16" />
                        </div>
                    )}

                    {/* Chegirma badge */}
                    {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                            -{discount}%
                        </div>
                    )}

                    {/* Wishlist tugmasi */}
                    <button
                        onClick={handleWishlistClick}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
                    >
                        <Heart
                            className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'
                                }`}
                        />
                    </button>
                </div>

                {/* Ma'lumotlar */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Nomi */}
                    <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-2 group-hover:text-[#7000ff] transition-colors">
                        {product.name}
                    </h3>

                    {/* Reyting */}
                    <div className="flex items-center gap-1 mb-3">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-700">{product.rating.toFixed(1)}</span>
                        {/* <span className="text-xs text-slate-500">({product.reviewCount})</span> */}
                    </div>

                    {/* Narx */}
                    <div className="mt-auto">
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-lg font-bold text-slate-900">
                                {price.toLocaleString('uz-UZ')} so'm
                            </span>
                            {originalPrice && (
                                <span className="text-sm text-slate-400 line-through">
                                    {originalPrice.toLocaleString('uz-UZ')}
                                </span>
                            )}
                        </div>

                        {/* Savatga qo'shish tugmasi */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#7000ff] hover:bg-[#5c00d9] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Savatga
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
