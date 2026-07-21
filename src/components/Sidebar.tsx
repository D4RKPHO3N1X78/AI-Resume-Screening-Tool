import React from 'react';
import { LayoutDashboard, FileCode, Upload, Scale, BarChart3, Grid, Sparkles } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'workbench' | 'ingestion' | 'comparison' | 'analytics' | 'matrix';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  candidateCount: number;
  topScore: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  candidateCount,
  topScore
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Leaderboard & Screen', icon: LayoutDashboard, badge: candidateCount },
    { id: 'workbench' as ActiveTab, label: 'Job Description Workbench', icon: FileCode },
    { id: 'ingestion' as ActiveTab, label: 'Resume Ingestion Hub', icon: Upload },
    { id: 'comparison' as ActiveTab, label: 'Candidate Comparison', icon: Scale },
    { id: 'analytics' as ActiveTab, label: 'Visual Analytics', icon: BarChart3 },
    { id: 'matrix' as ActiveTab, label: 'Skill Gap Matrix', icon: Grid },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/10 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div>
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Navigation
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 text-white border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Status Widget */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Pipeline Status</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Screened</p>
              <p className="text-base font-bold text-white">{candidateCount}</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Top Match</p>
              <p className="text-base font-bold text-gradient-cyan">{topScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 text-[11px] text-slate-500 border-t border-white/5 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          NLP Matcher Engine
        </span>
        <span className="text-slate-600">TF-IDF v2</span>
      </div>
    </aside>
  );
};
