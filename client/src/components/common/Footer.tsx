import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, ArrowUpRight, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-ivory-100 border-t border-charcoal-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-charcoal-800">
          
          {/* Column 1: Brand & Editorial Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-md bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-ivory-100 uppercase block leading-none">
                  Aratha
                </span>
                <span className="text-[10px] font-sans font-medium tracking-[0.2em] text-gold-400 uppercase block mt-1">
                  Publication House
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm pt-2">
              A sanctuary for literary prose, scholarly monographs, and visionary storytelling. 
              We craft books designed to endure in hands, hearts, and library shelves for generations.
            </p>

            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>submissions@aratha.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>100 Editorial Square, Suite 400</span>
              </div>
            </div>
          </div>

          {/* Column 2: Publishing Services */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-gold-400 mb-4">
              Publishing Services
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/services" className="hover:text-ivory-100 transition-colors">Traditional Publishing</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-ivory-100 transition-colors">Self-Publishing Assistance</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-ivory-100 transition-colors">Manuscript Evaluation</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-ivory-100 transition-colors">Editing & Proofreading</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-ivory-100 transition-colors">Book Cover Design</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-ivory-100 transition-colors">Interior Typesetting</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Press */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-gold-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/books" className="hover:text-ivory-100 transition-colors">Book Catalogue</Link>
              </li>
              <li>
                <Link to="/authors" className="hover:text-ivory-100 transition-colors">Featured Authors</Link>
              </li>
              <li>
                <Link to="/process" className="hover:text-ivory-100 transition-colors">7-Stage Publishing Process</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ivory-100 transition-colors">About Our Press</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-ivory-100 transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ivory-100 transition-colors">Contact Editorial Team</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Submissions CTA */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-gold-400 mb-4">
              Start Your Journey
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Ready to submit your manuscript for evaluation or discuss our publishing tracks?
            </p>
            <Link
              to="/enquire"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded bg-gold-500 text-charcoal-950 hover:bg-gold-400 text-xs font-bold uppercase tracking-wider transition-colors w-full justify-center"
            >
              <span>Submit Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Aratha Publication. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/admin" className="hover:text-gold-400 transition-colors flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
