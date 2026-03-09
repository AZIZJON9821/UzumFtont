"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingCard } from '@/components/ui/Loading';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { SortDropdown } from '@/components/catalog/SortDropdown';
import { productsApi } from '@/lib/api/products';
import type { Product, ProductFilters } from '@/lib/types';
import { SlidersHorizontal, X } from 'lucide-react';

function CatalogContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const initialCategory = searchParams.get('category');

    const [filters, setFilters] = useState<ProductFilters>({
        categoryId: initialCategory || undefined,
        sortBy: 'popular',
    });

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl && categoryFromUrl !== filters.categoryId) {
            setFilters(prev => ({ ...prev, categoryId: categoryFromUrl }));
        }
    }, [searchParams]);

    useEffect(() => {
        loadProducts();
    }, [filters]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productsApi.getAll(filters);
            setProducts(data);
        } catch (error) {
            console.error('Products load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Katalog</h1>

                    <div className="flex items-center gap-4">
                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 hover:border-[#7000ff] transition-colors"
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                            Filterlar
                        </button>

                        {/* Sort */}
                        <SortDropdown
                            value={filters.sortBy || 'popular'}
                            onChange={(sortBy) => handleFilterChange({ sortBy })}
                        />
                    </div>
                </div>

                <div className="flex gap-6 relative">
                    {/* Filters Mobile Overlay (Backdrop) */}
                    {showFilters && (
                        <div
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                            onClick={() => setShowFilters(false)}
                        />
                    )}

                    {/* Filters Sidebar */}
                    <div className={`
                        ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
                        w-80 lg:w-64 bg-white lg:bg-transparent
                        transition-transform duration-300 ease-in-out
                        overflow-y-auto lg:overflow-visible
                        lg:block flex-shrink-0
                    `}>
                        <div className="lg:hidden p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                            <h3 className="font-bold text-lg">Filterlar</h3>
                            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <FilterSidebar filters={filters} onChange={handleFilterChange} />
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[...Array(12)].map((_, i) => (
                                    <LoadingCard key={i} />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                <p className="text-xl text-slate-600 mb-2">Mahsulotlar topilmadi</p>
                                <p className="text-slate-500 text-sm">Tanlangan filtrlar bo'yicha hech narsa topilmadi</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 text-slate-600 text-sm">
                                    {products.length} ta mahsulot topildi
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 py-10">
                <div className="max-w-7xl mx-auto px-6 flex gap-6">
                    <div className="hidden lg:block w-64 h-[600px] bg-white rounded-lg animate-pulse"></div>
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-slate-200 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        }>
            <CatalogContent />
        </Suspense>
    );
}
