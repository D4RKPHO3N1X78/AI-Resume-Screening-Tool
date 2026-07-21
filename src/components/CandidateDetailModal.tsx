import React, { useState } from 'react';
import type { ScoredCandidate, JobDescription } from '../types';
import { X, Award, Briefcase, GraduationCap, Mail, Phone, CheckCircle2, XCircle, Sparkles, HelpCircle, FileText } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CandidateDetailModalProps {
  candidate: ScoredCandidate | null;
  job: JobDescription;
  onClose: () => void;
  onOpenInterviewQs: (candidate: ScoredCandidate) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  job,
  onClose,
  onOpenInterviewQs
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'resume'>('overview');

  if (!candidate) return null;

  const { resume, score } = candidate;

  // Radar chart dataset
  const radarData = [
    { subject: 'Skill Match', A: score.skillScore, fullMark: 100 },
    { subject: 'TF-IDF Similarity', A: score.tfidfScore, fullMark: 100 },
    { subject: 'Experience Fit', A: score.experienceScore, fullMark: 100 },
    { subject: 'Education Fit', A: score.educationScore, fullMark: 100 },
    { subject: 'Overall Fit', A: score.overallScore, fullMark: 100 },
  ];

  // Resume text highlighter for skills
  const renderHighlightedResumeText = () => {
    const skillsToHighlight = [
      ...score.matchedRequiredSkills,
      ...score.matchedPreferredSkills,
      ...score.bonusSkills
    ];

    if (skillsToHighlight.length === 0) return resume.rawText;

    const pattern = new RegExp(`(${skillsToHighlight.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = resume.rawText.split(pattern);

    return parts.map((part, i) => {
      const match = skillsToHighlight.find(s => s.toLowerCase() === part.toLowerCase());
      if (match) {
        const isReq = score.matchedRequiredSkills.some(s => s.toLowerCase() === match.toLowerCase());
        return (
          <mark
            key={i}
            className={`px-1 rounded font-bold ${
              isReq
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                : 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
            }`}
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white font-sans">{resume.candidateName}</h2>
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Grade {score.grade} ({score.overallScore}% Fit)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
              {resume.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {resume.email}
                </span>
              )}
              {resume.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  {resume.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                {resume.experienceYears} Years Exp
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                {resume.education}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInterviewQs(candidate)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-200" />
              <span>Generate Interview Qs</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/5 px-6 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Executive Overview & Radar
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'skills'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Skill Coverage & Gap Analysis
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'resume'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Resume & Keyword Highlights
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Strengths & AI Summary */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    AI Screening Executive Summary
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{score.aiSummary}"
                  </p>
                </div>

                {/* Strengths */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Key Alignment Factors ({score.strengths.length})
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {score.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Flags */}
                {score.riskFlags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
                      Flagged Gaps / Unverified Areas ({score.riskFlags.length})
                    </h4>
                    <ul className="space-y-1.5 text-xs text-rose-200">
                      {score.riskFlags.map((flag, idx) => (
                        <li key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-rose-950/30 border border-rose-500/20">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Recharts Radar Chart */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Candidate Fit Radar Breakdown
                </h4>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" />
                      <Radar name={resume.candidateName} dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Matched Required Skills */}
                <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Matched Required Skills ({score.matchedRequiredSkills.length} / {job.requiredSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {score.matchedRequiredSkills.map(s => (
                      <span key={s} className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Required Skills */}
                <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Missing Required Skills ({score.missingRequiredSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {score.missingRequiredSkills.length === 0 ? (
                      <p className="text-xs text-emerald-400 font-medium">None! 100% required skills matched.</p>
                    ) : (
                      score.missingRequiredSkills.map(s => (
                        <span key={s} className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/40">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Matched Preferred & Bonus Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Matched Preferred Stack ({score.matchedPreferredSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {score.matchedPreferredSkills.map(s => (
                      <span key={s} className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/40">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    Additional Unrequested Skills ({score.bonusSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {score.bonusSkills.map(s => (
                      <span key={s} className="px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 text-xs font-medium border border-purple-500/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Source Document: {resume.fileName}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Required Skill Match
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Preferred Skill Match
                  </span>
                </div>
              </div>

              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200 leading-relaxed max-h-96 overflow-y-auto bg-slate-900/80 p-4 rounded-xl border border-white/5">
                {renderHighlightedResumeText()}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
