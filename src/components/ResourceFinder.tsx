import React, { useState } from 'react';
import {
  BookOpen,
  Code,
  ExternalLink,
  FileText,
  GraduationCap,
  Search,
  Youtube,
} from 'lucide-react';
import type { CareerRoadmapResponse, LearningResourceItem } from '../types/career';

interface ResourceFinderProps {
  roadmap: CareerRoadmapResponse;
}

type ResourceGroupKey =
  | 'officialDocumentation'
  | 'freeCourses'
  | 'youtubeResources'
  | 'codingPracticePlatforms'
  | 'projectTutorials';

const GROUPS: {
  key: ResourceGroupKey;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}[] = [
  {
    key: 'officialDocumentation',
    title: 'Official Documentation',
    icon: FileText,
    accent: 'text-cyan-500',
  },
  {
    key: 'freeCourses',
    title: 'Free Courses',
    icon: GraduationCap,
    accent: 'text-emerald-500',
  },
  {
    key: 'youtubeResources',
    title: 'YouTube Learning Resources',
    icon: Youtube,
    accent: 'text-rose-500',
  },
  {
    key: 'codingPracticePlatforms',
    title: 'Coding Practice Platforms',
    icon: Code,
    accent: 'text-indigo-500',
  },
  {
    key: 'projectTutorials',
    title: 'Project Tutorials',
    icon: BookOpen,
    accent: 'text-blue-500',
  },
];

export const ResourceFinder: React.FC<ResourceFinderProps> = ({ roadmap }) => {
  const [filterText, setFilterText] = useState('');

  const matchesFilter = (item: LearningResourceItem) => {
    const q = filterText.trim().toLowerCase();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.provider.toLowerCase().includes(q) ||
      item.relatedSkill.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            Learning Resource Finder
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Curated documentation, courses, videos, and practice platforms aligned with your 8-week roadmap.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter by skill or resource..."
            aria-label="Filter learning resources"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {GROUPS.map((group) => {
          const Icon = group.icon;
          const items = roadmap.learningResources[group.key].filter(matchesFilter);

          return (
            <section
              key={group.key}
              className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6"
            >
              <h2 className="text-lg font-bold flex items-center gap-2.5 mb-4">
                <Icon className={`w-5 h-5 ${group.accent}`} />
                {group.title}
              </h2>

              {items.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No resources match your current filter in this category.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((res, idx) => (
                    <div
                      key={`${res.title}-${idx}`}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          {res.relatedSkill} · {res.provider} · {res.accessNote}
                        </p>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {res.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                          {res.description}
                        </p>
                      </div>

                      {res.url ? (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline w-fit"
                        >
                          Open Resource
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Search “{res.title} {res.provider}” on the official platform.
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
