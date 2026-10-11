import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';
import { ShieldAlert } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const slug = location.pathname.includes('terms') ? 'terms' : 'privacy';
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    api.getPage(slug).then(setPage).catch(console.error);
  }, [slug]);

  const isPrivacy = slug === 'privacy';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <SectionHeading
        tag="Legal Information & Compliance"
        title={isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'}
        subtitle="Editorial intake governance and intellectual property commitments."
      />

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start space-x-3 text-amber-900 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Draft Governance Notice:</span>
          <span>
            {page?.content?.notice || 'This document is a developmental draft outlining our privacy and manuscript handling protocols. Full executed publishing contracts govern commercial agreements.'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5DFD5] p-8 sm:p-12 shadow-subtle space-y-6 text-sm text-charcoal-800 leading-relaxed font-sans">
        
        <h3 className="font-serif text-xl font-bold text-charcoal-900">
          1. Intellectual Property & Author Copyright
        </h3>
        <p>
          Submission of an enquiry or manuscript draft to Aratha Publication does not transfer copyright, ownership, or exclusive rights. Authors remain the sole copyright owners of their literary creations.
        </p>

        <h3 className="font-serif text-xl font-bold text-charcoal-900 pt-4">
          2. Manuscript Confidentiality
        </h3>
        <p>
          All manuscript files, outlines, and author proposals submitted through our portal are stored in isolated private object storage. Files are shared exclusively with the assigned senior editorial committee and are never indexed, crawled, or made available to third parties.
        </p>

        <h3 className="font-serif text-xl font-bold text-charcoal-900 pt-4">
          3. Collection and Use of Data
        </h3>
        <p>
          Personal information (such as name, email, phone number, and location) is collected strictly to communicate regarding your publishing enquiry, prepare formal proposals, and execute publishing contracts. We do not sell or monetize author data.
        </p>

        <h3 className="font-serif text-xl font-bold text-charcoal-900 pt-4">
          4. Formal Agreements
        </h3>
        <p>
          All commercial publications under the Aratha imprint or assisted tracks are governed by individual, countersigned Publishing Agreements that clearly stipulate royalty schedules, production milestones, distribution territories, and reversion rights.
        </p>

      </div>

    </div>
  );
};
