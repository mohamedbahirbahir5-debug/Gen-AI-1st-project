import React from 'react';
import { Moon, Sun, Trash2 } from 'lucide-react';

interface SettingsProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onResetAllData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  theme,
  onToggleTheme,
  onResetAllData,
}) => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure appearance preferences or reset locally stored roadmap and progress data.
        </p>
      </div>

      {/* Theme */}
      <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-slate-900 dark:text-white">Appearance Theme</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Switch between dark slate mode and light mode.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              Switch to Light
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              Switch to Dark
            </>
          )}
        </button>
      </div>

      {/* Clear Storage */}
      <div className="rounded-2xl bg-white dark:bg-[#111827] border border-rose-500/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-rose-600 dark:text-rose-400">
            Reset Saved Progress &amp; Data
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Clears your saved student profile, generated roadmap, and browser progress checklist.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetAllData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 transition-colors whitespace-nowrap"
        >
          <Trash2 className="w-4 h-4" />
          Clear Saved Data
        </button>
      </div>
    </div>
  );
};
