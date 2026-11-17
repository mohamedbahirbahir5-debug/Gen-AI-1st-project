export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type RequiredOrCurrentLevel = SkillLevel | 'Not entered';
export type SkillStatus = 'Have' | 'Improve' | 'Learn';
export type SkillPriority = 'High' | 'Medium' | 'Low';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type LearningStyle =
  | 'Practical Projects'
  | 'Video Tutorials'
  | 'Documentation & Reading'
  | 'Interactive Practice'
  | 'Mixed';

export interface UserSkill {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface StudentProfile {
  studentName: string;
  educationLevel: string;
  skills: UserSkill[];
  targetCareer: string;
  experienceLevel: ExperienceLevel;
  weeklyHours: number;
  learningStyle: LearningStyle;
  preferredLanguage: string;
  careerGoal: string;
}

export interface SkillGapRow {
  skill: string;
  currentLevel: RequiredOrCurrentLevel;
  requiredLevel: SkillLevel;
  status: SkillStatus;
  priority: SkillPriority;
  category: string;
  notes: string;
}

export interface SkillCategoryBreakdown {
  category: string;
  readinessPercentage: number;
  haveCount: number;
  improveCount: number;
  learnCount: number;
}

export interface SkillGapAnalysis {
  overallReadinessPercentage: number;
  skillGapPercentage: number;
  summary: string;
  skillsAlreadyHave: string[];
  skillsToImprove: string[];
  skillsToLearn: string[];
  importantMissingSkills: string[];
  personalizedSuggestions: string[];
  categoryBreakdown: SkillCategoryBreakdown[];
  skillTable: SkillGapRow[];
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  skillsToDevelop: string[];
  learningObjectives: string[];
  detailedTopics: string[];
  practicalExercises: string[];
  weeklyAssignments: string[];
  estimatedStudyHours: number;
  expectedOutcomes: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  technologiesRequired: string[];
  skillsDemonstrated: string[];
  implementationSteps: string[];
  expectedFinalOutput: string;
  difficultyLevel: SkillLevel;
  portfolioValue: string;
}

export interface LearningResourceItem {
  title: string;
  provider: string;
  description: string;
  url: string;
  relatedSkill: string;
  accessNote: string;
}

export interface LearningResources {
  officialDocumentation: LearningResourceItem[];
  freeCourses: LearningResourceItem[];
  youtubeResources: LearningResourceItem[];
  codingPracticePlatforms: LearningResourceItem[];
  projectTutorials: LearningResourceItem[];
}

export interface CareerRoadmapResponse {
  generatedAt: string;
  modelUsed: string;
  careerOverview: string;
  skillGapAnalysis: SkillGapAnalysis;
  eightWeekRoadmap: RoadmapWeek[];
  portfolioProjects: PortfolioProject[];
  learningResources: LearningResources;
  careerPreparationTips: string[];
}

export interface StudentProgress {
  completedWeeks: number[];
  completedTopics: string[];
  completedProjects: string[];
  lastUpdated: string;
}

export type NavSection =
  | 'home'
  | 'dashboard'
  | 'skill-analysis'
  | 'roadmap'
  | 'projects'
  | 'resources'
  | 'progress'
  | 'pdf-reports'
  | 'settings';

export interface PopularCareer {
  title: string;
  tagline: string;
  coreStack: string[];
  demandLevel: string;
}

export const POPULAR_CAREERS: PopularCareer[] = [
  {
    title: 'Data Scientist',
    tagline: 'Extract predictive insights from complex datasets using statistics and ML.',
    coreStack: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Statistics'],
    demandLevel: 'Very High',
  },
  {
    title: 'AI Engineer',
    tagline: 'Design, evaluate, and deploy LLM-powered and multimodal AI systems.',
    coreStack: ['Python', 'PyTorch', 'LLMs', 'RAG', 'APIs'],
    demandLevel: 'Rapid Growth',
  },
  {
    title: 'Full Stack Developer',
    tagline: 'Build end-to-end scalable web apps across UI, APIs, and databases.',
    coreStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    demandLevel: 'Very High',
  },
  {
    title: 'Web Developer',
    tagline: 'Craft accessible, high-performance interactive web experiences.',
    coreStack: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
    demandLevel: 'High',
  },
  {
    title: 'Data Analyst',
    tagline: 'Transform raw business data into dashboards, KPIs, and clear decisions.',
    coreStack: ['SQL', 'Excel', 'Python', 'Tableau / Power BI', 'Statistics'],
    demandLevel: 'High',
  },
  {
    title: 'Cybersecurity Analyst',
    tagline: 'Protect networks, cloud workloads, and applications from security threats.',
    coreStack: ['Networking', 'Linux', 'SIEM', 'Python', 'Threat Modeling'],
    demandLevel: 'Very High',
  },
  {
    title: 'Cloud Engineer',
    tagline: 'Architect resilient cloud infrastructure, CI/CD pipelines, and containers.',
    coreStack: ['AWS / GCP', 'Linux', 'Terraform', 'Docker', 'Kubernetes'],
    demandLevel: 'Very High',
  },
  {
    title: 'Software Developer',
    tagline: 'Engineer reliable algorithms, backend services, and modular software.',
    coreStack: ['Java / Python / C++', 'DSA', 'Git', 'Testing', 'System Design'],
    demandLevel: 'Very High',
  },
  {
    title: 'UI/UX Designer',
    tagline: 'Design intuitive user journeys, wireframes, and accessible design systems.',
    coreStack: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
    demandLevel: 'High',
  },
  {
    title: 'Machine Learning Engineer',
    tagline: 'Productionize training pipelines, feature stores, and model serving.',
    coreStack: ['Python', 'PyTorch', 'MLOps', 'Docker', 'Mathematics'],
    demandLevel: 'Very High',
  },
];
