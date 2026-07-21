import { useState, useMemo } from 'react';
import type { JobDescription, Resume, ScoredCandidate, ScoringWeights } from './types';
import { SAMPLE_JOB_DESCRIPTIONS, SAMPLE_RESUMES } from './services/sampleData';
import { scoreCandidate } from './services/nlpEngine';
import { Navbar } from './components/Navbar';
import { Sidebar, type ActiveTab } from './components/Sidebar';
import { CandidateList } from './components/CandidateList';
import { JobDescriptionEditor } from './components/JobDescriptionEditor';
import { ResumeUploader } from './components/ResumeUploader';
import { CandidateComparison } from './components/CandidateComparison';
import { SkillGapMatrix } from './components/SkillGapMatrix';
import { AnalyticsView } from './components/AnalyticsView';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { InterviewQuestionsModal } from './components/InterviewQuestionsModal';
import { WeightSettingsModal } from './components/WeightSettingsModal';
import confetti from 'canvas-confetti';

export function App() {
  const [jobs, setJobs] = useState<JobDescription[]>(SAMPLE_JOB_DESCRIPTIONS);
  const [activeJob, setActiveJob] = useState<JobDescription>(SAMPLE_JOB_DESCRIPTIONS[0]);
  const [resumes, setResumes] = useState<Resume[]>(SAMPLE_RESUMES);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [comparedCandidateIds, setComparedCandidateIds] = useState<string[]>([]);

  // Modals state
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<ScoredCandidate | null>(null);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState<ScoredCandidate | null>(null);
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);

  // Compute real-time Candidate Scores for active job
  const scoredCandidates: ScoredCandidate[] = useMemo(() => {
    return resumes.map(resume => {
      const score = scoreCandidate(activeJob, resume);
      return { resume, score };
    }).sort((a, b) => b.score.overallScore - a.score.overallScore);
  }, [activeJob, resumes]);

  // Selected compared candidates list
  const comparedCandidates = useMemo(() => {
    return scoredCandidates.filter(c => comparedCandidateIds.includes(c.resume.id));
  }, [scoredCandidates, comparedCandidateIds]);

  // Top score calculation
  const topScore = scoredCandidates.length > 0 ? scoredCandidates[0].score.overallScore : 0;

  // Handlers
  const handleSelectJob = (job: JobDescription) => {
    setActiveJob(job);
  };

  const handleSaveJob = (updatedJob: JobDescription) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    setActiveJob(updatedJob);
  };

  const handleAddNewJob = () => {
    const newJob: JobDescription = {
      id: `jd_${Date.now()}`,
      title: 'New Position Role',
      department: 'Engineering',
      company: 'NexusTech',
      roleCategory: 'Software Engineering',
      minExperienceYears: 3,
      minEducation: "Bachelor's Degree",
      requiredSkills: ['JavaScript', 'React', 'Git', 'SQL'],
      preferredSkills: ['TypeScript', 'Docker', 'AWS'],
      rawText: `Job Title: New Position Role\nCompany: NexusTech\n\nRequirements:\n- 3+ years experience\n- Skills: JavaScript, React, SQL, Git`,
      weights: { skillMatch: 40, tfidf: 25, experience: 20, education: 15 },
      createdAt: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);
    setActiveJob(newJob);
    setActiveTab('workbench');
  };

  const handleResumesParsed = (newResumes: Resume[]) => {
    setResumes(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const fresh = newResumes.filter(r => !existingIds.has(r.id));
      return [...fresh, ...prev];
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setActiveTab('dashboard');
  };

  const handleSaveWeights = (newWeights: ScoringWeights) => {
    const updatedJob = {
      ...activeJob,
      weights: newWeights
    };
    handleSaveJob(updatedJob);
  };

  const handleToggleCompare = (candidate: ScoredCandidate) => {
    setComparedCandidateIds(prev => {
      if (prev.includes(candidate.resume.id)) {
        return prev.filter(id => id !== candidate.resume.id);
      } else {
        if (prev.length >= 4) return prev;
        return [...prev, candidate.resume.id];
      }
    });
  };

  const handleExportCSV = () => {
    if (scoredCandidates.length === 0) return;

    const headers = [
      'Candidate Name',
      'Fit Score (%)',
      'Grade',
      'Skill Score',
      'TFIDF Score',
      'Exp Score',
      'Edu Score',
      'Experience (Yrs)',
      'Education',
      'Matched Skills',
      'Missing Skills',
      'Email'
    ];

    const rows = scoredCandidates.map(c => [
      `"${c.resume.candidateName}"`,
      c.score.overallScore,
      c.score.grade,
      c.score.skillScore,
      c.score.tfidfScore,
      c.score.experienceScore,
      c.score.educationScore,
      c.resume.experienceYears,
      `"${c.resume.education}"`,
      `"${c.score.matchedRequiredSkills.join('; ')}"`,
      `"${c.score.missingRequiredSkills.join('; ')}"`,
      `"${c.resume.email || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Candidate_Screening_${activeJob.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        jobs={jobs}
        activeJob={activeJob}
        onSelectJob={handleSelectJob}
        onOpenNewJobModal={handleAddNewJob}
        onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
        onExportCSV={handleExportCSV}
        candidateCount={scoredCandidates.length}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          candidateCount={scoredCandidates.length}
          topScore={topScore}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <CandidateList
              candidates={scoredCandidates}
              onSelectCandidate={(c) => setSelectedCandidateForDetail(c)}
              onOpenInterviewQs={(c) => setSelectedCandidateForInterview(c)}
              comparedCandidates={comparedCandidates}
              onToggleCompare={handleToggleCompare}
              onOpenComparisonTab={() => setActiveTab('comparison')}
              onLoadSamples={() => handleResumesParsed(SAMPLE_RESUMES)}
            />
          )}

          {activeTab === 'workbench' && (
            <JobDescriptionEditor
              activeJob={activeJob}
              onSaveJob={handleSaveJob}
              onDeleteJob={(id) => {
                if (jobs.length > 1) {
                  const remaining = jobs.filter(j => j.id !== id);
                  setJobs(remaining);
                  setActiveJob(remaining[0]);
                }
              }}
            />
          )}

          {activeTab === 'ingestion' && (
            <ResumeUploader
              onResumesParsed={handleResumesParsed}
              existingCount={resumes.length}
            />
          )}

          {activeTab === 'comparison' && (
            <CandidateComparison
              candidates={comparedCandidates}
              job={activeJob}
              onRemoveFromCompare={(id) => setComparedCandidateIds(prev => prev.filter(item => item !== id))}
              onSelectCandidate={(c) => setSelectedCandidateForDetail(c)}
            />
          )}

          {activeTab === 'matrix' && (
            <SkillGapMatrix
              candidates={scoredCandidates}
              job={activeJob}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              candidates={scoredCandidates}
              job={activeJob}
            />
          )}
        </main>
      </div>

      {/* Candidate Deep Detail Modal */}
      {selectedCandidateForDetail && (
        <CandidateDetailModal
          candidate={selectedCandidateForDetail}
          job={activeJob}
          onClose={() => setSelectedCandidateForDetail(null)}
          onOpenInterviewQs={(c) => {
            setSelectedCandidateForDetail(null);
            setSelectedCandidateForInterview(c);
          }}
        />
      )}

      {/* Tailored Interview Questions Modal */}
      {selectedCandidateForInterview && (
        <InterviewQuestionsModal
          candidate={selectedCandidateForInterview}
          job={activeJob}
          onClose={() => setSelectedCandidateForInterview(null)}
        />
      )}

      {/* Scoring Weight Settings Modal */}
      {isWeightsModalOpen && (
        <WeightSettingsModal
          weights={activeJob.weights}
          onSaveWeights={handleSaveWeights}
          onClose={() => setIsWeightsModalOpen(false)}
        />
      )}

    </div>
  );
}

export default App;
