import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublishingEnquiry } from '../../types';
import { api } from '../../services/api';
import { 
  Inbox, 
  Search, 
  Download, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<PublishingEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getEnquiries({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search,
        limit: 100,
      });
      setEnquiries(res.enquiries);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEnquiries();
  };

  const handleExportCsv = () => {
    const token = localStorage.getItem('aratha_token');
    window.open(`/api/enquiries/export/csv?token=${token}`, '_blank');
  };

  const statusBadges: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    contacted: 'bg-purple-100 text-purple-800 border-purple-200',
    consultation_scheduled: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    reviewing_manuscript: 'bg-amber-100 text-amber-800 border-amber-200',
    proposal_sent: 'bg-teal-100 text-teal-800 border-teal-200',
    negotiation: 'bg-orange-100 text-orange-800 border-orange-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="space-y-6">
      
      {/* Title & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Publishing Enquiry CRM
          </h1>
          <p className="text-xs text-charcoal-500 font-mono mt-1">
            Author intake pipeline, editorial assignment, and proposal tracking
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded bg-white border border-[#E5DFD5] hover:bg-ivory-100 text-charcoal-800 text-xs font-semibold shadow-subtle"
        >
          <FileSpreadsheet className="w-4 h-4 text-green-600" />
          <span>Export Enquiries to CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5DFD5] flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reference, author, email, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded border border-[#E5DFD5] focus:outline-none focus:ring-1 focus:ring-gold-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-medium">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded border border-[#E5DFD5] bg-white font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="consultation_scheduled">Consultation Scheduled</option>
            <option value="reviewing_manuscript">Reviewing Manuscript</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="negotiation">Negotiation</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5DFD5] shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading CRM pipeline...</div>
        ) : enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-50 text-charcoal-600 font-mono uppercase text-[11px] border-b border-[#E5DFD5]">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Author & Location</th>
                  <th className="p-4">Manuscript & Genre</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD5]">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-charcoal-900">
                      {enq.referenceNumber}
                    </td>
                    <td className="p-4 text-charcoal-500 font-mono text-[11px]">
                      {new Date(enq.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-charcoal-900">{enq.fullName}</div>
                      <div className="text-[11px] text-gray-500">{enq.email} • {enq.country}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-serif font-bold text-charcoal-900 truncate">{enq.manuscriptTitle}</div>
                      <div className="text-[11px] text-gray-500">{enq.genre} • {enq.estimatedWordCount ? `${enq.estimatedWordCount} words` : 'No count'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${statusBadges[enq.status] || 'bg-gray-100 text-gray-800'}`}>
                        {enq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-charcoal-700">
                      {enq.assignedUser?.name || <span className="text-gray-400 italic">Unassigned</span>}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/enquiries/${enq.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 font-semibold"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3 text-gold-400" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-gray-500">
            No enquiry records found matching filters.
          </div>
        )}
      </div>

    </div>
  );
};
