import React, { useState, useMemo } from 'react';
import type { ScoredCandidate, Grade } from '../types';
import { CandidateCard } from './CandidateCard';
import { Search, Filter, ArrowUpDown, Grid, List, Sparkles, Scale } from 'lucide-react';

interface CandidateListProps {
  candidates: ScoredCandidate[];
  onSelectCandidate: (candidate: ScoredCandidate) => void;
  onOpenInterviewQs: (candidate: ScoredCandidate) => void;
  comparedCandidates: ScoredCandidate[];
  onToggleCompare: (candidate: ScoredCandidate) => void;
  onOpenComparisonTab: () => void;
  onLoadSamples: () => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onSelectCandidate,
  onOpenInterviewQs,
  comparedCandidates,
  onToggleCompare,
  onOpenComparisonTab,
  onLoadSamples
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<Grade | 'ALL'>('ALL');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'skill' | 'tfidf' | 'experience'>('score');

  // Filter and Sort Pipeline
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchesName = c.resume.candidateName.toLowerCase().includes(q);
        const matchesSkill = c.resume.extractedSkills.some(s => s.toLowerCase().includes(q));
        const matchesSearch = !q || matchesName || matchesSkill;

        const matchesGrade = gradeFilter === 'ALL' || c.score.grade === gradeFilter;
        const matchesScore = c.score.overallScore >= minScore;

        return matchesSearch && matchesGrade && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.score.overallScore - a.score.overallScore;
        if (sortBy === 'skill') return b.score.skillScore - a.score.skillScore;
        if (sortBy === 'tfidf') return b.score.tfidfScore - a.score.tfidfScore;
        if (sortBy === 'experience') return b.resume.experienceYears - a.resume.experienceYears;
        return 0;
      });
  }, [candidates, searchQuery, gradeFilter, minScore, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Summary & Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              Candidate Leaderboard
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {filteredCandidates.length} Active Profiles
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Screened and ranked in real-time using NLP TF-IDF & Skill Taxonomy matching.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {comparedCandidates.length > 0 && (
              <button
                onClick={onOpenComparisonTab}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Selected ({comparedCandidates.length})</span>
              </button>
            )}

            {candidates.length === 0 && (
              <button
                onClick={onLoadSamples}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Load Sample Candidates</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs font-medium"
            />
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-400 font-medium">Grade:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value as Grade | 'ALL')}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer flex-1"
            >
              <option value="ALL" className="bg-slate-900">All Grades</option>
              <option value="S" className="bg-slate-900">Grade S (90%+ S-Tier)</option>
              <option value="A" className="bg-slate-900">Grade A (80%+ High Fit)</option>
              <option value="B" className="bg-slate-900">Grade B (70%+ Moderate)</option>
              <option value="C" className="bg-slate-900">Grade C (60%+ Partial)</option>
              <option value="F" className="bg-slate-900">Grade F (&lt;60% Low)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer flex-1"
            >
              <option value="score" className="bg-slate-900">Overall Fit Score</option>
              <option value="skill" className="bg-slate-900">Skill Match Score</option>
              <option value="tfidf" className="bg-slate-900">TF-IDF Similarity</option>
              <option value="experience" className="bg-slate-900">Years of Experience</option>
            </select>
          </div>

          {/* Min Score Slider */}
          <div className="flex flex-col justify-center glass-input rounded-xl px-3 py-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Min Score:</span>
              <strong className="text-white font-mono">{minScore}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
            />
          </div>

        </div>

      </div>

      {/* Zero Candidates State */}
      {candidates.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Resumes in Pipeline Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload candidate PDF resumes or click below to load our 4 pre-packaged realistic candidate profiles to test NLP skill screening.
          </p>
          <button
            onClick={onLoadSamples}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            Load Sample Candidates Now
          </button>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-2">
          <p className="text-sm font-semibold text-white">No candidates match current filter criteria.</p>
          <p className="text-xs text-slate-400">Try resetting search query or minimum score thresholds.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((c) => (
            <CandidateCard
              key={c.resume.id}
              candidate={c}
              onSelectCandidate={onSelectCandidate}
              onOpenInterviewQs={onOpenInterviewQs}
              isCompared={comparedCandidates.some(item => item.resume.id === c.resume.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-3.5 pl-5">Candidate</th>
                  <th className="p-3.5">Grade & Fit Score</th>
                  <th className="p-3.5">Skill Match</th>
                  <th className="p-3.5">TF-IDF Score</th>
                  <th className="p-3.5">Experience</th>
                  <th className="p-3.5">Education</th>
                  <th className="p-3.5 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredCandidates.map((c) => {
                  return (
                    <tr key={c.resume.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white">
                        {c.resume.candidateName}
                      </td>
                      <td className="p-3.5 font-bold font-mono">
                        <span className="text-gradient-cyan">{c.score.overallScore}%</span> ({c.score.grade})
                      </td>
                      <td className="p-3.5 text-emerald-400 font-medium">
                        {c.score.skillScore}%
                      </td>
                      <td className="p-3.5 text-cyan-400 font-medium">
                        {c.score.tfidfScore}%
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {c.resume.experienceYears} Yrs
                      </td>
                      <td className="p-3.5 text-slate-400 truncate max-w-[120px]">
                        {c.resume.education}
                      </td>
                      <td className="p-3.5 text-right pr-5">
                        <button
                          onClick={() => onSelectCandidate(c)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white font-medium text-[11px]"
                        >
                          View Deep Analysis
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
