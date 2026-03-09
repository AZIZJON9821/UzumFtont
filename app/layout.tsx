import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer), {
  ssr: true,
});
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/lib/contexts/CartContext";
import { WishlistProvider } from "@/lib/contexts/WishlistContext";
import QueryProvider from "@/components/providers/QueryProvider";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uzum Market Clone",
  description: "O'zbekistondagi eng tezkor internet do'kon",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastContainer />
                <div className="flex min-h-screen flex-col w-full max-w-none overflow-x-hidden relative">
                  <Header />
                  <main className="flex-1 pb-20 md:pb-0 px-0">
                    {children}
                  </main>
                  <BottomNav />
                  <Footer />
                </div>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
