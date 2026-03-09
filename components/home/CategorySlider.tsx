"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categoriesApi } from '@/lib/api/categories';
import type { Category } from '@/lib/types';

export function CategorySlider() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Categories load error:', error);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex gap-4 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-24 animate-pulse">
                        <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-2" />
                        <div className="h-3 bg-slate-200 rounded w-16 mx-auto" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="relative group py-6">
            {/* Header with Title & Navigation */}
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white flex items-center gap-2">
                    Ommabop kategoriyalar
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105"
                    >
                        <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Categories Grid/Slider */}
            <div
                ref={scrollRef}
                className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category, index) => {
                    const bgColors = [
                        'bg-blue-50 dark:bg-blue-900/20',
                        'bg-purple-50 dark:bg-purple-900/20',
                        'bg-orange-50 dark:bg-orange-900/20',
                        'bg-green-50 dark:bg-green-900/20',
                        'bg-pink-50 dark:bg-pink-900/20',
                        'bg-cyan-50 dark:bg-cyan-900/20'
                    ];
                    const bgColor = bgColors[index % bgColors.length];

                    return (
                        <Link
                            key={category.id}
                            href={`/catalog?category=${category.id}`}
                            className="flex-shrink-0 group/item w-28 md:w-36"
                        >
                            <div className="flex flex-col items-center gap-3">
                                {/* Card Container */}
                                <div className={`w-full aspect-square ${bgColor} rounded-3xl flex items-center justify-center transition-all duration-300 group-hover/item:scale-105 group-hover/item:shadow-xl group-hover/item:border-2 group-hover/item:border-[#7000ff]/30 overflow-hidden relative border border-transparent shadow-sm`}>
                                    {category.icon ? (
                                        category.icon.startsWith('http') ? (
                                            <div className="relative w-full h-full p-4 md:p-6">
                                                <img
                                                    src={category.icon}
                                                    alt={category.name}
                                                    className="w-full h-full object-contain transition-transform duration-500 group-hover/item:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-4xl md:text-5xl drop-shadow-sm transition-transform duration-300 group-hover/item:scale-110">
                                                {category.icon}
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-3xl md:text-4xl font-bold text-[#7000ff] opacity-80 decoration-slice">
                                            {category.name[0]}
                                        </span>
                                    )}

                                    {/* Glass Overlay Effect */}
                                    <div className="absolute inset-0 bg-white/0 group-hover/item:bg-white/5 transition-colors" />
                                </div>

                                {/* Name Label */}
                                <span className="text-xs md:text-sm text-center text-slate-800 dark:text-slate-200 font-bold line-clamp-2 px-1 group-hover/item:text-[#7000ff] transition-colors leading-tight">
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
