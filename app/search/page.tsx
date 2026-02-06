"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingCard } from '@/components/ui/Loading';
import { productsApi } from '@/lib/api/products';
import type { Product, ProductFilters } from '@/lib/types';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            loadProducts();
        }
    }, [query]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productsApi.search(query);
            setProducts(data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Qidiruv natijalari: "{query}"
                    </h1>
                    {!loading && (
                        <p className="text-slate-600">
                            {products.length} ta mahsulot topildi
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <LoadingCard key={i} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-xl text-slate-600 mb-4">Mahsulotlar topilmadi</p>
                        <p className="text-slate-500">Boshqa kalit so'zlar bilan qidirib ko'ring</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="animate-pulse">
                        <div className="h-10 w-64 bg-slate-200 rounded mb-4"></div>
                        <div className="h-6 w-32 bg-slate-200 rounded mb-8"></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-slate-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
