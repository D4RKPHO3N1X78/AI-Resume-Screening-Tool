import React from 'react';
import type { ScoredCandidate, JobDescription } from '../types';
import { Scale } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface CandidateComparisonProps {
  candidates: ScoredCandidate[];
  job: JobDescription;
  onRemoveFromCompare: (candidateId: string) => void;
  onSelectCandidate: (candidate: ScoredCandidate) => void;
}

export const CandidateComparison: React.FC<CandidateComparisonProps> = ({
  candidates,
  job,
  onRemoveFromCompare,
  onSelectCandidate
}) => {
  if (candidates.length === 0) {
    return (
      <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Candidates Selected for Comparison</h3>
        <p className="text-xs text-slate-400">
          Go to the Leaderboard and click "Compare" on 2 or more candidates to compare them side-by-side.
        </p>
      </div>
    );
  }

  // Multi-candidate Radar Data
  const categories = [
    { key: 'skillScore', name: 'Skill Match' },
    { key: 'tfidfScore', name: 'TF-IDF Similarity' },
    { key: 'experienceScore', name: 'Experience Fit' },
    { key: 'educationScore', name: 'Education Fit' },
    { key: 'overallScore', name: 'Overall Score' },
  ];

  const radarData = categories.map(cat => {
    const row: any = { subject: cat.name };
    candidates.forEach(c => {
      row[c.resume.candidateName] = (c.score as any)[cat.key];
    });
    return row;
  });

  const colors = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            Head-to-Head Candidate Comparison
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side evaluation for target role: <strong className="text-white">{job.title}</strong>
          </p>
        </div>
        <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Comparing {candidates.length} Candidate(s)
        </span>
      </div>

      {/* Comparative Multi-Radar Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
          Multi-Candidate Performance Overlay
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" />
              {candidates.map((c, idx) => (
                <Radar
                  key={c.resume.id}
                  name={c.resume.candidateName}
                  dataKey={c.resume.candidateName}
                  stroke={colors[idx % colors.length]}
                  fill={colors[idx % colors.length]}
                  fillOpacity={0.2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-Side Candidate Columns Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(4, candidates.length)} gap-6`}>
        {candidates.map((c, idx) => (
          <div key={c.resume.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 relative">
            
            <button
              onClick={() => onRemoveFromCompare(c.resume.id)}
              className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 text-xs transition-colors"
              title="Remove from comparison"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Candidate #{idx + 1}
              </span>
              <h3 
                onClick={() => onSelectCandidate(c)}
                className="text-base font-bold text-white hover:text-indigo-300 cursor-pointer transition-colors truncate"
              >
                {c.resume.candidateName}
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Grade {c.score.grade}
                </span>
                <span className="text-lg font-extrabold text-white font-mono">
                  {c.score.overallScore}%
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-2 text-xs border-t border-b border-white/5 py-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Skill Match:</span>
                <span className="text-emerald-400 font-bold">{c.score.skillScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TF-IDF Overlap:</span>
                <span className="text-cyan-400 font-bold">{c.score.tfidfScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experience:</span>
                <span className="text-white font-bold">{c.resume.experienceYears} Yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Education:</span>
                <span className="text-slate-200 truncate max-w-[120px]">{c.resume.education}</span>
              </div>
            </div>

            {/* Required Skill Matches */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Matched Required Skills ({c.score.matchedRequiredSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {c.score.matchedRequiredSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Required Skills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                Missing Required Skills ({c.score.missingRequiredSkills.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {c.score.missingRequiredSkills.length === 0 ? (
                  <span className="text-xs text-emerald-400">Full Coverage</span>
                ) : (
                  c.score.missingRequiredSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 text-[11px]">
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
