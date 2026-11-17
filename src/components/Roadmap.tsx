import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  RefreshCw,
} from 'lucide-react';
import type { CareerRoadmapResponse, StudentProfile, StudentProgress } from '../types/career';

interface RoadmapProps {
  profile: StudentProfile;
  roadmap: CareerRoadmapResponse;
  progress: StudentProgress;
  onToggleWeekComplete: (weekNumber: number) => void;
  onToggleTopicComplete: (topicKey: string) => void;
  onRegenerate: () => void;
  isLoading: boolean;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  profile,
  roadmap,
  progress,
  onToggleWeekComplete,
  onToggleTopicComplete,
  onRegenerate,
  isLoading,
  onNotify,
}) => {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  const handleCopyRoadmap = async () => {
    const lines = [
      `AI CAREER ROADMAP FOR ${profile.studentName.toUpperCase()} (${profile.targetCareer})`,
      `Readiness: ${roadmap.skillGapAnalysis.overallReadinessPercentage}%`,
      '',
      ...roadmap.eightWeekRoadmap.flatMap((w) => [
        `WEEK ${w.weekNumber}: ${w.title} (${w.estimatedStudyHours} hrs)`,
        `Skills: ${w.skillsToDevelop.join(', ')}`,
        `Objectives: ${w.learningObjectives.join(' | ')}`,
        `Topics: ${w.detailedTopics.join(' | ')}`,
        `Exercises: ${w.practicalExercises.join(' | ')}`,
        `Assignment: ${w.weeklyAssignments.join(' | ')}`,
        `Outcomes: ${w.expectedOutcomes.join(' | ')}`,
        '',
      ]),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      onNotify('Full 8-week roadmap copied to clipboard.', 'success');
    } catch {
      onNotify('Could not access clipboard. Try downloading the PDF instead.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            Personalized 8-Week Learning Roadmap
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 tabular-nums">
            {profile.weeklyHours} hrs/week · {profile.learningStyle} · Target: {profile.targetCareer}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyRoadmap}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Copy className="w-4 h-4 text-indigo-500" />
            Copy Roadmap
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate Roadmap
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {roadmap.eightWeekRoadmap.map((week) => {
          const isOpen = expandedWeek === week.weekNumber;
          const isCompleted = progress.completedWeeks.includes(week.weekNumber);

          return (
            <div
              key={week.weekNumber}
              className={`rounded-xl border transition-colors ${
                isCompleted
                  ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]'
              }`}
            >
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setExpandedWeek(isOpen ? null : week.weekNumber)}
                  className="flex-1 flex items-start sm:items-center gap-4 text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 tabular-nums ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    W{week.weekNumber}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {week.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                      {week.estimatedStudyHours} hrs · {week.skillsToDevelop.join(' · ')}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleWeekComplete(week.weekNumber)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isCompleted ? 'Completed' : 'Mark Completed'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedWeek(isOpen ? null : week.weekNumber)}
                    aria-label={isOpen ? 'Collapse week details' : 'Expand week details'}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-6 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      Learning Objectives
                    </h3>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                      {week.learningObjectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-500 font-bold">–</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
                      Detailed Topics (Check to Track)
                    </h3>
                    <ul className="space-y-1.5">
                      {week.detailedTopics.map((topic) => {
                        const topicKey = `w${week.weekNumber}:${topic}`;
                        const checked = progress.completedTopics.includes(topicKey);
                        return (
                          <li key={topicKey}>
                            <label className="flex items-start gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => onToggleTopicComplete(topicKey)}
                                className="mt-1 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className={checked ? 'line-through text-slate-400' : ''}>
                                {topic}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      Practical Exercises
                    </h3>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                      {week.practicalExercises.map((ex, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-slate-400 font-bold">–</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
                        Weekly Assignments
                      </h3>
                      <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                        {week.weeklyAssignments.map((asn, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">–</span>
                            <span>{asn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                        Expected Outcomes
                      </h3>
                      <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                        {week.expectedOutcomes.map((out, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">–</span>
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
