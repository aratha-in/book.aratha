import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { api } from '../../services/api';
import { Plus, UserCheck, ShieldCheck, X, Check, Lock } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor' as 'super_admin' | 'editor' | 'enquiry_manager',
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.createUser(form);
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', role: 'editor' });
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    const nextState = !user.isActive;
    if (window.confirm(`Are you sure you want to ${nextState ? 'activate' : 'deactivate'} staff user "${user.name}"?`)) {
      try {
        await api.updateUser(user.id, { isActive: nextState });
        loadUsers();
      } catch (err: any) {
        alert(err.message || 'Failed to update user.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Staff & Permissions Management
          </h1>
          <p className="text-xs text-charcoal-500 font-mono mt-1">
            Role-Based Access Control (Super Admin, Editor, Enquiry Manager)
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#E5DFD5] shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading staff users...</div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-charcoal-600 font-mono uppercase text-[11px] border-b border-[#E5DFD5]">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD5]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="p-4 font-bold text-charcoal-900">
                      {u.name}
                    </td>
                    <td className="p-4 font-mono text-gray-600">
                      {u.email}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        u.role === 'super_admin' ? 'bg-gold-100 text-gold-900 border-gold-300' :
                        u.role === 'editor' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                        'bg-blue-100 text-blue-900 border-blue-300'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        u.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.isActive !== false ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                          u.isActive !== false ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {u.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-gray-500">
            No staff records found.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                Add Staff Member
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 rounded bg-red-50 text-red-700 text-xs">{error}</div>}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="staff@aratha.com"
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Temporary Password * (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Role & Permissions *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] bg-white text-xs font-medium"
                >
                  <option value="editor">Editor (Catalogue, Authors, Services, Content)</option>
                  <option value="enquiry_manager">Enquiry Manager (Intake CRM, Notes, Assignments)</option>
                  <option value="super_admin">Super Admin (All permissions & User Management)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#E5DFD5] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded border border-[#E5DFD5] text-charcoal-700 hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 font-bold"
                >
                  {saving ? 'Creating...' : 'Create Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
