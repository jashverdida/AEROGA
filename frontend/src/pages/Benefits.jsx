import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Users, TrendingUp } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';

const CATEGORIES = ['ALL', 'HEALTH', 'TRANSPORT', 'FINANCIAL', 'LIFESTYLE', 'EDUCATION'];

const categoryStyle = {
  HEALTH:     { color: '#4ade80', bg: 'rgba(74,222,128,0.09)',  border: 'rgba(74,222,128,0.2)',  accent: '#22c55e' },
  TRANSPORT:  { color: '#38bdf8', bg: 'rgba(56,189,248,0.09)',  border: 'rgba(56,189,248,0.2)',  accent: '#0ea5e9' },
  FINANCIAL:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.09)', border: 'rgba(167,139,250,0.2)', accent: '#8b5cf6' },
  LIFESTYLE:  { color: '#fb923c', bg: 'rgba(251,146,60,0.09)',  border: 'rgba(251,146,60,0.2)',  accent: '#f97316' },
  EDUCATION:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.09)',  border: 'rgba(251,191,36,0.2)',  accent: '#f59e0b' },
};

const emptyForm = {
  name: '', description: '', category: 'HEALTH', provider: '', value: '',
  eligibility: 'ALL_EMPLOYEES', active: true,
};

export default function Benefits() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('ALL');
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
      category: benefit.category ?? 'HEALTH',
      provider: benefit.provider ?? '',
      value: benefit.value,
      eligibility: benefit.eligibility ?? 'ALL_EMPLOYEES',
      active: benefit.active,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, value: parseFloat(form.value) };
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
    if (!window.confirm('Remove this benefit?')) return;
    await API.delete(`/api/benefits/${id}`);
    fetchBenefits();
  };

  const filtered = catFilter === 'ALL' ? benefits : benefits.filter((b) => b.category === catFilter);
  const activeCount = benefits.filter((b) => b.active).length;
  const totalEnrolled = benefits.reduce((sum, b) => sum + (b.enrolledCount ?? 0), 0);

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
        background: 'rgba(10,20,12,0.6)',
        border: '1px solid rgba(34,197,94,0.08)',
        borderRadius: '12px',
        padding: '14px 20px',
        backdropFilter: 'blur(8px)',
      }}>
        <div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{benefits.length}</p>
          <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Total benefits</p>
        </div>
        <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />
        <div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#4ade80', letterSpacing: '-0.03em' }}>{activeCount}</p>
          <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Active</p>
        </div>
        <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />
        <div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#a78bfa', letterSpacing: '-0.03em' }}>{totalEnrolled.toLocaleString()}</p>
          <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Total enrollments</p>
        </div>
        {isAdmin && (
          <button className="btn-primary flex items-center gap-2 text-sm ml-auto" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Benefit
          </button>
        )}
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => {
          const active = catFilter === cat;
          const cs = categoryStyle[cat];
          return (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              style={{
                fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '20px',
                border: `1px solid ${active ? (cs?.border ?? 'rgba(34,197,94,0.3)') : 'rgba(255,255,255,0.07)'}`,
                color: active ? (cs?.color ?? '#4ade80') : '#64748b',
                background: active ? (cs?.bg ?? 'rgba(34,197,94,0.08)') : 'transparent',
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full" style={{
              background: 'rgba(10,20,12,0.75)',
              border: '1px solid rgba(34,197,94,0.08)',
              borderRadius: '14px',
              padding: '52px', textAlign: 'center',
              color: '#475569', fontSize: '13px',
            }}>
              No benefits found.
            </div>
          ) : (
            filtered.map((benefit) => {
              const cs = categoryStyle[benefit.category] ?? categoryStyle.HEALTH;
              return (
                <div
                  key={benefit.id}
                  style={{
                    background: 'rgba(10,20,12,0.75)',
                    border: `1px solid ${benefit.active ? cs.border : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: '14px',
                    backdropFilter: 'blur(8px)',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', gap: '14px',
                    transition: 'box-shadow 200ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = benefit.active ? `0 0 28px ${cs.bg}` : 'none'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Colored accent top bar */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: benefit.active
                      ? `linear-gradient(90deg, ${cs.accent} 0%, transparent 70%)`
                      : 'linear-gradient(90deg, #475569 0%, transparent 70%)',
                  }} />

                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
                      color: cs.color, background: cs.bg, border: `1px solid ${cs.border}`,
                      borderRadius: '20px', padding: '3px 9px',
                    }}>
                      {benefit.category}
                    </div>
                    <div style={{
                      fontSize: '11px', fontWeight: 600,
                      color: benefit.active ? '#4ade80' : '#64748b',
                      background: benefit.active ? 'rgba(74,222,128,0.07)' : 'rgba(100,116,139,0.07)',
                      border: `1px solid ${benefit.active ? 'rgba(74,222,128,0.18)' : 'rgba(100,116,139,0.15)'}`,
                      borderRadius: '20px', padding: '3px 9px',
                    }}>
                      {benefit.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {/* Name & description */}
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{benefit.name}</h3>
                    {benefit.description && (
                      <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {benefit.description}
                      </p>
                    )}
                  </div>

                  {/* Value + provider */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '26px', fontWeight: 800, color: cs.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                        £{benefit.value?.toLocaleString()}
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b', marginLeft: '4px' }}>/ yr</span>
                      </p>
                      {benefit.provider && (
                        <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '3px' }}>via {benefit.provider}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users style={{ width: '13px', height: '13px', color: '#64748b' }} />
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{benefit.enrolledCount?.toLocaleString()}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>enrolled</span>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div style={{
                    fontSize: '11px', color: '#64748b',
                    background: 'rgba(255,255,255,0.025)',
                    borderRadius: '7px', padding: '6px 10px',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    <TrendingUp style={{ width: '11px', height: '11px', color: '#475569', flexShrink: 0 }} />
                    {benefit.eligibility?.replace('_', ' ') ?? 'All employees'}
                  </div>

                  {/* Admin actions */}
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <button
                        onClick={() => openEdit(benefit)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                          fontSize: '12px', fontWeight: 600, padding: '7px',
                          borderRadius: '8px', cursor: 'pointer', transition: 'all 150ms',
                          color: '#94a3b8', background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#4ade80'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                      >
                        <Pencil style={{ width: '13px', height: '13px' }} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(benefit.id)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                          fontSize: '12px', fontWeight: 600, padding: '7px',
                          borderRadius: '8px', cursor: 'pointer', transition: 'all 150ms',
                          color: '#94a3b8', background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                      >
                        <Trash2 style={{ width: '13px', height: '13px' }} />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })
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
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                {['HEALTH', 'TRANSPORT', 'FINANCIAL', 'LIFESTYLE', 'EDUCATION'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Provider</label>
              <input className="input-field" placeholder="Bupa, Aviva, Internal…" value={form.provider} onChange={(e) => setForm((p) => ({ ...p, provider: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Annual Value (£)</label>
              <input type="number" min="0" step="1" className="input-field" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Eligibility</label>
              <select className="input-field" value={form.eligibility} onChange={(e) => setForm((p) => ({ ...p, eligibility: e.target.value }))}>
                {['ALL_EMPLOYEES', 'FULL_TIME', 'PART_TIME', 'CONTRACTOR'].map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                className="accent-aeroga-500 w-4 h-4"
              />
              <label htmlFor="active" className="text-sm text-slate-300">Active</label>
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
