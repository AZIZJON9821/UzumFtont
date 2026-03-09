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
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/catalog?category=${category.id}`}
                        className="flex-shrink-0 group/item"
                    >
                        <div className="flex flex-col items-center gap-2 w-24">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-gradient-to-br from-[#7000ff]/10 to-[#7000ff]/20 rounded-full flex items-center justify-center group-hover/item:from-[#7000ff]/20 group-hover/item:to-[#7000ff]/30 transition-all duration-200 group-hover/item:scale-110 overflow-hidden relative">
                                {category.icon ? (
                                    category.icon.startsWith('http') ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={category.icon}
                                                alt={category.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-3xl">{category.icon}</span>
                                    )
                                ) : (
                                    <span className="text-2xl font-bold text-[#7000ff]">
                                        {category.name[0]}
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <span className="text-xs text-center text-slate-700 font-medium line-clamp-2 group-hover/item:text-[#7000ff] transition-colors">
                                {category.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
