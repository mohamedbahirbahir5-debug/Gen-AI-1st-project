import type { CareerRoadmapResponse, StudentProfile } from '../types/career';

export class RoadmapApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'API_ERROR', status = 500) {
    super(message);
    this.name = 'RoadmapApiError';
    this.code = code;
    this.status = status;
  }
}

export async function generateCareerRoadmap(
  profile: StudentProfile
): Promise<CareerRoadmapResponse> {
  let response: Response;
  try {
    response = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
  } catch {
    throw new RoadmapApiError(
      'Network connection error: could not reach the backend server.',
      'NETWORK_ERROR',
      0
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    // Non-JSON response
  }

  if (!response.ok) {
    const message =
      typeof body.error === 'string'
        ? body.error
        : `Request failed with status ${response.status}. Please retry.`;
    const code = typeof body.code === 'string' ? body.code : 'SERVER_ERROR';
    throw new RoadmapApiError(message, code, response.status);
  }

  return body as unknown as CareerRoadmapResponse;
}

export function downloadSkillGapCsv(
  profile: StudentProfile,
  roadmap: CareerRoadmapResponse
): void {
  const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

  const headers = [
    'Skill',
    'Current Level',
    'Required Level',
    'Status',
    'Priority',
    'Category',
    'Notes',
  ];

  const rows = roadmap.skillGapAnalysis.skillTable.map((row) =>
    [
      escapeCsv(row.skill),
      escapeCsv(row.currentLevel),
      escapeCsv(row.requiredLevel),
      escapeCsv(row.status),
      escapeCsv(row.priority),
      escapeCsv(row.category),
      escapeCsv(row.notes),
    ].join(',')
  );

  const summaryBlock = [
    `"Student Name",${escapeCsv(profile.studentName)}`,
    `"Target Career",${escapeCsv(profile.targetCareer)}`,
    `"Overall Readiness %","${roadmap.skillGapAnalysis.overallReadinessPercentage}%"`,
    `"Skill Gap %","${roadmap.skillGapAnalysis.skillGapPercentage}%"`,
    '',
  ];

  const csvContent = [...summaryBlock, headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const safeName = profile.studentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'student';
  link.href = url;
  link.setAttribute('download', `${safeName}-skill-gap-analysis.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
