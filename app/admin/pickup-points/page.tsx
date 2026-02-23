'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { pickupPointsApi, PickupPoint } from '@/lib/api/pickup-points';
import { showToast } from '@/components/ui/Toast';
import { Plus, MapPin, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import('@/components/ui/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">Xarita yuklanmoqda...</div>
});

export default function AdminPickupPointsPage() {
    const [points, setPoints] = useState<PickupPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPoint, setCurrentPoint] = useState<Partial<PickupPoint>>({
        name: '',
        address: '',
        lat: 41.2995, // Default Tashkent
        lng: 69.2401,
        isActive: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPoints();
    }, []);

    const loadPoints = async () => {
        try {
            setLoading(true);
            const data = await pickupPointsApi.getAll();
            setPoints(data);
        } catch (error) {
            showToast('Olib ketish nuqtalarini yuklashda xatolik', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (point: PickupPoint) => {
        setCurrentPoint(point);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Haqiqatan ham ushbu nuqtani o\'chirmoqchimisiz?')) return;
        try {
            await pickupPointsApi.delete(id);
            showToast('Nuqta o\'chirildi', 'success');
            loadPoints();
        } catch (error) {
            showToast('Ochirishda xatolik', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPoint.name || !currentPoint.address || !currentPoint.lat || !currentPoint.lng) {
            showToast('Iltimos barcha maydonlarni to\'ldiring', 'error');
            return;
        }

        try {
            setSaving(true);
            if (currentPoint.id) {
                await pickupPointsApi.update(currentPoint.id, currentPoint as any);
                showToast('Nuqta yangilandi', 'success');
            } else {
                await pickupPointsApi.create(currentPoint as any);
                showToast('Yangi nuqta qo\'shildi', 'success');
            }
            setIsEditing(false);
            setCurrentPoint({
                name: '',
                address: '',
                lat: 41.2995,
                lng: 69.2401,
                isActive: true
            });
            loadPoints();
        } catch (error) {
            showToast('Saqlashda xatolik', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Olib ketish nuqtalari</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-[#7000ff] hover:bg-[#5c00d9] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Yangi nuqta
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                        {currentPoint.id ? 'Nuqtani tahrirlash' : 'Yangi nuqta qo\'shish'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nomi</label>
                                <input
                                    type="text"
                                    value={currentPoint.name}
                                    onChange={(e) => setCurrentPoint({ ...currentPoint, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7000ff]/20 focus:border-[#7000ff]"
                                    placeholder="Masalan: Uzum Yunusobod"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Manzil</label>
                                <input
                                    type="text"
                                    value={currentPoint.address}
                                    onChange={(e) => setCurrentPoint({ ...currentPoint, address: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7000ff]/20 focus:border-[#7000ff]"
                                    placeholder="Masalan: Amir Temur ko'chasi, 123-uy"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={currentPoint.lat}
                                        onChange={(e) => setCurrentPoint({ ...currentPoint, lat: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7000ff]/20 focus:border-[#7000ff]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={currentPoint.lng}
                                        onChange={(e) => setCurrentPoint({ ...currentPoint, lng: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7000ff]/20 focus:border-[#7000ff]"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={currentPoint.isActive}
                                    onChange={(e) => setCurrentPoint({ ...currentPoint, isActive: e.target.checked })}
                                    className="w-4 h-4 text-[#7000ff] border-slate-300 rounded focus:ring-[#7000ff]"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Faol (Active)</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-[#7000ff] hover:bg-[#5c00d9] text-white py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                                    Saqlash
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <X className="h-5 w-5" />
                                    Bekor qilish
                                </button>
                            </div>
                        </div>

                        <div className="h-[400px]">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Xaritadan tanlang</label>
                            <Map
                                center={[currentPoint.lat || 41.2995, currentPoint.lng || 69.2401]}
                                zoom={12}
                                onLocationSelect={(lat, lng, address) => {
                                    setCurrentPoint(prev => ({
                                        ...prev,
                                        lat,
                                        lng,
                                        address: address || prev.address
                                    }));
                                }}
                            />
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-left">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Nomi</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Manzil</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Koordinatalar</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Holat</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                    Yuklanmoqda...
                                </td>
                            </tr>
                        ) : points.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    Nuqtalar hali qo'shilmagan
                                </td>
                            </tr>
                        ) : (
                            points.map((point) => (
                                <tr key={point.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{point.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{point.address}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${point.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {point.isActive ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(point)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(point.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
