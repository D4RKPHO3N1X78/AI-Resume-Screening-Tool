export type Grade = 'S' | 'A' | 'B' | 'C' | 'F';

export interface ScoringWeights {
  skillMatch: number;      // e.g. 40%
  tfidf: number;           // e.g. 25%
  experience: number;      // e.g. 20%
  education: number;       // e.g. 15%
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  company: string;
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperienceYears: number;
  minEducation: string; // e.g. "Bachelor's Degree", "Master's Degree", "PhD"
  roleCategory: string; // e.g. "Full Stack", "AI/ML", "Data Science", "Product", "Mobile"
  weights: ScoringWeights;
  createdAt: string;
}

export interface ResumeWorkExperience {
  role: string;
  company: string;
  duration?: string;
  highlights: string[];
}

export interface Resume {
  id: string;
  fileName: string;
  candidateName: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  rawText: string;
  extractedSkills: string[];
  experienceYears: number;
  education: string;
  workHistory?: ResumeWorkExperience[];
  actionWordScore: number;
  parsedAt: string;
  source: 'uploaded' | 'sample' | 'pasted';
}

export interface SkillMatch {
  skillName: string;
  category: 'technical' | 'tool' | 'soft' | 'cloud' | 'database';
  isRequired: boolean;
  isMatched: boolean;
  contextSnippet?: string;
}

export interface CandidateScore {
  candidateId: string;
  overallScore: number; // 0 to 100
  grade: Grade;
  skillScore: number;       // 0 to 100
  tfidfScore: number;       // 0 to 100
  experienceScore: number;  // 0 to 100
  educationScore: number;   // 0 to 100
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  bonusSkills: string[];
  strengths: string[];
  riskFlags: string[];
  aiSummary: string;
}

export interface ScoredCandidate {
  resume: Resume;
  score: CandidateScore;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'Skill Gap Verification' | 'Experience Probe' | 'Behavioral';
  question: string;
  context: string;
  targetSkill?: string;
  suggestedAnswerCriteria: string;
}

export interface CandidateAssessment {
  candidateId: string;
  candidateName: string;
  questions: InterviewQuestion[];
  overallRecommendation: 'Strong Hire' | 'Interview' | 'Possible Alternative' | 'Not Recommended';
  recommendationReason: string;
}

export interface FilterOptions {
  searchQuery: string;
  minScore: number;
  gradeFilter: Grade | 'ALL';
  selectedSkill: string;
  minExperienceYears: number;
}
