"use client";

import { useState, useEffect, useRef } from 'react';
import { X, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { addressesApi, CreateAddressDto } from '@/lib/api/addresses';
import { showToast } from '../ui/Toast';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddressModal({ isOpen, onClose, onSuccess }: AddressModalProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<CreateAddressDto>({
        city: 'Toshkent',
        district: '',
        street: '',
        house: '',
        isDefault: false,
        latitude: 41.2995,
        longitude: 69.2401,
    });

    // Update address from coordinates using 2GIS geocoding
    const updateAddressFromCoords = async (coords: [number, number]) => {
        try {
            // 2GIS reverse geocoding API
            const response = await fetch(
                `https://catalog.api.2gis.com/3.0/items/geocode?lat=${coords[0]}&lon=${coords[1]}&fields=items.address&key=376a27c6-14d0-4ebb-846d-c3b26961c113`
            );
            const data = await response.json();

            if (data.result?.items && data.result.items.length > 0) {
                const address = data.result.items[0].address_name || '';
                const components = address.split(', ');

                // Parse address components
                let city = 'Toshkent';
                let district = '';
                let street = '';
                let house = '';

                // Try to extract components from address string
                if (components.length >= 1) city = components[0] || 'Toshkent';
                if (components.length >= 2) district = components[1] || '';
                if (components.length >= 3) street = components[2] || '';
                if (components.length >= 4) house = components[3] || '';

                setFormData(prev => ({
                    ...prev,
                    city,
                    district,
                    street,
                    house,
                    latitude: coords[0],
                    longitude: coords[1],
                }));

                showToast('Manzil topildi', 'success');
            } else {
                // Just update coordinates if no address found
                setFormData(prev => ({
                    ...prev,
                    latitude: coords[0],
                    longitude: coords[1],
                }));
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            setFormData(prev => ({
                ...prev,
                latitude: coords[0],
                longitude: coords[1],
            }));
        }
    };

    // Initialize Leaflet Map (simpler alternative)
    useEffect(() => {
        if (!isOpen || !mapRef.current) return;

        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        if (!document.querySelector('link[href*="leaflet.css"]')) {
            document.head.appendChild(link);
        }

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            const L = window.L;

            // @ts-ignore
            const newMap = L.map(mapRef.current).setView(
                [formData.latitude || 41.2995, formData.longitude || 69.2401],
                13
            );

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(newMap);

            // Add marker
            const newMarker = L.marker(
                [formData.latitude || 41.2995, formData.longitude || 69.2401],
                { draggable: true }
            ).addTo(newMap);

            // Marker dragged
            newMarker.on('dragend', async (e: any) => {
                const coords = e.target.getLatLng();
                await updateAddressFromCoords([coords.lat, coords.lng]);
            });

            // Map clicked
            newMap.on('click', async (e: any) => {
                const coords = e.latlng;
                newMarker.setLatLng([coords.lat, coords.lng]);
                await updateAddressFromCoords([coords.lat, coords.lng]);
            });

            setMap(newMap);
            setMarker(newMarker);
        };

        if (!document.querySelector('script[src*="leaflet.js"]')) {
            document.head.appendChild(script);
        } else {
            script.onload(null as any);
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.district || !formData.street || !formData.house) {
            showToast('Barcha maydonlarni to\'ldiring', 'error');
            return;
        }

        setLoading(true);
        try {
            await addressesApi.create(formData);
            showToast('Manzil qo\'shildi', 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Xatolik yuz berdi', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-slate-900">Yangi manzil qo'shish</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Xaritadan manzilni tanlang
                        </label>
                        <div ref={mapRef} className="w-full h-[400px] rounded-lg border border-slate-300" />
                        <p className="text-xs text-slate-500 mt-2">
                            Xaritada markerni siljiting yoki bosing - manzil avtomatik to'ldiriladi
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Shahar</label>
                            <Input
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                placeholder="Toshkent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tuman</label>
                            <Input
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                placeholder="Yunusobod"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ko'cha</label>
                            <Input
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                placeholder="Amir Temur ko'chasi"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Uy raqami</label>
                            <Input
                                value={formData.house}
                                onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                                placeholder="12"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="w-4 h-4 text-[#7000ff] rounded"
                            />
                            <span className="text-sm text-slate-700">Asosiy manzil sifatida belgilash</span>
                        </label>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                            Bekor qilish
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
