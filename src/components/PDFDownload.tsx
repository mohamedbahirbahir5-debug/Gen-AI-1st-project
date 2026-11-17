import React, { useState } from 'react';
import { CheckCircle2, Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import type { CareerRoadmapResponse, StudentProfile, StudentProgress } from '../types/career';
import { generateCompleteCareerPdf } from '../services/pdfService';
import { downloadSkillGapCsv } from '../services/geminiService';

interface PDFDownloadProps {
  profile: StudentProfile;
  roadmap: CareerRoadmapResponse;
  progress: StudentProgress;
  onNotify: (message: string, type?: 'success' | 'error') => void;
}

export const PDFDownload: React.FC<PDFDownloadProps> = ({
  profile,
  roadmap,
  progress,
  onNotify,
}) => {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleDownloadPdf = () => {
    setGeneratingPdf(true);
    try {
      generateCompleteCareerPdf(profile, roadmap, progress);
      onNotify('Complete Career Roadmap PDF downloaded successfully.', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'PDF generation failed.';
      onNotify(msg, 'error');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDownloadCsv = () => {
    downloadSkillGapCsv(profile, roadmap);
    onNotify('Skill Gap Analysis CSV downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
          PDF &amp; CSV Report Center
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Export your personalized skill audit, 8-week curriculum, portfolio projects, and progress summary.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Multi-Page Formatted Report
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {profile.studentName}’s {profile.targetCareer} Career Blueprint
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Includes cover page, student profile, full skill gap matrix, all 8 weekly learning
              modules, 3 portfolio project specs, curated resources, and your current completion
              tracker status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {generatingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download Complete Career Roadmap PDF
            </button>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors whitespace-nowrap"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              Download Skill Analysis CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          {[
            {
              title: 'Page 1: Executive Summary',
              desc: 'Student profile, target role, readiness score & hours breakdown.',
            },
            {
              title: 'Page 2: Skill Gap Matrix',
              desc: 'Have / Improve / Learn categories + structured skill table.',
            },
            {
              title: 'Page 3+: 8-Week Roadmap',
              desc: 'Objectives, topics, exercises, assignments & weekly outcomes.',
            },
            {
              title: 'Final Pages: Projects & Tips',
              desc: '3 portfolio projects, resources, progress & career tips.',
            },
          ].map((item) => (
            <div key={item.title} className="space-y-1">
              <p className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                {item.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
