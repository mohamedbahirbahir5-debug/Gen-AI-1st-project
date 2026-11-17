import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import {
  POPULAR_CAREERS,
  type ExperienceLevel,
  type LearningStyle,
  type SkillLevel,
  type StudentProfile,
} from '../types/career';
import {
  hasValidationErrors,
  validateStudentProfile,
  type ProfileValidationErrors,
} from '../utils/validation';
import { Tooltip } from './Tooltip';

interface DashboardProps {
  profile: StudentProfile;
  onChangeProfile: (updated: StudentProfile) => void;
  onGenerate: () => void;
  onClearForm: () => void;
  onLoadSampleAlex: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
}

const EDUCATION_LEVELS = [
  'High School Student',
  'Undergraduate Student',
  'Graduate / Master’s Student',
  'Recent Graduate',
  'Bootcamp / Self-Taught Learner',
  'Working Professional Transitioning',
];

const QUICK_SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'C',
  'C++',
  'Java',
  'HTML',
  'CSS',
  'React',
  'Node.js',
  'SQL',
  'Git',
  'Docker',
  'Statistics',
  'Pandas',
  'Linux',
];

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  onChangeProfile,
  onGenerate,
  onClearForm,
  onLoadSampleAlex,
  isLoading,
  errorMessage,
  onRetry,
}) => {
  const [skillInput, setSkillInput] = useState('');
  const [skillLevelInput, setSkillLevelInput] = useState<SkillLevel>('Beginner');
  const [careerQuery, setCareerQuery] = useState('');
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const filteredCareers = useMemo(() => {
    const q = careerQuery.trim().toLowerCase();
    if (!q) return POPULAR_CAREERS;
    return POPULAR_CAREERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.coreStack.some((s) => s.toLowerCase().includes(q))
    );
  }, [careerQuery]);

  const updateField = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    const next = { ...profile, [key]: value };
    onChangeProfile(next);
    if (submittedOnce) {
      setErrors(validateStudentProfile(next));
    }
  };

  const addSkill = (rawName?: string, levelOverride?: SkillLevel) => {
    const name = (rawName ?? skillInput).trim();
    const level = levelOverride ?? skillLevelInput;
    if (!name) return;

    const exists = profile.skills.some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setSkillInput('');
      return;
    }

    const updatedSkills = [
      ...profile.skills,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, level },
    ];
    updateField('skills', updatedSkills);
    if (!rawName) setSkillInput('');
  };

  const updateSkillLevel = (id: string, level: SkillLevel) => {
    const updatedSkills = profile.skills.map((s) => (s.id === id ? { ...s, level } : s));
    updateField('skills', updatedSkills);
  };

  const removeSkill = (id: string) => {
    const updatedSkills = profile.skills.filter((s) => s.id !== id);
    updateField('skills', updatedSkills);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOnce(true);
    const validationErrors = validateStudentProfile(profile);
    setErrors(validationErrors);
    if (hasValidationErrors(validationErrors)) return;
    onGenerate();
  };

  const handleClear = () => {
    setErrors({});
    setSubmittedOnce(false);
    setSkillInput('');
    setCareerQuery('');
    onClearForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            Student Career Input Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Enter your actual skills and goals to audit skill gaps and generate an 8-week learning plan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onLoadSampleAlex}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <UserCheck className="w-4 h-4" />
            Load Sample Profile (Alex)
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Form
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-200">
                Roadmap Generation Failed
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 transition-colors whitespace-nowrap"
          >
            Retry Generation
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="studentName" className="block text-sm font-semibold mb-1.5">
              Student Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="studentName"
              type="text"
              value={profile.studentName}
              onChange={(e) => updateField('studentName', e.target.value)}
              placeholder="e.g., Alex"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {errors.studentName && (
              <p className="text-xs text-rose-500 mt-1">{errors.studentName}</p>
            )}
          </div>

          <div>
            <label htmlFor="educationLevel" className="block text-sm font-semibold mb-1.5">
              Education Level <span className="text-rose-500">*</span>
            </label>
            <select
              id="educationLevel"
              value={profile.educationLevel}
              onChange={(e) => updateField('educationLevel', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Select education level...</option>
              {EDUCATION_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            {errors.educationLevel && (
              <p className="text-xs text-rose-500 mt-1">{errors.educationLevel}</p>
            )}
          </div>
        </div>

        {/* Target Career Role */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label htmlFor="targetCareer" className="flex items-center text-sm font-semibold">
              Target Career Role <span className="text-rose-500 ml-1">*</span>
              <Tooltip text="Select one of the popular career paths below or enter any custom target role." />
            </label>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={careerQuery}
                onChange={(e) => setCareerQuery(e.target.value)}
                placeholder="Filter career paths..."
                aria-label="Filter career paths"
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {filteredCareers.map((career) => {
              const selected = profile.targetCareer.toLowerCase() === career.title.toLowerCase();
              return (
                <button
                  key={career.title}
                  type="button"
                  onClick={() => updateField('targetCareer', career.title)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs font-medium transition-colors truncate ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {career.title}
                </button>
              );
            })}
          </div>

          <input
            id="targetCareer"
            type="text"
            value={profile.targetCareer}
            onChange={(e) => updateField('targetCareer', e.target.value)}
            placeholder="Or enter a custom target career role..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.targetCareer && (
            <p className="text-xs text-rose-500 mt-1">{errors.targetCareer}</p>
          )}
        </div>

        {/* Current Technical Skills */}
        <div className="space-y-3">
          <label htmlFor="skillInput" className="flex items-center text-sm font-semibold">
            Current Technical Skills <span className="text-rose-500 ml-1">*</span>
            <Tooltip text="Only skills you add here are counted as existing skills. Set Beginner, Intermediate, or Advanced for each." />
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              id="skillInput"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill (e.g., Python, HTML, SQL) and click Add..."
              className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <select
              value={skillLevelInput}
              onChange={(e) => setSkillLevelInput(e.target.value as SkillLevel)}
              aria-label="Skill proficiency level"
              className="px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button
              type="button"
              onClick={() => addSkill()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Quick add:</span>
            {QUICK_SKILLS.map((quick) => {
              const alreadyAdded = profile.skills.some(
                (s) => s.name.toLowerCase() === quick.toLowerCase()
              );
              return (
                <button
                  key={quick}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => addSkill(quick, skillLevelInput)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-indigo-500/50 disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  + {quick}
                </button>
              );
            })}
          </div>

          {profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-sm"
                >
                  <span className="font-semibold text-indigo-900 dark:text-indigo-200">
                    {skill.name}
                  </span>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkillLevel(skill.id, e.target.value as SkillLevel)}
                    aria-label={`${skill.name} level`}
                    className="bg-transparent text-xs font-medium text-indigo-700 dark:text-indigo-300 focus:outline-none cursor-pointer"
                  >
                    <option value="Beginner" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      Beginner
                    </option>
                    <option value="Intermediate" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      Intermediate
                    </option>
                    <option value="Advanced" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      Advanced
                    </option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    aria-label={`Remove ${skill.name}`}
                    className="p-0.5 rounded hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              No skills added yet. Add your current skills above.
            </p>
          )}
          {errors.skills && <p className="text-xs text-rose-500">{errors.skills}</p>}
        </div>

        {/* Experience, Weekly Hours, Learning Style, Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-semibold mb-1.5">
              Experience Level <span className="text-rose-500">*</span>
            </label>
            <select
              id="experienceLevel"
              value={profile.experienceLevel}
              onChange={(e) => updateField('experienceLevel', e.target.value as ExperienceLevel)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.experienceLevel && (
              <p className="text-xs text-rose-500 mt-1">{errors.experienceLevel}</p>
            )}
          </div>

          <div>
            <label htmlFor="weeklyHours" className="flex items-center text-sm font-semibold mb-1.5">
              Study Hours / Week <span className="text-rose-500 ml-1">*</span>
              <Tooltip text="Used to pace your 8-week roadmap workload realistically." />
            </label>
            <input
              id="weeklyHours"
              type="number"
              min={1}
              max={80}
              value={profile.weeklyHours}
              onChange={(e) => updateField('weeklyHours', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.weeklyHours && (
              <p className="text-xs text-rose-500 mt-1">{errors.weeklyHours}</p>
            )}
          </div>

          <div>
            <label htmlFor="learningStyle" className="block text-sm font-semibold mb-1.5">
              Preferred Learning Style <span className="text-rose-500">*</span>
            </label>
            <select
              id="learningStyle"
              value={profile.learningStyle}
              onChange={(e) => updateField('learningStyle', e.target.value as LearningStyle)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Practical Projects">Practical Projects</option>
              <option value="Video Tutorials">Video Tutorials</option>
              <option value="Documentation & Reading">Documentation & Reading</option>
              <option value="Interactive Practice">Interactive Practice</option>
              <option value="Mixed">Mixed</option>
            </select>
            {errors.learningStyle && (
              <p className="text-xs text-rose-500 mt-1">{errors.learningStyle}</p>
            )}
          </div>

          <div>
            <label htmlFor="preferredLanguage" className="block text-sm font-semibold mb-1.5">
              Preferred Language <span className="text-rose-500">*</span>
            </label>
            <input
              id="preferredLanguage"
              type="text"
              value={profile.preferredLanguage}
              onChange={(e) => updateField('preferredLanguage', e.target.value)}
              placeholder="e.g., Python, TypeScript"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.preferredLanguage && (
              <p className="text-xs text-rose-500 mt-1">{errors.preferredLanguage}</p>
            )}
          </div>
        </div>

        {/* Career Goal */}
        <div>
          <label htmlFor="careerGoal" className="block text-sm font-semibold mb-1.5">
            Career Goal <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="careerGoal"
            rows={3}
            value={profile.careerGoal}
            onChange={(e) => updateField('careerGoal', e.target.value)}
            placeholder="Describe what you want to achieve (e.g., land a summer internship, build a portfolio, transition into software engineering)..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.careerGoal && <p className="text-xs text-rose-500 mt-1">{errors.careerGoal}</p>}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Skills &amp; Generating Roadmap...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate My Career Roadmap
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
