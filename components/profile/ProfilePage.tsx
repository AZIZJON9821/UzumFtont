'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { ordersApi } from '@/lib/api/orders';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Package, CreditCard, User, X } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 py-8 md:py-12 transition-colors">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* Sidebar Navigation */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-24 transition-colors">
              <div className="flex flex-col items-center mb-8">
                <div className="h-24 w-24 bg-gradient-to-br from-[#7000ff] to-[#9c4dff] rounded-2xl flex items-center justify-center text-white font-bold text-4xl mb-4 shadow-lg shadow-[#7000ff]/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  {user?.fullName?.[0] || user?.phone?.[0] || '?'}
                </div>
                <h2 className="text-xl font-bold text-black dark:text-white text-center line-clamp-1">
                  {user?.fullName || "Foydalanuvchi"}
                </h2>
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mt-2 transition-colors">
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">{user?.phone}</p>
                </div>
              </div>

              <nav className="space-y-1.5">
                {[
                  { id: 'info', label: "Ma'lumotlar", icon: User },
                  { id: 'orders', label: "Buyurtmalar", icon: Package },
                  { id: 'addresses', label: "Manzillar", icon: MapPin },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${activeTab === item.id
                      ? 'bg-[#7000ff] text-white shadow-md shadow-[#7000ff]/20 scale-[1.02]'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                ))}

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                    Chiqish
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 min-h-[500px] transition-all">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* INFO TAB */}
              {activeTab === 'info' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white">
                        Shaxsiy ma'lumotlar
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">Platformadagi asosiy profilingiz ma'lumotlari</p>
                    </div>
                    {!editing && (
                      <Button
                        variant="ghost"
                        className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#7000ff] font-bold rounded-xl px-6 transition-colors"
                        onClick={() => setEditing(true)}
                      >
                        Tahrirlash
                      </Button>
                    )}
                  </div>

                  {editing ? (
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                      <div className="space-y-4 md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                              Ism Familiya
                            </label>
                            <Input
                              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 focus:ring-2 focus:ring-[#7000ff]/20 dark:text-white transition-all"
                              value={formData.fullName}
                              onChange={(e) =>
                                setFormData({ ...formData, fullName: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                              Email Manzili
                            </label>
                            <Input
                              type="email"
                              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl h-12 focus:ring-2 focus:ring-[#7000ff]/20 dark:text-white transition-all"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#7000ff] hover:bg-[#5e00d6] text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-[#7000ff]/20 transition-all active:scale-95"
                          >
                            Saqlash
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl px-8 h-12 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => setEditing(false)}
                          >
                            Bekor qilish
                          </Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">
                          Telefon raqam
                        </label>
                        <p className="font-bold text-black dark:text-white text-lg">
                          {user?.phone}
                        </p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">
                          Elektron pochta
                        </label>
                        <p className="font-bold text-black dark:text-white text-lg">
                          {user?.email || 'Kiritilmagan'}
                        </p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">
                          To'liq ism
                        </label>
                        <p className="font-bold text-black dark:text-white text-lg">
                          {user?.fullName || 'Kiritilmagan'}
                        </p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 block">
                          Profil holati
                        </label>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${user?.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className={`text-sm font-bold ${user?.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {user?.isActive ? 'Faol va tasdiqlangan' : 'Faol emas'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                      Mening buyurtmalarim
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Barcha xaridlar va ularning yetkazilish holati</p>
                  </div>

                  {ordersLoading ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl transition-colors">
                      <div className="relative inline-block">
                        <div className="h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-[#7000ff] rounded-full animate-spin" />
                      </div>
                      <p className="text-slate-500 mt-4 font-medium italic">Buyurtmalar yuklanmoqda...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="group border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 hover:shadow-lg transition-all"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div className="flex gap-4 items-center">
                              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-[#7000ff]/5 transition-colors">
                                <Package className="h-6 w-6 text-[#7000ff]" />
                              </div>
                              <div>
                                <h4 className="font-bold text-black dark:text-white">
                                  #{order.id.substring(0, 8).toUpperCase()}
                                </h4>
                                <p className="text-slate-400 text-xs font-medium">
                                  {new Date(order.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right w-full sm:w-auto">
                              <p className="font-black text-[#7000ff] text-lg">
                                {order.totalAmount.toLocaleString('uz-UZ')} so'm
                              </p>
                              <div className="flex justify-end gap-2 mt-1">
                                <span
                                  className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider ${order.status === 'DELIVERED'
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                    : order.status === 'SHIPPED'
                                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                      : order.status === 'PROCESSING'
                                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                                    }`}
                                >
                                  {order.status === 'DELIVERED' ? 'Yetkazildi' : order.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-50 dark:border-slate-800 mt-2 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 3).map((_, i) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800" />
                              ))}
                              {order.items.length > 3 && (
                                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-[#7000ff] flex items-center justify-center text-[10px] text-white font-bold">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-400 hover:text-[#7000ff] hover:bg-[#7000ff]/5 rounded-lg px-4">
                              Batafsil ko'rish
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl transition-colors">
                      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Package className="h-10 w-10 text-slate-200" />
                      </div>
                      <h4 className="text-black dark:text-white font-bold text-lg">Hali buyurtmalar yo'q</h4>
                      <p className="text-slate-500 mt-2 mb-8 max-w-xs mx-auto">Siz hali biron bir mahsulot buyurtma qilmagansiz. Xaridni hoziroq boshlang!</p>
                      <Button
                        className="bg-[#7000ff] hover:bg-[#5e00d6] text-white font-bold rounded-2xl px-10 h-12 shadow-lg shadow-[#7000ff]/20 active:scale-95 transition-all"
                        onClick={() => router.push('/')}
                      >
                        Xaridni boshlash
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                      Mening manzillarim
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Buyurtmalaringizni yetkazib berish uchun asosiy manzillar</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700 p-8 flex flex-col items-center justify-center hover:border-[#7000ff]/30 transition-colors group cursor-pointer">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#7000ff]/10 transition-colors">
                      <MapPin className="h-7 w-7 text-slate-300 group-hover:text-[#7000ff] transition-colors" />
                    </div>
                    <p className="text-slate-500 font-bold group-hover:text-black dark:group-hover:text-white transition-colors">Yangi manzil qo'shish</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
