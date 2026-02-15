
import React, { useState } from 'react';
import { Send, Loader2, Sparkles, BookOpen, Target, UserCheck, Briefcase, BarChart3, Terminal } from 'lucide-react';
import { PersonaType, SummaryReport } from '../types';
import { processTechnicalUpdate } from '../services/geminiService';
import { saveReport, getCurrentUser } from '../services/storageService';

interface SummaryFormProps {
  onProcessed: (id: string) => void;
  onCancel: () => void;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ onProcessed, onCancel }) => {
  const [projectName, setProjectName] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [persona, setPersona] = useState<PersonaType>(PersonaType.EXECUTIVE);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !originalText) return;

    setIsProcessing(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error("User must be authenticated to create a report.");
      }

      const result = await processTechnicalUpdate(originalText, persona, projectName);
      
      const newReport: SummaryReport = {
        ...result,
        id: Math.random().toString(36).substring(7),
        userId: user.id,
        projectName,
        originalText,
        persona,
        timestamp: Date.now()
      };
      
      saveReport(newReport);
      onProcessed(newReport.id);
    } catch (error) {
      console.error("Pipeline error:", error);
      alert("Error processing the technical update. Please check your connection and API configuration.");
    } finally {
      setIsProcessing(false);
    }
  };

  const personaOptions = [
    { type: PersonaType.EXECUTIVE, icon: <Briefcase size={20} />, description: 'ROI & Strategy' },
    { type: PersonaType.BOARD, icon: <BarChart3 size={20} />, description: 'Risk & Governance' },
    { type: PersonaType.PRODUCT_MANAGER, icon: <UserCheck size={20} />, description: 'Velocity & Roadmaps' },
    { type: PersonaType.TECHNICAL_LEAD, icon: <Terminal size={20} />, description: 'Architecture Health' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles size={120} className="text-indigo-600" />
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">New Intelligence Analysis</h2>
          <p className="text-slate-500">Translate technical reality into executive strategy.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">01. Project Identity</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Project Apollo v2.1"
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50/50 text-slate-900 caret-indigo-600 transition-all outline-none text-xl font-bold placeholder:text-slate-300 shadow-sm"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">02. Target Audience Persona</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {personaOptions.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setPersona(opt.type)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all text-center space-y-3 group relative ${
                    persona === opt.type 
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' 
                      : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-all ${
                    persona === opt.type ? 'bg-indigo-600 text-white scale-110' : 'bg-white text-slate-400 group-hover:text-slate-600 border border-slate-200 shadow-sm'
                  }`}>
                    {opt.icon}
                  </div>
                  <div className="space-y-1">
                    <span className={`block text-xs font-black leading-tight ${persona === opt.type ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {opt.type.split(' (')[0]}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-tighter leading-tight">
                      {opt.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">03. Technical Intelligence Feed</label>
              <div className="flex items-center space-x-2 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-700 uppercase">
                  Feed Context: {persona.split(' (')[0]}
                </span>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder={`Provide the raw technical data for ${persona}...`}
                rows={10}
                className="w-full px-5 py-5 rounded-3xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50/50 text-slate-900 caret-indigo-600 transition-all outline-none resize-none font-mono text-sm leading-relaxed shadow-inner placeholder:text-slate-400"
                required
              />
              <div className="absolute bottom-5 right-5 flex items-center space-x-2">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-black text-slate-500 uppercase">
                    {originalText.length.toLocaleString()} Chars
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
            >
              Abort Mission
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-12 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center space-x-4 transition-all shadow-2xl ${
                isProcessing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.03] shadow-slate-200'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Execute Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100/50 flex space-x-4">
          <div className="bg-white p-2.5 rounded-2xl shadow-sm h-fit">
            <BookOpen className="text-indigo-600" size={20} />
          </div>
          <div>
            <h4 className="font-black text-indigo-900 text-[10px] uppercase tracking-widest mb-1">Adaptive Context Engine</h4>
            <p className="text-indigo-700/80 text-xs leading-relaxed">The feed is dynamically restructured to match the vocabulary and KPI priority of a {persona.split(' (')[0]}.</p>
          </div>
        </div>
        <div className="bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100/50 flex space-x-4">
          <div className="bg-white p-2.5 rounded-2xl shadow-sm h-fit">
            <Target className="text-emerald-600" size={20} />
          </div>
          <div>
            <h4 className="font-black text-emerald-900 text-[10px] uppercase tracking-widest mb-1">Strategic Calibration</h4>
            <p className="text-emerald-700/80 text-xs leading-relaxed">We calculate the delta between low-level technical velocity and high-level strategic alignment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;
