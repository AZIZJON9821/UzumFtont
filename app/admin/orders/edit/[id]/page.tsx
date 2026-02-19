'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ordersApi } from '@/lib/api/orders';
import { usersApi } from '@/lib/api/users';

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    userId: '',
    addressId: '',
    paymentMethod: 'CASH',
    status: 'PENDING',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order details
        const order = await ordersApi.getById(id);
        setFormData({
          userId: order.userId || '',
          addressId: order.addressId || '',
          paymentMethod: order.paymentMethod || 'CASH',
          status: order.status || 'PENDING',
        });

        // Fetch users
        const userData = await usersApi.getAll();
        setUsers(userData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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
      // Update the order using the API
      await ordersApi.update(id, formData);

      // Redirect to orders list page after successful update
      window.location.href = '/admin/orders';
    } catch (error) {
      console.error('Failed to update order', error);
      alert('Buyurtma yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Buyurtma tahrirlash</h2>
        <p className="text-sm text-slate-900">
          Buyurtma ma'lumotlarini tahrirlash
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Foydalanuvchi
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          >
            <option value="">Foydalanuvchi tanlang</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Holat
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-[#7000ff]"
          >
            <option value="PENDING">Kutilmoqda</option>
            <option value="CONFIRMED">Tasdiqlangan</option>
            <option value="PROCESSING">Qayta ishlamoqda</option>
            <option value="SHIPPED">Yetkazilmoqda</option>
            <option value="DELIVERED">Yetkazildi</option>
            <option value="CANCELLED">Bekor qilingan</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-[#7000ff] hover:bg-[#5d00d6] text-white"
            disabled={loading}
          >
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
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
