import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';
import { Feather, BookOpen, Compass, Award, HeartHandshake, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    api.getPage('about').then((res) => {
      setContent(res.content);
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Hero / Intro */}
      <div className="max-w-3xl">
        <SectionHeading
          tag="Editorial Heritage"
          title="About Aratha Publication"
          subtitle={content?.intro || 'Aratha Publication is an independent literary and scholarly publishing house committed to enduring words, thoughtful scholarship, and artisanal book design.'}
        />
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5DFD5] shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-xl bg-ivory-200 text-charcoal-900 flex items-center justify-center">
            <Compass className="w-6 h-6 text-gold-600" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-charcoal-900">Our Mission</h3>
          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-sans">
            {content?.mission || 'To bridge visionary writers with discerning readers through uncompromising editorial craft, ethical publishing practices, and beautiful physical books.'}
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5DFD5] shadow-subtle space-y-4">
          <div className="w-12 h-12 rounded-xl bg-ivory-200 text-charcoal-900 flex items-center justify-center">
            <Award className="w-6 h-6 text-gold-600" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-charcoal-900">Our Vision</h3>
          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-sans">
            {content?.vision || 'To build a lasting sanctuary for literature, academic thought, and narrative expression that withstands transient digital noise.'}
          </p>
        </div>
      </div>

      {/* Publishing Philosophy Section */}
      <div className="bg-charcoal-900 text-ivory-100 p-8 sm:p-14 rounded-2xl border border-charcoal-800 space-y-6">
        <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-gold-400">
          Publishing Philosophy
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold max-w-2xl leading-tight">
          A Book as an Heirloom, Not Disposable Content
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300 leading-relaxed pt-4 border-t border-charcoal-800">
          <p>
            {content?.philosophy || 'A book is not merely informational inventory; it is an enduring cultural object. Every comma, typeface selection, paper weight, and margin is an act of stewardship.'}
          </p>
          <p>
            {content?.approach || 'We treat every manuscript with bespoke attention. Rather than conveyor-belt production, our editors and typographers work intimately with authors through iterative revisions and classical typesetting.'}
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-8">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 text-center">
          Our Guiding Principles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-[#E5DFD5] text-center space-y-2">
            <h4 className="font-serif text-lg font-bold text-charcoal-900">Editorial Integrity</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We provide genuine developmental feedback and line-by-line craft to heighten each work's distinctive power.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-[#E5DFD5] text-center space-y-2">
            <h4 className="font-serif text-lg font-bold text-charcoal-900">Author Sovereignty</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Clear contracts, transparent accounting, and full respect for author vision and intellectual property.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-[#E5DFD5] text-center space-y-2">
            <h4 className="font-serif text-lg font-bold text-charcoal-900">Physical Craftsmanship</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Classic page geometry, acid-free archival stocks, and bindings made to be treasured in libraries for decades.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8 border-t border-[#E5DFD5]">
        <Link
          to="/enquire"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-subtle"
        >
          <span>Discuss Your Manuscript with Our Editors</span>
          <ArrowRight className="w-4 h-4 text-gold-400" />
        </Link>
      </div>

    </div>
  );
};
