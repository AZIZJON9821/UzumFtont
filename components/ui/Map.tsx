'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2 } from 'lucide-react';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    center: [number, number];
    zoom?: number;
    onLocationSelect?: (lat: number, lng: number, address?: string) => void;
    markers?: { lat: number; lng: number; label?: string }[];
    readOnly?: boolean;
    showSearch?: boolean;
}

function LocationMarker({ onLocationSelect, position, readOnly }: {
    onLocationSelect?: (lat: number, lng: number) => void;
    position: [number, number] | null;
    readOnly?: boolean;
}) {
    useMapEvents({
        click(e) {
            if (!readOnly && onLocationSelect) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={DefaultIcon} />
    );
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function Map({
    center,
    zoom = 13,
    onLocationSelect,
    markers = [],
    readOnly = false,
    showSearch = true
}: MapProps) {
    const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(
        onLocationSelect ? center : null
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (onLocationSelect) {
            setCurrentPosition(center);
        }
    }, [center, onLocationSelect]);

    const handleSelect = (lat: number, lng: number) => {
        setCurrentPosition([lat, lng]);
        if (onLocationSelect) {
            onLocationSelect(lat, lng);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            setIsSearching(true);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);

                setCurrentPosition([newLat, newLng]);
                if (onLocationSelect) {
                    onLocationSelect(newLat, newLng, display_name);
                }
            } else {
                alert('Manzil topilmadi');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('Qidiruvda xatolik yuz berdi');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="h-full w-full relative rounded-lg overflow-hidden border border-slate-200">
            {showSearch && (
                <div className="absolute top-4 left-12 right-4 z-[1000]">
                    <div className="flex gap-2 text-slate-900">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearch();
                                    }
                                }}
                                placeholder="Manzilni qidiring..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#7000ff]/20 focus:border-[#7000ff]"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="bg-[#7000ff] hover:bg-[#5c00d9] text-white px-4 py-2 rounded-lg shadow-md font-medium transition-colors disabled:opacity-50"
                        >
                            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Qidirish'}
                        </button>
                    </div>
                </div>
            )}

            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; Google'
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                />
                <ChangeView center={currentPosition || center} zoom={zoom} />

                {onLocationSelect && (
                    <LocationMarker
                        position={currentPosition}
                        onLocationSelect={handleSelect}
                        readOnly={readOnly}
                    />
                )}

                {markers.map((marker, index) => (
                    <Marker key={index} position={[marker.lat, marker.lng]} icon={DefaultIcon}>
                        {marker.label && (
                            <Popup>
                                {marker.label}
                            </Popup>
                        )}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
