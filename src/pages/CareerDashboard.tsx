import React from 'react';
import { ArrowRight, BarChart3, BookOpen, Compass, FileDown, FolderGit2 } from 'lucide-react';
import type {
  CareerRoadmapResponse,
  NavSection,
  StudentProfile,
  StudentProgress,
} from '../types/career';
import { Dashboard } from '../components/Dashboard';

interface CareerDashboardProps {
  profile: StudentProfile;
  roadmap: CareerRoadmapResponse | null;
  progress: StudentProgress;
  onChangeProfile: (updated: StudentProfile) => void;
  onGenerate: () => void;
  onClearForm: () => void;
  onLoadSampleAlex: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onNavigate: (section: NavSection) => void;
}

export const CareerDashboard: React.FC<CareerDashboardProps> = ({
  profile,
  roadmap,
  progress,
  onChangeProfile,
  onGenerate,
  onClearForm,
  onLoadSampleAlex,
  isLoading,
  errorMessage,
  onRetry,
  onNavigate,
}) => {
  return (
    <div className="space-y-8">
      <Dashboard
        profile={profile}
        onChangeProfile={onChangeProfile}
        onGenerate={onGenerate}
        onClearForm={onClearForm}
        onLoadSampleAlex={onLoadSampleAlex}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onRetry={onRetry}
      />

      {roadmap && (
        <section className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Active Roadmap: {profile.targetCareer}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                Readiness: {roadmap.skillGapAnalysis.overallReadinessPercentage}% · Weeks completed:{' '}
                {progress.completedWeeks.length}/8 · Projects completed:{' '}
                {progress.completedProjects.length}/3
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('pdf-reports')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <FileDown className="w-4 h-4" />
              Export PDF Report
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'skill-analysis' as const, label: 'Skill Gap Analysis', icon: BarChart3 },
              { id: 'roadmap' as const, label: '8-Week Roadmap', icon: Compass },
              { id: 'projects' as const, label: '3 Portfolio Projects', icon: FolderGit2 },
              { id: 'resources' as const, label: 'Learning Resources', icon: BookOpen },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onNavigate(card.id)}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-indigo-500/50 flex items-center justify-between text-xs font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                    {card.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
