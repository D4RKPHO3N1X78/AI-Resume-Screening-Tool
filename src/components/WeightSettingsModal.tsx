import React, { useState } from 'react';
import type { ScoringWeights } from '../types';
import { X, Sliders, Save, RefreshCw } from 'lucide-react';

interface WeightSettingsModalProps {
  weights: ScoringWeights;
  onSaveWeights: (weights: ScoringWeights) => void;
  onClose: () => void;
}

export const WeightSettingsModal: React.FC<WeightSettingsModalProps> = ({
  weights,
  onSaveWeights,
  onClose
}) => {
  const [localWeights, setLocalWeights] = useState<ScoringWeights>(weights);

  const total = localWeights.skillMatch + localWeights.tfidf + localWeights.experience + localWeights.education;

  const handleSave = () => {
    onSaveWeights(localWeights);
    onClose();
  };

  const handleResetDefaults = () => {
    setLocalWeights({
      skillMatch: 40,
      tfidf: 25,
      experience: 20,
      education: 15
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-sans">Configure NLP Scoring Criteria Weights</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-400">
            Adjust the relative weights for each screening dimension. Total sum must equal 100%.
          </p>

          <div className="space-y-4">
            
            {/* Skill Match Weight */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-400">Skill Coverage Weight</span>
                <span className="text-white font-mono">{localWeights.skillMatch}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={localWeights.skillMatch}
                onChange={e => setLocalWeights({ ...localWeights, skillMatch: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* TF-IDF Weight */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-cyan-400">TF-IDF Vector Similarity Weight</span>
                <span className="text-white font-mono">{localWeights.tfidf}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={localWeights.tfidf}
                onChange={e => setLocalWeights({ ...localWeights, tfidf: Number(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Experience Weight */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-indigo-400">Experience Years Fit Weight</span>
                <span className="text-white font-mono">{localWeights.experience}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={localWeights.experience}
                onChange={e => setLocalWeights({ ...localWeights, experience: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Education Weight */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-purple-400">Education Degree Fit Weight</span>
                <span className="text-white font-mono">{localWeights.education}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={localWeights.education}
                onChange={e => setLocalWeights({ ...localWeights, education: Number(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

          </div>

          {/* Total Indicator */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            total === 100 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <span>Total Criteria Sum:</span>
            <span className="font-mono text-sm font-bold">{total}% {total === 100 ? '(Valid)' : '(Must be 100%)'}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-slate-900/60">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={total !== 100}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/30 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Apply & Rescore Candidates</span>
          </button>
        </div>

      </div>
    </div>
  );
};
