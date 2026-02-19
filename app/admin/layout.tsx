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
  ArrowLeft,
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-[#7000ff] rounded-full flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white border-r flex-col hidden md:flex">
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === '/admin'
                  ? 'bg-[#7000ff] text-white'
                  : 'text-black hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard
                className={`h-5 w-5 ${
                  pathname === '/admin' ? 'text-white' : 'text-slate-900'
                }`}
              />
              Boshqaruv paneli
            </Link>
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname.startsWith('/admin/products')
                  ? 'bg-[#7000ff] text-white'
                  : 'text-black hover:bg-slate-100'
              }`}
            >
              <Package
                className={`h-5 w-5 ${
                  pathname.startsWith('/admin/products')
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
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname.startsWith('/admin/orders')
                  ? 'bg-[#7000ff] text-white'
                  : 'text-black hover:bg-slate-100'
              }`}
            >
              <ShoppingCart
                className={`h-5 w-5 ${
                  pathname.startsWith('/admin/orders')
                    ? 'text-white'
                    : 'text-slate-900'
                }`}
              />
              Buyurtmalar
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname.startsWith('/admin/users')
                  ? 'bg-[#7000ff] text-white'
                  : 'text-black hover:bg-slate-100'
              }`}
            >
              <Users
                className={`h-5 w-5 ${
                  pathname.startsWith('/admin/users')
                    ? 'text-white'
                    : 'text-slate-900'
                }`}
              />
              Foydalanuvchilar
            </Link>
          </nav>
          <div className="p-4 border-t">
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname.startsWith('/admin/settings')
                  ? 'bg-[#7000ff] text-white'
                  : 'text-black hover:bg-slate-100'
              }`}
            >
              <Settings
                className={`h-5 w-5 ${
                  pathname.startsWith('/admin/settings')
                    ? 'text-white'
                    : 'text-slate-900'
                }`}
              />
              Sozlamalar
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
