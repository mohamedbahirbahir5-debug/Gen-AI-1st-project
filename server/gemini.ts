import { GoogleGenAI, ThinkingLevel, Type, type Schema } from '@google/genai';
import { z } from 'zod';

export const GEMINI_MODEL_ID = 'gemini-4-hydrogen';

export const StudentSkillInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(60),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

export const StudentProfileInputSchema = z.object({
  studentName: z.string().trim().min(1, 'Student name is required').max(100),
  educationLevel: z.string().trim().min(1, 'Education level is required').max(100),
  skills: z
    .array(StudentSkillInputSchema)
    .min(1, 'At least one current technical skill is required')
    .max(30),
  targetCareer: z.string().trim().min(2, 'Target career role is required').max(100),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  weeklyHours: z.number().int().min(1).max(80),
  learningStyle: z.enum([
    'Practical Projects',
    'Video Tutorials',
    'Documentation & Reading',
    'Interactive Practice',
    'Mixed',
  ]),
  preferredLanguage: z.string().trim().min(1, 'Preferred programming language is required').max(60),
  careerGoal: z.string().trim().min(5, 'Career goal must be at least 5 characters').max(500),
});

export type StudentProfileInput = z.infer<typeof StudentProfileInputSchema>;

const SkillGapRowZod = z.object({
  skill: z.string().min(1),
  currentLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Not entered']),
  requiredLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  status: z.enum(['Have', 'Improve', 'Learn']),
  priority: z.enum(['High', 'Medium', 'Low']),
  category: z.string().min(1),
  notes: z.string().min(1),
});

const ResourceItemZod = z.object({
  title: z.string().min(1),
  provider: z.string().min(1),
  description: z.string().min(1),
  url: z.string(),
  relatedSkill: z.string().min(1),
  accessNote: z.string().min(1),
});

const CareerRoadmapZod = z.object({
  careerOverview: z.string().min(20),
  skillGapAnalysis: z.object({
    overallReadinessPercentage: z.number().min(0).max(100),
    skillGapPercentage: z.number().min(0).max(100),
    summary: z.string().min(20),
    skillsAlreadyHave: z.array(z.string()),
    skillsToImprove: z.array(z.string()),
    skillsToLearn: z.array(z.string()),
    importantMissingSkills: z.array(z.string()).min(1),
    personalizedSuggestions: z.array(z.string()).min(2),
    categoryBreakdown: z
      .array(
        z.object({
          category: z.string().min(1),
          readinessPercentage: z.number().min(0).max(100),
          haveCount: z.number().int().min(0),
          improveCount: z.number().int().min(0),
          learnCount: z.number().int().min(0),
        })
      )
      .min(2),
    skillTable: z.array(SkillGapRowZod).min(5),
  }),
  eightWeekRoadmap: z
    .array(
      z.object({
        weekNumber: z.number().int().min(1).max(8),
        title: z.string().min(3),
        skillsToDevelop: z.array(z.string()).min(1),
        learningObjectives: z.array(z.string()).min(2),
        detailedTopics: z.array(z.string()).min(2),
        practicalExercises: z.array(z.string()).min(1),
        weeklyAssignments: z.array(z.string()).min(1),
        estimatedStudyHours: z.number().min(1).max(80),
        expectedOutcomes: z.array(z.string()).min(1),
      })
    )
    .length(8),
  portfolioProjects: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(3),
        description: z.string().min(15),
        problemStatement: z.string().min(15),
        technologiesRequired: z.array(z.string()).min(2),
        skillsDemonstrated: z.array(z.string()).min(2),
        implementationSteps: z.array(z.string()).min(3),
        expectedFinalOutput: z.string().min(10),
        difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
        portfolioValue: z.string().min(10),
      })
    )
    .length(3),
  learningResources: z.object({
    officialDocumentation: z.array(ResourceItemZod).min(2),
    freeCourses: z.array(ResourceItemZod).min(2),
    youtubeResources: z.array(ResourceItemZod).min(2),
    codingPracticePlatforms: z.array(ResourceItemZod).min(2),
    projectTutorials: z.array(ResourceItemZod).min(2),
  }),
  careerPreparationTips: z.array(z.string()).min(3),
});

const resourceItemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    provider: { type: Type.STRING },
    description: { type: Type.STRING },
    url: {
      type: Type.STRING,
      description:
        'Canonical HTTPS URL of the official documentation or well-known public platform. Leave empty string if uncertain; never invent deep URLs.',
    },
    relatedSkill: { type: Type.STRING },
    accessNote: {
      type: Type.STRING,
      description: 'Specify whether it is Official Docs, Free Tier, Open Source, or Verify Pricing.',
    },
  },
  required: ['title', 'provider', 'description', 'url', 'relatedSkill', 'accessNote'],
};

const careerRoadmapResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    careerOverview: { type: Type.STRING },
    skillGapAnalysis: {
      type: Type.OBJECT,
      properties: {
        overallReadinessPercentage: { type: Type.NUMBER },
        skillGapPercentage: { type: Type.NUMBER },
        summary: { type: Type.STRING },
        skillsAlreadyHave: { type: Type.ARRAY, items: { type: Type.STRING } },
        skillsToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
        skillsToLearn: { type: Type.ARRAY, items: { type: Type.STRING } },
        importantMissingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        personalizedSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        categoryBreakdown: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              readinessPercentage: { type: Type.NUMBER },
              haveCount: { type: Type.INTEGER },
              improveCount: { type: Type.INTEGER },
              learnCount: { type: Type.INTEGER },
            },
            required: ['category', 'readinessPercentage', 'haveCount', 'improveCount', 'learnCount'],
          },
        },
        skillTable: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skill: { type: Type.STRING },
              currentLevel: {
                type: Type.STRING,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Not entered'],
              },
              requiredLevel: {
                type: Type.STRING,
                enum: ['Beginner', 'Intermediate', 'Advanced'],
              },
              status: {
                type: Type.STRING,
                enum: ['Have', 'Improve', 'Learn'],
              },
              priority: {
                type: Type.STRING,
                enum: ['High', 'Medium', 'Low'],
              },
              category: { type: Type.STRING },
              notes: { type: Type.STRING },
            },
            required: [
              'skill',
              'currentLevel',
              'requiredLevel',
              'status',
              'priority',
              'category',
              'notes',
            ],
          },
        },
      },
      required: [
        'overallReadinessPercentage',
        'skillGapPercentage',
        'summary',
        'skillsAlreadyHave',
        'skillsToImprove',
        'skillsToLearn',
        'importantMissingSkills',
        'personalizedSuggestions',
        'categoryBreakdown',
        'skillTable',
      ],
    },
    eightWeekRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          skillsToDevelop: { type: Type.ARRAY, items: { type: Type.STRING } },
          learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
          detailedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          practicalExercises: { type: Type.ARRAY, items: { type: Type.STRING } },
          weeklyAssignments: { type: Type.ARRAY, items: { type: Type.STRING } },
          estimatedStudyHours: { type: Type.NUMBER },
          expectedOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          'weekNumber',
          'title',
          'skillsToDevelop',
          'learningObjectives',
          'detailedTopics',
          'practicalExercises',
          'weeklyAssignments',
          'estimatedStudyHours',
          'expectedOutcomes',
        ],
      },
    },
    portfolioProjects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          problemStatement: { type: Type.STRING },
          technologiesRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillsDemonstrated: { type: Type.ARRAY, items: { type: Type.STRING } },
          implementationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          expectedFinalOutput: { type: Type.STRING },
          difficultyLevel: {
            type: Type.STRING,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
          },
          portfolioValue: { type: Type.STRING },
        },
        required: [
          'id',
          'title',
          'description',
          'problemStatement',
          'technologiesRequired',
          'skillsDemonstrated',
          'implementationSteps',
          'expectedFinalOutput',
          'difficultyLevel',
          'portfolioValue',
        ],
      },
    },
    learningResources: {
      type: Type.OBJECT,
      properties: {
        officialDocumentation: { type: Type.ARRAY, items: resourceItemSchema },
        freeCourses: { type: Type.ARRAY, items: resourceItemSchema },
        youtubeResources: { type: Type.ARRAY, items: resourceItemSchema },
        codingPracticePlatforms: { type: Type.ARRAY, items: resourceItemSchema },
        projectTutorials: { type: Type.ARRAY, items: resourceItemSchema },
      },
      required: [
        'officialDocumentation',
        'freeCourses',
        'youtubeResources',
        'codingPracticePlatforms',
        'projectTutorials',
      ],
    },
    careerPreparationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    'careerOverview',
    'skillGapAnalysis',
    'eightWeekRoadmap',
    'portfolioProjects',
    'learningResources',
    'careerPreparationTips',
  ],
};

function normalizeSkillName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9+#.]/g, '');
}

function findMatchingUserSkill(
  candidateSkill: string,
  userSkills: StudentProfileInput['skills']
): StudentProfileInput['skills'][number] | undefined {
  const normCandidate = normalizeSkillName(candidateSkill);
  if (!normCandidate) return undefined;
  return userSkills.find((s) => {
    const normUser = normalizeSkillName(s.name);
    if (!normUser) return false;
    return (
      normUser === normCandidate ||
      (normUser.length > 2 && normCandidate.includes(normUser)) ||
      (normCandidate.length > 2 && normUser.includes(normCandidate))
    );
  });
}

function sanitizeHttpsUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

export class GeminiApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'GeminiApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export async function generateCareerRoadmapWithGemini(profile: StudentProfileInput) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiApiError(
      'Gemini API key is not configured on the server. Please configure GEMINI_API_KEY in Settings > Secrets.',
      500,
      'MISSING_API_KEY'
    );
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const formattedSkills = profile.skills
    .map((s) => `- ${s.name} (${s.level})`)
    .join('\n');

  const systemInstruction = `You are a senior career guidance strategist, technical hiring manager, and curriculum architect.
Your job is to produce an accurate, personalized Skill Gap Analysis, an 8-Week Learning Roadmap, 3 Portfolio Projects, and verified Learning Resources for a student.

CRITICAL RULES:
1. NEVER claim that the student has a skill unless it is explicitly listed in their "Current Technical Skills". For any required skill the student did NOT enter, set currentLevel strictly to "Not entered" and status strictly to "Learn".
2. Evaluate entered skills honestly against the target career's industry expectations. If a student has "Python (Beginner)" and the role requires "Advanced", mark status as "Improve". If currentLevel meets or exceeds requiredLevel, mark status as "Have".
3. Keep the 8-week roadmap realistic for the student's available weekly study hours (${profile.weeklyHours} hrs/week). Each week's estimatedStudyHours should closely align with ${profile.weeklyHours} hours and progress logically from fundamentals to advanced topics.
4. Generate EXACTLY 8 weeks (weekNumber 1 through 8) and EXACTLY 3 realistic portfolio projects calibrated to the student's experience level and learning roadmap.
5. For Learning Resources: ONLY provide canonical, well-known official URLs you are confident exist (such as https://docs.python.org/3/, https://pandas.pydata.org/docs/, https://scikit-learn.org/stable/, https://react.dev/, https://nodejs.org/docs/, https://www.kaggle.com/learn, https://www.freecodecamp.org/, https://leetcode.com/, https://www.hackerrank.com/). NEVER invent or guess deep URLs, and NEVER claim a paid course is free—if pricing may vary, state "Verify pricing on platform" in accessNote and leave url empty if unsure.`;

  const prompt = `Analyze this student profile and generate the complete structured career roadmap JSON:

Student Name: ${profile.studentName}
Education Level: ${profile.educationLevel}
Target Career Role: ${profile.targetCareer}
Current Experience Level: ${profile.experienceLevel}
Available Study Hours Per Week: ${profile.weeklyHours} hours
Preferred Learning Style: ${profile.learningStyle}
Preferred Programming Language: ${profile.preferredLanguage}
Career Goal: ${profile.careerGoal}

Current Technical Skills (ONLY these skills are known by the student):
${formattedSkills}

Ensure overallReadinessPercentage + skillGapPercentage = 100, and tailor every week, project, and suggestion specifically to ${profile.studentName}'s profile and ${profile.targetCareer}.`;

  const callWithRetry = async () => {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await ai.models.generateContent({
          model: GEMINI_MODEL_ID,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: careerRoadmapResponseSchema,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.MEDIUM,
            },
          },
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message.toLowerCase() : '';
        const isTransient =
          msg.includes('503') ||
          msg.includes('unavailable') ||
          msg.includes('high demand') ||
          msg.includes('overloaded');
        if (isTransient && attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        throw err;
      }
    }
    throw new GeminiApiError('Gemini service did not respond after retries.', 503, 'MODEL_UNAVAILABLE');
  };

  try {
    const response = await callWithRetry();

    const rawText = response.text?.trim();
    if (!rawText) {
      throw new GeminiApiError(
        'Gemini returned an empty response. Please retry generating your roadmap.',
        502,
        'EMPTY_AI_RESPONSE'
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      throw new GeminiApiError(
        'Gemini returned malformed JSON. Please retry.',
        502,
        'INVALID_JSON_RESPONSE'
      );
    }

    const validated = CareerRoadmapZod.safeParse(parsedJson);
    if (!validated.success) {
      throw new GeminiApiError(
        'AI response did not match the required roadmap structure. Please retry.',
        502,
        'SCHEMA_VALIDATION_FAILED'
      );
    }

    const data = validated.data;

    // Enforce anti-hallucination rule: never mark an unentered skill as "Have" or "Improve"
    const sanitizedTable = data.skillGapAnalysis.skillTable.map((row) => {
      const matched = findMatchingUserSkill(row.skill, profile.skills);
      if (!matched) {
        return {
          ...row,
          currentLevel: 'Not entered' as const,
          status: 'Learn' as const,
        };
      }
      return {
        ...row,
        currentLevel: matched.level,
      };
    });

    const haveSkills = sanitizedTable.filter((r) => r.status === 'Have').map((r) => r.skill);
    const improveSkills = sanitizedTable.filter((r) => r.status === 'Improve').map((r) => r.skill);
    const learnSkills = sanitizedTable.filter((r) => r.status === 'Learn').map((r) => r.skill);

    const totalRows = Math.max(sanitizedTable.length, 1);
    const weightedScore = sanitizedTable.reduce((acc, row) => {
      if (row.status === 'Have') return acc + 1;
      if (row.status === 'Improve') return acc + 0.45;
      return acc;
    }, 0);
    const computedReadiness = Math.round((weightedScore / totalRows) * 100);
    const overallReadinessPercentage = Math.min(100, Math.max(0, computedReadiness));
    const skillGapPercentage = 100 - overallReadinessPercentage;

    const normalizedWeeks = [...data.eightWeekRoadmap]
      .sort((a, b) => a.weekNumber - b.weekNumber)
      .map((week, idx) => ({
        ...week,
        weekNumber: idx + 1,
      }));

    const sanitizeList = (items: z.infer<typeof ResourceItemZod>[]) =>
      items.map((item) => ({
        ...item,
        url: sanitizeHttpsUrl(item.url),
      }));

    return {
      generatedAt: new Date().toISOString(),
      modelUsed: GEMINI_MODEL_ID,
      careerOverview: data.careerOverview,
      skillGapAnalysis: {
        ...data.skillGapAnalysis,
        overallReadinessPercentage,
        skillGapPercentage,
        skillsAlreadyHave: haveSkills,
        skillsToImprove: improveSkills,
        skillsToLearn: learnSkills,
        skillTable: sanitizedTable,
      },
      eightWeekRoadmap: normalizedWeeks,
      portfolioProjects: data.portfolioProjects.map((project, idx) => ({
        ...project,
        id: project.id || `project-${idx + 1}`,
      })),
      learningResources: {
        officialDocumentation: sanitizeList(data.learningResources.officialDocumentation),
        freeCourses: sanitizeList(data.learningResources.freeCourses),
        youtubeResources: sanitizeList(data.learningResources.youtubeResources),
        codingPracticePlatforms: sanitizeList(data.learningResources.codingPracticePlatforms),
        projectTutorials: sanitizeList(data.learningResources.projectTutorials),
      },
      careerPreparationTips: data.careerPreparationTips,
    };
  } catch (err: unknown) {
    if (err instanceof GeminiApiError) {
      throw err;
    }

    const message = err instanceof Error ? err.message : 'Unknown error calling Gemini API';
    const lower = message.toLowerCase();

    if (
      lower.includes('api key') ||
      lower.includes('api_key_invalid') ||
      lower.includes('permission') ||
      lower.includes('401') ||
      lower.includes('403')
    ) {
      throw new GeminiApiError(
        'Invalid or unauthorized Gemini API key. Please check GEMINI_API_KEY in Settings > Secrets.',
        401,
        'INVALID_API_KEY'
      );
    }

    if (
      lower.includes('429') ||
      lower.includes('quota') ||
      lower.includes('rate limit') ||
      lower.includes('resource_exhausted')
    ) {
      throw new GeminiApiError(
        'Gemini API rate limit or quota exceeded. Please wait a moment and try again.',
        429,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    if (
      lower.includes('503') ||
      lower.includes('unavailable') ||
      lower.includes('high demand') ||
      lower.includes('overloaded')
    ) {
      throw new GeminiApiError(
        'The AI model is temporarily experiencing high demand. Please retry in a few seconds.',
        503,
        'MODEL_UNAVAILABLE'
      );
    }

    if (
      lower.includes('fetch') ||
      lower.includes('network') ||
      lower.includes('econn') ||
      lower.includes('timeout')
    ) {
      throw new GeminiApiError(
        'Network error reaching the Gemini API. Please check server connectivity and retry.',
        503,
        'NETWORK_ERROR'
      );
    }

    throw new GeminiApiError(
      'Failed to generate AI career roadmap. Please retry.',
      500,
      'GEMINI_INTERNAL_ERROR'
    );
  }
}
