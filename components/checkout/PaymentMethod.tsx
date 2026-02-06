"use client";

import React from 'react';
import { Banknote, CreditCard } from 'lucide-react';
import type { PaymentMethod as PaymentMethodType } from '@/lib/types';

interface PaymentMethodProps {
    selected: PaymentMethodType;
    onSelect: (method: PaymentMethodType) => void;
}

const paymentMethods = [
    {
        value: 'CASH' as PaymentMethodType,
        label: 'Naqd pul',
        description: 'Yetkazib berish paytida to\'lash',
        icon: Banknote,
    },
    {
        value: 'CARD' as PaymentMethodType,
        label: 'Bank kartasi',
        description: 'Visa, Mastercard, Humo, UzCard',
        icon: CreditCard,
    },
    {
        value: 'CLICK' as PaymentMethodType,
        label: 'Click',
        description: 'Click orqali to\'lash',
        icon: CreditCard,
    },
    {
        value: 'PAYME' as PaymentMethodType,
        label: 'Payme',
        description: 'Payme orqali to\'lash',
        icon: CreditCard,
    },
];

export function PaymentMethod({ selected, onSelect }: PaymentMethodProps) {
    return (
        <div className="space-y-3">
            {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selected === method.value;

                return (
                    <button
                        key={method.value}
                        onClick={() => onSelect(method.value)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                ? 'border-[#7000ff] bg-[#7000ff]/5'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#7000ff] text-white' : 'bg-slate-100 text-slate-600'
                                    }`}
                            >
                                <Icon className="h-6 w-6" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">{method.label}</p>
                                <p className="text-sm text-slate-600">{method.description}</p>
                            </div>

                            {/* Radio */}
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#7000ff]' : 'border-slate-300'
                                    }`}
                            >
                                {isSelected && <div className="w-3 h-3 bg-[#7000ff] rounded-full" />}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
