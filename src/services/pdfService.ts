import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import type {
  CareerRoadmapResponse,
  LearningResourceItem,
  StudentProfile,
  StudentProgress,
} from '../types/career';

type JsPDFWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number };
};

function cleanPdfText(input: string): string {
  return input
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, '--')
    .replace(/\u2013/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '')
    .trim();
}

export function generateCompleteCareerPdf(
  profile: StudentProfile,
  roadmap: CareerRoadmapResponse,
  progress: StudentProgress
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }) as JsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  const colors = {
    navy: [15, 23, 42] as [number, number, number],
    indigo: [79, 70, 229] as [number, number, number],
    cyan: [8, 145, 178] as [number, number, number],
    slateDark: [30, 41, 59] as [number, number, number],
    slateMuted: [100, 116, 139] as [number, number, number],
    lightBg: [248, 250, 252] as [number, number, number],
    border: [226, 232, 240] as [number, number, number],
  };

  let cursorY = margin;

  const ensureSpace = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 18) {
      doc.addPage();
      cursorY = margin;
    }
  };

  const addSectionHeader = (title: string, subtitle?: string) => {
    ensureSpace(18);
    doc.setFillColor(...colors.indigo);
    doc.rect(margin, cursorY, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...colors.navy);
    doc.text(cleanPdfText(title), margin + 6, cursorY + 5.5);
    cursorY += 10;

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...colors.slateMuted);
      const lines = doc.splitTextToSize(cleanPdfText(subtitle), contentWidth);
      doc.text(lines, margin, cursorY);
      cursorY += lines.length * 4.5 + 3;
    }
  };

  const addWrappedBullets = (label: string, items: string[]) => {
    if (items.length === 0) return;
    ensureSpace(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slateDark);
    doc.text(cleanPdfText(label), margin, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...colors.slateDark);

    for (const item of items) {
      const lines = doc.splitTextToSize(`- ${cleanPdfText(item)}`, contentWidth - 4);
      ensureSpace(lines.length * 4.3 + 2);
      doc.text(lines, margin + 3, cursorY);
      cursorY += lines.length * 4.3 + 1.2;
    }
    cursorY += 2;
  };

  // PAGE 1: COVER & SUMMARY
  doc.setFillColor(...colors.navy);
  doc.rect(0, 0, pageWidth, 68, 'F');

  doc.setFillColor(...colors.indigo);
  doc.rect(0, 65, pageWidth, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(129, 140, 248);
  doc.text('AI CAREER ROADMAP & SKILL GAP FINDER', margin, 20);

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('Personalized 8-Week Career Report', margin, 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  doc.text(
    cleanPdfText(`Prepared for ${profile.studentName} | Target Role: ${profile.targetCareer}`),
    margin,
    44
  );

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(
    cleanPdfText(`Generated on ${new Date(roadmap.generatedAt).toLocaleDateString()}`),
    margin,
    54
  );

  cursorY = 78;

  addSectionHeader('1. Student Profile & Career Target');

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: colors.navy, textColor: [255, 255, 255], fontSize: 9.5 },
    bodyStyles: { fontSize: 9, textColor: colors.slateDark },
    head: [['Profile Attribute', 'Details']],
    body: [
      ['Student Name', cleanPdfText(profile.studentName)],
      ['Education Level', cleanPdfText(profile.educationLevel)],
      ['Target Career Role', cleanPdfText(profile.targetCareer)],
      ['Experience Level', cleanPdfText(profile.experienceLevel)],
      ['Study Commitment', `${profile.weeklyHours} hours / week`],
      ['Preferred Learning Style', cleanPdfText(profile.learningStyle)],
      ['Preferred Language', cleanPdfText(profile.preferredLanguage)],
      [
        'Entered Technical Skills',
        cleanPdfText(profile.skills.map((s) => `${s.name} (${s.level})`).join(', ')),
      ],
      ['Career Goal', cleanPdfText(profile.careerGoal)],
    ],
    columnStyles: {
      0: { cellWidth: 52, fontStyle: 'bold' },
      1: { cellWidth: contentWidth - 52 },
    },
  });

  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 10;

  addSectionHeader('2. Career Readiness Summary');

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: 'plain',
    headStyles: { fillColor: colors.indigo, textColor: [255, 255, 255], fontSize: 10 },
    bodyStyles: { fillColor: colors.lightBg, fontSize: 10, fontStyle: 'bold', halign: 'center' },
    head: [['Overall Readiness', 'Skill Gap Remaining', 'Skills Entered', '8-Week Hours Total']],
    body: [
      [
        `${roadmap.skillGapAnalysis.overallReadinessPercentage}%`,
        `${roadmap.skillGapAnalysis.skillGapPercentage}%`,
        `${profile.skills.length}`,
        `${roadmap.eightWeekRoadmap.reduce((sum, w) => sum + w.estimatedStudyHours, 0)} hrs`,
      ],
    ],
  });

  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.slateDark);
  const overviewLines = doc.splitTextToSize(
    cleanPdfText(`${roadmap.careerOverview}\n\n${roadmap.skillGapAnalysis.summary}`),
    contentWidth
  );
  ensureSpace(overviewLines.length * 4.5 + 4);
  doc.text(overviewLines, margin, cursorY);

  // PAGE 2: SKILL GAP ANALYSIS
  doc.addPage();
  cursorY = margin;

  addSectionHeader(
    '3. AI Skill Gap Analysis',
    'Comparison of your entered skills against industry expectations for your target role.'
  );

  addWrappedBullets(
    'A. Skills You Already Have:',
    roadmap.skillGapAnalysis.skillsAlreadyHave.length > 0
      ? roadmap.skillGapAnalysis.skillsAlreadyHave
      : ['No target-role skills at full required proficiency yet.']
  );
  addWrappedBullets(
    'B. Skills to Improve:',
    roadmap.skillGapAnalysis.skillsToImprove.length > 0
      ? roadmap.skillGapAnalysis.skillsToImprove
      : ['None flagged for upgrade.']
  );
  addWrappedBullets('C. Skills to Learn:', roadmap.skillGapAnalysis.skillsToLearn);

  ensureSpace(20);
  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: { fillColor: colors.navy, textColor: [255, 255, 255], fontSize: 8.5 },
    bodyStyles: { fontSize: 8.2, textColor: colors.slateDark },
    head: [['Skill', 'Current Level', 'Required Level', 'Status', 'Priority', 'Category']],
    body: roadmap.skillGapAnalysis.skillTable.map((row) => [
      cleanPdfText(row.skill),
      cleanPdfText(row.currentLevel),
      cleanPdfText(row.requiredLevel),
      cleanPdfText(row.status),
      cleanPdfText(row.priority),
      cleanPdfText(row.category),
    ]),
  });

  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 8;
  addWrappedBullets(
    'Personalized Improvement Suggestions:',
    roadmap.skillGapAnalysis.personalizedSuggestions
  );

  // PAGE 3+: 8-WEEK LEARNING ROADMAP
  doc.addPage();
  cursorY = margin;

  addSectionHeader(
    '4. Personalized 8-Week Learning Roadmap',
    `Structured progression adapted to ${profile.weeklyHours} study hours/week and ${profile.learningStyle}.`
  );

  for (const week of roadmap.eightWeekRoadmap) {
    const isCompleted = progress.completedWeeks.includes(week.weekNumber);
    ensureSpace(26);

    doc.setFillColor(...colors.lightBg);
    doc.setDrawColor(...colors.border);
    doc.roundedRect(margin, cursorY, contentWidth, 10, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...colors.indigo);
    doc.text(
      cleanPdfText(
        `Week ${week.weekNumber}: ${week.title} (${week.estimatedStudyHours} hrs)${
          isCompleted ? ' [COMPLETED]' : ''
        }`
      ),
      margin + 3,
      cursorY + 6.5
    );
    cursorY += 14;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.8);
    doc.setTextColor(...colors.slateMuted);
    const skillLine = doc.splitTextToSize(
      cleanPdfText(`Skills to Develop: ${week.skillsToDevelop.join(', ')}`),
      contentWidth
    );
    doc.text(skillLine, margin, cursorY);
    cursorY += skillLine.length * 4.2 + 2;

    addWrappedBullets('Learning Objectives:', week.learningObjectives);
    addWrappedBullets('Detailed Topics:', week.detailedTopics);
    addWrappedBullets('Practical Exercises:', week.practicalExercises);
    addWrappedBullets('Weekly Assignments:', week.weeklyAssignments);
    addWrappedBullets('Expected Outcomes:', week.expectedOutcomes);

    cursorY += 3;
  }

  // PORTFOLIO PROJECTS
  doc.addPage();
  cursorY = margin;

  addSectionHeader(
    '5. Three Portfolio Mini-Projects',
    'Hands-on projects calibrated to your skill level and target career.'
  );

  roadmap.portfolioProjects.forEach((proj, idx) => {
    const done = progress.completedProjects.includes(proj.id);
    ensureSpace(28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...colors.navy);
    doc.text(
      cleanPdfText(
        `Project ${idx + 1}: ${proj.title} [${proj.difficultyLevel}]${done ? ' (Completed)' : ''}`
      ),
      margin,
      cursorY
    );
    cursorY += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...colors.slateDark);

    const blocks = [
      `Description: ${proj.description}`,
      `Problem Statement: ${proj.problemStatement}`,
      `Technologies: ${proj.technologiesRequired.join(', ')}`,
      `Skills Demonstrated: ${proj.skillsDemonstrated.join(', ')}`,
      `Expected Output: ${proj.expectedFinalOutput}`,
      `Portfolio Value: ${proj.portfolioValue}`,
    ];

    for (const block of blocks) {
      const lines = doc.splitTextToSize(cleanPdfText(block), contentWidth);
      ensureSpace(lines.length * 4.3 + 2);
      doc.text(lines, margin, cursorY);
      cursorY += lines.length * 4.3 + 1.5;
    }

    addWrappedBullets('Implementation Steps:', proj.implementationSteps);
    cursorY += 4;
  });

  // LEARNING RESOURCES & PROGRESS
  doc.addPage();
  cursorY = margin;

  addSectionHeader('6. Curated Learning Resources');

  const formatResourceRows = (category: string, items: LearningResourceItem[]) =>
    items.map((item) => [
      category,
      cleanPdfText(`${item.title} (${item.provider})`),
      cleanPdfText(item.relatedSkill),
      cleanPdfText(item.url || item.accessNote),
    ]);

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: colors.navy, textColor: [255, 255, 255], fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: colors.slateDark },
    head: [['Category', 'Resource', 'Skill', 'Link / Access Note']],
    body: [
      ...formatResourceRows('Official Docs', roadmap.learningResources.officialDocumentation),
      ...formatResourceRows('Free Courses', roadmap.learningResources.freeCourses),
      ...formatResourceRows('YouTube', roadmap.learningResources.youtubeResources),
      ...formatResourceRows('Practice', roadmap.learningResources.codingPracticePlatforms),
      ...formatResourceRows('Tutorials', roadmap.learningResources.projectTutorials),
    ],
  });

  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 10;

  addSectionHeader('7. Progress Summary & Career Preparation Recommendations');

  const totalWeeks = roadmap.eightWeekRoadmap.length;
  const completedWeeksCount = progress.completedWeeks.length;
  const totalProjects = roadmap.portfolioProjects.length;
  const completedProjectsCount = progress.completedProjects.length;
  const overallProgress = Math.round(
    ((completedWeeksCount + completedProjectsCount) / Math.max(totalWeeks + totalProjects, 1)) * 100
  );

  autoTable(doc, {
    startY: cursorY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: { fillColor: colors.cyan, textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: colors.slateDark },
    head: [['Metric', 'Status']],
    body: [
      ['Weeks Completed', `${completedWeeksCount} of ${totalWeeks}`],
      ['Portfolio Projects Completed', `${completedProjectsCount} of ${totalProjects}`],
      ['Topics Marked Completed', `${progress.completedTopics.length}`],
      ['Overall Roadmap Completion', `${overallProgress}%`],
    ],
  });

  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 8;
  addWrappedBullets('Career Preparation Recommendations:', roadmap.careerPreparationTips);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.slateMuted);
    doc.text(
      cleanPdfText(`AI Career Roadmap & Skill Gap Finder | ${profile.studentName}`),
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, {
      align: 'right',
    });
  }

  const safeSlug = profile.studentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'student';
  doc.save(`${safeSlug}-complete-career-roadmap.pdf`);
}
