import { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import API from '../api/axios';
import Badge, { methodBadge, statusBadge } from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

const METHOD_OPTIONS = ['ALL', 'GET', 'POST', 'PUT', 'DELETE'];
const STATUS_OPTIONS = ['ALL', '2xx', '4xx', '5xx'];

function formatTs(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString();
}

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
      const res = await API.get(`/api/admin/logs?page=${p}&size=10`);
      const data = res.data.data;
      setLogs(data?.content ?? []);
      setTotalPages(data?.totalPages ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

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
      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <select
          className="input-field w-auto text-sm"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {METHOD_OPTIONS.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select
          className="input-field w-auto text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-aeroga-500"
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={() => fetchLogs(page)}
            className="btn-ghost flex items-center gap-2 text-sm px-3 py-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-12"><Loader className="py-4" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Method', 'Path', 'Status', 'Latency', 'API Key', 'User', 'IP', 'Timestamp'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500 text-sm">
                      No logs match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <Badge variant={methodBadge(log.method)}>{log.method}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-300 max-w-[180px] truncate">{log.path}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge(log.statusCode)}>{log.statusCode}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{log.latencyMs}ms</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500 max-w-[100px] truncate">
                        {log.apiKeyId ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-[120px] truncate">{log.userId ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{log.ipAddress}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatTs(log.timestamp)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
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
