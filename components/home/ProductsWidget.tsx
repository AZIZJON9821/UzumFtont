"use client";

import React, { useEffect, useState } from 'react';
import { ProductCard } from '../product/ProductCard';
import { LoadingCard } from '../ui/Loading';
import { productsApi } from '@/lib/api/products';
import type { Product } from '@/lib/types';

interface ProductsWidgetProps {
    title: string;
    sortBy?: 'popular' | 'newest' | 'price_asc';
    limit?: number;
}

export function ProductsWidget({ title, sortBy = 'popular', limit = 10 }: ProductsWidgetProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, [sortBy]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productsApi.getAll({ sortBy, limit });
            setProducts(data);
        } catch (error) {
            console.error('Products load error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-12">
            {/* Title */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <button className="text-[#7000ff] font-medium hover:underline">
                    Barchasini ko'rish
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {loading ? (
                    <>
                        {[...Array(limit)].map((_, i) => (
                            <LoadingCard key={i} />
                        ))}
                    </>
                ) : (
                    <>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
