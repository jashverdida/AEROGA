import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Copy, Check } from 'lucide-react';
import API from '../api/axios';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

function maskKey(key) {
  if (!key) return '—';
  return key.substring(0, 8) + '••••••••••••';
}

function formatDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString();
}

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', clientName: '', requestsPerMinute: 60 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchKeys = async () => {
    try {
      const res = await API.get('/api/admin/keys');
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
      const res = await API.post('/api/admin/keys', form);
      const created = res.data.data;
      setNewKey(created.keyValue);
      setForm({ name: '', clientName: '', requestsPerMinute: 60 });
      setShowCreate(false);
      fetchKeys();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to create key');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, hard = false) => {
    try {
      await API.delete(`/api/admin/keys/${id}?hard=${hard}`);
      setShowDelete(null);
      fetchKeys();
    } catch {
      // handle silently
    }
  };

  const handleCopy = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{keys.length} key{keys.length !== 1 ? 's' : ''} total</p>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Create New Key
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-12"><Loader className="py-4" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Name', 'Client', 'Key', 'Rate Limit', 'Requests', 'Status', 'Last Used', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {keys.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500 text-sm">
                      No API keys yet. Create your first one.
                    </td>
                  </tr>
                ) : (
                  keys.map((key) => (
                    <tr key={key.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-white">{key.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{key.clientName}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{maskKey(key.keyValue)}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{key.requestsPerMinute}/min</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{key.totalRequests?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant={key.active ? 'green' : 'slate'}>{key.active ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(key.lastUsedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowDelete(key)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create API Key">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Key Name</label>
            <input
              className="input-field"
              placeholder="Production Key"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Client Name</label>
            <input
              className="input-field"
              placeholder="Acme Corp"
              value={form.clientName}
              onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Rate Limit (requests/min)</label>
            <input
              type="number"
              min={1}
              className="input-field"
              value={form.requestsPerMinute}
              onChange={(e) => setForm((p) => ({ ...p, requestsPerMinute: parseInt(e.target.value) }))}
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
      <Modal isOpen={!!newKey} onClose={() => setNewKey(null)} title="API Key Created">
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 text-sm text-amber-300">
            Save this key now. You won't be able to see it again.
          </div>
          <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-between gap-3">
            <code className="text-aeroga-300 text-sm font-mono break-all">{newKey}</code>
            <button onClick={handleCopy} className="flex-shrink-0 text-slate-400 hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="btn-primary w-full">Done</button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!showDelete} onClose={() => setShowDelete(null)} title="Delete API Key" size="sm">
        <p className="text-slate-300 text-sm mb-5">
          Are you sure you want to deactivate <span className="text-white font-medium">"{showDelete?.name}"</span>? The key will no longer work for authentication.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleDelete(showDelete?.id, false)}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Deactivate
          </button>
          <button onClick={() => setShowDelete(null)} className="btn-ghost flex-1">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
