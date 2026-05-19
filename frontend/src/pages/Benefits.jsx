import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

const TYPES = ['ALL', 'HEALTH', 'DENTAL', 'VISION', 'LIFE', 'WELLNESS', 'FINANCIAL', 'OTHER'];

const typeColors = {
  HEALTH: 'green', DENTAL: 'blue', VISION: 'purple',
  LIFE: 'indigo', WELLNESS: 'amber', FINANCIAL: 'green', OTHER: 'slate',
};

const emptyForm = {
  name: '', description: '', type: 'HEALTH', value: '', currency: 'USD',
  eligibleDepartments: '', active: true,
};

export default function Benefits() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchBenefits = async () => {
    try {
      const res = await API.get('/api/benefits');
      setBenefits(res.data.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBenefits(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (benefit) => {
    setEditTarget(benefit);
    setForm({
      name: benefit.name,
      description: benefit.description ?? '',
      type: benefit.type,
      value: benefit.value,
      currency: benefit.currency,
      eligibleDepartments: (benefit.eligibleDepartments ?? []).join(', '),
      active: benefit.active,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      value: parseFloat(form.value),
      eligibleDepartments: form.eligibleDepartments
        ? form.eligibleDepartments.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editTarget) {
        await API.put(`/api/benefits/${editTarget.id}`, payload);
      } else {
        await API.post('/api/benefits', payload);
      }
      setShowModal(false);
      fetchBenefits();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save benefit');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this benefit?')) return;
    await API.delete(`/api/benefits/${id}`);
    fetchBenefits();
  };

  const filtered = typeFilter === 'ALL' ? benefits : benefits.filter((b) => b.type === typeFilter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                typeFilter === t
                  ? 'bg-aeroga-600 border-aeroga-600 text-white'
                  : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {isAdmin && (
          <button className="btn-primary flex items-center gap-2 text-sm ml-auto" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Benefit
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 text-sm">
              No benefits found.
            </div>
          ) : (
            filtered.map((benefit) => (
              <div key={benefit.id} className="glass-card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <Badge variant={typeColors[benefit.type] ?? 'slate'}>{benefit.type}</Badge>
                  <Badge variant={benefit.active ? 'green' : 'slate'}>{benefit.active ? 'Active' : 'Inactive'}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{benefit.name}</h3>
                  {benefit.description && (
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">{benefit.description}</p>
                  )}
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-2xl font-bold text-aeroga-400">
                      {benefit.value?.toLocaleString()}
                      <span className="text-sm font-normal text-slate-500 ml-1">{benefit.currency}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {benefit.eligibleDepartments?.length
                        ? benefit.eligibleDepartments.join(', ')
                        : 'All departments'}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(benefit)} className="text-slate-500 hover:text-aeroga-400 transition-colors p-1">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(benefit.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editTarget ? 'Edit Benefit' : 'Add Benefit'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea className="input-field resize-none h-20" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                {['HEALTH', 'DENTAL', 'VISION', 'LIFE', 'WELLNESS', 'FINANCIAL', 'OTHER'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Currency</label>
              <select className="input-field" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
                {['USD', 'PHP', 'GBP', 'EUR'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Value</label>
              <input type="number" min="0" step="0.01" className="input-field" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} required />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                className="accent-aeroga-500 w-4 h-4"
              />
              <label htmlFor="active" className="text-sm text-slate-300">Active</label>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Eligible Departments <span className="text-slate-500">(comma-separated, leave empty for all)</span>
              </label>
              <input className="input-field" placeholder="Engineering, HR, Finance" value={form.eligibleDepartments} onChange={(e) => setForm((p) => ({ ...p, eligibleDepartments: e.target.value }))} />
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400">{error}</div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving ? <Loader size="sm" /> : (editTarget ? 'Update Benefit' : 'Create Benefit')}
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
