"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { ProductImage } from '@/lib/types';

interface ProductGalleryProps {
    images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                <span className="text-slate-400">Rasm yo'q</span>
            </div>
        );
    }

    const sortedImages = [...images].sort((a, b) => a.order - b.order);
    const currentImage = sortedImages[currentIndex];

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    };

    return (
        <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden mb-4 group">
                <Image
                    src={currentImage.url}
                    alt="Product"
                    fill
                    className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Navigation */}
                {sortedImages.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="h-6 w-6 text-slate-800" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="h-6 w-6 text-slate-800" />
                        </button>
                    </>
                )}

                {/* Zoom Icon */}
                <div className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-5 w-5 text-slate-700" />
                </div>
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {sortedImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                                    ? 'border-[#7000ff] scale-105'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <Image src={image.url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
