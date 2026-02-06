"use client";

import React from 'react';
import type { ProductVariant } from '@/lib/types';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
    variants: ProductVariant[];
    selectedVariant: ProductVariant;
    onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
    // Ranglarni guruplash
    const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));

    // O'lchamlarni guruplash
    const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));

    // Tanlangan rang bo'yicha variantlar
    const variantsByColor = variants.filter((v) => v.color?.id === selectedVariant.color?.id);

    // Tanlangan o'lcham bo'yicha variantlar
    const variantsBySize = variants.filter((v) => v.size?.id === selectedVariant.size?.id);

    const handleColorChange = (colorId: string) => {
        const variant = variants.find(
            (v) => v.color?.id === colorId && v.size?.id === selectedVariant.size?.id
        );
        if (variant) {
            onSelect(variant);
        } else {
            // Agar o'lcham mos kelmasa, faqat rangni o'zgartirish
            const firstWithColor = variants.find((v) => v.color?.id === colorId && v.isActive);
            if (firstWithColor) onSelect(firstWithColor);
        }
    };

    const handleSizeChange = (sizeId: string) => {
        const variant = variants.find(
            (v) => v.size?.id === sizeId && v.color?.id === selectedVariant.color?.id
        );
        if (variant) {
            onSelect(variant);
        } else {
            // Agar rang mos kelmasa, faqat o'lchamni o'zgartirish
            const firstWithSize = variants.find((v) => v.size?.id === sizeId && v.isActive);
            if (firstWithSize) onSelect(firstWithSize);
        }
    };

    return (
        <div className="space-y-6 mb-6">
            {/* Ranglar */}
            {colors.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Rang: <span className="font-bold text-slate-900">{selectedVariant.color?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                            if (!color) return null;
                            const isAvailable = variants.some(
                                (v) => v.color?.id === color.id && v.isActive && v.stock > 0
                            );
                            const isSelected = selectedVariant.color?.id === color.id;

                            return (
                                <button
                                    key={color.id}
                                    onClick={() => handleColorChange(color.id)}
                                    disabled={!isAvailable}
                                    className={`relative w-12 h-12 rounded-full border-2 transition-all ${isSelected
                                            ? 'border-[#7000ff] scale-110'
                                            : isAvailable
                                                ? 'border-slate-300 hover:border-slate-400'
                                                : 'border-slate-200 opacity-50 cursor-not-allowed'
                                        }`}
                                    style={{ backgroundColor: color.hexCode }}
                                    title={color.name}
                                >
                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Check className="h-6 w-6 text-white drop-shadow-lg" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* O'lchamlar */}
            {sizes.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        O'lcham: <span className="font-bold text-slate-900">{selectedVariant.size?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            if (!size) return null;
                            const isAvailable = variants.some(
                                (v) => v.size?.id === size.id && v.isActive && v.stock > 0
                            );
                            const isSelected = selectedVariant.size?.id === size.id;

                            return (
                                <button
                                    key={size.id}
                                    onClick={() => handleSizeChange(size.id)}
                                    disabled={!isAvailable}
                                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${isSelected
                                            ? 'bg-[#7000ff] text-white border-[#7000ff]'
                                            : isAvailable
                                                ? 'bg-white text-slate-700 border-slate-300 hover:border-[#7000ff]'
                                                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                        }`}
                                >
                                    {size.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* SKU */}
            <div className="text-sm text-slate-500">
                SKU: <span className="font-mono">{selectedVariant.sku}</span>
            </div>
        </div>
    );
}
