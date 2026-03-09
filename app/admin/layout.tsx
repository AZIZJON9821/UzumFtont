'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Package,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Users,
  MapPin,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingSpinner, LoadingPage } from '@/components/ui/Loading';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (
      !loading &&
      (!user || !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role))
    ) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (
    loading ||
    !user ||
    !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(user.role)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full max-w-none overflow-x-hidden relative">
      {/* Admin Top Bar */}
      <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[#7000ff] hover:text-[#5d00d6] flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Saytga qaytish
          </Link>
          <div className="h-6 w-px bg-slate-200" />
          <h1 className="text-lg font-bold text-slate-800">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="h-8 w-8 bg-[#7000ff] rounded-full flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-x-hidden overflow-y-auto">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white border-r flex-col hidden lg:flex">
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin'
                ? 'bg-[#7000ff] text-white'
                : 'text-black hover:bg-slate-100'
                }`}
            >
              <LayoutDashboard
                className={`h-5 w-5 ${pathname === '/admin' ? 'text-white' : 'text-slate-900'
                  }`}
              />
              Boshqaruv paneli
            </Link>
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/products')
                ? 'bg-[#7000ff] text-white'
                : 'text-black hover:bg-slate-100'
                }`}
            >
              <Package
                className={`h-5 w-5 ${pathname.startsWith('/admin/products')
                  ? 'text-white'
                  : 'text-slate-900'
                  }`}
              />
              <div className="flex-1">Mahsulotlar</div>
              {pathname.startsWith('/admin/products') && (
                <div className="h-2 w-2 bg-white rounded-full"></div>
              )}
            </Link>
            <Link
              href="/admin/orders"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/orders')
                ? 'bg-[#7000ff] text-white'
                : 'text-black hover:bg-slate-100'
                }`}
            >
              <ShoppingCart
                className={`h-5 w-5 ${pathname.startsWith('/admin/orders')
                  ? 'text-white'
                  : 'text-slate-900'
                  }`}
              />
              Buyurtmalar
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/users')
                ? 'bg-[#7000ff] text-white'
                : 'text-black hover:bg-slate-100'
                }`}
            >
              <Users
                className={`h-5 w-5 ${pathname.startsWith('/admin/users')
                  ? 'text-white'
                  : 'text-slate-900'
                  }`}
              />
              Foydalanuvchilar
            </Link>
            <Link
              href="/admin/pickup-points"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/pickup-points')
                ? 'bg-[#7000ff] text-white'
                : 'text-black hover:bg-slate-100'
                }`}
            >
              <MapPin
                className={`h-5 w-5 ${pathname.startsWith('/admin/pickup-points')
                  ? 'text-white'
                  : 'text-slate-900'
                  }`}
              />
              Olib ketish nuqtalari
            </Link>
          </nav>
          <div className="p-4 border-t">
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/settings')
                ? 'bg-[#7000ff] text-white'
                : 'text-black hover:bg-slate-100'
                }`}
            >
              <Settings
                className={`h-5 w-5 ${pathname.startsWith('/admin/settings')
                  ? 'text-white'
                  : 'text-slate-900'
                  }`}
              />
              Sozlamalar
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-16 border-b flex items-center justify-between px-6">
          <span className="font-bold text-[#7000ff]">Admin Menyu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {[
            { label: 'Boshqaruv paneli', icon: LayoutDashboard, href: '/admin' },
            { label: 'Mahsulotlar', icon: Package, href: '/admin/products' },
            { label: 'Buyurtmalar', icon: ShoppingCart, href: '/admin/orders' },
            { label: 'Foydalanuvchilar', icon: Users, href: '/admin/users' },
            { label: 'Olib ketish nuqtalari', icon: MapPin, href: '/admin/pickup-points' },
            { label: 'Sozlamalar', icon: Settings, href: '/admin/settings' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors ${pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                ? 'bg-[#7000ff] text-white'
                : 'text-black hover:bg-slate-100'
                }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
