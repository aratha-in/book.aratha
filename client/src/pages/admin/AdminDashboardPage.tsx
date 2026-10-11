import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardMetrics, PublishingEnquiry } from '../../types';
import { 
  BookOpen, 
  Users, 
  Inbox, 
  Clock, 
  PlusCircle, 
  ArrowRight, 
  Activity, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<{
    metrics: DashboardMetrics;
    statusCounts: Record<string, number>;
    recentActivity: any[];
    recentEnquiries: PublishingEnquiry[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardMetrics().then((res) => {
      setData(res);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-ivory-300 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-[#E5DFD5]" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics, statusCounts, recentActivity, recentEnquiries } = data;

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Editorial Overview
          </h1>
          <p className="text-xs text-charcoal-500 font-mono mt-1">
            Publishing House Metrics & Intake Pipeline
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/books"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-semibold"
          >
            <PlusCircle className="w-3.5 h-3.5 text-gold-400" />
            <span>Manage Titles</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded bg-gold-500 text-charcoal-950 hover:bg-gold-400 text-xs font-bold"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Open Intake CRM</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-xl border border-[#E5DFD5] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-500 font-medium uppercase tracking-wider block">Total Catalog Titles</span>
            <div className="font-serif text-3xl font-bold text-charcoal-900 mt-1">{metrics.totalBooks}</div>
            <span className="text-[11px] text-green-700 font-mono block mt-1">
              {metrics.publishedBooks} Published • {metrics.draftBooks} Draft
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-ivory-200 text-charcoal-900 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-gold-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5DFD5] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-500 font-medium uppercase tracking-wider block">Published Authors</span>
            <div className="font-serif text-3xl font-bold text-charcoal-900 mt-1">{metrics.totalAuthors}</div>
            <span className="text-[11px] text-charcoal-500 font-mono block mt-1">Active roster profiles</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-ivory-200 text-charcoal-900 flex items-center justify-center">
            <Users className="w-6 h-6 text-gold-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5DFD5] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-500 font-medium uppercase tracking-wider block">New Enquiries</span>
            <div className="font-serif text-3xl font-bold text-charcoal-900 mt-1">{metrics.newEnquiries}</div>
            <span className="text-[11px] text-amber-700 font-mono block mt-1">Awaiting editorial triage</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5DFD5] shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-500 font-medium uppercase tracking-wider block">In Pipeline</span>
            <div className="font-serif text-3xl font-bold text-charcoal-900 mt-1">{metrics.awaitingResponse}</div>
            <span className="text-[11px] text-charcoal-500 font-mono block mt-1">Reviewing or proposal sent</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-ivory-200 text-charcoal-900 flex items-center justify-center">
            <Clock className="w-6 h-6 text-gold-600" />
          </div>
        </div>

      </div>

      {/* Intake Pipeline Status Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-[#E5DFD5] shadow-subtle space-y-4">
        <h3 className="font-serif text-base font-bold text-charcoal-900 uppercase tracking-wider">
          Enquiry Pipeline by Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { key: 'new', label: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { key: 'contacted', label: 'Contacted', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { key: 'reviewing_manuscript', label: 'Reviewing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { key: 'proposal_sent', label: 'Proposal Sent', color: 'bg-teal-50 text-teal-700 border-teal-200' },
            { key: 'accepted', label: 'Accepted', color: 'bg-green-50 text-green-700 border-green-200' },
          ].map((s) => (
            <div key={s.key} className={`p-3 rounded-lg border ${s.color} text-center`}>
              <span className="text-[11px] font-mono font-semibold block">{s.label}</span>
              <span className="font-serif text-xl font-bold block mt-1">
                {statusCounts[s.key] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Recent Enquiries & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Enquiries Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E5DFD5] shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-[#E5DFD5] flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-charcoal-900">
              Recent Submissions
            </h3>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-gold-700 hover:underline">
              View All Enquiries &rarr;
            </Link>
          </div>

          <div className="divide-y divide-[#E5DFD5]">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 hover:bg-ivory-50 transition-colors flex items-center justify-between">
                  <div className="space-y-0.5 max-w-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-charcoal-900">{enq.referenceNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-ivory-200 text-charcoal-700 font-mono uppercase">
                        {enq.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-charcoal-800 truncate">{enq.manuscriptTitle}</div>
                    <div className="text-[11px] text-gray-500">By {enq.fullName} ({enq.country})</div>
                  </div>

                  <Link
                    to={`/admin/enquiries/${enq.id}`}
                    className="p-1.5 rounded hover:bg-ivory-200 text-charcoal-700 text-xs font-semibold"
                  >
                    Manage &rarr;
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-500">
                No recent enquiries found.
              </div>
            )}
          </div>
        </div>

        {/* Audit Log Activity Stream */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5DFD5] shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-[#E5DFD5]">
            <h3 className="font-serif text-base font-bold text-charcoal-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-gold-600" />
              <span>Recent Administrative Activity</span>
            </h3>
          </div>

          <div className="divide-y divide-[#E5DFD5] max-h-96 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((log) => (
                <div key={log.id} className="p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-charcoal-900 uppercase">
                      {log.action.replace('_', ' ')} ({log.entityType})
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-gray-600 text-[11px]">
                    Target ID: <span className="font-mono">{log.entityId || 'N/A'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-500">
                No audit logs recorded yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
