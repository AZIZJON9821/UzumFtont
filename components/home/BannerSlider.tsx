"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
    {
        id: 1,
        title: "Yangi Yil Chegirmalari",
        subtitle: "50% gacha chegirma",
        image: "/banners/banner1.jpg",
        bgColor: "from-purple-600 to-pink-600",
    },
    {
        id: 2,
        title: "Smartfonlar",
        subtitle: "Eng yangi modellar",
        image: "/banners/banner2.jpg",
        bgColor: "from-blue-600 to-cyan-600",
    },
    {
        id: 3,
        title: "Kiyimlar",
        subtitle: "Yangi kolleksiya",
        image: "/banners/banner3.jpg",
        bgColor: "from-green-600 to-teal-600",
    },
];

export function BannerSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    return (
        <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden group">
            {/* Banners */}
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className={`min-w-full h-full bg-gradient-to-r ${banner.bgColor} flex items-center justify-center px-8 md:px-16`}
                    >
                        <div className="text-white max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h2>
                            <p className="text-lg md:text-2xl mb-6">{banner.subtitle}</p>
                            <button className="bg-white text-[#7000ff] px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                                Ko'rish
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation buttons */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="h-6 w-6 text-slate-800" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="h-6 w-6 text-slate-800" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
