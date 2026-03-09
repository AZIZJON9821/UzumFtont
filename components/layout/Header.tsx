"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, ShieldCheck, X, ChevronRight, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '@/lib/contexts/CartContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { productsApi } from '@/lib/api/products';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Header() {
    const { user } = useAuth();
    const router = useRouter();
    const { itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<{ products: string[], categories: any[] }>({ products: [], categories: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Qidiruv takliflarini olish (debouncing bilan)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                try {
                    const data = await productsApi.getSuggestions(searchQuery);
                    setSuggestions(data);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Suggestions error:", error);
                }
            } else {
                setSuggestions({ products: [], categories: [] });
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (query: string) => {
        setSearchQuery(query);
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setShowSuggestions(false);
    };

    const handleCategoryClick = (id: string) => {
        router.push(`/catalog?category=${id}`);
        setShowSuggestions(false);
    };

    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <span key={i} className="font-black text-black dark:text-white">{part}</span>
                : part
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 flex flex-col transition-colors">
            {/* Top Bar for Language & Location */}
            <div className="bg-[#f0f2f5] dark:bg-slate-800 py-1.5 text-xs text-slate-600 dark:text-slate-400 hidden md:block transition-colors border-b dark:border-slate-700/50">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1 cursor-pointer hover:text-black dark:hover:text-white transition-colors">Shahar: <span className="text-black dark:text-white font-semibold border-b border-black dark:border-white">Toshkent</span></span>
                        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Topshirish punktlari</span>
                    </div>
                    <div className="flex gap-5 items-center">
                        <span className="text-slate-400 dark:text-slate-500">Buyurtmangizni 1 kunda yetkazib beramiz</span>
                        <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
                        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Savol-javoblar</span>
                        <span className="cursor-pointer hover:text-black dark:hover:text-white transition-colors">Buyurtmalarim</span>

                        <div className="flex items-center gap-3 ml-2">
                            <ThemeToggle />
                            <div className="h-3 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-1 cursor-pointer font-bold text-black dark:text-white hover:opacity-80 transition-opacity">
                                <span>O'zbekcha</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="shrink-0 group">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#7000ff] tracking-tighter group-hover:scale-105 transition-transform duration-300">uzum market</h1>
                    </Link>

                    {/* Catalog & Search Section */}
                    <div className="flex-1 flex items-center gap-4">
                        {/* Catalog Button (Desktop only) */}
                        <Link href="/catalog" className="hidden lg:block">
                            <Button className="flex gap-2 bg-[#f0f2f5] dark:bg-slate-800 text-[#7000ff] hover:bg-[#e2e5e9] dark:hover:bg-slate-700 border-none font-bold px-5 h-10 transition-all active:scale-95">
                                <Menu className="h-5 w-5" />
                                Katalog
                            </Button>
                        </Link>

                        {/* Search Bar with Suggestions */}
                        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
                            <form onSubmit={handleSearch} className="relative flex h-10 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-[#7000ff] focus-within:ring-4 focus-within:ring-[#7000ff]/10 transition-all bg-[#f2f4f7] dark:bg-slate-800">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                    placeholder="Mahsulot va toifalarni qidirish"
                                    className="w-full h-full pl-4 pr-10 focus:outline-none text-sm text-black dark:text-white placeholder:text-slate-500 font-medium bg-transparent"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-12 top-2.5 text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                                <button type="submit" className="px-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 border-l border-slate-200 dark:border-slate-700 transition-colors group">
                                    <Search className="h-5 w-5 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                </button>
                            </form>

                            {/* Refined Suggestions Dropdown */}
                            {showSuggestions && (suggestions.products.length > 0 || suggestions.categories.length > 0) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Products Section */}
                                    {suggestions.products.length > 0 && (
                                        <div className="py-2">
                                            {suggestions.products.map((prod, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSuggestionClick(prod)}
                                                    className="w-full flex items-center gap-4 px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                                                >
                                                    <Search className="h-4 w-4 text-slate-400 group-hover:text-[#7000ff]" />
                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {highlightMatch(prod, searchQuery)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Categories Section */}
                                    {suggestions.categories.length > 0 && (
                                        <div className="border-t border-slate-50 dark:border-slate-800 py-2 bg-slate-50/50 dark:bg-slate-800/30">
                                            {suggestions.categories.map((cat, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleCategoryClick(cat.id)}
                                                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-white dark:hover:bg-slate-800 transition-all text-left border-b border-transparent hover:border-slate-100 dark:hover:border-slate-700 group"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-black dark:text-white group-hover:text-[#7000ff]">
                                                            {cat.name}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            {cat.parent?.name || 'Katalog'} ruknida
                                                        </span>
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#7000ff] transform group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
                        {/* Profile */}
                        <Link href={user ? "/profile" : "/login"} className="hidden sm:flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-[#7000ff] transition-all group">
                            <div className="p-2.5 rounded-2xl group-hover:bg-[#7000ff]/10 transition-colors">
                                <User className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-bold hidden lg:block">{user ? (user.fullName || "Profil") : "Kirish"}</span>
                        </Link>

                        {/* Favorites */}
                        <Link href="/favorites" className="relative group">
                            <div className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-[#7000ff] group-hover:bg-[#7000ff]/10 rounded-2xl transition-colors">
                                <Heart className="h-6 w-6 transition-transform group-hover:scale-110" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-[#7000ff] text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 animate-in zoom-in duration-300">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="relative group flex items-center gap-2 cursor-pointer">
                            <div className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-[#7000ff] group-hover:bg-[#7000ff]/10 rounded-2xl transition-colors">
                                <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-[#7000ff] text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 animate-in zoom-in duration-300">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#7000ff] hidden lg:block">Savat</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Nav Menu (Desktop only) */}
            <nav className="max-w-7xl mx-auto px-6 h-11 hidden md:flex items-center gap-7 overflow-x-auto scrollbar-hide bg-white dark:bg-slate-900 transition-colors">
                {["Elektronika", "Maishiy texnika", "Kiyim", "Poyabzallar", "Aksessuarlar", "Go'zallik", "Salomatlik", "Uy-ro'zg'or buyumlari"].map((item) => (
                    <Link key={item} href="/catalog" className="text-[13px] font-bold text-slate-500 hover:text-[#7000ff] pb-2 border-b-2 border-transparent hover:border-[#7000ff] transition-all whitespace-nowrap">
                        {item}
                    </Link>
                ))}
                <Link href="/catalog" className="text-[13px] font-bold text-red-500 hover:opacity-80 pb-2 border-b-2 border-transparent transition-all whitespace-nowrap">Yana</Link>
            </nav>
        </header>
    );
}
