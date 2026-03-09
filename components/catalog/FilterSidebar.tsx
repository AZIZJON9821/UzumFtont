"use client";

import React, { useEffect, useState } from 'react';
import { categoriesApi, colorsApi, sizesApi } from '@/lib/api/categories';
import type { ProductFilters, Category, Color, Size } from '@/lib/types';
import { X } from 'lucide-react';

interface FilterSidebarProps {
    filters: ProductFilters;
    onChange: (filters: Partial<ProductFilters>) => void;
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    useEffect(() => {
        loadFilters();
    }, []);

    const loadFilters = async () => {
        try {
            const [categoriesData, colorsData, sizesData] = await Promise.all([
                categoriesApi.getAll(),
                colorsApi.getAll(),
                sizesApi.getAll(),
            ]);
            setCategories(categoriesData);
            setColors(colorsData);
            setSizes(sizesData);
        } catch (error) {
            console.error('Filters load error:', error);
        }
    };

    const handlePriceChange = () => {
        onChange({
            minPrice: priceRange.min ? Number(priceRange.min) : undefined,
            maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
        });
    };

    const toggleColor = (colorId: string) => {
        const currentColors = filters.colorIds || [];
        const newColors = currentColors.includes(colorId)
            ? currentColors.filter((id) => id !== colorId)
            : [...currentColors, colorId];
        onChange({ colorIds: newColors });
    };

    const toggleSize = (sizeId: string) => {
        const currentSizes = filters.sizeIds || [];
        const newSizes = currentSizes.includes(sizeId)
            ? currentSizes.filter((id) => id !== sizeId)
            : [...currentSizes, sizeId];
        onChange({ sizeIds: newSizes });
    };

    const clearFilters = () => {
        onChange({
            categoryId: undefined,
            colorIds: [],
            sizeIds: [],
            minPrice: undefined,
            maxPrice: undefined,
        });
        setPriceRange({ min: '', max: '' });
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 lg:sticky lg:top-20 h-full lg:h-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900">Filterlar</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-[#7000ff] hover:underline flex items-center gap-1"
                >
                    <X className="h-4 w-4" />
                    Tozalash
                </button>
            </div>

            {/* Kategoriyalar */}
            <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-3">Kategoriya</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                checked={filters.categoryId === category.id}
                                onChange={() => onChange({ categoryId: category.id })}
                                className="w-4 h-4 text-[#7000ff] focus:ring-[#7000ff]"
                            />
                            <span className="text-sm text-slate-700">{category.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Narx */}
            <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-3">Narx (so'm)</h4>
                <div className="flex gap-2 mb-2">
                    <input
                        type="number"
                        placeholder="Dan"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#7000ff] focus:border-[#7000ff]"
                    />
                    <input
                        type="number"
                        placeholder="Gacha"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#7000ff] focus:border-[#7000ff]"
                    />
                </div>
                <button
                    onClick={handlePriceChange}
                    className="w-full bg-[#7000ff] hover:bg-[#5c00d9] text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Qo'llash
                </button>
            </div>

            {/* Ranglar */}
            <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-3">Rang</h4>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => toggleColor(color.id)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${filters.colorIds?.includes(color.id)
                                ? 'border-[#7000ff] scale-110'
                                : 'border-slate-300 hover:border-slate-400'
                                }`}
                            style={{ backgroundColor: color.hexCode }}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>

            {/* O'lchamlar */}
            <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-3">O'lcham</h4>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size.id}
                            onClick={() => toggleSize(size.id)}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${filters.sizeIds?.includes(size.id)
                                ? 'bg-[#7000ff] text-white border-[#7000ff]'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-[#7000ff]'
                                }`}
                        >
                            {size.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
