import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon: Icon, iconColor = 'bg-aeroga-600', label, value, change }) {
  const isPositive = change >= 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between">
        <div className={`${iconColor} p-3 rounded-xl`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value?.toLocaleString() ?? '—'}</p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
}
