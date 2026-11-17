import type { CareerRoadmapResponse, StudentProfile, StudentProgress } from '../types/career';

const KEYS = {
  PROFILE: 'ai_career_roadmap_profile_v1',
  ROADMAP: 'ai_career_roadmap_result_v1',
  PROGRESS: 'ai_career_roadmap_progress_v1',
  THEME: 'ai_career_roadmap_theme_v1',
} as const;

export const EMPTY_PROFILE: StudentProfile = {
  studentName: '',
  educationLevel: '',
  skills: [],
  targetCareer: '',
  experienceLevel: 'Beginner',
  weeklyHours: 10,
  learningStyle: 'Practical Projects',
  preferredLanguage: 'Python',
  careerGoal: '',
};

export const SAMPLE_TEST_PROFILE_ALEX: StudentProfile = {
  studentName: 'Alex',
  educationLevel: 'Undergraduate Student',
  skills: [
    { id: 'alex-c', name: 'C', level: 'Intermediate' },
    { id: 'alex-py', name: 'Python', level: 'Beginner' },
    { id: 'alex-html', name: 'HTML', level: 'Intermediate' },
  ],
  targetCareer: 'Data Scientist',
  experienceLevel: 'Beginner',
  weeklyHours: 10,
  learningStyle: 'Practical Projects',
  preferredLanguage: 'Python',
  careerGoal:
    'Build strong statistics, SQL, and machine learning foundations to land an entry-level Data Scientist internship or junior role.',
};

export const EMPTY_PROGRESS: StudentProgress = {
  completedWeeks: [],
  completedTopics: [],
  completedProjects: [],
  lastUpdated: new Date().toISOString(),
};

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) return EMPTY_PROFILE;
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_PROFILE;
  }
}

export function saveRoadmap(roadmap: CareerRoadmapResponse | null): void {
  try {
    if (!roadmap) {
      localStorage.removeItem(KEYS.ROADMAP);
      return;
    }
    localStorage.setItem(KEYS.ROADMAP, JSON.stringify(roadmap));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadRoadmap(): CareerRoadmapResponse | null {
  try {
    const raw = localStorage.getItem(KEYS.ROADMAP);
    if (!raw) return null;
    return JSON.parse(raw) as CareerRoadmapResponse;
  } catch {
    return null;
  }
}

export function saveProgress(progress: StudentProgress): void {
  try {
    localStorage.setItem(
      KEYS.PROGRESS,
      JSON.stringify({ ...progress, lastUpdated: new Date().toISOString() })
    );
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadProgress(): StudentProgress {
  try {
    const raw = localStorage.getItem(KEYS.PROGRESS);
    if (!raw) return EMPTY_PROGRESS;
    return { ...EMPTY_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(KEYS.THEME, theme);
  } catch {
    // Ignore
  }
}

export function loadTheme(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(KEYS.THEME);
    return raw === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function clearAllStoredData(): void {
  try {
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.ROADMAP);
    localStorage.removeItem(KEYS.PROGRESS);
  } catch {
    // Ignore
  }
}
