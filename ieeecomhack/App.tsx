
import React, { useState, useEffect } from 'react';
import { Layout, Search, Settings, User as UserIcon, Bell, LayoutDashboard, FileText, History as HistoryIcon, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SummaryForm from './components/SummaryForm';
import SummaryDetail from './components/SummaryDetail';
import Auth from './components/Auth';
import { getReports, getCurrentUser, setSession } from './services/storageService';
import { SummaryReport, User, View } from './types';

// We update types.ts for View, but for inline stability:
enum AppView {
  DASHBOARD = 'dashboard',
  NEW_SUMMARY = 'new_summary',
  HISTORY = 'history',
  DETAIL = 'detail'
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reports, setReports] = useState<SummaryReport[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setReports(getReports());
    }
  }, [currentView, currentUser]);

  const handleSignOut = () => {
    setSession(null);
    setCurrentUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const navigateToDetail = (id: string) => {
    setSelectedReportId(id);
    setCurrentView(AppView.DETAIL);
  };

  if (!isReady) return null;

  if (!currentUser) {
    return <Auth onAuthenticated={(user) => setCurrentUser(user)} />;
  }

  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center space-x-3 mb-8">
          <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            E
          </div>
          <div>
            <span className="block text-lg font-bold text-white leading-none">ExecComm</span>
            <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">Intelligence Plat.</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentView === AppView.DASHBOARD ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => setCurrentView(AppView.NEW_SUMMARY)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentView === AppView.NEW_SUMMARY ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800'}`}
          >
            <FileText size={20} />
            <span className="font-semibold text-sm">New Summary</span>
          </button>
          <button 
            onClick={() => setCurrentView(AppView.HISTORY)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentView === AppView.HISTORY ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800'}`}
          >
            <HistoryIcon size={20} />
            <span className="font-semibold text-sm">All Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-rose-400 transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
          <div className="relative w-96 group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search reports or technical debt..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {currentView === AppView.DASHBOARD && (
            <Dashboard 
              reports={reports} 
              onViewReport={navigateToDetail}
              onNewReport={() => setCurrentView(AppView.NEW_SUMMARY)}
            />
          )}

          {currentView === AppView.NEW_SUMMARY && (
            <SummaryForm 
              onProcessed={navigateToDetail}
              onCancel={() => setCurrentView(AppView.DASHBOARD)}
            />
          )}

          {currentView === AppView.DETAIL && selectedReport && (
            <SummaryDetail 
              report={selectedReport}
              onBack={() => setCurrentView(AppView.DASHBOARD)}
            />
          )}

          {currentView === AppView.HISTORY && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-slate-900">Historical Intelligence</h1>
              <div className="grid grid-cols-1 gap-4">
                {reports.map(report => (
                  <div 
                    key={report.id}
                    onClick={() => navigateToDetail(report.id)}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{report.projectName}</h3>
                      <p className="text-sm text-slate-500">
                        {report.persona} • {new Date(report.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-8">
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-400">Readability</p>
                        <p className="font-bold text-indigo-600">{report.readabilityScore}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-400">Risks</p>
                        <p className={`font-bold ${report.risks.length > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                          {report.risks.length}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {reports.length === 0 && (
                   <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
                     No records found.
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
