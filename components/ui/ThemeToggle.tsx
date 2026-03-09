'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group relative overflow-hidden h-9"
            aria-label="Toggle Theme"
        >
            <div className="relative flex items-center justify-center w-5 h-5">
                <Sun className={`h-5 w-5 text-amber-500 absolute transition-all duration-500 transform ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                    }`} />
                <Moon className={`h-5 w-5 text-indigo-400 absolute transition-all duration-500 transform ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                    }`} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {theme === 'light' ? 'Good' : 'Night'}
            </span>

            {/* Subtle glow effect for dark mode */}
            {theme === 'dark' && (
                <span className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
            )}
        </button>
    );
}
