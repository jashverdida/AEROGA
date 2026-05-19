import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Eye } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';

const emptyForm = { name: '', email: '', department: '', position: '' };

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
    if (!window.confirm('Deactivate this employee?')) return;
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

  const getBenefitName = (id) => benefits.find((b) => b.id === id)?.name ?? id;

  const filtered = employees.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input
          className="input-field max-w-xs text-sm"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isAdmin && (
          <button className="btn-primary flex items-center gap-2 text-sm ml-auto" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-12"><Loader className="py-4" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Name', 'Email', 'Department', 'Position', 'Benefits', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500 text-sm">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-white">{emp.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{emp.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{emp.department}</td>
                      <td className="px-4 py-3 text-sm text-slate-400">{emp.position}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openView(emp)}
                          className="flex items-center gap-1.5 text-xs text-aeroga-400 hover:text-aeroga-300 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {emp.enrolledBenefitIds?.length ?? 0} enrolled
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={emp.active ? 'green' : 'slate'}>{emp.active ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <>
                              <button onClick={() => openEdit(emp)} className="text-slate-500 hover:text-aeroga-400 transition-colors p-1">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setEnrollTarget(emp); setSelectedBenefitId(''); setError(''); }}
                                className="text-xs text-aeroga-400 hover:text-aeroga-300 transition-colors px-2 py-0.5 border border-aeroga-700 rounded"
                              >
                                Enroll
                              </button>
                              <button onClick={() => handleDelete(emp.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
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

      {/* Create / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'department', 'position'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 capitalize">{field}</label>
              <input
                className="input-field"
                type={field === 'email' ? 'email' : 'text'}
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
            enrolledBenefits.map((benefit) => (
              <div key={benefit.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{benefit.name}</p>
                  <p className="text-xs text-slate-400">{benefit.type}</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleUnenroll(viewTarget.id, benefit.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
          <button onClick={() => setViewTarget(null)} className="btn-ghost w-full mt-2">Close</button>
        </div>
      </Modal>
    </div>
  );
}
