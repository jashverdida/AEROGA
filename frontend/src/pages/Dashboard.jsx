import { useState, useEffect } from 'react';
import { Activity, Key, Gift, Users } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import API from '../api/axios';
import StatCard from '../components/ui/StatCard';
import Badge, { methodBadge, statusBadge } from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-slate-400">{label}</p>
        <p className="text-aeroga-400 font-semibold">{payload[0].value} requests</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [topEndpoints, setTopEndpoints] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sumRes, timeRes, topRes, logsRes] = await Promise.all([
          API.get('/api/admin/analytics/summary'),
          API.get('/api/admin/analytics/requests-over-time'),
          API.get('/api/admin/analytics/top-endpoints'),
          API.get('/api/admin/logs?page=0&size=10'),
        ]);
        setSummary(sumRes.data.data);
        setTimeSeries(timeRes.data.data);
        setTopEndpoints(topRes.data.data);
        setRecentLogs(logsRes.data.data?.content ?? []);
      } catch {
        // non-admin users fall back gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const formatTime = (ts) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Activity} iconColor="bg-aeroga-600" label="Total Requests" value={summary?.totalRequests} />
        <StatCard icon={Key} iconColor="bg-blue-600" label="Active API Keys" value={summary?.totalApiKeys} />
        <StatCard icon={Gift} iconColor="bg-emerald-600" label="Active Benefits" value={summary?.totalBenefits} />
        <StatCard icon={Users} iconColor="bg-purple-600" label="Active Employees" value={summary?.totalEmployees} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Requests over time (7 days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeSeries}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 3 }}
                activeDot={{ r: 5, fill: '#818cf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Top endpoints</h2>
          {topEndpoints.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topEndpoints} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="path"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <Tooltip
                  formatter={(v) => [v, 'Requests']}
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50">
          <h2 className="text-sm font-semibold text-white">Recent Request Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/30">
                {['Method', 'Path', 'Status', 'Latency', 'API Key', 'Time'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No logs yet. Make some API calls!
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <Badge variant={methodBadge(log.method)}>{log.method}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-300">{log.path}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadge(log.statusCode)}>{log.statusCode}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{log.latencyMs}ms</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500 truncate max-w-[120px]">
                      {log.apiKeyId ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatTime(log.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
