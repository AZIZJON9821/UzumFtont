'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api/axios';
import { ordersApi } from '@/lib/api/orders';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Package, CreditCard, User, LayoutDashboard } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 py-8 md:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* Premium Sidebar Navigation */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sticky top-24 transition-colors">
              <div className="flex flex-col items-center mb-8">
                <div className="h-24 w-24 bg-gradient-to-br from-[#7000ff] to-[#9c4dff] rounded-2xl flex items-center justify-center text-white font-bold text-4xl mb-4 shadow-lg shadow-[#7000ff]/20 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  {user?.fullName?.[0] || user?.phone?.[0] || '?'}
                </div>
                <h2 className="text-xl font-black text-black dark:text-white text-center line-clamp-1">
                  {user?.fullName || "Foydalanuvchi"}
                </h2>
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mt-2 transition-colors">
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-tighter">{user?.phone}</p>
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === item.id
                      ? 'bg-[#7000ff] text-white shadow-md shadow-[#7000ff]/20 scale-[1.02]'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                ))}

                {/* Admin Panel Link in Profile Sidebar */}
                {user && ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role?.toUpperCase()) && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[#7000ff] hover:bg-[#7000ff]/5 transition-all mt-2 border border-dashed border-[#7000ff]/20"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Admin Panel
                  </button>
                )}

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <span className="flex items-center justify-center h-5 w-5 rounded-full border-2 border-red-200 text-[10px] font-black group-hover:bg-red-500 group-hover:text-white transition-colors">X</span>
                    Chiqish
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 min-h-[550px] transition-all">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold">
                  {error}
                </div>
              )}

              {/* INFO TAB */}
              {activeTab === 'info' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-3xl font-black text-black dark:text-white tracking-tight">
                        Shaxsiy ma'lumotlar
                      </h3>
                      <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 font-medium italic">Profilingizni boshqarish va tahrirlash</p>
                    </div>
                    {!editing && (
                      <Button
                        variant="ghost"
                        className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#7000ff] font-black rounded-2xl px-8 h-12 transition-all active:scale-95"
                        onClick={() => setEditing(true)}
                      >
                        Tahrirlash
                      </Button>
                    )}
                  </div>

                  {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                            To'liq Ism
                          </label>
                          <Input
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl h-14 focus:ring-4 focus:ring-[#7000ff]/10 dark:text-white transition-all font-bold px-6"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({ ...formData, fullName: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                            Email Manzil
                          </label>
                          <Input
                            type="email"
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl h-14 focus:ring-4 focus:ring-[#7000ff]/10 dark:text-white transition-all font-bold px-6"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-[#7000ff] hover:bg-[#5e00d6] text-white font-black rounded-2xl px-12 h-14 shadow-xl shadow-[#7000ff]/20 transition-all active:scale-95"
                        >
                          Saqlash
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl px-10 h-14 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => setEditing(false)}
                        >
                          Bekor qilish
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-all hover:border-[#7000ff]/20">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">
                          Telefon raqam
                        </label>
                        <p className="font-black text-black dark:text-white text-xl tracking-tight">
                          {user?.phone}
                        </p>
                      </div>
                      <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-all hover:border-[#7000ff]/20">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">
                          Elektron pochta
                        </label>
                        <p className="font-black text-black dark:text-white text-xl tracking-tight">
                          {user?.email || 'Kiritilmagan'}
                        </p>
                      </div>
                      <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-all hover:border-[#7000ff]/20">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">
                          To'liq ism
                        </label>
                        <p className="font-black text-black dark:text-white text-xl tracking-tight">
                          {user?.fullName || 'Kiritilmagan'}
                        </p>
                      </div>
                      <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 transition-all hover:border-[#7000ff]/20">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">
                          Profil holati
                        </label>
                        <div className="flex items-center gap-3">
                          <span className={`h-3 w-3 rounded-full ${user?.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                          <span className={`text-base font-black ${user?.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {user?.isActive ? 'Faol' : 'Faol emas'}
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
                  <div className="mb-10">
                    <h3 className="text-3xl font-black text-black dark:text-white tracking-tight">
                      Mening buyurtmalarim
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 font-medium italic">Buyurtmalar tarixi va holati</p>
                  </div>

                  {ordersLoading ? (
                    <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/30 rounded-[3rem]">
                      <div className="relative inline-block">
                        <div className="h-16 w-16 border-4 border-slate-200 dark:border-slate-700 border-t-[#7000ff] rounded-full animate-spin" />
                      </div>
                      <p className="text-slate-400 mt-6 font-bold italic tracking-wider">Buyurtmalar yuklanmoqda...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="group border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-3xl p-6 hover:shadow-2xl hover:shadow-[#7000ff]/5 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
                            <div className="flex gap-5 items-center">
                              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-[#7000ff]/5 transition-colors">
                                <Package className="h-7 w-7 text-[#7000ff]" />
                              </div>
                              <div>
                                <h4 className="font-black text-black dark:text-white text-lg tracking-tight">
                                  #{order.id.substring(0, 8).toUpperCase()}
                                </h4>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                                  {new Date(order.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right w-full sm:w-auto">
                              <p className="font-black text-[#7000ff] text-2xl tracking-tighter">
                                {order.totalAmount.toLocaleString('uz-UZ')} so'm
                              </p>
                              <div className="flex justify-end gap-2 mt-2">
                                <span
                                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest ${order.status === 'DELIVERED'
                                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                                    : order.status === 'SHIPPED'
                                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                                      : order.status === 'PROCESSING'
                                        ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                                    }`}
                                >
                                  {order.status === 'DELIVERED' ? 'Yetkazildi' : order.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex -space-x-3">
                              {[1, 2, 3].map((_, i) => (
                                <div key={i} className="h-10 w-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shadow-sm" />
                              ))}
                              {order.items.length > 3 && (
                                <div className="h-10 w-10 rounded-full border-4 border-white dark:border-slate-900 bg-[#7000ff] flex items-center justify-center text-xs text-white font-black shadow-lg">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs font-black text-slate-400 hover:text-[#7000ff] hover:bg-[#7000ff]/5 rounded-xl px-6 h-10 border border-transparent hover:border-[#7000ff]/20 transition-all">
                              Batafsil ko'rish
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/30 rounded-[3rem]">
                      <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Package className="h-12 w-12 text-slate-200" />
                      </div>
                      <h4 className="text-black dark:text-white font-black text-xl tracking-tight">Hali buyurtmalar yo'q</h4>
                      <p className="text-slate-400 mt-2 mb-10 max-w-xs mx-auto font-medium italic">Siz hali biron bir mahsulot buyurtma qilmagansiz. Xaridni hoziroq boshlang!</p>
                      <Button
                        className="bg-[#7000ff] hover:bg-[#5e00d6] text-white font-black rounded-[1.5rem] px-12 h-16 shadow-2xl shadow-[#7000ff]/30 active:scale-95 transition-all"
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
                  <div className="mb-10">
                    <h3 className="text-3xl font-black text-black dark:text-white tracking-tight">
                      Mening manzillarim
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 font-medium italic">Buyurtmalarni yetkazish manzillari</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800/50 rounded-[2.5rem] border-4 border-dashed border-slate-50 dark:border-slate-800 p-12 flex flex-col items-center justify-center hover:border-[#7000ff]/30 transition-all group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/80">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-[#7000ff]/10 group-hover:rotate-12 transition-all duration-500">
                      <MapPin className="h-10 w-10 text-slate-200 group-hover:text-[#7000ff] transition-colors" />
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 font-black text-lg group-hover:text-black dark:group-hover:text-white transition-colors">Yangi manzil qo'shish</p>
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
