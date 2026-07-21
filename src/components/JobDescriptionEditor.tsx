import React, { useState, useEffect } from 'react';
import type { JobDescription } from '../types';
import { extractSkillsFromText } from '../services/nlpEngine';
import { Sparkles, Save, CheckCircle, Trash2, Plus } from 'lucide-react';

interface JobDescriptionEditorProps {
  activeJob: JobDescription;
  onSaveJob: (updatedJob: JobDescription) => void;
  onDeleteJob?: (jobId: string) => void;
}

export const JobDescriptionEditor: React.FC<JobDescriptionEditorProps> = ({
  activeJob,
  onSaveJob,
  onDeleteJob
}) => {
  const [formData, setFormData] = useState<JobDescription>(activeJob);
  const [newRequiredSkill, setNewRequiredSkill] = useState('');
  const [newPreferredSkill, setNewPreferredSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(activeJob);
  }, [activeJob]);

  const handleAutoExtractSkills = () => {
    const extracted = extractSkillsFromText(formData.rawText);
    const splitPoint = Math.ceil(extracted.length * 0.6);
    const req = extracted.slice(0, splitPoint);
    const pref = extracted.slice(splitPoint);

    setFormData(prev => ({
      ...prev,
      requiredSkills: Array.from(new Set([...prev.requiredSkills, ...req])),
      preferredSkills: Array.from(new Set([...prev.preferredSkills, ...pref]))
    }));
  };

  const handleAddRequiredSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequiredSkill.trim()) return;
    if (!formData.requiredSkills.includes(newRequiredSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newRequiredSkill.trim()]
      }));
    }
    setNewRequiredSkill('');
  };

  const handleRemoveRequiredSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const handleAddPreferredSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPreferredSkill.trim()) return;
    if (!formData.preferredSkills.includes(newPreferredSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, newPreferredSkill.trim()]
      }));
    }
    setNewPreferredSkill('');
  };

  const handleRemovePreferredSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSkills: prev.preferredSkills.filter(s => s !== skill)
    }));
  };

  const handleSave = () => {
    onSaveJob(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-sans">Job Description Workbench</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              NLP Taxonomy Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure job specifications, required technical skill matrices, and scoring criteria weights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onDeleteJob && (
            <button
              onClick={() => onDeleteJob(formData.id)}
              className="px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isSaved ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Changes Saved!' : 'Save Job Specs'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Job General Info */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              Role Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Company / Team</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Min Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.minExperienceYears}
                  onChange={e => setFormData({ ...formData, minExperienceYears: Number(e.target.value) })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Min Required Education</label>
                <select
                  value={formData.minEducation}
                  onChange={e => setFormData({ ...formData, minEducation: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium bg-slate-900"
                >
                  <option value="High School">High School</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Ph.D.">Ph.D.</option>
                </select>
              </div>
            </div>
          </div>

          {/* Raw Text & Auto Extraction */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Full Job Description Text
              </h3>
              <button
                type="button"
                onClick={handleAutoExtractSkills}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-medium shadow-md shadow-violet-600/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Extract NLP Skills
              </button>
            </div>

            <textarea
              rows={8}
              value={formData.rawText}
              onChange={e => setFormData({ ...formData, rawText: e.target.value })}
              placeholder="Paste complete Job Description text here..."
              className="w-full glass-input rounded-xl p-3 text-xs font-mono leading-relaxed"
            />
          </div>

        </div>

        {/* Right Column: Skill Taxonomy Tags */}
        <div className="space-y-6">
          
          {/* Required Skills Box */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Required Technical Skills ({formData.requiredSkills.length})
              </h3>
            </div>

            <form onSubmit={handleAddRequiredSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. PyTorch)"
                value={newRequiredSkill}
                onChange={e => setNewRequiredSkill(e.target.value)}
                className="flex-1 glass-input rounded-xl px-3 py-1.5 text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-2 max-h-48 overflow-y-auto">
              {formData.requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveRequiredSkill(skill)}
                    className="hover:text-rose-400 text-slate-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills Box */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Preferred / Bonus Skills ({formData.preferredSkills.length})
              </h3>
            </div>

            <form onSubmit={handleAddPreferredSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Next.js)"
                value={newPreferredSkill}
                onChange={e => setNewPreferredSkill(e.target.value)}
                className="flex-1 glass-input rounded-xl px-3 py-1.5 text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-2 max-h-48 overflow-y-auto">
              {formData.preferredSkills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium"
                >
                  {skill}
                  <button
                    onClick={() => handleRemovePreferredSkill(skill)}
                    className="hover:text-rose-400 text-slate-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
