import React, { useState } from 'react';
import type { ScoredCandidate, JobDescription, CandidateAssessment } from '../types';
import { generateCandidateAssessment } from '../services/interviewGenerator';
import { X, HelpCircle, Copy, Check } from 'lucide-react';

interface InterviewQuestionsModalProps {
  candidate: ScoredCandidate | null;
  job: JobDescription;
  onClose: () => void;
}

export const InterviewQuestionsModal: React.FC<InterviewQuestionsModalProps> = ({
  candidate,
  job,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!candidate) return null;

  const assessment: CandidateAssessment = generateCandidateAssessment(
    job,
    candidate.resume,
    candidate.score
  );

  const handleCopyQuestions = () => {
    const formatted = `INTERVIEW QUESTIONNAIRE FOR ${candidate.resume.candidateName.toUpperCase()}
Target Role: ${job.title} (${job.company})
Fit Score: ${candidate.score.overallScore}% (Grade ${candidate.score.grade})
Recommendation: ${assessment.overallRecommendation}

RECOMMENDATION SUMMARY:
${assessment.recommendationReason}

INTERVIEW QUESTIONS:
${assessment.questions.map((q, idx) => `
${idx + 1}. [${q.category.toUpperCase()}] ${q.question}
   - Context: ${q.context}
   - Target Criteria: ${q.suggestedAnswerCriteria}
`).join('\n')}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-3xl max-h-[85vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div>
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              Tailored Technical & Behavioral Interview Guide
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Generated for candidate <strong className="text-white">{candidate.resume.candidateName}</strong> ({job.title})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyQuestions}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Guide'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Recommendation Banner */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">Hiring Recommendation:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {assessment.overallRecommendation}
              </span>
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "{assessment.recommendationReason}"
            </p>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Generated Question Set ({assessment.questions.length})
            </h3>

            {assessment.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                    q.category === 'Skill Gap Verification' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    q.category === 'Technical' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    Q{idx + 1}: {q.category}
                  </span>
                  {q.targetSkill && (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Target: {q.targetSkill}
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-white leading-snug">
                  {q.question}
                </p>

                <div className="pt-1 space-y-1 text-xs">
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Context:</strong> {q.context}
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-emerald-400">Evaluation Criteria:</strong> {q.suggestedAnswerCriteria}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
