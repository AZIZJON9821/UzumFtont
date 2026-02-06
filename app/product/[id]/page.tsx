"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoadingPage } from '@/components/ui/Loading';
import { ProductGallery } from '@/components/product/ProductGallery';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ReviewsList } from '@/components/product/ReviewsList';
import { ProductsWidget } from '@/components/home/ProductsWidget';
import { productsApi } from '@/lib/api/products';
import { useCart } from '@/lib/contexts/CartContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { showToast } from '@/components/ui/Toast';
import type { Product, ProductVariant } from '@/lib/types';
import { Star, Heart, ShoppingCart, Truck, Shield } from 'lucide-react';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productsApi.getById(productId);
            setProduct(data);
            // Birinchi aktiv variantni tanlash
            const firstActive = data.variants.find((v) => v.isActive);
            setSelectedVariant(firstActive || data.variants[0]);
        } catch (error) {
            console.error('Product load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            showToast('Iltimos, variant tanlang', 'error');
            return;
        }

        if (selectedVariant.stock < quantity) {
            showToast('Omborda yetarli mahsulot yo\'q', 'error');
            return;
        }

        try {
            await addToCart({ variantId: selectedVariant.id, quantity });
            showToast('Savatga qo\'shildi!', 'success');
        } catch (error) {
            showToast('Xatolik yuz berdi', 'error');
        }
    };

    const handleWishlistToggle = async () => {
        if (!product) return;
        try {
            await toggleWishlist(product.id);
            showToast(
                isInWishlist(product.id) ? 'Sevimlilardan o\'chirildi' : 'Sevimlilarga qo\'shildi',
                'success'
            );
        } catch (error) {
            showToast('Xatolik yuz berdi', 'error');
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (!product || !selectedVariant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-slate-600">Mahsulot topilmadi</p>
            </div>
        );
    }

    const price = selectedVariant.discountPrice || selectedVariant.price;
    const originalPrice = selectedVariant.discountPrice ? selectedVariant.price : null;
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50 py-6">
            <div className="max-w-7xl mx-auto px-6">
                {/* Product Detail */}
                <div className="bg-white rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Gallery */}
                        <ProductGallery images={selectedVariant.images} />

                        {/* Info */}
                        <div>
                            {/* Title */}
                            <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-lg">{product.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-slate-500">({product.reviewCount} ta sharh)</span>
                            </div>

                            {/* Variant Selector */}
                            <VariantSelector
                                variants={product.variants}
                                selectedVariant={selectedVariant}
                                onSelect={setSelectedVariant}
                            />

                            {/* Price */}
                            <div className="bg-slate-50 rounded-lg p-4 mb-6">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-3xl font-bold text-slate-900">
                                        {price.toLocaleString('uz-UZ')} so'm
                                    </span>
                                    {originalPrice && (
                                        <span className="text-lg text-slate-400 line-through">
                                            {originalPrice.toLocaleString('uz-UZ')} so'm
                                        </span>
                                    )}
                                    {discount > 0 && (
                                        <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                                            -{discount}%
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600">
                                    Omborda: <span className="font-semibold">{selectedVariant.stock} ta</span>
                                </p>
                            </div>

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Miqdor</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-lg transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                                        className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-lg transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mb-6">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-[#7000ff] hover:bg-[#5c00d9] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ShoppingCart className="h-6 w-6" />
                                    Savatga qo'shish
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    className="w-14 h-14 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Heart
                                        className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <Truck className="h-5 w-5 text-[#7000ff]" />
                                    <span className="text-sm">Bepul yetkazib berish (50,000 so'mdan yuqori)</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-700">
                                    <Shield className="h-5 w-5 text-[#7000ff]" />
                                    <span className="text-sm">14 kun ichida qaytarish kafolati</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Tavsif</h2>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* Reviews */}
                <ReviewsList productId={product.id} />

                {/* Similar Products */}
                <div className="mt-12">
                    <ProductsWidget title="O'xshash mahsulotlar" sortBy="popular" limit={6} />
                </div>
            </div>
        </div>
    );
}
