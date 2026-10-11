import React, { useEffect, useState } from 'react';
import { FAQ, Testimonial } from '../../types';
import { api } from '../../services/api';
import { Plus, Edit3, Trash2, X, Check, Save } from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const [tab, setTab] = useState<'faqs' | 'testimonials' | 'settings'>('faqs');

  // FAQs State
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqModal, setFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'Publishing Options', displayOrder: 0, isPublished: true });

  // Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testModal, setTestModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Testimonial | null>(null);
  const [testForm, setTestForm] = useState({ authorName: '', roleOrDescription: '', testimonial: '', imageUrl: '', displayOrder: 0, isPublished: true });

  // Settings State
  const [heroSetting, setHeroSetting] = useState<any>({});
  const [brandSetting, setBrandSetting] = useState<any>({});
  const [settingsSaved, setSettingsSaved] = useState(false);

  const loadData = async () => {
    try {
      const [fData, tData, hData, bData] = await Promise.all([
        api.getFaqs(true),
        api.getTestimonials(true),
        api.getSetting('homepage_hero'),
        api.getSetting('brand_info'),
      ]);
      setFaqs(fData);
      setTestimonials(tData);
      if (hData.value) setHeroSetting(hData.value);
      if (bData.value) setBrandSetting(bData.value);
    } catch (err) {
      console.error('Failed to load content:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // FAQ Handlers
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.updateFaq(editingFaq.id, faqForm);
      } else {
        await api.createFaq(faqForm);
      }
      setFaqModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving FAQ');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (window.confirm('Delete this FAQ?')) {
      await api.deleteFaq(id);
      loadData();
    }
  };

  // Testimonial Handlers
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await api.updateTestimonial(editingTest.id, testForm);
      } else {
        await api.createTestimonial(testForm);
      }
      setTestModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving Testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      await api.deleteTestimonial(id);
      loadData();
    }
  };

  // Settings Handlers
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSetting('homepage_hero', heroSetting);
      await api.updateSetting('brand_info', brandSetting);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="pb-4 border-b border-[#E5DFD5]">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          CMS Content & Site Settings
        </h1>
        <p className="text-xs text-charcoal-500 font-mono mt-1">
          Manage editorial FAQs, author testimonials, homepage copy, and contact coordinates
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5DFD5] space-x-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setTab('faqs')}
          className={`pb-3 border-b-2 transition-colors ${
            tab === 'faqs' ? 'border-charcoal-900 text-charcoal-900' : 'border-transparent text-gray-400 hover:text-charcoal-800'
          }`}
        >
          Frequently Asked Questions ({faqs.length})
        </button>
        <button
          onClick={() => setTab('testimonials')}
          className={`pb-3 border-b-2 transition-colors ${
            tab === 'testimonials' ? 'border-charcoal-900 text-charcoal-900' : 'border-transparent text-gray-400 hover:text-charcoal-800'
          }`}
        >
          Author Testimonials ({testimonials.length})
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`pb-3 border-b-2 transition-colors ${
            tab === 'settings' ? 'border-charcoal-900 text-charcoal-900' : 'border-transparent text-gray-400 hover:text-charcoal-800'
          }`}
        >
          Hero Copy & Brand Settings
        </button>
      </div>

      {/* TAB 1: FAQS */}
      {tab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ question: '', answer: '', category: 'Publishing Options', displayOrder: faqs.length + 1, isPublished: true });
                setFaqModal(true);
              }}
              className="px-3.5 py-2 rounded bg-charcoal-900 text-ivory-100 text-xs font-semibold uppercase tracking-wider"
            >
              + Add FAQ Question
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E5DFD5] shadow-subtle divide-y divide-[#E5DFD5]">
            {faqs.map((f) => (
              <div key={f.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-3xl">
                  <span className="text-[10px] font-mono uppercase bg-ivory-200 px-2 py-0.5 rounded font-bold text-charcoal-700">
                    {f.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-charcoal-900 pt-1">{f.question}</h4>
                  <p className="text-xs text-charcoal-600 leading-relaxed">{f.answer}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingFaq(f);
                      setFaqForm({ question: f.question, answer: f.answer, category: f.category, displayOrder: f.displayOrder, isPublished: f.isPublished });
                      setFaqModal(true);
                    }}
                    className="p-1 text-charcoal-700 hover:text-charcoal-950"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteFaq(f.id)} className="p-1 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TESTIMONIALS */}
      {tab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingTest(null);
                setTestForm({ authorName: '', roleOrDescription: '', testimonial: '', imageUrl: '', displayOrder: testimonials.length + 1, isPublished: true });
                setTestModal(true);
              }}
              className="px-3.5 py-2 rounded bg-charcoal-900 text-ivory-100 text-xs font-semibold uppercase tracking-wider"
            >
              + Add Testimonial
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E5DFD5] shadow-subtle divide-y divide-[#E5DFD5]">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1 max-w-3xl">
                  <div className="font-bold text-sm text-charcoal-900">{t.authorName}</div>
                  <div className="text-[11px] text-gray-500 font-mono">{t.roleOrDescription}</div>
                  <p className="text-xs text-charcoal-700 italic pt-1">"{t.testimonial}"</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingTest(t);
                      setTestForm({ authorName: t.authorName, roleOrDescription: t.roleOrDescription, testimonial: t.testimonial, imageUrl: t.imageUrl || '', displayOrder: t.displayOrder, isPublished: t.isPublished });
                      setTestModal(true);
                    }}
                    className="p-1 text-charcoal-700 hover:text-charcoal-950"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SITE SETTINGS */}
      {tab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DFD5] shadow-subtle space-y-6 text-xs">
          
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-[#E5DFD5] pb-2">
              Homepage Hero Section Copy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-charcoal-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={heroSetting.headline || ''}
                  onChange={(e) => setHeroSetting({ ...heroSetting, headline: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-charcoal-700 mb-1">Subheadline Paragraph</label>
                <textarea
                  rows={3}
                  value={heroSetting.subheadline || ''}
                  onChange={(e) => setHeroSetting({ ...heroSetting, subheadline: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E5DFD5]">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-[#E5DFD5] pb-2">
              Brand Coordinates & Inquiries Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Submissions Contact Email</label>
                <input
                  type="email"
                  value={brandSetting.contactEmail || ''}
                  onChange={(e) => setBrandSetting({ ...brandSetting, contactEmail: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={brandSetting.phone || ''}
                  onChange={(e) => setBrandSetting({ ...brandSetting, phone: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-charcoal-700 mb-1">Office Address</label>
                <input
                  type="text"
                  value={brandSetting.officeAddress || ''}
                  onChange={(e) => setBrandSetting({ ...brandSetting, officeAddress: e.target.value })}
                  className="w-full p-2.5 rounded border border-[#E5DFD5] text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4 text-gold-400" />
              <span>Save Site Content & Settings</span>
            </button>
            {settingsSaved && (
              <span className="text-green-700 font-semibold flex items-center space-x-1 text-xs">
                <Check className="w-4 h-4" />
                <span>Settings persisted successfully!</span>
              </span>
            )}
          </div>

        </form>
      )}

      {/* FAQ Modal */}
      {faqModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
              <h3 className="font-serif font-bold text-lg">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h3>
              <button onClick={() => setFaqModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full p-2 rounded border border-[#E5DFD5]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full p-2 rounded border border-[#E5DFD5]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full p-2 rounded border border-[#E5DFD5]"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setFaqModal(false)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-charcoal-900 text-ivory-100 rounded font-bold">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {testModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5DFD5] max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-2">
              <h3 className="font-serif font-bold text-lg">{editingTest ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => setTestModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Author Name</label>
                <input
                  type="text"
                  required
                  value={testForm.authorName}
                  onChange={(e) => setTestForm({ ...testForm, authorName: e.target.value })}
                  className="w-full p-2 rounded border border-[#E5DFD5]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Role / Book Reference</label>
                <input
                  type="text"
                  required
                  value={testForm.roleOrDescription}
                  onChange={(e) => setTestForm({ ...testForm, roleOrDescription: e.target.value })}
                  className="w-full p-2 rounded border border-[#E5DFD5]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Testimonial Quote</label>
                <textarea
                  required
                  rows={4}
                  value={testForm.testimonial}
                  onChange={(e) => setTestForm({ ...testForm, testimonial: e.target.value })}
                  className="w-full p-2 rounded border border-[#E5DFD5]"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setTestModal(false)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-charcoal-900 text-ivory-100 rounded font-bold">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
