import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, CheckCircle2, Download, Lightbulb, TrendingUp } from 'lucide-react';
import type { CareerRoadmapResponse, StudentProfile } from '../types/career';
import { downloadSkillGapCsv } from '../services/geminiService';

interface SkillAnalysisProps {
  profile: StudentProfile;
  roadmap: CareerRoadmapResponse;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}

export const SkillAnalysis: React.FC<SkillAnalysisProps> = ({ profile, roadmap, onNotify }) => {
  const { skillGapAnalysis } = roadmap;

  const pieData = [
    { name: 'Readiness', value: skillGapAnalysis.overallReadinessPercentage, color: '#0891b2' },
    { name: 'Skill Gap', value: skillGapAnalysis.skillGapPercentage, color: '#4f46e5' },
  ];

  const handleCsvDownload = () => {
    downloadSkillGapCsv(profile, roadmap);
    onNotify('Skill gap analysis exported as CSV.', 'success');
  };

  const getStatusClass = (status: 'Have' | 'Improve' | 'Learn') => {
    if (status === 'Have') {
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    }
    if (status === 'Improve') {
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
    }
    return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30';
  };

  const getPriorityClass = (priority: 'High' | 'Medium' | 'Low') => {
    if (priority === 'High') return 'text-rose-600 dark:text-rose-400 font-semibold';
    if (priority === 'Medium') return 'text-amber-600 dark:text-amber-400 font-medium';
    return 'text-slate-500 dark:text-slate-400 font-medium';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            Skill Gap Analysis
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Comparing {profile.studentName}’s entered skills against{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {profile.targetCareer}
            </span>{' '}
            expectations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCsvDownload}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold border border-slate-800 dark:border-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Download Skill Analysis CSV
        </button>
      </div>

      {/* Top Metrics + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
              Readiness vs. Skill Gap
            </h2>
            <div className="mt-2 flex items-baseline gap-3 tabular-nums">
              <span className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">
                {skillGapAnalysis.overallReadinessPercentage}%
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Ready ({skillGapAnalysis.skillGapPercentage}% Gap)
              </span>
            </div>
          </div>

          <div className="h-52 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={4}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {skillGapAnalysis.summary}
          </p>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide mb-4">
            Skill Category Readiness Breakdown
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skillGapAnalysis.categoryBreakdown}
                margin={{ top: 8, right: 12, left: -12, bottom: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="readinessPercentage"
                  name="Readiness %"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* A, B, C Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-3 tabular-nums">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            A. Skills Already Have ({skillGapAnalysis.skillsAlreadyHave.length})
          </div>
          {skillGapAnalysis.skillsAlreadyHave.length > 0 ? (
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {skillGapAnalysis.skillsAlreadyHave.join(' · ')}
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No entered skills meet full target proficiency yet—your roadmap builds from your current baseline.
            </p>
          )}
        </div>

        <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm mb-3 tabular-nums">
            <TrendingUp className="w-4 h-4 shrink-0" />
            B. Skills to Improve ({skillGapAnalysis.skillsToImprove.length})
          </div>
          {skillGapAnalysis.skillsToImprove.length > 0 ? (
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {skillGapAnalysis.skillsToImprove.join(' · ')}
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">None flagged for upgrade.</p>
          )}
        </div>

        <div className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm mb-3 tabular-nums">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            C. Skills to Learn ({skillGapAnalysis.skillsToLearn.length})
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {skillGapAnalysis.skillsToLearn.join(' · ')}
          </p>
        </div>
      </div>

      {/* Professional Skill Gap Table */}
      <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold">Detailed Skill Gap Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-semibold">Skill</th>
                <th className="px-6 py-3 font-semibold">Current Level</th>
                <th className="px-6 py-3 font-semibold">Required Level</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Priority</th>
                <th className="px-6 py-3 font-semibold">Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {skillGapAnalysis.skillTable.map((row) => (
                <tr key={row.skill} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    {row.skill}
                  </td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                    {row.currentLevel}
                  </td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                    {row.requiredLevel}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold border ${getStatusClass(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className={`px-6 py-3 text-xs ${getPriorityClass(row.priority)}`}>
                    {row.priority}
                  </td>
                  <td className="px-6 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-xs">
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Missing Skills & Personalized Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            High-Impact Missing Skills
          </h3>
          <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
            {skillGapAnalysis.importantMissingSkills.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold leading-5">–</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-cyan-500" />
            Personalized Improvement Suggestions
          </h3>
          <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
            {skillGapAnalysis.personalizedSuggestions.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-cyan-500 font-bold leading-5">–</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
