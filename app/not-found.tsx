'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-4 transition-colors">
            <h1 className="text-9xl font-black text-[#7000ff] opacity-20">404</h1>
            <div className="text-center -mt-12 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                    Sahifa topilmadi
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Afsuski, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.
                </p>
                <Link href="/">
                    <Button className="bg-[#7000ff] hover:bg-[#5e00d6] text-white font-bold rounded-2xl px-12 h-14 shadow-xl shadow-[#7000ff]/20 active:scale-95 transition-all">
                        Bosh sahifaga qaytish
                    </Button>
                </Link>
            </div>

            <div className="mt-12 flex gap-4">
                <div className="w-2 h-2 rounded-full bg-[#7000ff] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#7000ff] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#7000ff] animate-bounce [animation-delay:0.4s]" />
            </div>
        </div>
    );
}
