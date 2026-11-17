import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Compass, Loader2, Sparkles, X } from 'lucide-react';
import type {
  CareerRoadmapResponse,
  NavSection,
  StudentProfile,
  StudentProgress,
} from './types/career';
import {
  EMPTY_PROFILE,
  EMPTY_PROGRESS,
  SAMPLE_TEST_PROFILE_ALEX,
  clearAllStoredData,
  loadProfile,
  loadProgress,
  loadRoadmap,
  loadTheme,
  saveProfile,
  saveProgress,
  saveRoadmap,
  saveTheme,
} from './utils/storage';
import { generateCareerRoadmap } from './services/geminiService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SkillAnalysis } from './components/SkillAnalysis';
import { Roadmap } from './components/Roadmap';
import { ProjectCards } from './components/ProjectCards';
import { ResourceFinder } from './components/ResourceFinder';
import { ProgressTracker } from './components/ProgressTracker';
import { PDFDownload } from './components/PDFDownload';
import { Home } from './pages/Home';
import { CareerDashboard } from './pages/CareerDashboard';
import { Settings } from './pages/Settings';

interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadTheme());

  const [profile, setProfile] = useState<StudentProfile>(() => loadProfile());
  const [roadmap, setRoadmap] = useState<CareerRoadmapResponse | null>(() => loadRoadmap());
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveRoadmap(roadmap);
  }, [roadmap]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4500);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await generateCareerRoadmap(profile);
      setRoadmap(result);
      setProgress(EMPTY_PROGRESS);
      setActiveSection('skill-analysis');
      notify(`Personalized roadmap generated for ${profile.targetCareer}.`, 'success');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to generate AI career roadmap. Please retry.';
      setErrorMessage(msg);
      notify(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setProfile(EMPTY_PROFILE);
    setErrorMessage(null);
    notify('Form cleared.', 'success');
  };

  const handleLoadSampleAlex = () => {
    setProfile(SAMPLE_TEST_PROFILE_ALEX);
    setErrorMessage(null);
    notify('Loaded sample profile: Alex (Data Scientist).', 'success');
  };

  const handleSelectCareerFromHome = (careerTitle: string) => {
    setProfile((prev) => ({ ...prev, targetCareer: careerTitle }));
    setActiveSection('dashboard');
    notify(`Target career set to ${careerTitle}. Complete your profile to generate.`, 'success');
  };

  const handleToggleWeekComplete = (weekNumber: number) => {
    setProgress((prev) => {
      const exists = prev.completedWeeks.includes(weekNumber);
      const completedWeeks = exists
        ? prev.completedWeeks.filter((w) => w !== weekNumber)
        : [...prev.completedWeeks, weekNumber];
      return { ...prev, completedWeeks };
    });
  };

  const handleToggleTopicComplete = (topicKey: string) => {
    setProgress((prev) => {
      const exists = prev.completedTopics.includes(topicKey);
      const completedTopics = exists
        ? prev.completedTopics.filter((t) => t !== topicKey)
        : [...prev.completedTopics, topicKey];
      return { ...prev, completedTopics };
    });
  };

  const handleToggleProjectComplete = (projectId: string) => {
    setProgress((prev) => {
      const exists = prev.completedProjects.includes(projectId);
      const completedProjects = exists
        ? prev.completedProjects.filter((p) => p !== projectId)
        : [...prev.completedProjects, projectId];
      return { ...prev, completedProjects };
    });
  };

  const handleResetAllData = () => {
    clearAllStoredData();
    setProfile(EMPTY_PROFILE);
    setRoadmap(null);
    setProgress(EMPTY_PROGRESS);
    setErrorMessage(null);
    notify('All saved profiles, roadmaps, and progress cleared.', 'success');
  };

  const renderEmptyRoadmapState = (sectionTitle: string) => (
    <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-10 text-center max-w-xl mx-auto my-8 space-y-4">
      <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center">
        <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {sectionTitle} Not Generated Yet
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Fill out your current technical skills and target career on the Career Dashboard to generate
        your personalized AI analysis and roadmap.
      </p>
      <button
        type="button"
        onClick={() => setActiveSection('dashboard')}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
      >
        <Sparkles className="w-4 h-4" />
        Go to Career Dashboard
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <Home
            onGetStarted={() => setActiveSection('dashboard')}
            onSelectCareer={handleSelectCareerFromHome}
            onNavigate={setActiveSection}
          />
        );
      case 'dashboard':
        return (
          <CareerDashboard
            profile={profile}
            roadmap={roadmap}
            progress={progress}
            onChangeProfile={setProfile}
            onGenerate={() => void handleGenerateRoadmap()}
            onClearForm={handleClearForm}
            onLoadSampleAlex={handleLoadSampleAlex}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onRetry={() => void handleGenerateRoadmap()}
            onNavigate={setActiveSection}
          />
        );
      case 'skill-analysis':
        return roadmap ? (
          <SkillAnalysis profile={profile} roadmap={roadmap} onNotify={notify} />
        ) : (
          renderEmptyRoadmapState('Skill Gap Analysis')
        );
      case 'roadmap':
        return roadmap ? (
          <Roadmap
            profile={profile}
            roadmap={roadmap}
            progress={progress}
            onToggleWeekComplete={handleToggleWeekComplete}
            onToggleTopicComplete={handleToggleTopicComplete}
            onRegenerate={() => void handleGenerateRoadmap()}
            isLoading={isLoading}
            onNotify={notify}
          />
        ) : (
          renderEmptyRoadmapState('8-Week Learning Roadmap')
        );
      case 'projects':
        return roadmap ? (
          <ProjectCards
            roadmap={roadmap}
            progress={progress}
            onToggleProjectComplete={handleToggleProjectComplete}
          />
        ) : (
          renderEmptyRoadmapState('Portfolio Projects')
        );
      case 'resources':
        return roadmap ? (
          <ResourceFinder roadmap={roadmap} />
        ) : (
          renderEmptyRoadmapState('Learning Resources')
        );
      case 'progress':
        return roadmap ? (
          <ProgressTracker
            roadmap={roadmap}
            progress={progress}
            onToggleWeekComplete={handleToggleWeekComplete}
            onToggleTopicComplete={handleToggleTopicComplete}
            onToggleProjectComplete={handleToggleProjectComplete}
          />
        ) : (
          renderEmptyRoadmapState('Progress Tracker')
        );
      case 'pdf-reports':
        return roadmap ? (
          <PDFDownload
            profile={profile}
            roadmap={roadmap}
            progress={progress}
            onNotify={notify}
          />
        ) : (
          renderEmptyRoadmapState('PDF Reports')
        );
      case 'settings':
        return (
          <Settings
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onResetAllData={handleResetAllData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        targetCareer={profile.targetCareer}
        readinessPercentage={roadmap?.skillGapAnalysis.overallReadinessPercentage ?? null}
        onNavigate={setActiveSection}
      />

      <div className="flex flex-1">
        <Sidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          hasRoadmap={Boolean(roadmap)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {renderContent()}
        </main>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <Loader2 className="w-8 h-8 mx-auto text-indigo-600 dark:text-indigo-400 animate-spin" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Building Your Career Roadmap
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Analyzing your current skills, identifying gaps, designing 8 weekly modules, and
              curating 3 portfolio projects...
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm">
          <div
            className={`rounded-xl px-4 py-3 shadow-xl border flex items-center gap-3 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-emerald-500/40'
                : 'bg-rose-950 text-rose-100 border-rose-500/50'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
