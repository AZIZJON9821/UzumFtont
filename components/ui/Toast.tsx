"use client";

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div
            className={`${bgColors[type]} border rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[300px] max-w-md animate-slide-in`}
        >
            {icons[type]}
            <p className="flex-1 text-sm text-slate-800">{message}</p>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

// Toast container
let toastId = 0;

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        // Global toast function
        (window as any).showToast = (message: string, type: ToastType = 'info') => {
            const id = toastId++;
            setToasts((prev) => [...prev, { id, message, type }]);
        };
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

// Helper function
export const showToast = (message: string, type: ToastType = 'info') => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(message, type);
    }
};
