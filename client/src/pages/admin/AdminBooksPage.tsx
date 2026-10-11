import React, { useEffect, useState } from 'react';
import { Book, Author, Category } from '../../types';
import { api } from '../../services/api';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Upload, 
  Check, 
  X, 
  ExternalLink,
  Star
} from 'lucide-react';

export const AdminBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    authorId: '',
    categoryId: '',
    coverImageUrl: '',
    shortDescription: '',
    fullDescription: '',
    language: 'English',
    isbn: '',
    formats: ['Paperback', 'eBook'],
    pageCount: '',
    publicationDate: '',
    externalPurchaseUrl: '',
    isFeatured: false,
    status: 'published' as 'published' | 'draft' | 'archived',
    seoTitle: '',
    seoDescription: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksRes, authorsRes, catsRes] = await Promise.all([
        api.getBooks({ status: statusFilter === 'all' ? undefined : statusFilter, search, limit: 100 }),
        api.getAuthors(true),
        api.getCategories(),
      ]);
      setBooks(booksRes.books);
      setAuthors(authorsRes);
      setCategories(catsRes);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openCreateModal = () => {
    setEditingBook(null);
    setForm({
      title: '',
      slug: '',
      subtitle: '',
      authorId: authors[0]?.id || '',
      categoryId: categories[0]?.id || '',
      coverImageUrl: '',
      shortDescription: '',
      fullDescription: '',
      language: 'English',
      isbn: '',
      formats: ['Paperback', 'eBook'],
      pageCount: '',
      publicationDate: new Date().toISOString().split('T')[0],
      externalPurchaseUrl: '',
      isFeatured: false,
      status: 'published',
      seoTitle: '',
      seoDescription: '',
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      slug: book.slug,
      subtitle: book.subtitle || '',
      authorId: book.authorId,
      categoryId: book.categoryId,
      coverImageUrl: book.coverImageUrl || '',
      shortDescription: book.shortDescription,
      fullDescription: book.fullDescription,
      language: book.language || 'English',
      isbn: book.isbn || '',
      formats: book.formats || ['Paperback'],
      pageCount: book.pageCount ? book.pageCount.toString() : '',
      publicationDate: book.publicationDate || '',
      externalPurchaseUrl: book.externalPurchaseUrl || '',
      isFeatured: book.isFeatured,
      status: book.status,
      seoTitle: book.seoTitle || '',
      seoDescription: book.seoDescription || '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      // Auto-generate slug if creating new
      slug: !editingBook ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
    }));
  };

  const handleFormatToggle = (fmt: string) => {
    setForm((prev) => {
      const exists = prev.formats.includes(fmt);
      return {
        ...prev,
        formats: exists ? prev.formats.filter((f) => f !== fmt) : [...prev.formats, fmt],
      };
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      try {
        const res = await api.uploadImage(e.target.files[0]);
        setForm((prev) => ({ ...prev, coverImageUrl: res.url }));
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

    const payload = {
      ...form,
      pageCount: form.pageCount ? parseInt(form.pageCount, 10) : null,
    };

    try {
      if (editingBook) {
        await api.updateBook(editingBook.id, payload);
      } else {
        await api.createBook(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save publication.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you wish to delete "${title}"?`)) {
      try {
        await api.deleteBook(id);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Delete failed.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Book Catalogue CMS
          </h1>
          <p className="text-xs text-charcoal-500 font-mono mt-1">
            Publish, edit bibliographic records, and assign authors
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add New Publication</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search titles, ISBN, authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded border border-[#E5DFD5] focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded border border-[#E5DFD5] bg-white font-medium"
          >
            <option value="all">All Records</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5DFD5] shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading publications...</div>
        ) : books.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-charcoal-600 font-mono uppercase text-[11px] border-b border-[#E5DFD5]">
                <tr>
                  <th className="p-4">Cover</th>
                  <th className="p-4">Title & Details</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD5]">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="p-4 w-16">
                      <div className="w-12 h-16 rounded overflow-hidden bg-ivory-200 border border-[#E5DFD5] shrink-0">
                        {b.coverImageUrl ? (
                          <img src={b.coverImageUrl} alt={b.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                            <BookOpen className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-serif font-bold text-sm text-charcoal-900">{b.title}</div>
                      {b.subtitle && <div className="text-[11px] text-charcoal-500 italic">{b.subtitle}</div>}
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">ISBN: {b.isbn || 'Unassigned'}</div>
                    </td>
                    <td className="p-4 font-medium text-charcoal-800">
                      {b.author?.name || 'Unassigned'}
                    </td>
                    <td className="p-4 text-charcoal-600">
                      {b.category?.name || 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        b.status === 'published' ? 'bg-green-100 text-green-800' :
                        b.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {b.isFeatured ? (
                        <span className="text-gold-600 flex items-center text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-gold-500 mr-1" /> Yes
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 rounded hover:bg-ivory-200 text-charcoal-700 mr-1"
                        title="Edit record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.title)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600"
                        title="Delete publication"
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
            No publications found matching criteria.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                {editingBook ? 'Edit Publication Record' : 'Create New Book Publication'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-50 text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={handleTitleChange}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] font-mono text-xs focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Author *</label>
                  <select
                    required
                    value={form.authorId}
                    onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] bg-white text-xs"
                  >
                    <option value="">Select Author</option>
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Category *</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] bg-white text-xs"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Cover Image Upload / URL */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 mb-1">Cover Image</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Image URL or upload file below"
                      value={form.coverImageUrl}
                      onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                      className="flex-grow p-2.5 rounded border border-[#E5DFD5] text-xs"
                    />
                    <label className="px-3 py-2.5 rounded bg-ivory-200 hover:bg-ivory-300 font-semibold cursor-pointer shrink-0">
                      <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 mb-1">Short Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 mb-1">Full Description / Synopsis *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.fullDescription}
                    onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                    placeholder="978-1-..."
                    className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Page Count</label>
                  <input
                    type="number"
                    value={form.pageCount}
                    onChange={(e) => setForm({ ...form, pageCount: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Publication Date</label>
                  <input
                    type="date"
                    value={form.publicationDate}
                    onChange={(e) => setForm({ ...form, publicationDate: e.target.value })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">External Purchase URL</label>
                  <input
                    type="url"
                    value={form.externalPurchaseUrl}
                    onChange={(e) => setForm({ ...form, externalPurchaseUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                  />
                </div>

                {/* Formats Checkbox */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-charcoal-700 mb-1">Available Formats</label>
                  <div className="flex gap-4">
                    {['Hardcover', 'Paperback', 'eBook'].map((f) => (
                      <label key={f} className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.formats.includes(f)}
                          onChange={() => handleFormatToggle(f)}
                          className="rounded text-gold-600 focus:ring-gold-500"
                        />
                        <span>{f}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status & Featured */}
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Publication Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2.5 rounded border border-[#E5DFD5] bg-white text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span>Feature on Homepage ribbon</span>
                  </label>
                </div>

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
                  {saving ? 'Saving...' : editingBook ? 'Update Publication' : 'Create Publication'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
