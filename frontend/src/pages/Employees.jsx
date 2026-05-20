import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Eye, Search } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';

const emptyForm = { name: '', email: '', department: '', position: '' };

const DEPT_COLORS = {
  Engineering: { color: '#4ade80', bg: 'rgba(74,222,128,0.09)',  border: 'rgba(74,222,128,0.2)' },
  Product:     { color: '#38bdf8', bg: 'rgba(56,189,248,0.09)',  border: 'rgba(56,189,248,0.2)' },
  Marketing:   { color: '#fb923c', bg: 'rgba(251,146,60,0.09)',  border: 'rgba(251,146,60,0.2)' },
  Sales:       { color: '#a78bfa', bg: 'rgba(167,139,250,0.09)', border: 'rgba(167,139,250,0.2)' },
  Finance:     { color: '#fbbf24', bg: 'rgba(251,191,36,0.09)',  border: 'rgba(251,191,36,0.2)' },
  HR:          { color: '#f472b6', bg: 'rgba(244,114,182,0.09)', border: 'rgba(244,114,182,0.2)' },
  Design:      { color: '#fb923c', bg: 'rgba(251,146,60,0.09)',  border: 'rgba(251,146,60,0.2)' },
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AVATAR_PALETTES = [
  ['#22c55e', '#15803d'], ['#3b82f6', '#1d4ed8'], ['#a855f7', '#7c3aed'],
  ['#f59e0b', '#d97706'], ['#ef4444', '#b91c1c'], ['#06b6d4', '#0e7490'],
  ['#f97316', '#c2410c'], ['#ec4899', '#be185d'],
];

function avatarGradient(name) {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length;
  const [a, b] = AVATAR_PALETTES[idx];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

const CARD_STYLE = {
  background: 'rgba(10,20,12,0.75)',
  border: '1px solid rgba(34,197,94,0.08)',
  borderRadius: '14px',
  backdropFilter: 'blur(8px)',
};

export default function Employees() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [employees, setEmployees] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [enrollTarget, setEnrollTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [enrolledBenefits, setEnrolledBenefits] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedBenefitId, setSelectedBenefitId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const [empRes, benRes] = await Promise.all([
        API.get('/api/employees'),
        API.get('/api/benefits'),
      ]);
      setEmployees(empRes.data.data ?? []);
      setBenefits(benRes.data.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (emp) => {
    setEditTarget(emp);
    setForm({ name: emp.name, email: emp.email, department: emp.department, position: emp.position });
    setError('');
    setShowModal(true);
  };

  const openView = async (emp) => {
    setViewTarget(emp);
    try {
      const res = await API.get(`/api/employees/${emp.id}/benefits`);
      setEnrolledBenefits(res.data.data ?? []);
    } catch {
      setEnrolledBenefits([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editTarget) {
        await API.put(`/api/employees/${editTarget.id}`, form);
      } else {
        await API.post('/api/employees', form);
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this employee?')) return;
    await API.delete(`/api/employees/${id}`);
    fetchAll();
  };

  const handleEnroll = async () => {
    if (!selectedBenefitId || !enrollTarget) return;
    try {
      await API.post(`/api/employees/${enrollTarget.id}/enroll`, { benefitId: selectedBenefitId });
      setEnrollTarget(null);
      setSelectedBenefitId('');
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Enrollment failed');
    }
  };

  const handleUnenroll = async (empId, benefitId) => {
    await API.delete(`/api/employees/${empId}/benefits/${benefitId}`);
    setEnrolledBenefits((prev) => prev.filter((b) => b.id !== benefitId));
    fetchAll();
  };

  const filtered = employees.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.department?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter((e) => e.active).length;

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
        background: 'rgba(10,20,12,0.6)',
        border: '1px solid rgba(34,197,94,0.08)',
        borderRadius: '12px',
        padding: '14px 20px',
        backdropFilter: 'blur(8px)',
      }}>
        <div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{employees.length}</p>
          <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Total employees</p>
        </div>
        <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />
        <div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#4ade80', letterSpacing: '-0.03em' }}>{activeCount}</p>
          <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Active</p>
        </div>
        <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />
        <div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#f87171', letterSpacing: '-0.03em' }}>{employees.length - activeCount}</p>
          <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Inactive</p>
        </div>

        {/* Search + action */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#475569', pointerEvents: 'none' }} />
            <input
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', padding: '8px 12px 8px 32px',
                color: '#e2e8f0', fontSize: '13px', outline: 'none', width: '220px',
              }}
              placeholder="Search name, email, dept…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button className="btn-primary flex items-center gap-2 text-sm" onClick={openCreate}>
              <Plus className="w-4 h-4" /> Add Employee
            </button>
          )}
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
                  {['Employee', 'Department', 'Position', 'Benefits', 'Status', ...(isAdmin ? ['Actions'] : [])].map((h) => (
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
                    <td colSpan={isAdmin ? 6 : 5} style={{ padding: '48px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp, idx) => {
                    const deptCs = DEPT_COLORS[emp.department] ?? DEPT_COLORS.Engineering;
                    return (
                      <tr
                        key={emp.id}
                        style={{
                          borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.025)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {/* Employee name + avatar */}
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                              background: avatarGradient(emp.name),
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '11px', fontWeight: 700, color: 'white',
                            }}>
                              {getInitials(emp.name)}
                            </div>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', lineHeight: 1.2 }}>{emp.name}</p>
                              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{emp.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Department chip */}
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{
                            display: 'inline-block',
                            fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px',
                            color: deptCs.color, background: deptCs.bg, border: `1px solid ${deptCs.border}`,
                          }}>
                            {emp.department}
                          </span>
                        </td>

                        <td style={{ padding: '10px 16px', fontSize: '12.5px', color: '#94a3b8' }}>{emp.position}</td>

                        {/* Enrolled benefits */}
                        <td style={{ padding: '10px 16px' }}>
                          <button
                            onClick={() => openView(emp)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px',
                              fontSize: '12px', fontWeight: 600,
                              color: '#4ade80', cursor: 'pointer', background: 'none', border: 'none',
                              transition: 'color 150ms',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#86efac'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#4ade80'; }}
                          >
                            <Eye style={{ width: '13px', height: '13px' }} />
                            {emp.enrolledBenefitIds?.length ?? 0} enrolled
                          </button>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px',
                            color: emp.active ? '#4ade80' : '#64748b',
                            background: emp.active ? 'rgba(74,222,128,0.08)' : 'rgba(100,116,139,0.08)',
                            border: `1px solid ${emp.active ? 'rgba(74,222,128,0.2)' : 'rgba(100,116,139,0.15)'}`,
                          }}>
                            {emp.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Admin actions */}
                        {isAdmin && (
                          <td style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => openEdit(emp)}
                                style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', transition: 'color 150ms' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#4ade80'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
                              >
                                <Pencil style={{ width: '14px', height: '14px' }} />
                              </button>
                              <button
                                onClick={() => { setEnrollTarget(emp); setSelectedBenefitId(''); setError(''); }}
                                style={{
                                  fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '6px',
                                  color: '#4ade80', background: 'rgba(74,222,128,0.07)',
                                  border: '1px solid rgba(74,222,128,0.2)', cursor: 'pointer', transition: 'all 150ms',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(74,222,128,0.12)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(74,222,128,0.07)'; }}
                              >
                                Enroll
                              </button>
                              <button
                                onClick={() => handleDelete(emp.id)}
                                style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', transition: 'color 150ms' }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
                              >
                                <Trash2 style={{ width: '14px', height: '14px' }} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { field: 'name', label: 'Full Name', type: 'text' },
            { field: 'email', label: 'Email', type: 'email' },
            { field: 'department', label: 'Department', type: 'text' },
            { field: 'position', label: 'Position / Title', type: 'text' },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
              <input
                className="input-field"
                type={type}
                value={form[field]}
                onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                required
              />
            </div>
          ))}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400">{error}</div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
              {saving ? <Loader size="sm" /> : (editTarget ? 'Update' : 'Create Employee')}
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Enroll Modal */}
      <Modal isOpen={!!enrollTarget} onClose={() => setEnrollTarget(null)} title={`Enroll ${enrollTarget?.name}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Select Benefit</label>
            <select
              className="input-field"
              value={selectedBenefitId}
              onChange={(e) => setSelectedBenefitId(e.target.value)}
            >
              <option value="">— Choose a benefit —</option>
              {benefits.filter((b) => b.active).map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400">{error}</div>
          )}
          <div className="flex gap-3">
            <button onClick={handleEnroll} disabled={!selectedBenefitId} className="btn-primary flex-1 disabled:opacity-50">Enroll</button>
            <button onClick={() => setEnrollTarget(null)} className="btn-ghost flex-1">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* View Benefits Modal */}
      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title={`${viewTarget?.name}'s Benefits`} size="sm">
        <div className="space-y-3">
          {enrolledBenefits.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No benefits enrolled.</p>
          ) : (
            enrolledBenefits.map((benefit) => {
              const cs = { HEALTH: '#4ade80', TRANSPORT: '#38bdf8', FINANCIAL: '#a78bfa', LIFESTYLE: '#fb923c', EDUCATION: '#fbbf24' };
              return (
                <div key={benefit.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '12px 14px',
                }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{benefit.name}</p>
                    <p style={{ fontSize: '11px', color: cs[benefit.category] ?? '#64748b', marginTop: '2px', fontWeight: 600 }}>
                      {benefit.category}
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleUnenroll(viewTarget.id, benefit.id)}
                      style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'color 150ms' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
                    >
                      <X style={{ width: '15px', height: '15px' }} />
                    </button>
                  )}
                </div>
              );
            })
          )}
          <button onClick={() => setViewTarget(null)} className="btn-ghost w-full mt-2">Close</button>
        </div>
      </Modal>
    </div>
  );
}
