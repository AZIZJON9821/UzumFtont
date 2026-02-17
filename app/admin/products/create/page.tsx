"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '../ProductForm';

export default function CreateProductPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 hover:bg-white border rounded-lg transition-colors">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Yangi mahsulot</h2>
                    <p className="text-sm text-slate-500">Mahsulot ma'lumotlarini to'ldiring</p>
                </div>
            </div>

            <ProductForm />
        </div>
    );
}
