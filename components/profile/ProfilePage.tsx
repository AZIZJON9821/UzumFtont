'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { ordersApi } from '@/lib/api/orders';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Package, CreditCard } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import type { Order } from '@/lib/types';

export default function ProfilePageComponent() {
  const router = useRouter();
  const { logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  const [activeTab, setActiveTab] = useState('info');

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
      setFormData({
        fullName: data.fullName || '',
        email: data.email || '',
      });
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        router.push('/auth/login');
      } else {
        setError('Profilni yuklashda xatolik');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (err: any) {
      console.error('Orders fetch error:', err);
      setError("Buyurtmalar ro'yxatini yuklashda xatolik");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch('/auth/profile', formData);
      setUser(data);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "O'zgartirishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading && !user)
    return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-1/4">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col items-center mb-6">
              <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl mb-3">
                {user?.fullName?.[0] || user?.phone?.[0] || '?'}
              </div>
              <h2 className="text-xl font-bold text-black text-center">
                {user?.fullName || "Ism yo'q"}
              </h2>
              <p className="text-slate-900 text-sm">{user?.phone}</p>
            </div>

            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'bg-[#7000ff] text-white'
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                Ma'lumotlarim
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#7000ff] text-white'
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                Buyurtmalarim
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-[#7000ff] text-white'
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                Manzillarim
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-md font-medium text-red-600 hover:bg-red-50 mt-4"
              >
                Chiqish
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4">
          <div className="bg-white shadow rounded-lg p-6 min-h-[400px]">
            {error && <div className="mb-4 text-red-500">{error}</div>}

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-black">
                    Shaxsiy ma'lumotlar
                  </h3>
                  {!editing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      Tahrirlash
                    </Button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Ism Familiya
                      </label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" disabled={loading}>
                        Saqlash
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setEditing(false)}
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-xs text-slate-900 uppercase font-semibold mb-1">
                        Telefon
                      </label>
                      <p className="font-bold text-black text-lg">
                        {user?.phone}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-xs text-slate-900 uppercase font-semibold mb-1">
                        Email
                      </label>
                      <p className="font-bold text-black text-lg">
                        {user?.email || 'Kiritilmagan'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-xs text-slate-900 uppercase font-semibold mb-1">
                        Ism
                      </label>
                      <p className="font-bold text-black text-lg">
                        {user?.fullName || 'Kiritilmagan'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-xs text-slate-500 uppercase font-semibold mb-1">
                        Holati
                      </label>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                          user?.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user?.isActive ? 'Faol' : 'Faol emas'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-xl font-bold text-black mb-6">
                  Buyurtmalar tarixi
                </h3>

                {ordersLoading ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-black font-medium">Yuklanmoqda...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-slate-200 rounded-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-lg text-black">
                              #{order.id.substring(0, 8)}
                            </h4>
                            <p className="text-slate-600 text-sm">
                              {new Date(order.createdAt).toLocaleDateString(
                                'uz-UZ'
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-black">
                              {order.totalAmount.toLocaleString('uz-UZ')} so'm
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                order.status === 'DELIVERED'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'SHIPPED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'PROCESSING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status === 'DELIVERED'
                                ? 'Yetkazildi'
                                : order.status === 'SHIPPED'
                                ? 'Yetkazish jarayonida'
                                : order.status === 'PROCESSING'
                                ? 'Qayta ishlanmoqda'
                                : order.status === 'CANCELLED'
                                ? 'Bekor qilindi'
                                : order.status}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-medium text-slate-700 mb-2">
                            Mahsulotlar:
                          </h5>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-black">
                                  {item.variant?.product?.name ||
                                    "Noma'lum mahsulot"}{' '}
                                  × {item.quantity}
                                </span>
                                <span className='text-black'>
                                  {(
                                    (item.price || 0) * item.quantity
                                  ).toLocaleString('uz-UZ')}{' '}
                                  so'm
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            <span>
                              To'lov:{' '}
                              {order.paymentMethod === 'CASH'
                                ? 'Naqd pul'
                                : order.paymentMethod === 'CARD'
                                ? 'Karta'
                                : order.paymentMethod}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            <span>
                              To'lov holati:{' '}
                              {order.paymentStatus === 'PAID'
                                ? "To'landi"
                                : order.paymentStatus === 'PENDING'
                                ? 'Kutilmoqda'
                                : order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-4">📦</div>
                    <p className="text-black font-medium">
                      Sizda hozircha buyurtmalar yo'q
                    </p>
                    <Button className="mt-4" onClick={() => router.push('/')}>
                      Xaridni boshlash
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div>
                <h3 className="text-xl font-bold text-black mb-6">
                  Manzillarim
                </h3>

                {/* Static address */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-black mb-1">
                        Tashkent, Yunusobod tumani
                      </h4>
                      <p className="text-black text-sm mb-2">
                        Amir Temur ko'chasi, 123-uy
                      </p>
                      <div className="h-48 bg-gray-200 rounded-lg relative overflow-hidden">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.775342649475!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzM4LjIiTiA2OcKwMTQnMjQuNCJF!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Location Map"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Bu sizning birlamchi yetkazib berish manzilingiz. Ushbu manzil
                  buyurtmalaringizda standart sifatida foydalaniladi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
