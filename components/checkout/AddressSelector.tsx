"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api/axios';
import type { Address } from '@/lib/types';
import { Plus, MapPin, Check } from 'lucide-react';

interface AddressSelectorProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function AddressSelector({ selectedId, onSelect }: AddressSelectorProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const { data } = await api.get<Address[]>('/addresses');
            setAddresses(data);

            // Agar manzil tanlanmagan bo'lsa, default'ni tanlash
            if (!selectedId && data.length > 0) {
                const defaultAddress = data.find((addr) => addr.isDefault) || data[0];
                onSelect(defaultAddress.id);
            }
        } catch (error) {
            console.error('Addresses load error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-slate-100 rounded-lg h-24" />
                ))}
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-4">Manzil qo'shilmagan</p>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#7000ff] hover:bg-[#5c00d9] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Manzil qo'shish
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {addresses.map((address) => (
                <button
                    key={address.id}
                    onClick={() => onSelect(address.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedId === address.id
                            ? 'border-[#7000ff] bg-[#7000ff]/5'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-slate-900">{address.fullName}</p>
                                {address.isDefault && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        Asosiy
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 mb-1">{address.phone}</p>
                            <p className="text-sm text-slate-600">
                                {address.region}, {address.city}, {address.street}, {address.building}
                                {address.apartment && `, ${address.apartment}`}
                            </p>
                        </div>

                        {selectedId === address.id && (
                            <div className="flex-shrink-0 ml-3">
                                <div className="w-6 h-6 bg-[#7000ff] rounded-full flex items-center justify-center">
                                    <Check className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        )}
                    </div>
                </button>
            ))}

            <button
                onClick={() => setShowForm(true)}
                className="w-full border-2 border-dashed border-slate-300 hover:border-[#7000ff] rounded-lg p-4 flex items-center justify-center gap-2 text-slate-600 hover:text-[#7000ff] transition-colors"
            >
                <Plus className="h-5 w-5" />
                Yangi manzil qo'shish
            </button>
        </div>
    );
}
