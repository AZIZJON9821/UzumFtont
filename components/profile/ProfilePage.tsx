'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api/axios';
import { ordersApi } from '@/lib/api/orders';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Package, CreditCard, User, ShieldCheck, LogOut } from 'lucide-react';
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

  if (loading && !user)
    return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 bg-[#7000ff] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {user?.fullName?.[0] || user?.phone?.[0] || '?'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {user?.fullName || "Foydalanuvchi"}
                  </h2>
                  <p className="text-slate-500 text-sm">{user?.phone}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'info', label: "Ma'lumotlar", icon: User },
                  { id: 'orders', label: "Buyurtmalar", icon: Package },
                  { id: 'addresses', label: "Manzillar", icon: MapPin },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                      ? 'bg-[#7000ff] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}

                {user && ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role?.toUpperCase()) && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#7000ff] hover:bg-[#7000ff]/5 transition-colors mt-4 border border-[#7000ff]/20"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin Panel
                  </button>
                )}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  Chiqish
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm min-h-[400px]">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              {activeTab === 'info' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Shaxsiy ma'lumotlar</h3>
                    {!editing && (
                      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                        Tahrirlash
                      </Button>
                    )}
                  </div>

                  {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">To'liq ism</label>
                          <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                          <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={loading}>Saqlash</Button>
                        <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Bekor qilish</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Telefon raqam</p>
                          <p className="font-medium">{user?.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Email</p>
                          <p className="font-medium">{user?.email || 'Kiritilmagan'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">To'liq ism</p>
                          <p className="font-medium">{user?.fullName || 'Kiritilmagan'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Profil holati</p>
                          <p className={`font-medium ${user?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {user?.isActive ? 'Faol' : 'Faol emas'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Buyurtmalar tarixi</h3>
                  {ordersLoading ? (
                    <div className="text-center py-12">Yuklanmoqda...</div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-slate-100 dark:border-slate-800 rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm">#{order.id.substring(0, 8)}</p>
                            <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#7000ff]">{order.totalAmount.toLocaleString()} so'm</p>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full font-bold uppercase">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 italic">Buyurtmalar topilmadi</div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Mening manzillarim</h3>
                  <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center text-slate-400">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Hali manzillar qo'shilmagan</p>
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
