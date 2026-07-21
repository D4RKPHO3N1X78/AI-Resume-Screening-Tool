import type { Resume } from '../types';
import { extractSkillsFromText } from './nlpEngine';

const ACTION_VERBS = [
  'architected', 'built', 'created', 'designed', 'developed', 'engineered', 'established',
  'implemented', 'launched', 'led', 'managed', 'optimized', 'orchestrated', 'overhauled',
  'pioneered', 'refactored', 'scaled', 'spearheaded', 'streamlined', 'transformed'
];

function parseCandidateName(text: string, defaultFileName: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (
      firstLine.length < 40 &&
      !firstLine.includes('@') &&
      !firstLine.includes('http') &&
      !/\d/.test(firstLine) &&
      firstLine.split(' ').length <= 4
    ) {
      return firstLine;
    }
  }

  const cleanName = defaultFileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/resume/i, '')
    .trim();

  return cleanName || 'Candidate';
}

function parseEmail(text: string): string | undefined {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : undefined;
}

function parsePhone(text: string): string | undefined {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : undefined;
}

function parseSocialLinks(text: string) {
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);

  return {
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    github: githubMatch ? githubMatch[0] : undefined
  };
}

function parseYearsOfExperience(text: string): number {
  const lower = text.toLowerCase();
  
  const explicitMatch = lower.match(/(\d{1,2})\+?\s*(?:years|yrs)\s*(?:of)?\s*experience/);
  if (explicitMatch) {
    return parseInt(explicitMatch[1], 10);
  }

  const currentYear = new Date().getFullYear();
  const yearRanges = text.matchAll(/(20\d{2}|19\d{2})\s*[-–—to]+\s*(20\d{2}|19\d{2}|present|current|now)/gi);

  let totalYears = 0;
  for (const match of yearRanges) {
    const startYear = parseInt(match[1], 10);
    const endStr = match[2].toLowerCase();
    const endYear = (endStr.includes('present') || endStr.includes('current') || endStr.includes('now')) 
      ? currentYear 
      : parseInt(endStr, 10);

    if (endYear >= startYear && startYear > 1980) {
      totalYears += (endYear - startYear);
    }
  }

  if (totalYears > 0) {
    return Math.min(25, Math.max(1, totalYears));
  }

  const jobHeaderMatches = (text.match(/experience|work history|employment/gi) || []).length;
  return jobHeaderMatches > 0 ? 3 : 2;
}

function parseEducation(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes('phd') || lower.includes('ph.d') || lower.includes('doctor of philosophy')) {
    return 'Ph.D. in Computer Science / Engineering';
  }
  if (lower.includes('master') || lower.includes('m.s.') || lower.includes('ms in') || lower.includes('m.tech')) {
    return "Master's Degree in CS / STEM";
  }
  if (lower.includes('bachelor') || lower.includes('b.s.') || lower.includes('bs in') || lower.includes('b.tech')) {
    return "Bachelor's Degree in CS / STEM";
  }
  if (lower.includes('associate')) {
    return "Associate Degree";
  }
  if (lower.includes('bootcamp') || lower.includes('certified')) {
    return "Software Engineering Bootcamp / Certification";
  }

  return "Bachelor's Degree (Equivalent)";
}

function computeActionWordScore(text: string): number {
  const lower = text.toLowerCase();
  let count = 0;

  for (const verb of ACTION_VERBS) {
    if (lower.includes(verb)) {
      count++;
    }
  }

  return Math.min(100, Math.round((count / 6) * 100));
}

export function parseRawResumeText(
  rawText: string,
  fileName: string = 'Resume.pdf',
  source: 'uploaded' | 'sample' | 'pasted' = 'uploaded'
): Resume {
  const candidateName = parseCandidateName(rawText, fileName);
  const email = parseEmail(rawText);
  const phone = parsePhone(rawText);
  const { linkedin, github } = parseSocialLinks(rawText);
  const experienceYears = parseYearsOfExperience(rawText);
  const education = parseEducation(rawText);
  const extractedSkills = extractSkillsFromText(rawText);
  const actionWordScore = computeActionWordScore(rawText);

  return {
    id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    fileName,
    candidateName,
    email,
    phone,
    linkedin,
    github,
    rawText,
    extractedSkills,
    experienceYears,
    education,
    actionWordScore,
    parsedAt: new Date().toISOString(),
    source
  };
}
