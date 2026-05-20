import { useState, useEffect } from 'react';
import { Activity, Key, Gift, Users } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import API from '../api/axios';
import Badge, { methodBadge, statusBadge } from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(4,13,9,0.97)',
      border: '1px solid rgba(34,197,94,0.18)',
      borderRadius: '10px',
      padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '5px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
          {p.value?.toLocaleString()} <span style={{ fontWeight: 400, color: '#64748b' }}>{p.name}</span>
        </p>
      ))}
    </div>
  );
};

function DashStat({ icon: Icon, label, value, change, accentColor, glowColor }) {
  const up = change >= 0;
  return (
    <div style={{
      background: 'rgba(10,20,12,0.75)',
      border: '1px solid rgba(34,197,94,0.08)',
      borderRadius: '14px',
      padding: '22px',
      backdropFilter: 'blur(8px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${accentColor} 0%, transparent 70%)`,
      }} />
      <div style={{
        position: 'absolute', top: '-40px', right: '-20px',
        width: '110px', height: '110px', borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}0d)`,
          border: `1px solid ${accentColor}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 18px ${glowColor}`,
        }}>
          <Icon style={{ width: '20px', height: '20px', color: accentColor }} />
        </div>
        {change !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            fontSize: '11px', fontWeight: 600,
            color: up ? '#4ade80' : '#f87171',
            background: up ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
            border: `1px solid ${up ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
            borderRadius: '20px', padding: '2px 8px',
          }}>
            {up ? '↑' : '↓'} {Math.abs(change)}%
          </div>
        )}
      </div>
      <div style={{ marginTop: '18px' }}>
        <p style={{ fontSize: '30px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {value?.toLocaleString() ?? '—'}
        </p>
        <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{label}</p>
      </div>
    </div>
  );
}

const CARD_STYLE = {
  background: 'rgba(10,20,12,0.75)',
  border: '1px solid rgba(34,197,94,0.08)',
  borderRadius: '14px',
  backdropFilter: 'blur(8px)',
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
          API.get('/api/admin/logs?page=0&size=8'),
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
        <DashStat icon={Activity} label="Total Requests" value={summary?.totalRequests}
          change={summary?.totalRequestsChange} accentColor="#22c55e" glowColor="rgba(34,197,94,0.15)" />
        <DashStat icon={Key} label="Active API Keys" value={summary?.activeApiKeys}
          change={summary?.activeApiKeysChange} accentColor="#3b82f6" glowColor="rgba(59,130,246,0.12)" />
        <DashStat icon={Gift} label="Active Benefits" value={summary?.totalBenefits}
          accentColor="#a855f7" glowColor="rgba(168,85,247,0.12)" />
        <DashStat icon={Users} label="Active Employees" value={summary?.totalEmployees}
          accentColor="#f59e0b" glowColor="rgba(245,158,11,0.12)" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Area chart — wider */}
        <div className="lg:col-span-3" style={{ ...CARD_STYLE, padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>Requests over time</h2>
            <span style={{
              fontSize: '10.5px', color: '#4ade80',
              background: 'rgba(74,222,128,0.07)',
              border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: '20px', padding: '2px 9px', fontWeight: 600,
            }}>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeSeries} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id="gradReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradErr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: '#475569' }} tickLine={false} axisLine={false}
                tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 10.5, fill: '#475569' }} tickLine={false} axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="requests" name="requests" stroke="#22c55e" strokeWidth={2}
                fill="url(#gradReq)" dot={false} activeDot={{ r: 5, fill: '#4ade80', stroke: 'none' }} />
              <Area type="monotone" dataKey="errors" name="errors" stroke="#f87171" strokeWidth={1.5}
                fill="url(#gradErr)" dot={false} activeDot={{ r: 4, fill: '#f87171', stroke: 'none' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — narrower */}
        <div className="lg:col-span-2" style={{ ...CARD_STYLE, padding: '22px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '18px' }}>Top endpoints</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topEndpoints} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <YAxis type="category" dataKey="endpoint" tick={{ fontSize: 9.5, fill: '#94a3b8' }}
                tickLine={false} axisLine={false} width={128}
                tickFormatter={(v) => v.length > 22 ? v.slice(0, 22) + '…' : v} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="requests" name="requests" fill="url(#barGrad)" radius={[0, 5, 5, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Logs */}
      <div style={{ ...CARD_STYLE, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>Recent Request Logs</h2>
          <span style={{ fontSize: '11px', color: '#475569' }}>{recentLogs.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['Method', 'Path', 'Status', 'Response Time', 'API Key', 'Time'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 18px', textAlign: 'left', fontSize: '10.5px',
                    fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                    No logs yet.
                  </td>
                </tr>
              ) : (
                recentLogs.map((log, idx) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: idx < recentLogs.length - 1 ? '1px solid rgba(255,255,255,0.025)' : 'none',
                      transition: 'background 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.028)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '10px 18px' }}>
                      <Badge variant={methodBadge(log.method)}>{log.method}</Badge>
                    </td>
                    <td style={{ padding: '10px 18px', fontSize: '11.5px', fontFamily: 'monospace', color: '#94a3b8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.path}
                    </td>
                    <td style={{ padding: '10px 18px' }}>
                      <Badge variant={statusBadge(log.statusCode)}>{log.statusCode}</Badge>
                    </td>
                    <td style={{ padding: '10px 18px', fontSize: '12px', fontWeight: 600, color: log.responseTime > 200 ? '#f59e0b' : '#4ade80' }}>
                      {log.responseTime}ms
                    </td>
                    <td style={{ padding: '10px 18px', fontSize: '11px', fontFamily: 'monospace', color: '#475569', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.apiKey ?? '—'}
                    </td>
                    <td style={{ padding: '10px 18px', fontSize: '11px', color: '#475569', whiteSpace: 'nowrap' }}>
                      {formatTime(log.timestamp)}
                    </td>
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
