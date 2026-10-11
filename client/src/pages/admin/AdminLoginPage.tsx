import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (eMail: string, pass: string) => {
    setEmail(eMail);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5DFD5] p-8 sm:p-10 shadow-book-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-charcoal-900 text-gold-400 flex items-center justify-center mx-auto border border-gold-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 tracking-tight">
            Aratha Publication CMS
          </h1>
          <p className="text-xs text-charcoal-500 font-mono">
            Authorized Editorial Staff Sign In
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-lg flex items-center space-x-2 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@aratha.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E5DFD5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </form>

        {/* Demo Fast-Login Presets */}
        <div className="pt-4 border-t border-[#E5DFD5] space-y-2.5">
          <span className="text-[11px] font-mono font-semibold uppercase text-gray-500 block text-center">
            Development Quick Fill:
          </span>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => setPreset('admin@aratha.com', 'ArathaAdmin2026!')}
              className="p-2 rounded border border-[#E5DFD5] bg-ivory-50 hover:bg-ivory-200 text-charcoal-800 font-medium text-center"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => setPreset('editor@aratha.com', 'StaffPass2026!')}
              className="p-2 rounded border border-[#E5DFD5] bg-ivory-50 hover:bg-ivory-200 text-charcoal-800 font-medium text-center"
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setPreset('crm@aratha.com', 'StaffPass2026!')}
              className="p-2 rounded border border-[#E5DFD5] bg-ivory-50 hover:bg-ivory-200 text-charcoal-800 font-medium text-center"
            >
              Enquiry CRM
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-charcoal-500 hover:underline">
            &larr; Back to Public Website
          </Link>
        </div>

      </div>

    </div>
  );
};
