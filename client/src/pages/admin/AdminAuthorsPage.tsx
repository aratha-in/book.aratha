import React, { useEffect, useState } from 'react';
import { Author } from '../../types';
import { api } from '../../services/api';
import { Plus, Edit3, Trash2, X, Upload, Globe, User } from 'lucide-react';

export const AdminAuthorsPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    biography: '',
    profileImageUrl: '',
    websiteUrl: '',
    isPublished: true,
  });

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const data = await api.getAuthors(true);
      setAuthors(data);
    } catch (err) {
      console.error('Failed to load authors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const openCreateModal = () => {
    setEditingAuthor(null);
    setForm({
      name: '',
      slug: '',
      biography: '',
      profileImageUrl: '',
      websiteUrl: '',
      isPublished: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (author: Author) => {
    setEditingAuthor(author);
    setForm({
      name: author.name,
      slug: author.slug,
      biography: author.biography,
      profileImageUrl: author.profileImageUrl || '',
      websiteUrl: author.websiteUrl || '',
      isPublished: author.isPublished,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: !editingAuthor ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      try {
        const res = await api.uploadImage(e.target.files[0]);
        setForm((prev) => ({ ...prev, profileImageUrl: res.url }));
      } catch (err: any) {
        alert(err.message || 'Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingAuthor) {
        await api.updateAuthor(editingAuthor.id, form);
      } else {
        await api.createAuthor(form);
      }
      setModalOpen(false);
      loadAuthors();
    } catch (err: any) {
      setError(err.message || 'Failed to save author.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you wish to delete author "${name}"?`)) {
      try {
        await api.deleteAuthor(id);
        loadAuthors();
      } catch (err: any) {
        alert(err.message || 'Delete failed.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Author Management CMS
          </h1>
          <p className="text-xs text-charcoal-500 font-mono mt-1">
            Maintain author roster, portraits, and literary biographies
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add New Author</span>
        </button>
      </div>

      {/* Authors Table */}
      <div className="bg-white rounded-xl border border-[#E5DFD5] shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading authors...</div>
        ) : authors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-charcoal-600 font-mono uppercase text-[11px] border-b border-[#E5DFD5]">
                <tr>
                  <th className="p-4">Portrait</th>
                  <th className="p-4">Name & Slug</th>
                  <th className="p-4">Biography</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD5]">
                {authors.map((a) => (
                  <tr key={a.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="p-4 w-16">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-ivory-200 border border-[#E5DFD5]">
                        {a.profileImageUrl ? (
                          <img src={a.profileImageUrl} alt={a.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-400 m-2.5" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-serif font-bold text-sm text-charcoal-900">{a.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">/authors/{a.slug}</div>
                    </td>
                    <td className="p-4 max-w-md">
                      <p className="text-charcoal-600 line-clamp-2 leading-relaxed">{a.biography}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        a.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {a.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(a)}
                        className="p-1.5 rounded hover:bg-ivory-200 text-charcoal-700 mr-1"
                        title="Edit author"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id, a.name)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600"
                        title="Delete author"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-gray-500">
            No authors found.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingAuthor ? 'Edit Author Profile' : 'Add New Author'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="p-3 rounded bg-red-50 text-red-700 text-xs">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={handleNameChange}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Profile Photo</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Image URL or upload below"
                    value={form.profileImageUrl}
                    onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })}
                    className="flex-grow p-2.5 rounded border border-[#E5DFD5] text-xs"
                  />
                  <label className="px-3 py-2.5 rounded bg-ivory-200 hover:bg-ivory-300 font-semibold cursor-pointer shrink-0">
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Official Website</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.websiteUrl}
                  onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Biography *</label>
                <textarea
                  required
                  rows={4}
                  value={form.biography}
                  onChange={(e) => setForm({ ...form, biography: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="authorPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded text-gold-600 focus:ring-gold-500"
                />
                <label htmlFor="authorPublished" className="font-semibold text-charcoal-800 cursor-pointer">
                  Profile is publicly visible
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
                  {saving ? 'Saving...' : 'Save Author'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
