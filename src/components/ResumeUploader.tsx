import React, { useState, useRef } from 'react';
import { extractTextFromPDF } from '../services/pdfParser';
import { parseRawResumeText } from '../services/resumeParser';
import type { Resume } from '../types';
import { SAMPLE_RESUMES } from '../services/sampleData';
import { UploadCloud, FileText, Sparkles, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

interface ResumeUploaderProps {
  onResumesParsed: (newResumes: Resume[]) => void;
  existingCount: number;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onResumesParsed,
  existingCount
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [candidateNameInput, setCandidateNameInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setUploadStatus(`Parsing ${files.length} PDF resume(s)...`);

    const parsedList: Resume[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        let rawText = '';
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          rawText = await extractTextFromPDF(file);
        } else {
          rawText = await file.text();
        }

        const parsed = parseRawResumeText(rawText, file.name, 'uploaded');
        parsedList.push(parsed);
      } catch (err) {
        console.error(`Failed to parse file ${file.name}:`, err);
      }
    }

    if (parsedList.length > 0) {
      onResumesParsed(parsedList);
      setUploadStatus(`Successfully parsed ${parsedList.length} candidate resume(s)!`);
    } else {
      setUploadStatus('Failed to extract text from selected file(s).');
    }

    setIsProcessing(false);
    setTimeout(() => setUploadStatus(null), 4000);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    setIsProcessing(true);
    const parsed = parseRawResumeText(
      pastedText,
      candidateNameInput.trim() ? `${candidateNameInput.trim()}.txt` : 'Pasted_Candidate.txt',
      'pasted'
    );

    if (candidateNameInput.trim()) {
      parsed.candidateName = candidateNameInput.trim();
    }

    onResumesParsed([parsed]);
    setPastedText('');
    setCandidateNameInput('');
    setUploadStatus(`Candidate ${parsed.candidateName} parsed successfully!`);
    setIsProcessing(false);
    setTimeout(() => setUploadStatus(null), 4000);
  };

  const handleLoadSamples = () => {
    setIsProcessing(true);
    setUploadStatus('Loading 4 sample candidate profiles...');
    setTimeout(() => {
      onResumesParsed(SAMPLE_RESUMES);
      setUploadStatus('Successfully loaded 4 diverse sample candidate resumes!');
      setIsProcessing(false);
      setTimeout(() => setUploadStatus(null), 4000);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-400" />
            Resume Ingestion Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ingest candidate PDF resumes or raw text for instant NLP skill extraction and ranking scoring.
          </p>
        </div>

        <button
          onClick={handleLoadSamples}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Load Sample Candidates</span>
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveMode('upload')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
            activeMode === 'upload'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          PDF Batch Upload
        </button>
        <button
          onClick={() => setActiveMode('paste')}
          className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
            activeMode === 'paste'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Paste Raw Resume Text
        </button>
      </div>

      {/* Main Upload / Ingestion Body */}
      {activeMode === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileUpload(e.dataTransfer.files);
          }}
          className="glass-panel p-12 rounded-3xl border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/70 glass-panel-hover text-center cursor-pointer space-y-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
            {isProcessing ? (
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Drag & Drop PDF Resumes Here
            </h3>
            <p className="text-xs text-slate-400">
              Supports single or multi-PDF files up to 20MB. Automatic client-side NLP parsing.
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700">
              Browse Files...
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePasteSubmit} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Candidate Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Jordan Smith"
              value={candidateNameInput}
              onChange={(e) => setCandidateNameInput(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Resume Text</label>
            <textarea
              rows={10}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste candidate resume body text, experience timeline, and technical skills..."
              className="w-full glass-input rounded-xl p-3 text-xs font-mono leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={!pastedText.trim() || isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-40 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Parse & Add Candidate</span>
          </button>
        </form>
      )}

      {/* Upload Feedback Alert */}
      {uploadStatus && (
        <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs font-medium text-indigo-200 flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Pipeline Ingestion Info */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Current Candidates in Pipeline: <strong className="text-white">{existingCount}</strong>
        </span>
        <span className="text-slate-500">Parsing Engine: PDFjs + NLP Tokenizer</span>
      </div>

    </div>
  );
};
