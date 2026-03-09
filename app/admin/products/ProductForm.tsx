"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Loading';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    initialData?: any;
    productId?: string;
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // State for images
    const [images, setImages] = useState<string[]>([]);

    // State for product and main variant
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        brand: initialData?.brand || '',
        categoryId: initialData?.categoryId || '',
        status: initialData?.status || 'ACTIVE',
        // Variant info
        price: initialData?.variants?.[0]?.price ? Number(initialData?.variants?.[0]?.price) : 0,
        stock: initialData?.variants?.[0]?.stock || 0,
        sku: initialData?.variants?.[0]?.sku || '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();

        // Set initial images if editing
        if (initialData?.variants?.[0]?.images) {
            setImages(initialData.variants[0].images.map((img: any) => img.url));
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let currentProductId = productId;
            let currentVariantId = initialData?.variants?.[0]?.id;

            // 1. Create or Update Product
            const productPayload = {
                name: formData.name,
                description: formData.description,
                brand: formData.brand,
                categoryId: formData.categoryId,
                status: formData.status,
            };

            if (currentProductId) {
                await api.patch(`/products/${currentProductId}`, productPayload);
            } else {
                const { data: newProduct } = await api.post('/products', productPayload);
                currentProductId = newProduct.id;
            }

            // Kichik tanaffus (Render serveri ulanishni yopib qo'ymasligi uchun)
            await new Promise((resolve) => setTimeout(resolve, 500));

            // 2. Create or Update Variant
            const variantPayload = {
                productId: currentProductId,
                sku: formData.sku || `${formData.name.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`,
                price: Number(formData.price),
                stock: Number(formData.stock),
            };

            if (currentVariantId) {
                await api.patch(`/products/variants/${currentVariantId}`, variantPayload);
            } else {
                const { data: newVariant } = await api.post('/products/variants', variantPayload);
                currentVariantId = newVariant.id;
            }

            // Yana kichik tanaffus rasmlarga o'tishdan oldin
            await new Promise((resolve) => setTimeout(resolve, 500));

            // 3. Handle Images
            if (initialData?.variants?.[0]?.images) {
                for (const img of initialData.variants[0].images) {
                    await api.delete(`/images/${img.id}`);
                }
            }

            for (let i = 0; i < images.length; i++) {
                await api.post('/images', {
                    url: images[i],
                    productVariantId: currentVariantId,
                    isMain: i === 0,
                });
            }

            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            console.error('Submit failed', error);
            alert(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-black border-b pb-2">Asosiy ma'lumotlar</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Nomi</label>
                                <Input
                                    required
                                    placeholder="Masalan: iPhone 15 Pro"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Tavsif</label>
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full px-3 py-2 border rounded-md text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff] resize-none"
                                    placeholder="Mahsulot haqida batafsil ma'lumot..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">Kategoriya</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border rounded-md text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">Tanlang</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">Brend</label>
                                    <Input
                                        placeholder="Masalan: Apple"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-black border-b pb-2">Narx va Sklad</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Narxi (UZS)</label>
                                <Input
                                    required
                                    type="number"
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Sklad miqdori</label>
                                <Input
                                    required
                                    type="number"
                                    placeholder="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">SKU Kodi</label>
                                <Input
                                    placeholder="IPHONE-15-PRO-BLK"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Images and Status */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-black border-b pb-2">Mahsulot rasmlari</h3>
                        <ImageUpload
                            images={images}
                            onChange={setImages}
                            maxImages={6}
                        />
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-black border-b pb-2">Holat</h3>
                        <div>
                            <select
                                className="w-full px-3 py-2 border rounded-md text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="ACTIVE">Faol (Sotuvda)</option>
                                <option value="DRAFT">Qoralama</option>
                                <option value="ARCHIVED">Arxivlangan</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Bekor qilish
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-[#7000ff] hover:bg-[#5d00d6] text-white"
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner size="sm" /> : (productId ? 'Saqlash' : 'Yaratish')}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
