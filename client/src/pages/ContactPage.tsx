import React, { useState } from 'react';
import { api } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.submitContact(formData);
      setSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <SectionHeading
        tag="Reach Out"
        title="Contact the Editorial Office"
        subtitle="Have inquiries about rights, book orders, press reviews, or bespoke publishing arrangements? Reach our team directly."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5DFD5] p-8 sm:p-10 shadow-subtle space-y-6">
          <h3 className="font-serif text-2xl font-bold text-charcoal-900 border-b border-[#E5DFD5] pb-3">
            Send an Editorial Inquiry
          </h3>

          {success && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start space-x-3 text-green-800 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <span>Thank you! Your message has been dispatched to the Aratha editorial office. We will reply promptly.</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start space-x-3 text-red-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="author@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 555 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry Topic"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="How may our team assist you?"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-gold-400" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* Office Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-ivory-50 rounded-2xl border border-[#E5DFD5] p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Editorial House Details
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-charcoal-800">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gold-600 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold block text-charcoal-900">Submissions & Editorial</span>
                  <a href="mailto:submissions@aratha.com" className="hover:underline text-gold-700">
                    submissions@aratha.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold block text-charcoal-900">Editorial Address</span>
                  <span>100 Editorial Square, Suite 400</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-charcoal-900 text-ivory-100 p-8 rounded-2xl border border-charcoal-800 space-y-3">
            <h4 className="font-serif text-lg font-bold">Have a Ready Manuscript?</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              If you are seeking publishing representation, use our structured intake portal for immediate reference assignment.
            </p>
            <a
              href="/enquire"
              className="inline-block mt-2 text-xs font-bold uppercase tracking-wider text-gold-400 hover:underline"
            >
              Go to Manuscript Intake Portal &rarr;
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
