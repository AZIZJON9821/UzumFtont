'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import type { Order } from '@/lib/types';
import { useAuth } from '@/components/providers/AuthProvider';

// Extend the Order type to include orderNumber for display purposes
interface DisplayOrder extends Order {
  orderNumber?: number;
}

export default function AdminOrdersPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getAllOrders();
      // Map the data to add orderNumber from the ID for display purposes
      const ordersWithNumbers = data.map((order, index) => ({
        ...order,
        orderNumber: index + 1,
      }));
      setOrders(ordersWithNumbers);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchOrders();
    }
  }, [authLoading, authUser]);

  const handleDelete = async (id: string) => {
    if (confirm("Ushbu buyurtmani o'chirmoqchimisiz?")) {
      try {
        // In a real implementation, you would call an API to delete the order
        // await api.delete(`/orders/${id}`);
        setOrders(orders.filter((o) => o.id !== id));
      } catch (error) {
        console.error('Failed to delete order', error);
        alert('Xatolik yuz berdi');
      }
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.includes(searchTerm) ||
      (o.user?.fullName &&
        o.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Buyurtmalar</h2>
          <p className="text-sm text-slate-900">
            Barcha buyurtmalarni boshqarish
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders/create">
            <Button className="bg-[#7000ff] hover:bg-[#5d00d6] text-white flex gap-2">
              <Plus className="h-4 w-4" />
              Buyurtma qo'shish
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
              placeholder="Buyurtma qidirish..."
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
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Buyurtma Raqami
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Umumiy Summa
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider text-right">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      #{order.orderNumber || order.id.substring(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {order.user?.fullName || "Noma'lum"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${order.status === 'DELIVERED' ||
                          order.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'PENDING' ||
                            order.status === 'PROCESSING' ||
                            order.status === 'SHIPPED'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {order.totalAmount?.toLocaleString()} UZS
                  </td>
                  <td className="px-6 py-4 text-sm text-black">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/orders/edit/${order.id}`}>
                        <button className="p-2 text-slate-400 hover:text-[#7000ff] hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Buyurtmalar topilmadi
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
