import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navLinks = [
    { label: 'Books', href: '/books' },
    { label: 'Publishing Services', href: '/services' },
    { label: 'Authors', href: '/authors' },
    { label: 'The Process', href: '/process' },
    { label: 'About Us', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory-100/95 backdrop-blur-md border-b border-[#E5DFD5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-charcoal-900 text-gold-400 flex items-center justify-center border border-gold-500/30 shadow-subtle group-hover:bg-charcoal-800 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-charcoal-900 uppercase block leading-none">
                Aratha
              </span>
              <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.2em] text-gold-600 uppercase block mt-1">
                Publication House
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm tracking-wide font-medium transition-colors hover:text-gold-600 ${
                  isActive(link.href)
                    ? 'text-charcoal-900 font-semibold border-b-2 border-gold-500 pb-0.5'
                    : 'text-charcoal-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Admin Button */}
          <div className="hidden sm:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-charcoal-900 text-gold-400 hover:bg-charcoal-800 transition-all border border-gold-500/40"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal ({user?.role?.replace('_', ' ')})</span>
              </Link>
            ) : null}

            <Link
              to="/enquire"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-md bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all shadow-subtle hover:shadow-elevated border border-charcoal-900"
            >
              <span>Publish Your Book</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              to="/enquire"
              className="px-3 py-2 rounded bg-charcoal-900 text-ivory-100 text-xs font-semibold uppercase tracking-wider"
            >
              Publish
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-charcoal-900 hover:bg-ivory-200 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory-100 border-b border-[#E5DFD5] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? 'bg-ivory-200 text-charcoal-900 font-semibold'
                  : 'text-charcoal-700 hover:bg-ivory-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#E5DFD5] space-y-2">
            <Link
              to="/enquire"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded bg-charcoal-900 text-ivory-100 text-sm font-semibold uppercase tracking-wider"
            >
              <span>Publish Your Book</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
            {isAuthenticated ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-xs font-medium text-gold-700 border border-gold-300 rounded"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Go to Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-xs text-charcoal-500 hover:underline pt-2"
              >
                Staff Portal Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
