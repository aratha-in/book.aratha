import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Feather, 
  Inbox, 
  FileText, 
  UserCheck, 
  LogOut, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, roles: ['super_admin', 'editor', 'enquiry_manager'] },
    { label: 'Enquiry CRM', href: '/admin/enquiries', icon: Inbox, roles: ['super_admin', 'editor', 'enquiry_manager'] },
    { label: 'Book Catalogue', href: '/admin/books', icon: BookOpen, roles: ['super_admin', 'editor'] },
    { label: 'Authors', href: '/admin/authors', icon: Users, roles: ['super_admin', 'editor'] },
    { label: 'Publishing Services', href: '/admin/services', icon: Layers, roles: ['super_admin', 'editor'] },
    { label: 'Content & FAQs', href: '/admin/content', icon: FileText, roles: ['super_admin', 'editor'] },
    { label: 'Staff Management', href: '/admin/users', icon: UserCheck, roles: ['super_admin'] },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col md:flex-row text-charcoal-900 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-charcoal-950 text-ivory-100 flex flex-col justify-between shrink-0 border-r border-charcoal-800">
        
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-charcoal-800">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-wider text-ivory-100 uppercase block leading-none">
                  Aratha CMS
                </span>
                <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase block mt-1">
                  Editorial Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Current User Role Pill */}
          <div className="px-6 py-4 bg-charcoal-900 border-b border-charcoal-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gold-500/30 text-gold-300 font-bold flex items-center justify-center text-xs">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-ivory-100 block truncate">{user?.name}</span>
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block">
                {user?.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              if (!hasRole(item.roles)) return null;
              const active = item.href === '/admin' 
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href);

              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                      : 'text-gray-400 hover:text-ivory-100 hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-charcoal-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded text-xs text-gray-400 hover:text-ivory-100 hover:bg-charcoal-800 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] font-mono bg-charcoal-800 px-1.5 py-0.5 rounded">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Administrative Workspace */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
