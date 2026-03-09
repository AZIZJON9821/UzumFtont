"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, ShieldCheck, X, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '@/lib/contexts/CartContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';
import { productsApi } from '@/lib/api/products';

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
                    console.error('Suggestions fetch error:', error);
                }
            } else {
                setSuggestions({ products: [], categories: [] });
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Tashqariga bosganda takliflarni yopish
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
        submitSearch(searchQuery);
    };

    const submitSearch = (query: string) => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        submitSearch(suggestion);
    };

    const handleCategoryClick = (category: any) => {
        router.push(`/catalog/${category.slug}`);
        setShowSuggestions(false);
    };

    // Matnni qalinlashtirish funksiyasi
    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <span key={i} className="font-bold text-black">{part}</span>
                : <span key={i}>{part}</span>
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white flex flex-col">
            {/* Top Bar for Language & Location */}
            <div className="bg-[#f0f2f5] py-1.5 text-xs text-slate-600 hidden md:block">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1 cursor-pointer hover:text-black transition-colors">Shahar: <span className="text-black font-semibold border-b border-black">Toshkent</span></span>
                        <span className="cursor-pointer hover:text-black transition-colors">Topshirish punktlari</span>
                    </div>
                    <div className="flex gap-5 items-center">
                        <span className="text-slate-400">Buyurtmangizni 1 kunda yetkazib beramiz</span>
                        <div className="h-3 w-[1px] bg-slate-300"></div>
                        <span className="cursor-pointer hover:text-black transition-colors">Savol-javoblar</span>
                        <span className="cursor-pointer hover:text-black transition-colors">Buyurtmalarim</span>
                        <div className="flex items-center gap-1 cursor-pointer font-bold text-black hover:opacity-80 transition-opacity">
                            <span>O'zbekcha</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between gap-4 md:gap-8">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#7000ff] tracking-tighter">uzum market</h1>
                    </Link>

                    {/* Catalog & Search Section */}
                    <div className="flex-1 flex items-center gap-4">
                        {/* Catalog Button (Desktop only) */}
                        <Link href="/catalog" className="hidden lg:block">
                            <Button className="flex gap-2 bg-[#f0f2f5] text-[#7000ff] hover:bg-[#e2e5e9] border-none font-semibold px-5 h-10 transition-colors">
                                <Menu className="h-5 w-5" />
                                Katalog
                            </Button>
                        </Link>

                        {/* Search Bar with Suggestions */}
                        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
                            <form onSubmit={handleSearch} className="relative flex h-10 border border-slate-200 rounded-md overflow-hidden focus-within:border-[#7000ff] transition-all bg-[#f2f4f7]">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                    placeholder="Mahsulot va toifalarni qidirish"
                                    className="w-full h-full pl-4 pr-10 focus:outline-none text-sm text-black placeholder:text-slate-500 font-medium bg-transparent"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-12 top-2.5 text-slate-400 hover:text-black transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                                <button type="submit" className="px-5 bg-[#f0f2f5] hover:bg-[#e2e5e9] text-slate-500 border-l border-slate-200 transition-colors group">
                                    <Search className="h-5 w-5 group-hover:text-black transition-colors" />
                                </button>
                            </form>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (suggestions.products.length > 0 || suggestions.categories.length > 0) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                                    <div className="py-2">
                                        {/* Product Suggestions */}
                                        {suggestions.products.map((product, index) => (
                                            <button
                                                key={`p-${index}`}
                                                onClick={() => handleSuggestionClick(product)}
                                                className="w-full text-left px-5 py-3 text-sm font-medium text-slate-600 hover:bg-[#f2f4f7] flex items-center gap-4 transition-colors group"
                                            >
                                                <Search className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                                                <span>{highlightMatch(product, searchQuery)}</span>
                                            </button>
                                        ))}

                                        {/* Divider */}
                                        {suggestions.products.length > 0 && suggestions.categories.length > 0 && (
                                            <div className="mx-5 my-2 border-t border-slate-100" />
                                        )}

                                        {/* Category Suggestions */}
                                        {suggestions.categories.map((category, index) => (
                                            <button
                                                key={`c-${index}`}
                                                onClick={() => handleCategoryClick(category)}
                                                className="w-full text-left px-5 py-3 hover:bg-[#f2f4f7] flex items-center justify-between transition-colors group"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-black group-hover:text-[#7000ff]">{category.name}</span>
                                                    <span className="text-xs text-slate-400">{category.parentName}</span>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Actions (Visible in header on desktop, mobile hidden via responsive classes if needed) */}
                    <div className="hidden md:flex items-center gap-6 shrink-0">
                        {user ? (
                            <Link href="/profile" className="flex items-center gap-2 text-black hover:text-[#7000ff] group">
                                <User className="h-6 w-6" />
                                <span className="text-sm font-medium truncate max-w-[100px]">{user.fullName || "Kabinet"}</span>
                            </Link>
                        ) : (
                            <Link href="/auth/login" className="flex items-center gap-2 text-black hover:text-[#7000ff] group">
                                <User className="h-6 w-6" />
                                <span className="text-sm font-medium">Kirish</span>
                            </Link>
                        )}

                        <Link href="/wishlist" className="flex items-center gap-2 text-black hover:text-[#7000ff] group">
                            <div className="relative">
                                <Heart className="h-6 w-6 group-hover:fill-current" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium">Saralangan</span>
                        </Link>

                        <Link href="/cart" className="flex items-center gap-2 text-black hover:text-[#7000ff] group">
                            <div className="relative">
                                <ShoppingBag className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-[#7000ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium">Savat</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Header Search (Only if needed, but the main layout might have its own mobile search) */}
        </header>
    );
}
