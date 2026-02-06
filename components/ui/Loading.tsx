import React from 'react';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizeClasses[size]} border-[#7000ff] border-t-transparent rounded-full animate-spin`}
            />
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-slate-600">Yuklanmoqda...</p>
            </div>
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse">
            <div className="aspect-square bg-slate-200 rounded-lg mb-3" />
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
    );
}
