import React, { useEffect, useState } from 'react';
import { PublishingService } from '../../types';
import { api } from '../../services/api';
import { Plus, Edit3, Trash2, X, CheckCircle2, Layers } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<PublishingService[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<PublishingService | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    deliverables: [''],
    pricingLabel: '',
    imageUrl: '',
    displayOrder: 1,
    isActive: true,
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await api.getServices(true);
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      title: '',
      slug: '',
      description: '',
      deliverables: ['Dedicated Senior Developmental Editor', 'Classical interior layout and cover typography'],
      pricingLabel: 'Custom Scope / Quote',
      imageUrl: '',
      displayOrder: services.length + 1,
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (service: PublishingService) => {
    setEditingService(service);
    setForm({
      title: service.title,
      slug: service.slug,
      description: service.description,
      deliverables: service.deliverables || [''],
      pricingLabel: service.pricingLabel || '',
      imageUrl: service.imageUrl || '',
      displayOrder: service.displayOrder,
      isActive: service.isActive,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleDeliverableChange = (index: number, val: string) => {
    const updated = [...form.deliverables];
    updated[index] = val;
    setForm({ ...form, deliverables: updated });
  };

  const addDeliverableField = () => {
    setForm({ ...form, deliverables: [...form.deliverables, ''] });
  };

  const removeDeliverableField = (index: number) => {
    setForm({ ...form, deliverables: form.deliverables.filter((_, i) => i !== index) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      deliverables: form.deliverables.filter((d) => d.trim().length > 0),
    };

    try {
      if (editingService) {
        await api.updateService(editingService.id, payload);
      } else {
        await api.createService(payload);
      }
      setModalOpen(false);
      loadServices();
    } catch (err: any) {
      setError(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Publishing Services CMS
          </h1>
          <p className="text-xs text-charcoal-500 font-mono mt-1">
            Configure publishing tracks, deliverables, and pricing labels
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E5DFD5] shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading services...</div>
        ) : services.length > 0 ? (
          <div className="divide-y divide-[#E5DFD5]">
            {services.map((s) => (
              <div key={s.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-ivory-50/50">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-gray-400">#{s.displayOrder}</span>
                    <h3 className="font-serif text-base font-bold text-charcoal-900">{s.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      s.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {s.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">{s.description}</p>
                  <div className="text-[11px] font-mono text-gold-700 font-semibold pt-1">
                    {s.pricingLabel || 'Custom Scope'} • {s.deliverables?.length || 0} Deliverables
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => openEditModal(s)}
                    className="px-3 py-1.5 rounded border border-[#E5DFD5] hover:bg-ivory-100 text-xs font-semibold text-charcoal-700 flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Track</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-gray-500">
            No publishing services configured.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingService ? 'Edit Publishing Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 rounded bg-red-50 text-red-700 text-xs">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">URL Anchor Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Pricing / Scope Label</label>
                <input
                  type="text"
                  placeholder="e.g. From $450 or Royalty Based"
                  value={form.pricingLabel}
                  onChange={(e) => setForm({ ...form, pricingLabel: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>

              {/* Deliverables Manager */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-charcoal-700">Deliverables & Inclusions</label>
                  <button
                    type="button"
                    onClick={addDeliverableField}
                    className="text-[11px] font-bold text-gold-700 hover:underline"
                  >
                    + Add Inclusions
                  </button>
                </div>
                {form.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleDeliverableChange(idx, e.target.value)}
                      placeholder="e.g. Bespoke typography & print galley proofs"
                      className="flex-grow p-2 rounded border border-[#E5DFD5] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeDeliverableField(idx)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="srvActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded text-gold-600 focus:ring-gold-500"
                />
                <label htmlFor="srvActive" className="font-semibold text-charcoal-800 cursor-pointer">
                  Service is active and selectable in enquiry intake
                </label>
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
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
