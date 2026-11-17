import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Award, CheckCircle2, Circle, FolderGit2, Trophy } from 'lucide-react';
import type { CareerRoadmapResponse, StudentProgress } from '../types/career';

interface ProgressTrackerProps {
  roadmap: CareerRoadmapResponse;
  progress: StudentProgress;
  onToggleWeekComplete: (weekNumber: number) => void;
  onToggleTopicComplete: (topicKey: string) => void;
  onToggleProjectComplete: (projectId: string) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  roadmap,
  progress,
  onToggleWeekComplete,
  onToggleTopicComplete,
  onToggleProjectComplete,
}) => {
  const allTopics = roadmap.eightWeekRoadmap.flatMap((w) =>
    w.detailedTopics.map((topic) => ({
      key: `w${w.weekNumber}:${topic}`,
      label: `Week ${w.weekNumber}: ${topic}`,
    }))
  );

  const completedTopics = allTopics.filter((t) => progress.completedTopics.includes(t.key));
  const pendingTopics = allTopics.filter((t) => !progress.completedTopics.includes(t.key));

  const totalItems =
    roadmap.eightWeekRoadmap.length + roadmap.portfolioProjects.length + allTopics.length;
  const completedItems =
    progress.completedWeeks.length + progress.completedProjects.length + completedTopics.length;
  const overallPercent = Math.round((completedItems / Math.max(totalItems, 1)) * 100);

  const weeklyChartData = roadmap.eightWeekRoadmap.map((w) => {
    const weekTopics = w.detailedTopics.map((t) => `w${w.weekNumber}:${t}`);
    const doneTopics = weekTopics.filter((k) => progress.completedTopics.includes(k)).length;
    const weekDone = progress.completedWeeks.includes(w.weekNumber);
    const pct = weekDone
      ? 100
      : Math.round((doneTopics / Math.max(weekTopics.length, 1)) * 100);
    return {
      name: `W${w.weekNumber}`,
      completion: pct,
    };
  });

  const milestones = [
    {
      title: 'Foundation Kickoff',
      achieved: progress.completedWeeks.includes(1) || progress.completedWeeks.length >= 1,
      detail: 'Complete Week 1 fundamentals',
    },
    {
      title: 'Halfway Builder',
      achieved: progress.completedWeeks.length >= 4,
      detail: 'Complete 4 weeks of the roadmap',
    },
    {
      title: 'First Portfolio Artifact',
      achieved: progress.completedProjects.length >= 1,
      detail: 'Finish at least 1 portfolio project',
    },
    {
      title: 'Career Launch Ready',
      achieved:
        progress.completedWeeks.length === 8 &&
        progress.completedProjects.length === roadmap.portfolioProjects.length,
      detail: 'Finish all 8 weeks & all 3 projects',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
          Student Progress Tracker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Your milestones, completed weeks, and projects persist automatically in browser storage.
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
        <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Overall Progress</p>
          <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">
            {overallPercent}%
          </p>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Weeks Completed</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {progress.completedWeeks.length} / {roadmap.eightWeekRoadmap.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toggle weeks below</p>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Topics Mastered</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {completedTopics.length} / {allTopics.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {pendingTopics.length} pending
          </p>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Projects Built</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {progress.completedProjects.length} / {roadmap.portfolioProjects.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Portfolio readiness</p>
        </div>
      </div>

      {/* Chart + Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-4">
            Weekly Completion Breakdown
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="completion" name="Completion %" fill="#0891b2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Learning Milestones
          </h2>
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.title}
                className={`p-3 rounded-xl border flex items-start gap-3 ${
                  m.achieved
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <Award
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    m.achieved ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{m.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-base font-bold mb-3">Weekly Completion Checklist</h2>
          <div className="space-y-2">
            {roadmap.eightWeekRoadmap.map((w) => {
              const done = progress.completedWeeks.includes(w.weekNumber);
              return (
                <button
                  key={w.weekNumber}
                  type="button"
                  onClick={() => onToggleWeekComplete(w.weekNumber)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>
                      Week {w.weekNumber}: {w.title}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums shrink-0 ml-2">
                    {w.estimatedStudyHours}h
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-500" />
              Portfolio Projects Status
            </h2>
            <div className="space-y-2">
              {roadmap.portfolioProjects.map((proj) => {
                const done = progress.completedProjects.includes(proj.id);
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => onToggleProjectComplete(proj.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>{proj.title}</span>
                    </span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">
                      {proj.difficultyLevel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 tabular-nums">
                Completed Topics ({completedTopics.length})
              </h3>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {completedTopics.length === 0 ? (
                  <p className="text-xs text-slate-500">No topics marked completed yet.</p>
                ) : (
                  completedTopics.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => onToggleTopicComplete(t.key)}
                      className="w-full text-left text-xs px-2.5 py-1.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                    >
                      ✓ {t.label}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2 tabular-nums">
                Pending Topics ({pendingTopics.length})
              </h3>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {pendingTopics.length === 0 ? (
                  <p className="text-xs text-emerald-500">All topics completed!</p>
                ) : (
                  pendingTopics.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => onToggleTopicComplete(t.key)}
                      className="w-full text-left text-xs px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/15"
                    >
                      ○ {t.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
