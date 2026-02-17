"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AddressModal } from "@/components/profile/AddressModal";
import { addressesApi, Address } from "@/lib/api/addresses";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash2, MapPin } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

export default function ProfilePage() {
    const router = useRouter();
    const { logout } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);

    // Edit form state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });

    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (activeTab === "addresses") {
            fetchAddresses();
        }
    }, [activeTab]);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/auth/profile");
            setUser(data);
            setFormData({
                fullName: data.fullName || "",
                email: data.email || "",
            });
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                router.push("/auth/login");
            } else {
                setError("Profilni yuklashda xatolik");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const data = await addressesApi.getAll();
            setAddresses(data);
        } catch (err: any) {
            console.error('Error fetching addresses:', err);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Manzilni o\'chirmoqchimisiz?')) return;

        try {
            await addressesApi.delete(id);
            showToast('Manzil o\'chirildi', 'success');
            fetchAddresses();
        } catch (err: any) {
            showToast('Xatolik yuz berdi', 'error');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await addressesApi.setDefault(id);
            showToast('Asosiy manzil o\'zgartirildi', 'success');
            fetchAddresses();
        } catch (err: any) {
            showToast('Xatolik yuz berdi', 'error');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.patch("/auth/profile", formData);
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

    if (loading && !user) return <div className="p-8 text-center">Yuklanmoqda...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">

                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl mb-3">
                                {user?.fullName?.[0] || user?.phone?.[0] || "?"}
                            </div>
                            <h2 className="text-xl font-bold text-black text-center">{user?.fullName || "Ism yo'q"}</h2>
                            <p className="text-slate-900 text-sm">{user?.phone}</p>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "info" ? "bg-[#7000ff] text-white" : "hover:bg-gray-100 text-black"}`}
                            >
                                Ma'lumotlarim
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "orders" ? "bg-[#7000ff] text-white" : "hover:bg-gray-100 text-black"}`}
                            >
                                Buyurtmalarim
                            </button>
                            <button
                                onClick={() => setActiveTab("addresses")}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "addresses" ? "bg-[#7000ff] text-white" : "hover:bg-gray-100 text-black"}`}
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
                        {activeTab === "info" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-black">Shaxsiy ma'lumotlar</h3>
                                    {!editing && (
                                        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                                            Tahrirlash
                                        </Button>
                                    )}
                                </div>

                                {editing ? (
                                    <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">Ism Familiya</label>
                                            <Input
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">Email</label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button type="submit" disabled={loading}>Saqlash</Button>
                                            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Bekor qilish</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-xs text-slate-900 uppercase font-semibold mb-1">Telefon</label>
                                            <p className="font-bold text-black text-lg">{user?.phone}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-xs text-slate-900 uppercase font-semibold mb-1">Email</label>
                                            <p className="font-bold text-black text-lg">{user?.email || "Kiritilmagan"}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-xs text-slate-900 uppercase font-semibold mb-1">Ism</label>
                                            <p className="font-bold text-black text-lg">{user?.fullName || "Kiritilmagan"}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-xs text-slate-500 uppercase font-semibold mb-1">Holati</label>
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user?.isActive ? "Faol" : "Faol emas"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ORDERS TAB */}
                        {activeTab === "orders" && (
                            <div>
                                <h3 className="text-xl font-bold text-black mb-6">Buyurtmalar tarixi</h3>
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <div className="text-4xl mb-4">📦</div>
                                    <p className="text-black font-medium">Sizda hozircha buyurtmalar yo'q</p>
                                    <Button className="mt-4" onClick={() => router.push("/")}>Xaridni boshlash</Button>
                                </div>
                            </div>
                        )}

                        {/* ADDRESSES TAB */}
                        {activeTab === "addresses" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-black">Manzillarim</h3>
                                    <Button size="sm" onClick={() => setShowAddressModal(true)}>
                                        Yangi manzil qo'shish
                                    </Button>
                                </div>

                                {addresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className="p-4 border border-slate-200 rounded-lg hover:border-[#7000ff] transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MapPin className="h-4 w-4 text-[#7000ff]" />
                                                            <h4 className="font-semibold text-black">
                                                                {address.city}, {address.district}
                                                            </h4>
                                                            {address.isDefault && (
                                                                <span className="px-2 py-0.5 bg-[#7000ff] text-white text-xs rounded-full">
                                                                    Asosiy
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-black text-sm">
                                                            {address.street}, {address.house}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {!address.isDefault && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleSetDefault(address.id)}
                                                            >
                                                                Asosiy qilish
                                                            </Button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <div className="text-4xl mb-4">📍</div>
                                        <p className="text-black font-medium">Sizda saqlangan manzillar yo'q</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Address Modal */}
            <AddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSuccess={fetchAddresses}
            />
        </div>
    );
}
