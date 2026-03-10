"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight,
    Package, TrendingUp, AlertTriangle, X, ChevronUp, ChevronDown,
} from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';

interface Product {
    id: string;
    name: string;
    slug: string;
    brand?: string;
    status: string;
    category: { id: string; name: string };
    variants: Array<{ price: string; stock: number }>;
    createdAt: string;
}

interface Category { id: string; name: string; }

const STATUSES = ['ALL', 'ACTIVE', 'DRAFT', 'ARCHIVED', 'OUT_OF_STOCK'] as const;
const STATUS_LABELS: Record<string, string> = {
    ALL: 'Barchasi', ACTIVE: 'Faol', DRAFT: 'Qoralama',
    ARCHIVED: 'Arxiv', OUT_OF_STOCK: 'Tugagan',
};
const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    DRAFT: 'bg-slate-100 text-slate-600',
    ARCHIVED: 'bg-yellow-100 text-yellow-700',
    OUT_OF_STOCK: 'bg-red-100 text-red-700',
};

const PAGE_SIZES = [10, 25, 50];
type SortKey = 'name' | 'minPrice' | 'totalStock' | 'status' | 'createdAt';
type SortDir = 'asc' | 'desc';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW' | 'OUT'>('ALL');

    // Sort
    const [sortKey, setSortKey] = useState<SortKey>('createdAt');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [pRes, cRes] = await Promise.all([
                api.get('/products?limit=500'),
                api.get('/categories'),
            ]);
            setProducts(Array.isArray(pRes.data) ? pRes.data : pRes.data.data || []);
            setCategories(cRes.data);
        } catch (err) {
            console.error('Failed to fetch', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Ushbu mahsulotni o'chirmoqchimisiz?")) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch {
                alert('Xatolik yuz berdi');
            }
        }
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
        setPage(1);
    };

    const clearFilters = () => {
        setSearch(''); setStatusFilter('ALL'); setCategoryFilter('ALL'); setStockFilter('ALL'); setPage(1);
    };
    const hasActiveFilters = search || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || stockFilter !== 'ALL';

    // Computed product helpers
    const computed = useMemo(() =>
        products.map(p => ({
            ...p,
            minPrice: p.variants.length ? Math.min(...p.variants.map(v => Number(v.price))) : 0,
            maxPrice: p.variants.length ? Math.max(...p.variants.map(v => Number(v.price))) : 0,
            totalStock: p.variants.reduce((a, v) => a + v.stock, 0),
        })), [products]);

    // Stats
    const stats = useMemo(() => ({
        total: computed.length,
        active: computed.filter(p => p.status === 'ACTIVE').length,
        outOfStock: computed.filter(p => p.totalStock === 0).length,
        lowStock: computed.filter(p => p.totalStock > 0 && p.totalStock <= 5).length,
    }), [computed]);

    // Filter + Sort
    const processed = useMemo(() => {
        let list = [...computed];
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q));
        }
        if (statusFilter !== 'ALL') list = list.filter(p => p.status === statusFilter);
        if (categoryFilter !== 'ALL') list = list.filter(p => p.category?.id === categoryFilter);
        if (stockFilter === 'IN_STOCK') list = list.filter(p => p.totalStock > 5);
        if (stockFilter === 'LOW') list = list.filter(p => p.totalStock > 0 && p.totalStock <= 5);
        if (stockFilter === 'OUT') list = list.filter(p => p.totalStock === 0);

        list.sort((a, b) => {
            let va: any = (a as any)[sortKey] ?? '';
            let vb: any = (b as any)[sortKey] ?? '';
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return list;
    }, [computed, search, statusFilter, categoryFilter, stockFilter, sortKey, sortDir]);

    const totalPages = Math.ceil(processed.length / pageSize);
    const paginated = processed.slice((page - 1) * pageSize, page * pageSize);

    const SortIcon = ({ col }: { col: SortKey }) => (
        <span className="inline-flex flex-col ml-1">
            <ChevronUp className={`h-3 w-3 ${sortKey === col && sortDir === 'asc' ? 'text-[#7000ff]' : 'text-slate-300'}`} />
            <ChevronDown className={`h-3 w-3 -mt-1 ${sortKey === col && sortDir === 'desc' ? 'text-[#7000ff]' : 'text-slate-300'}`} />
        </span>
    );

    if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-black">Mahsulotlar</h2>
                    <p className="text-sm text-slate-500">{processed.length} ta natija</p>
                </div>
                <Link href="/admin/products/create">
                    <Button className="bg-[#7000ff] hover:bg-[#5d00d6] text-white flex gap-2">
                        <Plus className="h-4 w-4" /> Mahsulot qo'shish
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Jami', value: stats.total, icon: <Package className="h-5 w-5 text-[#7000ff]" />, bg: 'bg-purple-50' },
                    { label: 'Faol', value: stats.active, icon: <TrendingUp className="h-5 w-5 text-green-600" />, bg: 'bg-green-50' },
                    { label: 'Kam qoldi (≤5)', value: stats.lowStock, icon: <AlertTriangle className="h-5 w-5 text-orange-500" />, bg: 'bg-orange-50' },
                    { label: 'Tugagan', value: stats.outOfStock, icon: <AlertTriangle className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3 border`}>
                        <div className="p-2 bg-white rounded-lg shadow-sm">{s.icon}</div>
                        <div>
                            <div className="text-lg font-bold text-black">{s.value}</div>
                            <div className="text-xs text-slate-500">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                {/* Filter Bar */}
                <div className="p-4 border-b space-y-3">
                    <div className="flex flex-col md:flex-row gap-3 flex-wrap">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Mahsulot yoki brend qidirish..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>

                        {/* Status */}
                        <select
                            className="px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30 bg-white"
                            value={statusFilter}
                            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        >
                            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>

                        {/* Category */}
                        <select
                            className="px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30 bg-white"
                            value={categoryFilter}
                            onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                        >
                            <option value="ALL">Barcha kategoriya</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>

                        {/* Stock */}
                        <select
                            className="px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30 bg-white"
                            value={stockFilter}
                            onChange={e => { setStockFilter(e.target.value as any); setPage(1); }}
                        >
                            <option value="ALL">Barcha sklad</option>
                            <option value="IN_STOCK">Mavjud ({'>'} 5)</option>
                            <option value="LOW">Kam qoldi (1–5)</option>
                            <option value="OUT">Tugagan (0)</option>
                        </select>

                        {/* Page size */}
                        <select
                            className="px-3 py-2 border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#7000ff]/30 bg-white"
                            value={pageSize}
                            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                            {PAGE_SIZES.map(s => <option key={s} value={s}>{s} ta</option>)}
                        </select>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <X className="h-4 w-4" /> Tozalash
                            </button>
                        )}
                    </div>

                    {/* Status chips */}
                    <div className="flex flex-wrap gap-2">
                        {STATUSES.map(s => (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${statusFilter === s
                                        ? 'bg-[#7000ff] text-white border-[#7000ff]'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#7000ff] hover:text-[#7000ff]'
                                    }`}
                            >
                                {STATUS_LABELS[s]}
                                {s !== 'ALL' && (
                                    <span className="ml-1 opacity-70">
                                        ({products.filter(p => p.status === s).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#7000ff] select-none" onClick={() => handleSort('name')}>
                                    <span className="flex items-center">Mahsulot <SortIcon col="name" /></span>
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategoriya</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#7000ff] select-none" onClick={() => handleSort('minPrice')}>
                                    <span className="flex items-center">Narx <SortIcon col="minPrice" /></span>
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#7000ff] select-none" onClick={() => handleSort('totalStock')}>
                                    <span className="flex items-center">Sklad <SortIcon col="totalStock" /></span>
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-[#7000ff] select-none" onClick={() => handleSort('status')}>
                                    <span className="flex items-center">Holat <SortIcon col="status" /></span>
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginated.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{p.name}</div>
                                        {p.brand && <div className="text-xs text-slate-400 mt-0.5">{p.brand}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{p.category?.name || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                        {p.variants.length === 0 ? '-' :
                                            p.minPrice === p.maxPrice
                                                ? `${p.minPrice.toLocaleString()} UZS`
                                                : `${p.minPrice.toLocaleString()} – ${p.maxPrice.toLocaleString()}`
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={
                                            p.totalStock === 0 ? 'text-red-500 font-semibold' :
                                                p.totalStock <= 5 ? 'text-orange-500 font-semibold' :
                                                    'text-slate-600'
                                        }>
                                            {p.totalStock} dona
                                            {p.totalStock === 0 && <span className="ml-1 text-xs">(tugagan)</span>}
                                            {p.totalStock > 0 && p.totalStock <= 5 && <span className="ml-1 text-xs">(kam)</span>}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${STATUS_COLORS[p.status] || 'bg-slate-100 text-slate-700'}`}>
                                            {STATUS_LABELS[p.status] || p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/products/edit/${p.id}`}>
                                                <button className="p-2 text-slate-400 hover:text-[#7000ff] hover:bg-purple-50 rounded-lg transition-colors">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Package className="h-10 w-10 opacity-30" />
                                            <p className="text-sm">Mahsulotlar topilmadi</p>
                                            {hasActiveFilters && (
                                                <button onClick={clearFilters} className="text-xs text-[#7000ff] hover:underline">
                                                    Filtrlarni tozalash
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-sm text-slate-500">
                            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, processed.length)} / {processed.length} ta
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-lg border hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pg = i + 1;
                                if (totalPages > 5 && page > 3) pg = page - 2 + i;
                                if (pg > totalPages) return null;
                                return (
                                    <button
                                        key={pg}
                                        onClick={() => setPage(pg)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === pg ? 'bg-[#7000ff] text-white' : 'border hover:bg-slate-50 text-slate-700'
                                            }`}
                                    >
                                        {pg}
                                    </button>
                                );
                            })}
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-lg border hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
