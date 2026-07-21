import React from 'react';
import type { ScoredCandidate, JobDescription } from '../types';
import { BarChart3, TrendingUp, Users, Award, Briefcase } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface AnalyticsViewProps {
  candidates: ScoredCandidate[];
  job: JobDescription;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  candidates,
  job
}) => {
  if (candidates.length === 0) {
    return (
      <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4 max-w-xl mx-auto my-12">
        <BarChart3 className="w-12 h-12 text-indigo-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Analytics Data Available</h3>
        <p className="text-xs text-slate-400">Load candidate resumes to view automated screening metrics and analytics.</p>
      </div>
    );
  }

  // 1. Grade Distribution Data
  const gradeCounts = { S: 0, A: 0, B: 0, C: 0, F: 0 };
  candidates.forEach(c => {
    gradeCounts[c.score.grade]++;
  });

  const gradeChartData = [
    { grade: 'Grade S (90%+)', count: gradeCounts.S, fill: '#F59E0B' },
    { grade: 'Grade A (80%+)', count: gradeCounts.A, fill: '#10B981' },
    { grade: 'Grade B (70%+)', count: gradeCounts.B, fill: '#06B6D4' },
    { grade: 'Grade C (60%+)', count: gradeCounts.C, fill: '#F97316' },
    { grade: 'Grade F (<60%)', count: gradeCounts.F, fill: '#EF4444' },
  ];

  // 2. Score Ranking Bar Chart
  const scoreRankingData = candidates
    .map(c => ({
      name: c.resume.candidateName,
      score: c.score.overallScore,
      skillScore: c.score.skillScore,
      tfidfScore: c.score.tfidfScore,
      exp: c.resume.experienceYears
    }))
    .sort((a, b) => b.score - a.score);

  // 3. Overall Pipeline Metrics
  const avgScore = Math.round(candidates.reduce((sum, c) => sum + c.score.overallScore, 0) / (candidates.length || 1));
  const topCandidate = candidates.reduce((max, c) => c.score.overallScore > max.score.overallScore ? c : max, candidates[0]);
  const sTierCount = gradeCounts.S + gradeCounts.A;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Screening Pipeline Analytics & Metrics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Statistical distribution and performance insight for: <strong className="text-white">{job.title}</strong>
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Candidates</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{candidates.length}</p>
          <p className="text-[11px] text-slate-500">Screened & Parsed</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pipeline Avg Fit Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{avgScore}%</p>
          <p className="text-[11px] text-slate-500">Across active resumes</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Top Tier Candidates</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-black text-yellow-400 font-mono">{sTierCount}</p>
          <p className="text-[11px] text-slate-500">Grades S & A (&gt;80%)</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Top Recommended</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-base font-bold text-white truncate">{topCandidate.resume.candidateName}</p>
          <p className="text-[11px] text-cyan-400 font-semibold">{topCandidate.score.overallScore}% Match (Grade {topCandidate.score.grade})</p>
        </div>

      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Candidate Leaderboard Scores */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Candidate Score Ranking
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreRankingData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#6366F1" radius={[0, 8, 8, 0]}>
                  {scoreRankingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 85 ? '#10B981' : entry.score >= 70 ? '#6366F1' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Match Grade Distribution
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeChartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="grade" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {gradeChartData.map((entry, index) => (
                    <Cell key={`cell-g-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
