import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublishingEnquiry, User } from '../../types';
import { api } from '../../services/api';
import { 
  ArrowLeft, 
  Clock, 
  Send, 
  UserCheck, 
  Download, 
  FileText, 
  MessageSquare, 
  History, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminEnquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [enquiry, setEnquiry] = useState<PublishingEnquiry | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Status updating
  const [status, setStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Assignee updating
  const [assignedTo, setAssignedTo] = useState('');
  const [updatingAssignee, setUpdatingAssignee] = useState(false);

  // Internal Note form
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const loadEnquiry = async () => {
    if (!id) return;
    try {
      const data = await api.getEnquiryById(id);
      setEnquiry(data);
      setStatus(data.status);
      setAssignedTo(data.assignedTo || '');
    } catch (err) {
      console.error('Failed to load enquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiry();
    // Load staff users for assignment dropdown
    api.getUsers().then(setUsers).catch(() => {
      // If user lacks permission to list users, fallback silently
    });
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    setUpdatingStatus(true);
    try {
      await api.updateEnquiryStatus(id, newStatus);
      setStatus(newStatus);
      loadEnquiry();
    } catch (err: any) {
      alert(err.message || 'Status update failed.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssigneeChange = async (userId: string) => {
    if (!id) return;
    setUpdatingAssignee(true);
    try {
      await api.assignEnquiry(id, userId || null);
      setAssignedTo(userId);
      loadEnquiry();
    } catch (err: any) {
      alert(err.message || 'Assignment failed.');
    } finally {
      setUpdatingAssignee(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !noteText.trim()) return;
    setAddingNote(true);
    try {
      await api.addEnquiryNote(id, noteText.trim());
      setNoteText('');
      loadEnquiry();
    } catch (err: any) {
      alert(err.message || 'Failed to add note.');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading || !enquiry) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-ivory-200 rounded" />
        <div className="h-24 bg-white rounded-xl" />
      </div>
    );
  }

  const allowedStatuses = [
    { value: 'new', label: 'New Submission' },
    { value: 'contacted', label: 'Author Contacted' },
    { value: 'consultation_scheduled', label: 'Consultation Scheduled' },
    { value: 'reviewing_manuscript', label: 'Reviewing Manuscript' },
    { value: 'proposal_sent', label: 'Publishing Proposal Sent' },
    { value: 'negotiation', label: 'Contract Negotiation' },
    { value: 'accepted', label: 'Accepted for Publication' },
    { value: 'rejected', label: 'Declined' },
    { value: 'completed', label: 'Project Completed' },
    { value: 'closed', label: 'Closed / Archived' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5]">
        <Link
          to="/admin/enquiries"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Enquiries</span>
        </Link>
        <span className="font-mono text-xs text-gray-500">
          Enquiry ID: {enquiry.id}
        </span>
      </div>

      {/* Primary Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 sm:p-8 shadow-subtle space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD5] pb-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-lg font-bold text-charcoal-900">
                {enquiry.referenceNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-ivory-200 text-charcoal-800">
                {enquiry.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-2">
              "{enquiry.manuscriptTitle}"
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Submitted by <strong>{enquiry.fullName}</strong> on {new Date(enquiry.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Quick status controller */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-charcoal-700">Update Status:</span>
            <select
              value={status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-bold py-2 px-3 rounded-lg border border-[#E5DFD5] bg-ivory-50 text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
            >
              {allowedStatuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Scope & Author Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          
          <div className="space-y-1">
            <span className="text-gray-400 font-mono uppercase block text-[10px]">Author Contact</span>
            <div className="font-bold text-charcoal-900 text-sm">{enquiry.fullName}</div>
            <div className="text-gray-600">{enquiry.email}</div>
            <div className="text-gray-600">{enquiry.phone}</div>
            <div className="text-gray-600">{enquiry.country}</div>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 font-mono uppercase block text-[10px]">Manuscript Scope</span>
            <div className="font-semibold text-charcoal-900">Genre: {enquiry.genre}</div>
            <div className="text-gray-600">Status: {enquiry.manuscriptStatus}</div>
            <div className="text-gray-600">Word Count: {enquiry.estimatedWordCount ? `${enquiry.estimatedWordCount.toLocaleString()} words` : 'Not specified'}</div>
            <div className="text-gray-600">Format: {enquiry.preferredFormat || 'Flexible'}</div>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 font-mono uppercase block text-[10px]">Publishing Service Track</span>
            <div className="font-bold text-charcoal-900">
              {enquiry.service?.title || 'General Publishing Inquiry'}
            </div>
            <div className="text-gray-600">Target Timeline: {enquiry.expectedTimeline || 'Flexible'}</div>
            <div className="text-gray-600">Budget Range: {enquiry.budgetRange || 'Not provided'}</div>
          </div>

          <div className="space-y-2">
            <span className="text-gray-400 font-mono uppercase block text-[10px]">Editorial Assignee</span>
            <select
              value={assignedTo}
              disabled={updatingAssignee}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full text-xs py-1.5 px-2 rounded border border-[#E5DFD5] bg-white font-medium"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role.replace('_', ' ')})</option>
              ))}
            </select>

            {enquiry.manuscriptFileId && (
              <div className="pt-2">
                <a
                  href={`/api/upload/manuscript/${enquiry.manuscriptFileId}/download`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-[11px] font-semibold"
                >
                  <Download className="w-3.5 h-3.5 text-gold-400" />
                  <span>Download Manuscript</span>
                </a>
              </div>
            )}
          </div>

        </div>

        {/* Project Description Box */}
        <div className="pt-4 border-t border-[#E5DFD5]">
          <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
            Author Project Description & Goals
          </span>
          <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed bg-ivory-50 p-4 rounded-lg border border-[#E5DFD5] whitespace-pre-line font-sans">
            {enquiry.projectDescription}
          </p>
        </div>

      </div>

      {/* Two Column Section: Internal Notes CRM & Activity History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Private Internal Notes (Staff-only, never sent to author) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5DFD5] p-6 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-gold-600" />
              <span>Confidential Internal Notes</span>
            </h3>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Staff Only</span>
          </div>

          {/* New note form */}
          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              rows={3}
              required
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add internal feedback, appraisal commentary, quotation notes, or next action items..."
              className="w-full p-3 rounded-lg border border-[#E5DFD5] text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            <button
              type="submit"
              disabled={addingNote}
              className="px-4 py-2 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-semibold disabled:opacity-50"
            >
              {addingNote ? 'Saving Note...' : 'Add Internal Note'}
            </button>
          </form>

          {/* Notes list */}
          <div className="space-y-3 pt-2">
            {enquiry.notes && enquiry.notes.length > 0 ? (
              enquiry.notes.map((n) => (
                <div key={n.id} className="p-4 rounded-lg bg-ivory-50 border border-[#E5DFD5] text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="font-bold text-charcoal-900">{n.user?.name || 'Staff Member'}</span>
                    <span className="font-mono text-[10px]">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-charcoal-800 leading-relaxed font-sans">{n.note}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 italic">
                No internal notes recorded yet for this project.
              </div>
            )}
          </div>
        </div>

        {/* Right: Activity & Communication History */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5DFD5] p-6 shadow-subtle space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 flex items-center space-x-2 border-b border-[#E5DFD5] pb-3">
            <History className="w-4 h-4 text-gold-600" />
            <span>Activity History</span>
          </h3>

          <div className="space-y-3 text-xs max-h-96 overflow-y-auto">
            {enquiry.activities && enquiry.activities.length > 0 ? (
              enquiry.activities.map((a) => (
                <div key={a.id} className="p-3 rounded border border-[#E5DFD5] bg-ivory-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-charcoal-900 uppercase text-[10px]">
                      {a.activityType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-charcoal-700 text-[11px] leading-relaxed">
                    {a.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 italic">
                No activity records logged.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
