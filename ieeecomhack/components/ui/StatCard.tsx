
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
    <div className={`${color} p-3 rounded-lg text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && <span className="text-xs font-semibold text-emerald-600">{trend}</span>}
      </div>
    </div>
  </div>
);

export default StatCard;
