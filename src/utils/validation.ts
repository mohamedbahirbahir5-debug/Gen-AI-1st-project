import type { StudentProfile } from '../types/career';

export interface ProfileValidationErrors {
  studentName?: string;
  educationLevel?: string;
  skills?: string;
  targetCareer?: string;
  experienceLevel?: string;
  weeklyHours?: string;
  learningStyle?: string;
  preferredLanguage?: string;
  careerGoal?: string;
}

export function validateStudentProfile(profile: StudentProfile): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  if (!profile.studentName.trim()) {
    errors.studentName = 'Please enter your name.';
  } else if (profile.studentName.trim().length < 2) {
    errors.studentName = 'Name must be at least 2 characters.';
  }

  if (!profile.educationLevel.trim()) {
    errors.educationLevel = 'Please select or enter your education level.';
  }

  if (profile.skills.length === 0) {
    errors.skills = 'Add at least one current technical skill (even beginner level).';
  }

  if (!profile.targetCareer.trim()) {
    errors.targetCareer = 'Please choose a target career role.';
  }

  if (!profile.experienceLevel) {
    errors.experienceLevel = 'Select your current experience level.';
  }

  if (!Number.isFinite(profile.weeklyHours) || profile.weeklyHours < 1 || profile.weeklyHours > 80) {
    errors.weeklyHours = 'Weekly study hours must be between 1 and 80.';
  }

  if (!profile.learningStyle) {
    errors.learningStyle = 'Select your preferred learning style.';
  }

  if (!profile.preferredLanguage.trim()) {
    errors.preferredLanguage = 'Enter your preferred programming language (or "None yet").';
  }

  if (!profile.careerGoal.trim()) {
    errors.careerGoal = 'Describe your career goal.';
  } else if (profile.careerGoal.trim().length < 8) {
    errors.careerGoal = 'Please write at least 8 characters about your career goal.';
  }

  return errors;
}

export function hasValidationErrors(errors: ProfileValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
