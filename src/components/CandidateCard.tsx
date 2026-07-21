import React from 'react';
import type { ScoredCandidate, Grade } from '../types';
import { Briefcase, GraduationCap, CheckCircle2, XCircle, ChevronRight, HelpCircle, Scale } from 'lucide-react';

interface CandidateCardProps {
  candidate: ScoredCandidate;
  onSelectCandidate: (candidate: ScoredCandidate) => void;
  onOpenInterviewQs: (candidate: ScoredCandidate) => void;
  isCompared: boolean;
  onToggleCompare: (candidate: ScoredCandidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelectCandidate,
  onOpenInterviewQs,
  isCompared,
  onToggleCompare
}) => {
  const { resume, score } = candidate;

  const getGradeBadge = (grade: Grade) => {
    switch (grade) {
      case 'S':
        return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black border-yellow-300 shadow-yellow-500/20';
      case 'A':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold border-emerald-300 shadow-emerald-500/20';
      case 'B':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold border-cyan-300 shadow-cyan-500/20';
      case 'C':
        return 'bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold border-amber-400 shadow-amber-500/20';
      case 'F':
      default:
        return 'bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold border-rose-400 shadow-rose-500/20';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 glass-panel-hover flex flex-col justify-between space-y-4 relative group">
      
      {/* Top Row: Name, Source, Grade & Match Score */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 
              onClick={() => onSelectCandidate(candidate)}
              className="text-base font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors font-sans truncate max-w-[200px]"
            >
              {resume.candidateName}
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {resume.source}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              {resume.experienceYears} Yrs Exp
            </span>
            <span className="flex items-center gap-1 truncate max-w-[140px]" title={resume.education}>
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              {resume.education.replace("Degree in CS / STEM", "").replace("Degree", "")}
            </span>
          </div>
        </div>

        {/* Grade & Score Circle */}
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 text-xs rounded-lg border shadow-md ${getGradeBadge(score.grade)}`}>
              Grade {score.grade}
            </span>
            <span className="text-xl font-extrabold text-white font-mono">
              {score.overallScore}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Fit Score</span>
        </div>
      </div>

      {/* Progress Bars for Breakdown */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 text-[10px] font-medium text-slate-400">
        <div>
          <div className="flex justify-between mb-1">
            <span>Skill</span>
            <span className="text-emerald-400">{score.skillScore}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${score.skillScore}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>TF-IDF</span>
            <span className="text-cyan-400">{score.tfidfScore}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${score.tfidfScore}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Exp</span>
            <span className="text-indigo-400">{score.experienceScore}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${score.experienceScore}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Edu</span>
            <span className="text-purple-400">{score.educationScore}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${score.educationScore}%` }} />
          </div>
        </div>
      </div>

      {/* Skills Pill Cloud */}
      <div className="space-y-2 pt-1">
        
        {/* Matched Required Skills */}
        {score.matchedRequiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {score.matchedRequiredSkills.map(s => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Missing Required Skills */}
        {score.missingRequiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {score.missingRequiredSkills.map(s => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3 text-rose-400" />
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Executive AI Summary Teaser */}
      <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
        "{score.aiSummary}"
      </p>

      {/* Card Action Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
        <button
          onClick={() => onToggleCompare(candidate)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isCompared 
              ? 'bg-indigo-500 text-white font-semibold shadow-sm shadow-indigo-500/30' 
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenInterviewQs(candidate)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
            title="Generate Interview Questions"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Interview Qs</span>
          </button>

          <button
            onClick={() => onSelectCandidate(candidate)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Deep View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
