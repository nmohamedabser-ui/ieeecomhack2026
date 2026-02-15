
import React, { useState } from 'react';
import { ArrowLeft, Share2, Download, CheckCircle, AlertCircle, TrendingUp, HelpCircle, Terminal, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { SummaryReport } from '../types';

interface SummaryDetailProps {
  report: SummaryReport;
  onBack: () => void;
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({ report, onBack }) => {
  const [showFullFeed, setShowFullFeed] = useState(false);

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Reports</span>
        </button>
        <div className="flex space-x-3">
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-all" title="Download Report">
            <Download size={20} />
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-all" title="Share Analysis">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Source Context Header - NEW: Addressing user request to see "which feed was given" */}
      <div className="mb-8 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-500/10">
        <div className="p-4 bg-slate-800/50 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
              <Terminal size={18} />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Source Intelligence Feed</span>
              <span className="text-sm font-bold text-white">{report.projectName}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                Target: {report.persona}
              </span>
            </div>
            <button 
              onClick={() => setShowFullFeed(!showFullFeed)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {showFullFeed ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
        <div className={`transition-all duration-300 ${showFullFeed ? 'max-h-[500px]' : 'max-h-[80px]'} overflow-hidden relative`}>
          <div className="p-6 font-mono text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
            {report.originalText}
          </div>
          {!showFullFeed && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Intelligence Output */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <div className="flex items-center space-x-3 mb-6 relative">
              <div className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">
                Executive Synthesis
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none relative">
              <p className="text-xl text-slate-800 leading-relaxed font-semibold mb-8 border-l-4 border-indigo-500 pl-6 py-2">
                {report.executiveSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-100">
              <div>
                <h3 className="flex items-center space-x-2 font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span>Key Strategic Takeaways</span>
                </h3>
                <ul className="space-y-3">
                  {report.keyTakeaways.map((item, i) => (
                    <li key={i} className="flex space-x-3 text-sm text-slate-600">
                      <span className="text-indigo-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center space-x-2 font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">
                  <TrendingUp size={16} className="text-indigo-500" />
                  <span>Critical Action Items</span>
                </h3>
                <ul className="space-y-3">
                  {report.suggestedActionItems.map((item, i) => (
                    <li key={i} className="flex space-x-3 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <span className="text-indigo-600 font-black text-xs shrink-0">{String(i+1).padStart(2, '0')}</span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center justify-between text-sm uppercase tracking-widest">
              Performance Metrics
              <HelpCircle size={16} className="text-slate-300" />
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                  <span>Persona Readability</span>
                  <span className="text-emerald-600">{report.readabilityScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: `${report.readabilityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                  <span>Technical Complexity</span>
                  <span className="text-indigo-600">{report.complexityScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]" style={{ width: `${report.complexityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                  <span>Communication Gap</span>
                  <span className="text-amber-600">{report.communicationGapScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)]" style={{ width: `${report.communicationGapScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 shadow-sm">
            <h3 className="font-bold text-rose-900 flex items-center space-x-2 mb-4 text-sm uppercase tracking-widest">
              <AlertCircle size={18} className="text-rose-500" />
              <span>Risk Extractions</span>
            </h3>
            <div className="space-y-3">
              {report.risks.map((risk, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border border-rose-200 text-sm text-rose-800 font-semibold shadow-sm flex items-start space-x-2">
                  <span className="block w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{risk}</span>
                </div>
              ))}
              {report.risks.length === 0 && (
                <p className="text-sm text-rose-600 italic">No critical risks identified in this feed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDetail;
