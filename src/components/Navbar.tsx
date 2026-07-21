import React from 'react';
import type { JobDescription } from '../types';
import { Cpu, Sliders, Plus, Download, FileText } from 'lucide-react';

interface NavbarProps {
  jobs: JobDescription[];
  activeJob: JobDescription;
  onSelectJob: (job: JobDescription) => void;
  onOpenNewJobModal: () => void;
  onOpenWeightsModal: () => void;
  onExportCSV: () => void;
  candidateCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  jobs,
  activeJob,
  onSelectJob,
  onOpenNewJobModal,
  onOpenWeightsModal,
  onExportCSV,
  candidateCount
}) => {
  return (
    <header className="glass-panel sticky top-0 z-30 border-b border-white/10 px-6 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 shadow-lg shadow-indigo-500/25">
            <Cpu className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                ResumePulse <span className="text-gradient-cyan">NLP</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.4 Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated Natural Language Resume Screening & Ranking</p>
          </div>
        </div>

        {/* Active Job Selector */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 rounded-xl p-1.5 px-3">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Target Job:</span>
            <select
              value={activeJob.id}
              onChange={(e) => {
                const selected = jobs.find(j => j.id === e.target.value);
                if (selected) onSelectJob(selected);
              }}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer pr-2 max-w-[220px] truncate"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id} className="bg-slate-900 text-white">
                  {job.title} ({job.company})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenNewJobModal}
            className="flex items-center gap-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl transition-all"
            title="Create or edit Job Description"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">New Job</span>
          </button>

          {/* Scoring Weights Modal Launcher */}
          <button
            onClick={onOpenWeightsModal}
            className="flex items-center gap-1.5 text-xs font-medium bg-slate-800/80 hover:bg-indigo-900/40 text-slate-200 border border-slate-700 hover:border-indigo-500/50 px-3 py-2 rounded-xl transition-all"
            title="Configure NLP Weights"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">NLP Weights</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            disabled={candidateCount === 0}
            className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

      </div>
    </header>
  );
};
