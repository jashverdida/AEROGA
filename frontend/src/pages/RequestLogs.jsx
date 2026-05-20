import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import API from '../api/axios';
import Badge, { methodBadge, statusBadge } from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

const METHOD_OPTIONS = ['ALL', 'GET', 'POST', 'PUT', 'DELETE'];
const STATUS_OPTIONS = ['ALL', '2xx', '4xx', '5xx'];

function formatTs(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString([], {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

const SELECT_STYLE = {
  background: 'rgba(7,25,18,0.9)',
  border: '1px solid rgba(34,197,94,0.12)',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: '13px',
  fontWeight: 500,
  padding: '8px 32px 8px 12px',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  minWidth: '110px',
};

const CARD_STYLE = {
  background: 'rgba(10,20,12,0.75)',
  border: '1px solid rgba(34,197,94,0.08)',
  borderRadius: '14px',
  backdropFilter: 'blur(8px)',
};

export default function RequestLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  const fetchLogs = async (p = page) => {
    setLoading(true);
    try {
      const res = await API.get(`/api/admin/logs?page=${p}&size=15`);
      const data = res.data.data;
      setLogs(data?.content ?? []);
      setTotalPages(data?.totalPages ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(page); }, [page]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => fetchLogs(page), 30000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, page]);

  const filtered = logs.filter((log) => {
    const methodOk = method === 'ALL' || log.method === method;
    const statusOk =
      statusFilter === 'ALL' ||
      (statusFilter === '2xx' && log.statusCode >= 200 && log.statusCode < 300) ||
      (statusFilter === '4xx' && log.statusCode >= 400 && log.statusCode < 500) ||
      (statusFilter === '5xx' && log.statusCode >= 500);
    return methodOk && statusOk;
  });

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div style={{ ...CARD_STYLE, padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity style={{ width: '14px', height: '14px', color: '#4ade80' }} />
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Filter:</span>
        </div>
        <select style={SELECT_STYLE} value={method} onChange={(e) => setMethod(e.target.value)}>
          {METHOD_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select style={SELECT_STYLE} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: '#64748b', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ accentColor: '#22c55e', width: '14px', height: '14px' }}
            />
            Auto-refresh 30s
          </label>
          <button
            onClick={() => fetchLogs(page)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12.5px', fontWeight: 600, color: '#94a3b8',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <RefreshCw style={{ width: '13px', height: '13px' }} />
            Refresh
          </button>
        </div>
      </div>

      <div style={{ ...CARD_STYLE, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '52px', display: 'flex', justifyContent: 'center' }}><Loader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['Method', 'Path', 'Status', 'Response Time', 'API Key', 'IP Address', 'Timestamp'].map((h) => (
                    <th key={h} style={{
                      padding: '11px 16px', textAlign: 'left', fontSize: '10.5px',
                      fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                      No logs match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log, idx) => (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                        transition: 'background 150ms',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.028)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '10px 16px' }}>
                        <Badge variant={methodBadge(log.method)}>{log.method}</Badge>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '11.5px', fontFamily: 'monospace', color: '#94a3b8', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.path}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <Badge variant={statusBadge(log.statusCode)}>{log.statusCode}</Badge>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '12px', fontWeight: 600, color: log.responseTime > 200 ? '#f59e0b' : '#4ade80' }}>
                        {log.responseTime}ms
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '11px', fontFamily: 'monospace', color: '#475569', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.apiKey ?? '—'}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '11.5px', fontFamily: 'monospace', color: '#64748b' }}>
                        {log.ipAddress}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '11px', color: '#475569', whiteSpace: 'nowrap' }}>
                        {formatTs(log.timestamp)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{
            padding: '12px 18px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <p style={{ fontSize: '12px', color: '#475569' }}>Page {page + 1} of {totalPages}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
