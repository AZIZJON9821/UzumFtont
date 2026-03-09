"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '@/lib/contexts/CartContext';
import { useWishlist } from '@/lib/contexts/WishlistContext';

export function BottomNav() {
    const pathname = usePathname();
    const { itemCount: cartCount } = useCart();
    const { itemCount: wishlistCount } = useWishlist();

    const { user } = useAuth();
    const isAdmin = user && ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role?.toUpperCase());

    const navItems = [
        { label: 'Bosh sahifa', icon: Home, href: '/' },
        { label: 'Katalog', icon: Search, href: '/catalog' },
        ...(isAdmin ? [{ label: 'Admin', icon: ShieldCheck, href: '/admin' }] : []),
        { label: 'Savat', icon: ShoppingBag, href: '/cart', count: cartCount },
        { label: 'Saralangan', icon: Heart, href: '/wishlist', count: wishlistCount },
        { label: 'Kabinet', icon: User, href: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe md:hidden">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-90 ${isActive ? 'text-[#7000ff]' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <div className="relative">
                                <Icon className={`h-6 w-6 ${isActive ? 'fill-current/10' : ''}`} />
                                {item.count !== undefined && item.count > 0 && (
                                    <span className={`absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${item.label === 'Savat' ? 'bg-[#7000ff]' : 'bg-red-500'
                                        }`}>
                                        {item.count > 99 ? '99+' : item.count}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium leading-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
