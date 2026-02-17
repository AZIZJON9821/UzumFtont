"use client";

import { useEffect, useState, use } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import ProductForm from '../../ProductForm';
import { LoadingSpinner } from '@/components/ui/Loading';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;
    if (!product) return <div className="text-center py-10">Mahsulot topilmadi</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-white border rounded-lg transition-colors">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Mahsulotni tahrirlash</h2>
                    <p className="text-sm text-slate-500">{product.name} ma'lumotlarini o'zgartirish</p>
                </div>
            </div>

            <ProductForm initialData={product} productId={id} />
        </div>
    );
}
