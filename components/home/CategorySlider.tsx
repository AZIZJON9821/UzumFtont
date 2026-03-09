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
        <div className="relative group">
            {/* Scroll buttons */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
            >
                <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>

            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
            >
                <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>

            {/* Categories */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category, index) => {
                    const gradients = [
                        'from-blue-500/10 to-blue-600/5',
                        'from-purple-500/10 to-purple-600/5',
                        'from-orange-500/10 to-orange-600/5',
                        'from-green-500/10 to-green-600/5',
                        'from-pink-500/10 to-pink-600/5',
                        'from-cyan-500/10 to-cyan-600/5'
                    ];
                    const gradient = gradients[index % gradients.length];

                    return (
                        <Link
                            key={category.id}
                            href={`/catalog?category=${category.id}`}
                            className="flex-shrink-0 group/item w-24 md:w-28"
                        >
                            <div className="flex flex-col items-center gap-3">
                                {/* Premium Circular Container */}
                                <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${gradient} dark:from-slate-800 dark:to-slate-900 flex items-center justify-center transition-all duration-500 group-hover/item:scale-110 group-hover/item:shadow-[0_0_20px_rgba(112,0,255,0.2)] border border-[#7000ff]/5 dark:border-white/5 overflow-hidden shadow-sm`}>

                                    {/* Glassmorphism Background layer */}
                                    <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-[2px] opacity-0 group-hover/item:opacity-100 transition-opacity" />

                                    {category.icon ? (
                                        category.icon.startsWith('http') ? (
                                            <div className="relative w-full h-full z-10 transition-transform duration-500 group-hover/item:scale-110">
                                                <img
                                                    src={category.icon}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-3xl md:text-4xl drop-shadow-md z-10 transition-transform duration-500 group-hover/item:scale-110">
                                                {category.icon}
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-2xl md:text-3xl font-black text-[#7000ff] opacity-80 z-10">
                                            {category.name[0]}
                                        </span>
                                    )}

                                    {/* Shine reflection effect */}
                                    <div className="absolute -inset-full top-0 block w-1/2 h-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/item:animate-[shine_1s_ease-in-out]" />
                                </div>

                                {/* Premium Name Label */}
                                <span className="text-[11px] md:text-xs text-center text-slate-800 dark:text-slate-200 font-bold line-clamp-2 px-1 group-hover/item:text-[#7000ff] transition-colors leading-tight min-h-[2.5em] flex items-center justify-center">
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
