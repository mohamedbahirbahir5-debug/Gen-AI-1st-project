import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Compass,
  Cpu,
  FileDown,
  FolderGit2,
  Search,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { POPULAR_CAREERS, type NavSection } from '../types/career';

interface HomeProps {
  onGetStarted: () => void;
  onSelectCareer: (careerTitle: string) => void;
  onNavigate: (section: NavSection) => void;
}

export const Home: React.FC<HomeProps> = ({ onGetStarted, onSelectCareer, onNavigate }) => {
  const [careerSearch, setCareerSearch] = useState('');

  const filteredCareers = POPULAR_CAREERS.filter((c) => {
    const q = careerSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.coreStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  const scrollToCareers = () => {
    const el = document.getElementById('popular-careers');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-14 pb-8">
      {/* Hero Section */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-8 sm:p-12 lg:p-14">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">
            Personalized Skill Gap Audit · 8-Week Study Blueprint · Portfolio Builder
          </p>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white text-balance">
            Discover your career path and close skill gaps with precision
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Audit your existing technical skills against real role expectations, receive a realistic
            8-week curriculum paced to your weekly hours, and export a complete PDF action plan.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white transition-colors whitespace-nowrap"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={scrollToCareers}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm text-slate-800 dark:text-slate-200 transition-colors whitespace-nowrap"
            >
              Explore Careers
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-balance">How It Works</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Go from uncertainty to a concrete 8-week study plan in three structured steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: '01. Enter Your Skills & Goal',
              desc: 'Tag your existing technical skills, proficiency levels, weekly study hours, and target career role.',
            },
            {
              step: '02. Audit Your Skill Gaps',
              desc: 'AI compares your profile against real industry expectations—strictly tracking only skills you actually entered.',
            },
            {
              step: '03. Follow Your 8-Week Roadmap',
              desc: 'Track weekly modules, build 3 portfolio projects, and download a formatted multi-page PDF report.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 space-y-2"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.step}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-balance">Platform Capabilities</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Everything you need to bridge skill gaps and build verifiable proof of work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: BarChart3,
              title: 'Skill Gap Matrix',
              desc: 'Have, Improve, and Learn breakdowns with readiness charts and CSV export.',
            },
            {
              icon: Compass,
              title: '8-Week Roadmap',
              desc: 'Week-by-week objectives, exercises, assignments, and hour budgets tailored to you.',
            },
            {
              icon: FolderGit2,
              title: '3 Portfolio Projects',
              desc: 'Practical mini-projects with problem statements, tech stack, and step-by-step plans.',
            },
            {
              icon: FileDown,
              title: 'Multi-Page PDF Report',
              desc: 'Downloadable, cleanly formatted PDF containing your entire career blueprint.',
            },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-5"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Career Paths */}
      <section id="popular-careers" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-balance">Popular Career Paths</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select any role to launch the dashboard with that career pre-filled.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={careerSearch}
              onChange={(e) => setCareerSearch(e.target.value)}
              placeholder="Search career paths..."
              aria-label="Search popular career paths"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredCareers.map((career) => (
            <button
              key={career.title}
              type="button"
              onClick={() => onSelectCareer(career.title)}
              className="text-left rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 p-4 transition-colors flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {career.demandLevel} Demand
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{career.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {career.tagline}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {career.coreStack.slice(0, 3).join(' · ')}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Why Choose Our Platform */}
      <section className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-8">
        <h2 className="text-2xl font-bold mb-6">Why Choose This Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'Honest Skill Evaluation',
              desc: 'Strictly audits only the skills you enter—zero fabricated proficiency claims.',
            },
            {
              icon: Cpu,
              title: 'Structured AI Architecture',
              desc: 'Server-side Gemini integration with schema validation for reliable, actionable plans.',
            },
            {
              icon: Zap,
              title: 'Persistent Progress & Exports',
              desc: 'Track every week, topic, and project locally and export clean PDF and CSV reports.',
            },
          ].map((why) => {
            const Icon = why.icon;
            return (
              <div key={why.title} className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{why.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {why.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>AI Career Roadmap &amp; Skill Gap Finder</span>
        </div>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Settings
          </button>
        </div>
      </footer>
    </div>
  );
};
