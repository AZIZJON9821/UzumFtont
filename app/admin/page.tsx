import Link from 'next/link';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Umumiy mahsulotlar', value: '1,234', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Bugungi buyurtmalar', value: '45', icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Foydalanuvchilar', value: '890', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Oylik daromad', value: '12,500,000 UZS', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">Boshqaruv paneli</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-black font-medium">{stat.label}</p>
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-bold text-black mb-4">Oxirgi buyurtmalar</h3>
                    <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed rounded-lg">
                        Hozircha buyurtmalar yo'q
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="text-lg font-bold text-black mb-4">Eng ko'p sotilgan mahsulotlar</h3>
                    <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed rounded-lg">
                        Ma'lumotlar mavjud emas
                    </div>
                </div>
            </div>
        </div>
    );
}
