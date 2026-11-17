import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import type { NavSection } from '../types/career';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenMobileMenu: () => void;
  targetCareer: string;
  readinessPercentage: number | null;
  onNavigate: (section: NavSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenMobileMenu,
  targetCareer,
  readinessPercentage,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            CareerPath AI
          </button>
        </div>

        {/* Zone 2: Concise Top Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('roadmap')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Roadmap
          </button>
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Projects
          </button>
        </nav>

        {/* Zone 3: Theme Switch & Target Summary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {targetCareer && (
            <button
              type="button"
              onClick={() => onNavigate('skill-analysis')}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-indigo-500/50 transition-colors whitespace-nowrap shrink-0 tabular-nums"
            >
              <span className="truncate max-w-[140px]">{targetCareer}</span>
              {readinessPercentage !== null && (
                <>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {readinessPercentage}% Ready
                  </span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
