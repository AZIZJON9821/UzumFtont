"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const router = useRouter();
    const { logout } = useAuth(); // Use logout from context
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);

    // Edit form state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });

    const [activeTab, setActiveTab] = useState("info"); // info, orders, addresses

    useEffect(() => {
        fetchProfile();
    }, []);

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
                            <h2 className="text-xl font-bold text-slate-900 text-center">{user?.fullName || "Ism yo'q"}</h2>
                            <p className="text-slate-500 text-sm">{user?.phone}</p>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "info" ? "bg-[#7000ff] text-white" : "hover:bg-gray-100 text-slate-700"}`}
                            >
                                Ma'lumotlarim
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "orders" ? "bg-[#7000ff] text-white" : "hover:bg-gray-100 text-slate-700"}`}
                            >
                                Buyurtmalarim
                            </button>
                            <button
                                onClick={() => setActiveTab("addresses")}
                                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "addresses" ? "bg-[#7000ff] text-white" : "hover:bg-gray-100 text-slate-700"}`}
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
                                    <h3 className="text-xl font-bold text-slate-900">Shaxsiy ma'lumotlar</h3>
                                    {!editing && (
                                        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                                            Tahrirlash
                                        </Button>
                                    )}
                                </div>

                                {editing ? (
                                    <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ism Familiya</label>
                                            <Input
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                                            <label className="block text-xs text-slate-500 uppercase font-semibold mb-1">Telefon</label>
                                            <p className="font-bold text-slate-900 text-lg">{user?.phone}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-xs text-slate-500 uppercase font-semibold mb-1">Email</label>
                                            <p className="font-bold text-slate-900 text-lg">{user?.email || "Kiritilmagan"}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-xs text-slate-500 uppercase font-semibold mb-1">Ism</label>
                                            <p className="font-bold text-slate-900 text-lg">{user?.fullName || "Kiritilmagan"}</p>
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
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Buyurtmalar tarixi</h3>
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <div className="text-4xl mb-4">📦</div>
                                    <p className="text-slate-600 font-medium">Sizda hozircha buyurtmalar yo'q</p>
                                    <Button className="mt-4" onClick={() => router.push("/")}>Xaridni boshlash</Button>
                                </div>
                            </div>
                        )}

                        {/* ADDRESSES TAB */}
                        {activeTab === "addresses" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">Manzillarim</h3>
                                    <Button size="sm">Yangi manzil qo'shish</Button>
                                </div>
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <div className="text-4xl mb-4">📍</div>
                                    <p className="text-slate-600 font-medium">Sizda saqlangan manzillar yo'q</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
