'use client';

import { ReactNode, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoadingSpinner, LoadingPage } from '@/components/ui/Loading';

import { ThemeProvider } from '@/components/providers/ThemeProvider';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
        {/* Admin Top Bar */}
        <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[#7000ff] hover:text-[#5d00d6] flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Saytga qaytish
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-[#7000ff] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-[#7000ff]/20">
              AD
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex-col hidden md:flex transition-colors">
            <nav className="flex-1 p-4 space-y-1">
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin'
                  ? 'bg-[#7000ff] text-white shadow-md shadow-[#7000ff]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <LayoutDashboard
                  className={`h-5 w-5 ${pathname === '/admin' ? 'text-white' : 'text-slate-400'
                    }`}
                />
                Boshqaruv paneli
              </Link>
              <Link
                href="/admin/products"
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/products')
                  ? 'bg-[#7000ff] text-white shadow-md shadow-[#7000ff]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <Package
                  className={`h-5 w-5 ${pathname.startsWith('/admin/products')
                    ? 'text-white'
                    : 'text-slate-400'
                    }`}
                />
                <div className="flex-1">Mahsulotlar</div>
              </Link>
              <Link
                href="/admin/orders"
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/orders')
                  ? 'bg-[#7000ff] text-white shadow-md shadow-[#7000ff]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <ShoppingCart
                  className={`h-5 w-5 ${pathname.startsWith('/admin/orders')
                    ? 'text-white'
                    : 'text-slate-400'
                    }`}
                />
                Buyurtmalar
              </Link>
              <Link
                href="/admin/users"
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/users')
                  ? 'bg-[#7000ff] text-white shadow-md shadow-[#7000ff]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <Users
                  className={`h-5 w-5 ${pathname.startsWith('/admin/users')
                    ? 'text-white'
                    : 'text-slate-400'
                    }`}
                />
                Foydalanuvchilar
              </Link>
              <Link
                href="/admin/pickup-points"
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/pickup-points')
                  ? 'bg-[#7000ff] text-white shadow-md shadow-[#7000ff]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <MapPin
                  className={`h-5 w-5 ${pathname.startsWith('/admin/pickup-points')
                    ? 'text-white'
                    : 'text-slate-400'
                    }`}
                />
                Olib ketish nuqtalari
              </Link>
            </nav>
            <div className="p-4 border-t dark:border-slate-800">
              <Link
                href="/admin/settings"
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname.startsWith('/admin/settings')
                  ? 'bg-[#7000ff] text-white shadow-md shadow-[#7000ff]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <Settings
                  className={`h-5 w-5 ${pathname.startsWith('/admin/settings')
                    ? 'text-white'
                    : 'text-slate-400'
                    }`}
                />
                Sozlamalar
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
