import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';
import { ArrowRight, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export const ProcessPage: React.FC = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    api.getPage('process').then((res) => {
      setContent(res.content);
    }).catch(console.error);
  }, []);

  const stages = content?.stages || [
    {
      step: '01',
      title: 'Submit Your Publishing Enquiry',
      description: 'Begin by submitting your project details, manuscript status, and goals through our intake portal. You can attach sample chapters or submit without uploading.'
    },
    {
      step: '02',
      title: 'Editorial Review & Appraisal',
      description: 'Our senior editorial team evaluates your manuscript concept, prose voice, narrative pacing, and readership alignment over 3 to 5 business days.'
    },
    {
      step: '03',
      title: 'Initial Consultation',
      description: 'Meet one-on-one with an assigned editor to discuss creative aspirations, target release channels, and suitable publishing tracks (traditional or assisted).'
    },
    {
      step: '04',
      title: 'Proposal, Scope & Agreement',
      description: 'We present a transparent publishing schedule specifying editorial passes, cover design directions, production specifications, and rights covenants.'
    },
    {
      step: '05',
      title: 'Developmental & Copy Editing',
      description: 'Iterative revision passes focusing on voice consistency, historical or factual precision, grammar, and typography markups.'
    },
    {
      step: '06',
      title: 'Design, Typesetting & Galleys',
      description: 'Classical typography, interior grid layouts, cover jacket creation, physical unbound proofs, and author sign-off.'
    },
    {
      step: '07',
      title: 'Publication & Global Distribution',
      description: 'Release across international bookstore catalogues, library wholesalers, Amazon KDP, Apple Books, and launch marketing outreach.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <SectionHeading
        tag="Editorial Journey"
        title="The Seven-Stage Publishing Pathway"
        subtitle="We guide authors through a deliberate, transparent publishing sequence designed to uphold publishing-house excellence from the first sentence to the printed edition."
      />

      {/* Process Timeline */}
      <div className="space-y-8">
        {stages.map((stage: any, index: number) => (
          <div
            key={stage.step}
            className="bg-white rounded-xl border border-[#E5DFD5] p-6 sm:p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-gold-600/90 shrink-0 w-16">
              {stage.step}
            </div>

            <div className="space-y-1 flex-grow">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                {stage.title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-sans max-w-3xl">
                {stage.description}
              </p>
            </div>

            <div className="shrink-0 self-end md:self-auto">
              <span className="inline-block text-[11px] font-mono font-semibold px-3 py-1 rounded bg-ivory-200 text-charcoal-800">
                Phase {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Important Disclaimer Card as required by prompt */}
      <div className="bg-ivory-50 border border-gold-300 rounded-xl p-6 sm:p-8 flex items-start space-x-4 text-xs sm:text-sm text-charcoal-700">
        <ShieldAlert className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-charcoal-900">Please Note Regarding Timelines and Deliverables</h4>
          <p className="leading-relaxed">
            Exact timelines, costs, rights arrangements, print volumes, and deliverables depend strictly on the mutually agreed publishing track (traditional curation versus assisted self-publishing) and will be formally enumerated in your signed publishing agreement.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/enquire"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-subtle"
        >
          <span>Submit Your Project to Begin Stage 01</span>
          <ArrowRight className="w-4 h-4 text-gold-400" />
        </Link>
      </div>

    </div>
  );
};
