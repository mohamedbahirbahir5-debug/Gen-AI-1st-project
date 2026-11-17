import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { CareerRoadmapResponse, StudentProgress } from '../types/career';

interface ProjectCardsProps {
  roadmap: CareerRoadmapResponse;
  progress: StudentProgress;
  onToggleProjectComplete: (projectId: string) => void;
}

export const ProjectCards: React.FC<ProjectCardsProps> = ({
  roadmap,
  progress,
  onToggleProjectComplete,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
          Portfolio Projects
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Build these three targeted projects to demonstrate job-ready skills to hiring managers.
        </p>
      </div>

      <div className="space-y-6">
        {roadmap.portfolioProjects.map((project, index) => {
          const completed = progress.completedProjects.includes(project.id);

          return (
            <article
              key={project.id}
              className={`rounded-2xl p-6 sm:p-7 border transition-colors ${
                completed
                  ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tabular-nums">
                    Project 0{index + 1} · {project.difficultyLevel}
                  </p>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleProjectComplete(project.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors whitespace-nowrap ${
                    completed
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completed ? 'Project Completed' : 'Mark Completed'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-sm">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      Problem Statement
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {project.problemStatement}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Technologies Required
                    </h3>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {project.technologiesRequired.join(' · ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Skills Demonstrated
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">
                      {project.skillsDemonstrated.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      Implementation Steps
                    </h3>
                    <ol className="space-y-1.5 list-decimal list-inside text-slate-700 dark:text-slate-300">
                      {project.implementationSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <p>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Expected Output:{' '}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {project.expectedFinalOutput}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Portfolio Value:{' '}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        {project.portfolioValue}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
