import React from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Compass,
  FileDown,
  FolderGit2,
  Home,
  LayoutDashboard,
  Settings,
  X,
} from 'lucide-react';
import type { NavSection } from '../types/career';

interface SidebarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  hasRoadmap: boolean;
}

const NAV_ITEMS: {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresRoadmap?: boolean;
}[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Career Dashboard', icon: LayoutDashboard },
  { id: 'skill-analysis', label: 'Skill Gap Analysis', icon: BarChart3, requiresRoadmap: true },
  { id: 'roadmap', label: 'Learning Roadmap', icon: Compass, requiresRoadmap: true },
  { id: 'projects', label: 'Portfolio Projects', icon: FolderGit2, requiresRoadmap: true },
  { id: 'resources', label: 'Learning Resources', icon: BookOpen, requiresRoadmap: true },
  { id: 'progress', label: 'Progress Tracker', icon: CheckCircle2, requiresRoadmap: true },
  { id: 'pdf-reports', label: 'PDF Reports', icon: FileDown, requiresRoadmap: true },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  hasRoadmap,
}) => {
  const handleSelect = (id: NavSection) => {
    onNavigate(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="font-semibold text-sm text-slate-900 dark:text-white">Menu</span>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="space-y-1 flex-1" aria-label="Workspace navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isLocked = Boolean(item.requiresRoadmap && !hasRoadmap);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : isLocked
                  ? 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <p className="font-semibold text-slate-700 dark:text-slate-200">Local Auto-Save</p>
        <p className="mt-1">
          Your profile, roadmap, and weekly checklist stay saved in your browser.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 z-10 shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
