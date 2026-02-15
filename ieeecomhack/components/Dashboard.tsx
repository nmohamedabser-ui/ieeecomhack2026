
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
// Added FileText to the lucide-react imports to fix the error where the icon was used but not imported
import { Activity, AlertTriangle, MessageSquare, Zap, Clock, ChevronRight, Briefcase, BarChart3, UserCheck, Terminal, FileText } from 'lucide-react';
import { SummaryReport, PersonaType } from '../types';
import StatCard from './ui/StatCard';

interface DashboardProps {
  reports: SummaryReport[];
  onViewReport: (id: string) => void;
  onNewReport: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, onViewReport, onNewReport }) => {
  const stats = useMemo(() => {
    if (reports.length === 0) return { avgReadability: 0, totalRisks: 0, avgGap: 0, count: 0 };
    const avgReadability = reports.reduce((acc, r) => acc + r.readabilityScore, 0) / reports.length;
    const totalRisks = reports.reduce((acc, r) => acc + r.risks.length, 0);
    const avgGap = reports.reduce((acc, r) => acc + r.communicationGapScore, 0) / reports.length;
    return { avgReadability: Math.round(avgReadability), totalRisks, avgGap: Math.round(avgGap), count: reports.length };
  }, [reports]);

  const chartData = useMemo(() => {
    return reports.slice(0, 7).reverse().map(r => ({
      name: new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      Readability: r.readabilityScore,
      Gap: r.communicationGapScore,
      Complexity: r.complexityScore
    }));
  }, [reports]);

  const getPersonaIcon = (type: PersonaType) => {
    switch (type) {
      case PersonaType.EXECUTIVE: return <Briefcase size={14} />;
      case PersonaType.BOARD: return <BarChart3 size={14} />;
      case PersonaType.PRODUCT_MANAGER: return <UserCheck size={14} />;
      case PersonaType.TECHNICAL_LEAD: return <Terminal size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Intelligence</h1>
          <p className="text-slate-500 font-medium">Global communication health and alignment metrics.</p>
        </div>
        <button 
          onClick={onNewReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center space-x-2 shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Zap size={14} />
          <span>New Analysis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Avg. Readability" value={`${stats.avgReadability}%`} trend="+2.4%" icon={<Activity size={24}/>} color="bg-indigo-600" />
        <StatCard label="Active Risks" value={stats.totalRisks} trend="-1" icon={<AlertTriangle size={24}/>} color="bg-rose-500" />
        <StatCard label="Comm. Gap" value={`${stats.avgGap}%`} trend="-5%" icon={<MessageSquare size={24}/>} color="bg-amber-500" />
        <StatCard label="Total Reports" value={stats.count} icon={<Clock size={24}/>} color="bg-slate-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Strategic Alignment Trends</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} fontWeight="bold" />
                <YAxis stroke="#cbd5e1" fontSize={10} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="Readability" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Gap" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Recent Intelligence Reports</h3>
          <div className="space-y-4">
            {reports.slice(0, 4).map(report => (
              <div 
                key={report.id}
                onClick={() => onViewReport(report.id)}
                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-slate-50 hover:border-indigo-100 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="bg-slate-900 p-2.5 rounded-xl text-white font-black text-[10px] shadow-sm group-hover:bg-indigo-600 transition-colors">
                    {report.projectName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{report.projectName}</h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <div className="flex items-center space-x-1 text-[9px] font-black text-indigo-500 uppercase tracking-tighter">
                        {getPersonaIcon(report.persona)}
                        <span>{report.persona.split(' (')[0]}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 shrink-0">
                  <div className="text-right">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Score</div>
                    <div className={`text-xs font-black ${report.readabilityScore > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {report.readabilityScore}%
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={18} />
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                  <FileText size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No intelligence available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
