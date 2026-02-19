'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ordersApi } from '@/lib/api/orders';

export default function CreateOrderPage() {
  const [formData, setFormData] = useState({
    addressId: '',
    paymentMethod: 'CASH' as const,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ordersApi.create(formData);
      // Redirect to orders list page after successful creation
      window.location.href = '/admin/orders';
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Buyurtma yaratishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Buyurtma yaratish</h2>
        <p className="text-sm text-slate-900">Yangi buyurtma qo'shish</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Manzil ID
          </label>
          <input
            type="text"
            name="addressId"
            value={formData.addressId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            To'lov usuli
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          >
            <option value="CASH">Naqd</option>
            <option value="CARD">Karta</option>
            <option value="CLICK">Click</option>
            <option value="PAYME">Payme</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-[#7000ff] hover:bg-[#5d00d6] text-white"
            disabled={loading}
          >
            {loading ? 'Saqlanmoqda...' : 'Yaratish'}
          </Button>
          <Link href="/admin/orders">
            <Button type="button" variant="outline">
              Bekor qilish
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
