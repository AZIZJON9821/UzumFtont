"use client";

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ImageUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages = [...images];

        try {
            for (let i = 0; i < files.length; i++) {
                if (newImages.length >= maxImages) break;

                const formData = new FormData();
                formData.append('file', files[i]);

                const { data } = await api.post('/uploads/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (data.url) {
                    newImages.push(data.url);
                }
            }
            onChange(newImages);
        } catch (error) {
            console.error('Image upload failed', error);
            alert('Rasm yuklashda xatolik yuz berdi');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                        <img src={url} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 font-medium">
                                Asosiy
                            </div>
                        )}
                    </div>
                ))}

                {images.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg hover:border-[#7000ff] hover:bg-slate-50 transition-all text-slate-900 hover:text-[#7000ff]"
                    >
                        {uploading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                <Upload className="h-6 w-6 mb-2" />
                                <span className="text-xs font-medium">Rasm qo'shish</span>
                            </>
                        )}
                    </button>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/jpeg, image/png, image/webp, image/jpg"
                multiple
            />
            <p className="text-xs text-slate-700">
                Maksimal {maxImages} ta rasm. Birinchi rasm asosiy rasm hisoblanadi. (JPG, PNG, WebP)
            </p>
        </div>
    );
}
