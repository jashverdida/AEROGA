import { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Check, ShieldOff, Activity, Clock, Zap } from 'lucide-react';
import API from '../api/axios';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';

function maskKey(key) {
  if (!key) return '—';
  return key.slice(0, 12) + '••••••••••••••••';
}

function formatDate(dt) {
  if (!dt) return 'Never';
  const d = new Date(dt);
  const now = new Date();
  const diffMs = now - d;
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString();
}

const CARD_STYLE = {
  background: 'rgba(10,20,12,0.75)',
  border: '1px solid rgba(34,197,94,0.08)',
  borderRadius: '14px',
  backdropFilter: 'blur(8px)',
  padding: '22px',
  position: 'relative',
  overflow: 'hidden',
};

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [newKeyValue, setNewKeyValue] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', rateLimit: 1000 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchKeys = async () => {
    try {
      const res = await API.get('/api/api-keys');
      setKeys(res.data.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await API.post('/api/api-keys', form);
      const created = res.data.data;
      setNewKeyValue(created.key);
      setForm({ name: '', rateLimit: 1000 });
      setShowCreate(false);
      fetchKeys();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to create key');
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await API.post(`/api/api-keys/${id}/revoke`, {});
      fetchKeys();
    } catch {
      // silent
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/api-keys/${id}`);
      setShowDelete(null);
      fetchKeys();
    } catch {
      // silent
    }
  };

  const handleCopy = () => {
    if (newKeyValue) {
      navigator.clipboard.writeText(newKeyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCount = keys.filter((k) => k.status === 'ACTIVE').length;

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,20,12,0.6)',
        border: '1px solid rgba(34,197,94,0.08)',
        borderRadius: '12px',
        padding: '14px 20px',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div>
            <p style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{keys.length}</p>
            <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Total keys</p>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />
          <div>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#4ade80', letterSpacing: '-0.03em' }}>{activeCount}</p>
            <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Active</p>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />
          <div>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#f87171', letterSpacing: '-0.03em' }}>{keys.length - activeCount}</p>
            <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Revoked</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Create New Key
        </button>
      </div>

      {/* Key cards */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader size="lg" /></div>
      ) : keys.length === 0 ? (
        <div style={{ ...CARD_STYLE, textAlign: 'center', padding: '52px' }}>
          <p style={{ color: '#475569', fontSize: '14px' }}>No API keys yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {keys.map((key) => {
            const active = key.status === 'ACTIVE';
            return (
              <div key={key.id} style={{
                ...CARD_STYLE,
                borderColor: active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                transition: 'border-color 200ms, box-shadow 200ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = active ? '0 0 28px rgba(34,197,94,0.07)' : 'none'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Accent top line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: active
                    ? 'linear-gradient(90deg, #22c55e 0%, transparent 70%)'
                    : 'linear-gradient(90deg, #475569 0%, transparent 70%)',
                }} />

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {key.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Created {formatDate(key.createdAt)}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '11px', fontWeight: 600,
                    padding: '3px 9px', borderRadius: '20px',
                    color: active ? '#4ade80' : '#94a3b8',
                    background: active ? 'rgba(74,222,128,0.08)' : 'rgba(148,163,184,0.08)',
                    border: `1px solid ${active ? 'rgba(74,222,128,0.2)' : 'rgba(148,163,184,0.15)'}`,
                    flexShrink: 0,
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: active ? '#4ade80' : '#64748b',
                      boxShadow: active ? '0 0 6px #4ade80' : 'none',
                    }} />
                    {active ? 'Active' : 'Revoked'}
                  </div>
                </div>

                {/* Masked key */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '14px',
                }}>
                  <code style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {maskKey(key.key)}
                  </code>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Zap style={{ width: '12px', height: '12px', color: '#4ade80' }} />
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>{key.rateLimit?.toLocaleString()}/min</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Activity style={{ width: '12px', height: '12px', color: '#3b82f6' }} />
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>{key.requestCount?.toLocaleString() ?? 0} reqs</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto' }}>
                    <Clock style={{ width: '12px', height: '12px', color: '#64748b' }} />
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{formatDate(key.lastUsed)}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {active && (
                    <button
                      onClick={() => handleRevoke(key.id)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: 600, padding: '7px 12px', borderRadius: '8px',
                        background: 'rgba(245,158,11,0.07)',
                        border: '1px solid rgba(245,158,11,0.18)',
                        color: '#f59e0b',
                        cursor: 'pointer', transition: 'all 150ms',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.12)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.07)'; }}
                    >
                      <ShieldOff style={{ width: '13px', height: '13px' }} />
                      Revoke
                    </button>
                  )}
                  <button
                    onClick={() => setShowDelete(key)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      fontSize: '12px', fontWeight: 600, padding: '7px 12px', borderRadius: '8px',
                      background: 'rgba(248,113,113,0.07)',
                      border: '1px solid rgba(248,113,113,0.18)',
                      color: '#f87171',
                      cursor: 'pointer', transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.07)'; }}
                  >
                    <Trash2 style={{ width: '13px', height: '13px' }} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create API Key">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Key Name</label>
            <input
              className="input-field"
              placeholder="Production Integration"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Rate Limit (requests/min)</label>
            <input
              type="number"
              min={1}
              className="input-field"
              value={form.rateLimit}
              onChange={(e) => setForm((p) => ({ ...p, rateLimit: parseInt(e.target.value) }))}
              required
            />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400">{error}</div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving ? <Loader size="sm" /> : 'Create Key'}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* New Key Display Modal */}
      <Modal isOpen={!!newKeyValue} onClose={() => setNewKeyValue(null)} title="API Key Created">
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 text-sm text-amber-300">
            Save this key now. You won't be able to see it again.
          </div>
          <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between gap-3">
            <code className="text-aeroga-300 text-sm font-mono break-all">{newKeyValue}</code>
            <button onClick={handleCopy} className="flex-shrink-0 text-slate-400 hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={() => setNewKeyValue(null)} className="btn-primary w-full">Done</button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!showDelete} onClose={() => setShowDelete(null)} title="Delete API Key" size="sm">
        <p className="text-slate-300 text-sm mb-5">
          Permanently delete <span className="text-white font-medium">"{showDelete?.name}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleDelete(showDelete?.id)}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
          <button onClick={() => setShowDelete(null)} className="btn-ghost flex-1">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
