import type { JobDescription, Resume, CandidateScore, Grade, ScoringWeights } from '../types';

const ENGLISH_STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
  'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'experience', 'work', 'working', 'developed',
  'responsible', 'using', 'used', 'years', 'built', 'created', 'managed', 'led', 'team'
]);

export const SKILL_TAXONOMY: Record<string, string[]> = {
  'JavaScript': ['javascript', 'js', 'es6', 'ecmascript', 'es2020', 'node.js', 'nodejs'],
  'TypeScript': ['typescript', 'ts'],
  'Python': ['python', 'py', 'python3', 'python2'],
  'Java': ['java', 'j2ee', 'spring', 'springboot', 'spring boot'],
  'C++': ['c++', 'cpp'],
  'C#': ['c#', 'csharp', '.net', 'dotnet', 'asp.net'],
  'Go': ['golang', 'go language', 'go'],
  'Rust': ['rust'],
  'Ruby': ['ruby', 'rails', 'ruby on rails'],
  'PHP': ['php', 'laravel', 'symfony'],
  'SQL': ['sql', 't-sql', 'pl/sql', 'database'],
  'HTML/CSS': ['html', 'html5', 'css', 'css3', 'sass', 'scss', 'less'],
  'React': ['react', 'reactjs', 'react.js', 'react native', 'hooks', 'redux', 'next.js', 'nextjs'],
  'Vue.js': ['vue', 'vuejs', 'vue.js', 'nuxt', 'nuxtjs'],
  'Angular': ['angular', 'angularjs', 'angular 2+', 'ng'],
  'Node.js': ['node', 'nodejs', 'node.js', 'express', 'express.js', 'nest', 'nestjs'],
  'Django': ['django', 'django REST framework', 'drf'],
  'FastAPI': ['fastapi', 'fast api'],
  'Flask': ['flask'],
  'Tailwind CSS': ['tailwind', 'tailwindcss'],
  'Bootstrap': ['bootstrap'],
  'GraphQL': ['graphql', 'apollo', 'hasura'],
  'REST API': ['rest', 'restful', 'rest api', 'web services', 'apis', 'api design'],
  'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloudfront', 'ecs', 'eks', 'dynamodb'],
  'Google Cloud': ['gcp', 'google cloud', 'google cloud platform', 'bigquery'],
  'Azure': ['azure', 'microsoft azure'],
  'Docker': ['docker', 'container', 'containers', 'dockerfile'],
  'Kubernetes': ['kubernetes', 'k8s', 'kubectl'],
  'Terraform': ['terraform', 'infrastructure as code', 'iac'],
  'CI/CD': ['ci/cd', 'cicd', 'jenkins', 'github actions', 'gitlab ci', 'circleci'],
  'Linux': ['linux', 'unix', 'bash', 'shell', 'ubuntu', 'centos'],
  'PostgreSQL': ['postgres', 'postgresql', 'psql'],
  'MySQL': ['mysql', 'mariadb'],
  'MongoDB': ['mongo', 'mongodb', 'mongoose'],
  'Redis': ['redis'],
  'Elasticsearch': ['elasticsearch', 'elk', 'kibana'],
  'Pinecone': ['pinecone', 'vector store', 'chromadb', 'weaviate'],
  'Machine Learning': ['machine learning', 'ml', 'deep learning', 'dl', 'neural networks'],
  'PyTorch': ['pytorch', 'torch'],
  'TensorFlow': ['tensorflow', 'tf', 'keras'],
  'Scikit-Learn': ['scikit-learn', 'sklearn'],
  'Pandas': ['pandas', 'numpy'],
  'NLP': ['nlp', 'natural language processing', 'spacy', 'nltk', 'transformers', 'bert', 'huggingface', 'llm', 'llms', 'langchain', 'openai', 'embeddings', 'rag'],
  'Computer Vision': ['computer vision', 'cv', 'opencv', 'yolo'],
  'Agile / Scrum': ['agile', 'scrum', 'kanban', 'jira', 'sprint'],
  'System Architecture': ['system design', 'system architecture', 'microservices', 'distributed systems', 'scalability'],
  'Leadership': ['leadership', 'team lead', 'mentorship', 'cross-functional', 'stakeholder management'],
  'Problem Solving': ['problem solving', 'analytical', 'critical thinking'],
  'Git': ['git', 'github', 'gitlab', 'bitbucket', 'version control']
};

export function tokenizeText(text: string): string[] {
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = clean.split(' ').filter(w => w.length > 1 && !ENGLISH_STOPWORDS.has(w));
  return words;
}

function computeTF(tokens: string[]): Record<string, number> {
  const tf: Record<string, number> = {};
  const total = tokens.length || 1;

  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }

  for (const token in tf) {
    tf[token] = tf[token] / total;
  }

  return tf;
}

export function computeCosineSimilarity(textA: string, textB: string): number {
  const tokensA = tokenizeText(textA);
  const tokensB = tokenizeText(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const tfA = computeTF(tokensA);
  const tfB = computeTF(tokensB);

  const vocab = new Set([...Object.keys(tfA), ...Object.keys(tfB)]);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const word of vocab) {
    const valA = tfA[word] || 0;
    const valB = tfB[word] || 0;

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.min(100, Math.round(similarity * 350));
}

export function extractSkillsFromText(text: string): string[] {
  const lowerText = text.toLowerCase();
  const extracted: string[] = [];

  for (const [canonicalSkill, aliases] of Object.entries(SKILL_TAXONOMY)) {
    for (const alias of aliases) {
      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\W)${escapedAlias}(?:$|\\W)`, 'i');
      if (regex.test(lowerText)) {
        if (!extracted.includes(canonicalSkill)) {
          extracted.push(canonicalSkill);
        }
        break;
      }
    }
  }

  return extracted;
}

export function evaluateSkillCoverage(
  candidateSkills: string[],
  jdRequired: string[],
  jdPreferred: string[],
  resumeText: string
) {
  const candidateLower = candidateSkills.map(s => s.toLowerCase());
  const resumeLowerText = resumeText.toLowerCase();

  const isSkillPresent = (skillName: string) => {
    const canonical = Object.keys(SKILL_TAXONOMY).find(
      k => k.toLowerCase() === skillName.toLowerCase()
    );
    const aliases = canonical ? SKILL_TAXONOMY[canonical] : [skillName.toLowerCase()];
    
    if (candidateLower.includes(skillName.toLowerCase())) return true;
    
    for (const alias of aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, 'i');
      if (regex.test(resumeLowerText)) return true;
    }
    return false;
  };

  const matchedRequired = jdRequired.filter(s => isSkillPresent(s));
  const missingRequired = jdRequired.filter(s => !isSkillPresent(s));
  const matchedPreferred = jdPreferred.filter(s => isSkillPresent(s));

  const allJDSkills = new Set([...jdRequired, ...jdPreferred].map(s => s.toLowerCase()));
  const bonusSkills = candidateSkills.filter(s => !allJDSkills.has(s.toLowerCase()));

  const totalReqCount = jdRequired.length || 1;
  const totalPrefCount = jdPreferred.length || 1;

  const reqRatio = matchedRequired.length / totalReqCount;
  const prefRatio = matchedPreferred.length / totalPrefCount;

  const skillScore = Math.min(100, Math.round((reqRatio * 85) + (prefRatio * 15)));

  return {
    skillScore,
    matchedRequired,
    missingRequired,
    matchedPreferred,
    bonusSkills
  };
}

export function evaluateExperienceMatch(candidateExp: number, reqExp: number): number {
  if (reqExp === 0) return 95;
  if (candidateExp >= reqExp) {
    const extraYears = candidateExp - reqExp;
    return Math.min(100, 90 + Math.min(10, extraYears * 2));
  } else {
    const gap = reqExp - candidateExp;
    const score = Math.max(20, 90 - (gap * 18));
    return Math.round(score);
  }
}

export function evaluateEducationMatch(candidateEdu: string, reqEdu: string): number {
  const eduHierarchy: Record<string, number> = {
    'phd': 100,
    'master': 90,
    'bachelor': 80,
    'associate': 60,
    'high school': 40,
    'unknown': 50
  };

  const getEduTier = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('phd') || t.includes('doctor')) return 'phd';
    if (t.includes('master') || t.includes('ms') || t.includes('m.s') || t.includes('mba')) return 'master';
    if (t.includes('bachelor') || t.includes('bs') || t.includes('b.s') || t.includes('ba')) return 'bachelor';
    if (t.includes('associate')) return 'associate';
    return 'unknown';
  };

  const candTier = getEduTier(candidateEdu);
  const reqTier = getEduTier(reqEdu);

  const candScore = eduHierarchy[candTier] || 60;
  const reqScore = eduHierarchy[reqTier] || 60;

  if (candScore >= reqScore) {
    return Math.min(100, candScore + 10);
  } else {
    return Math.max(40, candScore - 15);
  }
}

export function scoreCandidate(
  job: JobDescription,
  resume: Resume
): CandidateScore {
  const weights: ScoringWeights = job.weights || {
    skillMatch: 40,
    tfidf: 25,
    experience: 20,
    education: 15
  };

  const skillEval = evaluateSkillCoverage(
    resume.extractedSkills,
    job.requiredSkills,
    job.preferredSkills,
    resume.rawText
  );

  const tfidfScore = computeCosineSimilarity(job.rawText, resume.rawText);

  const experienceScore = evaluateExperienceMatch(
    resume.experienceYears,
    job.minExperienceYears
  );

  const educationScore = evaluateEducationMatch(
    resume.education,
    job.minEducation
  );

  const rawWeighted = 
    (skillEval.skillScore * (weights.skillMatch / 100)) +
    (tfidfScore * (weights.tfidf / 100)) +
    (experienceScore * (weights.experience / 100)) +
    (educationScore * (weights.education / 100));

  const overallScore = Math.min(100, Math.max(10, Math.round(rawWeighted)));

  let grade: Grade = 'F';
  if (overallScore >= 88) grade = 'S';
  else if (overallScore >= 78) grade = 'A';
  else if (overallScore >= 68) grade = 'B';
  else if (overallScore >= 55) grade = 'C';

  const strengths: string[] = [];
  const riskFlags: string[] = [];

  if (skillEval.matchedRequired.length === job.requiredSkills.length && job.requiredSkills.length > 0) {
    strengths.push('100% match on all required technical skills');
  } else if (skillEval.matchedRequired.length > 0) {
    strengths.push(`Matches ${skillEval.matchedRequired.length} of ${job.requiredSkills.length} required skills`);
  }

  if (skillEval.matchedPreferred.length > 0) {
    strengths.push(`Has preferred stack: ${skillEval.matchedPreferred.slice(0, 3).join(', ')}`);
  }

  if (resume.experienceYears >= job.minExperienceYears) {
    strengths.push(`${resume.experienceYears} yrs experience exceeds required ${job.minExperienceYears} yrs`);
  } else {
    riskFlags.push(`Experience gap: ${resume.experienceYears} yrs vs ${job.minExperienceYears} yrs required`);
  }

  if (skillEval.missingRequired.length > 0) {
    riskFlags.push(`Missing key skills: ${skillEval.missingRequired.join(', ')}`);
  }

  if (tfidfScore >= 75) {
    strengths.push('High semantic alignment with job description context');
  } else if (tfidfScore < 45) {
    riskFlags.push('Low overall vocabulary overlap with job domain');
  }

  const aiSummary = generateExecutiveSummary(
    resume.candidateName,
    grade,
    overallScore,
    skillEval.matchedRequired,
    skillEval.missingRequired,
    resume.experienceYears,
    job.minExperienceYears
  );

  return {
    candidateId: resume.id,
    overallScore,
    grade,
    skillScore: skillEval.skillScore,
    tfidfScore,
    experienceScore,
    educationScore,
    matchedRequiredSkills: skillEval.matchedRequired,
    missingRequiredSkills: skillEval.missingRequired,
    matchedPreferredSkills: skillEval.matchedPreferred,
    bonusSkills: skillEval.bonusSkills,
    strengths,
    riskFlags,
    aiSummary
  };
}

function generateExecutiveSummary(
  name: string,
  grade: Grade,
  score: number,
  matchedReq: string[],
  missingReq: string[],
  candExp: number,
  reqExp: number
): string {
  if (grade === 'S' || grade === 'A') {
    return `${name} is a top tier candidate (Score: ${score}%, Grade ${grade}). They show strong technical alignment with key expertise in ${matchedReq.slice(0, 4).join(', ')} and ${candExp} years of relevant experience. Highly recommended for interview screening.`;
  } else if (grade === 'B') {
    return `${name} is a competitive candidate (Score: ${score}%, Grade B) with solid core qualifications in ${matchedReq.join(', ')}. ${missingReq.length > 0 ? `Needs verification on unlisted skills: ${missingReq.join(', ')}.` : ''} Recommended for preliminary technical assessment.`;
  } else if (grade === 'C') {
    return `${name} demonstrates partial suitability (Score: ${score}%, Grade C). While possessing background experience, key required skills like ${missingReq.join(', ') || 'specific stack requirements'} are not prominently indicated.`;
  } else {
    return `${name} shows lower overall alignment (Score: ${score}%, Grade F) for this role due to skill gaps and experience mismatch (${candExp} yrs vs ${reqExp} yrs required).`;
  }
}
