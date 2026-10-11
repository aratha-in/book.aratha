import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { PublishingService } from '../types';
import { SectionHeading } from '../components/common/SectionHeading';
import { 
  Send, 
  CheckCircle2, 
  FileText, 
  Upload, 
  ShieldCheck, 
  AlertCircle, 
  BookOpen, 
  Clock, 
  Copy,
  Check
} from 'lucide-react';

export const EnquiryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('service') || '';

  const [services, setServices] = useState<PublishingService[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state with generated reference number
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceNumber: string;
    enquiryId: string;
    manuscriptTitle: string;
    authorName: string;
  } | null>(null);

  const [copiedRef, setCopiedRef] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    manuscriptTitle: '',
    serviceId: preselectedServiceId,
    genre: 'Literary Fiction',
    manuscriptStatus: 'Completed',
    estimatedWordCount: '',
    preferredFormat: 'Print & eBook',
    projectDescription: '',
    expectedTimeline: '3 - 6 months',
    budgetRange: '$2,500 - $5,000',
    consent: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);
  }, []);

  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setError('Manuscript file size must not exceed 25MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.consent) {
      setError('You must agree to the privacy notice before submitting your manuscript enquiry.');
      return;
    }

    setSubmitting(true);

    try {
      let manuscriptFileId: string | null = null;

      // 1. Upload manuscript file if provided
      if (selectedFile) {
        setUploadProgress(true);
        const uploadRes = await api.uploadManuscript(selectedFile);
        manuscriptFileId = uploadRes.fileId;
        setUploadProgress(false);
      }

      // 2. Submit enquiry
      const payload = {
        ...formData,
        estimatedWordCount: formData.estimatedWordCount ? parseInt(formData.estimatedWordCount, 10) : null,
        manuscriptFileId,
      };

      const result = await api.submitEnquiry(payload);

      setSubmissionSuccess({
        referenceNumber: result.referenceNumber,
        enquiryId: result.enquiryId,
        manuscriptTitle: formData.manuscriptTitle,
        authorName: formData.fullName,
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your project. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress(false);
    }
  };

  const copyReference = () => {
    if (submissionSuccess && navigator.clipboard) {
      navigator.clipboard.writeText(submissionSuccess.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submissionSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
        <div className="bg-white rounded-2xl border border-[#E5DFD5] p-8 sm:p-12 shadow-book-lg text-center space-y-6">
          
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto border border-green-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gold-600 block">
              Enquiry Formally Registered
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-2">
              Thank You, {submissionSuccess.authorName}
            </h1>
            <p className="text-sm text-charcoal-600 mt-2">
              Your publishing project, <strong>"{submissionSuccess.manuscriptTitle}"</strong>, has been securely registered in the Aratha editorial intake system.
            </p>
          </div>

          {/* Reference Badge */}
          <div className="bg-ivory-100 border border-[#E5DFD5] p-6 rounded-xl max-w-md mx-auto space-y-2">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block">
              Your Unique Enquiry Reference
            </span>
            <div className="flex items-center justify-center space-x-3">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-wider">
                {submissionSuccess.referenceNumber}
              </span>
              <button
                onClick={copyReference}
                className="p-1.5 rounded hover:bg-ivory-200 text-charcoal-700 transition-colors"
                title="Copy reference number"
              >
                {copiedRef ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 font-mono">
              Please preserve this reference for all communications with our editorial staff.
            </p>
          </div>

          {/* Next Steps Card */}
          <div className="text-left bg-ivory-50 p-6 rounded-xl border border-[#E5DFD5] space-y-4 max-w-xl mx-auto text-xs sm:text-sm">
            <h4 className="font-serif font-bold text-charcoal-900 text-base border-b border-[#E5DFD5] pb-2">
              What Happens Next:
            </h4>
            <div className="space-y-3 text-charcoal-700">
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-charcoal-900 text-ivory-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p>A confirmation email has been dispatched to your inbox detailing this submission.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-charcoal-900 text-ivory-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p>Our editorial review committee will conduct an initial appraisal within 3 to 5 business days.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-charcoal-900 text-ivory-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p>An assigned publishing editor will contact you via email or phone to schedule an exploratory consultation.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/books"
              className="px-6 py-3 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Explore Book Catalogue
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded bg-white border border-[#E5DFD5] text-charcoal-900 hover:bg-ivory-100 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Return to Homepage
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Heading */}
      <SectionHeading
        tag="Editorial Intake Portal"
        title="Publish Your Book with Aratha"
        subtitle="Submit your manuscript or concept proposal for formal evaluation. Every submission is treated with confidentiality and reviewed by our senior editorial staff."
      />

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start space-x-3 text-red-800 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5DFD5] p-8 sm:p-12 shadow-subtle space-y-8">
        
        {/* Step 1: Author Details */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-[#E5DFD5] pb-2 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-charcoal-900 text-gold-400 text-xs font-bold flex items-center justify-center">1</span>
            <span>Author & Contact Details</span>
          </h3>

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
                placeholder="e.g. Alistair Finch"
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

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 123 4567"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Country of Residence *
              </label>
              <input
                type="text"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. United Kingdom"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Project & Manuscript Details */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-[#E5DFD5] pb-2 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-charcoal-900 text-gold-400 text-xs font-bold flex items-center justify-center">2</span>
            <span>Manuscript & Scope</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Book / Manuscript Title *
              </label>
              <input
                type="text"
                name="manuscriptTitle"
                required
                value={formData.manuscriptTitle}
                onChange={handleChange}
                placeholder="Working title of your book or proposal"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Publishing Service Track
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                <option value="">General Publishing Consultation</option>
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Genre / Field *
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                <option value="Literary Fiction">Literary Fiction</option>
                <option value="Memoir & Narrative Non-Fiction">Memoir & Narrative Non-Fiction</option>
                <option value="Academic & Research">Academic & Research</option>
                <option value="Poetry & Anthologies">Poetry & Anthologies</option>
                <option value="Business & Leadership">Business & Leadership</option>
                <option value="Philosophy & Essays">Philosophy & Essays</option>
                <option value="Other / Interdisciplinary">Other / Interdisciplinary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Manuscript Status *
              </label>
              <select
                name="manuscriptStatus"
                value={formData.manuscriptStatus}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                <option value="Completed">Completed Manuscript</option>
                <option value="In Progress">In Progress (Drafting)</option>
                <option value="Outline / Proposal">Concept Outline / Book Proposal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Estimated Word Count (Optional)
              </label>
              <input
                type="number"
                name="estimatedWordCount"
                value={formData.estimatedWordCount}
                onChange={handleChange}
                placeholder="e.g. 75000"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Preferred Release Format
              </label>
              <select
                name="preferredFormat"
                value={formData.preferredFormat}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                <option value="Print & eBook">Hardcover, Paperback & eBook</option>
                <option value="Paperback & eBook">Paperback & eBook</option>
                <option value="Hardcover Edition">Deluxe Hardcover Edition</option>
                <option value="eBook Only">Digital eBook Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Expected Timeline
              </label>
              <select
                name="expectedTimeline"
                value={formData.expectedTimeline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                <option value="Immediate (< 3 months)">Immediate (&lt; 3 months)</option>
                <option value="3 - 6 months">3 - 6 months</option>
                <option value="6 - 12 months">6 - 12 months</option>
                <option value="Flexible / Long-term">Flexible / Long-term</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                Project Synopsis & Goals *
              </label>
              <textarea
                name="projectDescription"
                required
                rows={4}
                value={formData.projectDescription}
                onChange={handleChange}
                placeholder="Describe your book's core premise, target readership, themes, and your expectations from Aratha..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Optional Manuscript File Upload */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-[#E5DFD5] pb-2 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-charcoal-900 text-gold-400 text-xs font-bold flex items-center justify-center">3</span>
            <span>Manuscript Attachment (Optional)</span>
          </h3>

          <div className="border-2 border-dashed border-[#E5DFD5] rounded-xl p-6 text-center bg-ivory-50/50 hover:bg-ivory-50 transition-colors">
            <Upload className="w-8 h-8 text-gold-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-charcoal-900">
              Attach manuscript draft, sample chapters, or proposal
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Supported file types: PDF, DOCX, DOC, RTF, TXT, EPUB (Max 25MB). 
              Files are encrypted in transit and saved in private storage.
            </p>

            <label className="inline-block mt-4 px-4 py-2 rounded bg-charcoal-900 text-ivory-100 text-xs font-semibold cursor-pointer hover:bg-charcoal-800 transition-colors">
              <span>Choose File</span>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.rtf,.txt,.epub"
                className="hidden"
              />
            </label>

            {selectedFile && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-xs font-medium text-charcoal-800 bg-white p-2 rounded border border-[#E5DFD5] max-w-sm mx-auto">
                <FileText className="w-4 h-4 text-gold-600" />
                <span className="truncate">{selectedFile.name}</span>
                <span className="text-gray-400">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Privacy Consent & Submission */}
        <div className="space-y-4 pt-2">
          <div className="flex items-start space-x-3 bg-ivory-100 p-4 rounded-lg border border-[#E5DFD5]">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-[#E5DFD5] text-gold-600 focus:ring-gold-500"
            />
            <label htmlFor="consent" className="text-xs text-charcoal-700 leading-relaxed cursor-pointer">
              I consent to the Aratha Publication privacy terms. I understand that submitting this enquiry does not transfer copyright, and that all manuscript materials remain under strict editorial confidentiality.
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-md bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-subtle hover:shadow-elevated"
            >
              {submitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-gold-400" />
                  <span>{uploadProgress ? 'Encrypting & Uploading File...' : 'Registering Enquiry...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-gold-400" />
                  <span>Submit Publishing Enquiry</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
