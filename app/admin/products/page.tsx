"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface Product {
    id: string;
    name: string;
    slug: string;
    status: string;
    category: {
        name: string;
    };
    variants: Array<{
        price: string;
        stock: number;
    }>;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Ushbu mahsulotni o\'chirmoqchimisiz?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete product', error);
                alert('Xatolik yuz berdi');
            }
        }
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            const { data } = await api.post('/products/sync');
            alert(`Sinxronizatsiya muvaffaqiyatli yakunlandi: ${data.products} mahsulot, ${data.variants} variant.`);
            fetchProducts();
        } catch (error: any) {
            console.error('Sync failed', error);
            alert(error.response?.data?.message || 'Sinxronizatsiyada xatolik yuz berdi');
        } finally {
            setSyncing(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-black">Mahsulotlar</h2>
                    <p className="text-sm text-slate-900">Barcha mahsulotlarni boshqarish</p>
                </div>
                <div className="flex gap-2">
                    {/* <Button
                        onClick={handleSync}
                        disabled={syncing}
                        variant="outline"
                        className="border-slate-200 hover:bg-slate-50 text-black flex gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Sinxronizatsiya...' : 'Sinxronizatsiya (Odoo)'}
                    </Button> */}
                    <Link href="/admin/products/create">
                        <Button className="bg-[#7000ff] hover:bg-[#5d00d6] text-white flex gap-2">
                            <Plus className="h-4 w-4" />
                            Mahsulot qo'shish
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700" />
                        <input
                            type="text"
                            placeholder="Mahsulot qidirish..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="flex gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrlar
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">Mahsulot</th>
                                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">Kategoriya</th>
                                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">Narx</th>
                                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">Sklad</th>
                                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">Holat</th>
                                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredProducts.map((product) => {
                                const prices = product.variants.map(v => Number(v.price));
                                const minPrice = Math.min(...prices);
                                const maxPrice = Math.max(...prices);
                                const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

                                return (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{product.name}</div>
                                            <div className="text-xs text-slate-900">{product.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-black">
                                            {product.category?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-black">
                                            {minPrice === maxPrice
                                                ? `${minPrice.toLocaleString()} UZS`
                                                : `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} UZS`
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={totalStock > 0 ? 'text-slate-600' : 'text-red-500 font-medium'}>
                                                {totalStock} dona
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                product.status === 'DRAFT' ? 'bg-slate-100 text-slate-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/products/edit/${product.id}`}>
                                                    <button className="p-2 text-slate-400 hover:text-[#7000ff] hover:bg-slate-100 rounded-lg transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        Mahsulotlar topilmadi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
