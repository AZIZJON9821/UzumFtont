"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '@/lib/contexts/CartContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';

export function Header() {
    const { user } = useAuth();
    const router = useRouter();
    const { itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white flex flex-col">
            {/* Top Bar for Language & Location (Optional - for future) */}
            <div className="bg-[#f0f2f5] py-1 text-xs text-black hidden md:block">
                <div className="max-w-7xl mx-auto px-6 flex justify-between">
                    <span>Shahar: Toshkent</span>
                    <div className="flex gap-4">
                        <span>Buyurtmalarim</span>
                        <span className="font-bold">O'zbekcha</span>
                    </div>
                </div>
            </div>

            <div className="border-b">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
                    {/* Logo & Catalog */}
                    <div className="flex items-center gap-4 shrink-0">
                        <Link href="/" className="text-3xl font-bold text-[#7000ff] tracking-tight">
                            uzum market
                        </Link>
                    </div>

                    {/* Catalog Button */}
                    <Link href="/catalog">
                        <Button className="hidden md:flex gap-2 bg-[#f0f2f5] text-[#7000ff] hover:bg-[#e6e8eb] border-none font-medium px-4">
                            <Menu className="h-5 w-5" />
                            Katalog
                        </Button>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-3xl hidden md:block">
                        <form onSubmit={handleSearch} className="relative flex h-10 border border-slate-300 rounded-md overflow-hidden hover:border-slate-400 focus-within:border-[#7000ff]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Mahsulot va toifalarni qidirish"
                                className="w-full h-full pl-4 pr-12 focus:outline-none text-sm text-black placeholder:text-slate-400"
                            />
                            <button type="submit" className="absolute right-0 top-0 h-full px-6 bg-[#f0f2f5] hover:bg-[#e6e8eb] text-slate-500 border-l border-slate-200">
                                <Search className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role) && (
                                    <Link href="/admin" className="text-black hover:text-[#7000ff]" title="Admin Panel">
                                        <ShieldCheck className="h-6 w-6" />
                                    </Link>
                                )}
                                <Link href="/profile" className="flex items-center gap-2 text-black hover:text-slate-900">
                                    <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-[#7000ff] font-bold">
                                        {user.fullName?.[0] || <User className="h-5 w-5" />}
                                    </div>
                                    <span className="text-sm font-medium hidden lg:inline truncate max-w-[100px]">{user.fullName || "Kabinet"}</span>
                                </Link>
                            </div>
                        ) : (
                            <Link href="/auth/login" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
                                <User className="h-6 w-6" />
                                <span className="text-sm font-medium hidden lg:inline">Kirish</span>
                            </Link>
                        )}

                        <Link href="/wishlist" className="flex items-center gap-2 text-black hover:text-slate-900">
                            <div className="relative">
                                <Heart className="h-6 w-6" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium hidden lg:inline">Sevimlilar</span>
                        </Link>

                        <Link href="/cart" className="flex items-center gap-2 text-black hover:text-slate-900">
                            <div className="relative">
                                <ShoppingBag className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#7000ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium hidden lg:inline">Savat</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Search (Visible only on small screens) */}
            <div className="md:hidden px-4 py-3 bg-white border-b">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Qidirish..."
                        className="w-full h-10 pl-4 pr-10 rounded-md bg-[#f0f2f5] border-none text-black focus:ring-1 focus:ring-[#7000ff]"
                    />
                    <button type="submit" className="absolute right-3 top-2.5">
                        <Search className="h-5 w-5 text-slate-400" />
                    </button>
                </form>
            </div>
        </header>
    );
}
