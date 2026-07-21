import React from 'react';
import type { ScoredCandidate, JobDescription } from '../types';
import { Grid, Check, X } from 'lucide-react';

interface SkillGapMatrixProps {
  candidates: ScoredCandidate[];
  job: JobDescription;
}

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({
  candidates,
  job
}) => {
  const allSkills = Array.from(new Set([...job.requiredSkills, ...job.preferredSkills]));

  if (candidates.length === 0) {
    return (
      <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4 max-w-xl mx-auto my-12">
        <Grid className="w-12 h-12 text-indigo-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Candidate Data to Display</h3>
        <p className="text-xs text-slate-400">Load or upload candidate resumes to view the Skill Gap Heatmap matrix.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <Grid className="w-5 h-5 text-cyan-400" />
            Skill Gap Heatmap & Taxonomy Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual breakdown of required and preferred skill coverage across all candidate resumes.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-400" />
            Matched
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-3 h-3 rounded-md bg-rose-500/30 border border-rose-400" />
            Missing
          </span>
        </div>
      </div>

      {/* Heatmap Grid Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4 pl-6 min-w-[200px]">Candidate</th>
                {allSkills.map(skill => {
                  const isReq = job.requiredSkills.includes(skill);
                  return (
                    <th key={skill} className="p-3 text-center min-w-[110px]" title={isReq ? 'Required Skill' : 'Preferred Skill'}>
                      <div className="flex flex-col items-center">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded mb-1 font-bold ${
                          isReq ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {isReq ? 'REQ' : 'PREF'}
                        </span>
                        <span className="text-white truncate max-w-[100px]">{skill}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs">
              {candidates.map(c => (
                <tr key={c.resume.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 pl-6 font-bold text-white flex items-center gap-2">
                    <span>{c.resume.candidateName}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      {c.score.overallScore}%
                    </span>
                  </td>

                  {allSkills.map(skill => {
                    const isMatched = c.score.matchedRequiredSkills.includes(skill) || c.score.matchedPreferredSkills.includes(skill);
                    return (
                      <td key={skill} className="p-3 text-center">
                        <div className="flex items-center justify-center">
                          {isMatched ? (
                            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shadow-sm shadow-emerald-500/20">
                              <Check className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-bold opacity-60">
                              <X className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
