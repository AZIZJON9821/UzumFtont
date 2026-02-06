"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
    value: string;
    onChange: (value: any) => void;
}

const sortOptions = [
    { value: 'popular', label: 'Mashxur' },
    { value: 'newest', label: 'Yangi' },
    { value: 'price_asc', label: 'Arzon narx' },
    { value: 'price_desc', label: 'Qimmat narx' },
    { value: 'rating', label: 'Reyting' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = sortOptions.find((opt) => opt.value === value);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 hover:border-[#7000ff] transition-colors min-w-[150px] justify-between"
            >
                <span className="text-sm font-medium text-slate-700">
                    {selectedOption?.label || 'Saralash'}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-full bg-white rounded-lg border border-slate-200 shadow-lg z-20 overflow-hidden">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${value === option.value ? 'bg-[#7000ff]/10 text-[#7000ff] font-medium' : 'text-slate-700'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
