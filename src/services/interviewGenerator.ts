import type { CandidateScore, InterviewQuestion, CandidateAssessment, JobDescription, Resume } from '../types';

export function generateCandidateAssessment(
  job: JobDescription,
  resume: Resume,
  score: CandidateScore
): CandidateAssessment {
  const questions: InterviewQuestion[] = [];

  // 1. Skill Gap Verification Questions
  score.missingRequiredSkills.forEach((skill, idx) => {
    questions.push({
      id: `q_missing_${idx}`,
      category: 'Skill Gap Verification',
      targetSkill: skill,
      question: `Our core architecture relies heavily on ${skill}. Could you share any experience or projects where you used ${skill} or comparable alternatives?`,
      context: `Missing required skill flagged by NLP screening (${skill}).`,
      suggestedAnswerCriteria: `Evaluate whether candidate has practical exposure to ${skill} or fast learning capability in similar tooling.`
    });
  });

  // 2. Technical Probe Questions
  score.matchedRequiredSkills.slice(0, 3).forEach((skill, idx) => {
    questions.push({
      id: `q_tech_${idx}`,
      category: 'Technical',
      targetSkill: skill,
      question: `In your recent work with ${skill}, what was the most complex architectural trade-off or performance bottleneck you encountered, and how did you resolve it?`,
      context: `Candidate listed ${skill} as a core strength.`,
      suggestedAnswerCriteria: `Look for concrete production experience, performance profiling metrics, and problem-solving depth.`
    });
  });

  // 3. Experience & Seniority Probe
  if (resume.experienceYears < job.minExperienceYears) {
    questions.push({
      id: 'q_exp_gap',
      category: 'Experience Probe',
      question: `This role typically targets candidates with ${job.minExperienceYears}+ years of experience. Can you highlight an instance where you stepped up to lead a complex feature end-to-end?`,
      context: `Candidate has ${resume.experienceYears} years experience vs ${job.minExperienceYears} required.`,
      suggestedAnswerCriteria: `Assess autonomy, speed of execution, and ownership under pressure.`
    });
  } else {
    questions.push({
      id: 'q_seniority',
      category: 'Behavioral',
      question: `With your ${resume.experienceYears} years of background, how do you approach mentoring junior team members and driving architectural standards across an engineering team?`,
      context: `Candidate meets or exceeds experience requirements.`,
      suggestedAnswerCriteria: `Look for collaboration skills, code review standards, and team impact.`
    });
  }

  // Recommendation logic
  let overallRecommendation: 'Strong Hire' | 'Interview' | 'Possible Alternative' | 'Not Recommended' = 'Interview';
  let recommendationReason = '';

  if (score.overallScore >= 88) {
    overallRecommendation = 'Strong Hire';
    recommendationReason = `${resume.candidateName} exceeds requirements with ${score.matchedRequiredSkills.length} matched skills and strong experience fit. Recommend prioritizing for immediate technical loop.`;
  } else if (score.overallScore >= 75) {
    overallRecommendation = 'Interview';
    recommendationReason = `${resume.candidateName} meets key requirements. Recommended for screening call to probe ${score.missingRequiredSkills.length > 0 ? `missing skills (${score.missingRequiredSkills.join(', ')})` : 'system design skills'}.`;
  } else if (score.overallScore >= 60) {
    overallRecommendation = 'Possible Alternative';
    recommendationReason = `Partial match for current open role. Consider for adjacent roles or initial preliminary technical assessment.`;
  } else {
    overallRecommendation = 'Not Recommended';
    recommendationReason = `Significant skill and experience gaps relative to job description requirements.`;
  }

  return {
    candidateId: resume.id,
    candidateName: resume.candidateName,
    questions,
    overallRecommendation,
    recommendationReason
  };
}
