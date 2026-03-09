import Link from 'next/link';
import { Instagram, Send, Youtube, Facebook, ChevronRight } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white py-12 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
                    {/* 1. Biz haqimizda */}
                    <div>
                        <h3 className="font-bold text-black mb-5 text-base">Biz haqimizda</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="/" className="hover:text-black transition-colors">Topshirish punktlari</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Vakansiyalar</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Kompaniya haqida</Link></li>
                        </ul>
                    </div>

                    {/* 2. Foydalanuvchilarga */}
                    <div>
                        <h3 className="font-bold text-black mb-5 text-base">Foydalanuvchilarga</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="/" className="hover:text-black transition-colors">Biz bilan bog'lanish</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Savol-Javob</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Buyurtmani qaytarish</Link></li>
                        </ul>
                    </div>

                    {/* 3. Tadbirkorlarga */}
                    <div>
                        <h3 className="font-bold text-black mb-5 text-base">Tadbirkorlarga</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li><Link href="/" className="hover:text-black transition-colors">Uzum da soting</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Sotuvchi kabinetiga kirish</Link></li>
                        </ul>
                    </div>

                    {/* 4. Ilovani yuklab olish va Ijtimoiy tarmoqlar */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="font-bold text-black mb-5 text-base">Ilovani yuklab olish</h3>
                            <div className="flex flex-wrap gap-4">
                                <Link href="#" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all group">
                                    <div className="scale-75 origin-left">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 22C14.32 22.05 13.89 21.24 12.37 21.24C10.84 21.24 10.37 22 9.09998 22.05C7.81998 22.1 6.87998 20.77 6.03998 19.58C4.31998 17.12 2.99998 12.55 4.75998 9.51998C5.62998 8.01998 7.18998 7.06998 8.87998 7.03998C10.16 7.00998 11.38 7.89998 12.17 7.89998C12.96 7.89998 14.42 6.83998 15.94 6.98998C16.58 7.01998 18.39 7.24998 19.56 8.95998C19.46 9.01998 17.42 10.2 17.45 12.59C17.49 15.48 19.95 16.44 19.98 16.45C19.96 16.51 19.58 17.82 18.71 19.5ZM13 3.5C13.74 2.6 14.28 1.42 14.1 0.25C13.06 0.3 11.83 0.95 11.08 1.85C10.42 2.63 9.83 3.84 10.02 4.97C11.12 5.06 12.3 4.38 13 3.5Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] text-slate-500">Download on the</span>
                                        <span className="text-sm font-bold text-black">App Store</span>
                                    </div>
                                </Link>
                                <Link href="#" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all">
                                    <div className="scale-75 origin-left">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.60999 1.43999L13.12 11.09L16.2 8.04999L3.60999 0.77999C3.47999 0.70999 3.32999 0.72999 3.20999 0.81999C3.08999 0.90999 3.01999 1.04999 3.01999 1.19999V22.8C3.01999 22.95 3.08999 23.09 3.20999 23.18C3.32999 23.27 3.47999 23.29 3.60999 23.22L16.2 15.95L13.12 12.91L3.60999 22.56V1.43999Z" fill="currentColor" />
                                            <path d="M17.47 15.24L21.39 12.98C21.75 12.77 21.96 12.4 21.96 12C21.96 11.6 21.75 11.23 21.39 11.02L17.47 8.75999L14.41 11.78L17.47 15.24Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] text-slate-500">GET IT ON</span>
                                        <span className="text-sm font-bold text-black">Google Play</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-black mb-5 text-base">Uzum ijtimoiy tarmoqlarda</h3>
                            <div className="flex gap-4">
                                <Link href="#" className="p-2 bg-slate-100 rounded-lg hover:bg-[#7000ff]/10 hover:text-[#7000ff] transition-all">
                                    <Instagram className="h-6 w-6" />
                                </Link>
                                <Link href="#" className="p-2 bg-slate-100 rounded-lg hover:bg-[#7000ff]/10 hover:text-[#7000ff] transition-all">
                                    <Send className="h-6 w-6" />
                                </Link>
                                <Link href="#" className="p-2 bg-slate-100 rounded-lg hover:bg-[#7000ff]/10 hover:text-[#7000ff] transition-all">
                                    <Youtube className="h-6 w-6" />
                                </Link>
                                <Link href="#" className="p-2 bg-slate-100 rounded-lg hover:bg-[#7000ff]/10 hover:text-[#7000ff] transition-all">
                                    <Facebook className="h-6 w-6" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
                    <div className="flex gap-6">
                        <Link href="/" className="text-black font-bold">Maxfiylik kelishuvi</Link>
                        <Link href="/" className="text-black font-bold">Foydalanuvchi kelishuvi</Link>
                    </div>
                    <p>«2026© XK MCHJ «UZUM MARKET». Barcha huquqlar himoyalangan»</p>
                </div>
            </div>
        </footer>
    );
}
