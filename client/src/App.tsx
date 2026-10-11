import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { BooksCataloguePage } from './pages/BooksCataloguePage';
import { BookDetailPage } from './pages/BookDetailPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { ProcessPage } from './pages/ProcessPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { EnquiryPage } from './pages/EnquiryPage';
import { LegalPage } from './pages/LegalPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminAuthorsPage } from './pages/admin/AdminAuthorsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminEnquiryDetailPage } from './pages/admin/AdminEnquiryDetailPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

// Public Layout Wrapper with Navbar & Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 text-charcoal-900 selection:bg-gold-500/20 selection:text-charcoal-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Route protection component for /admin
const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 font-mono text-xs text-charcoal-700">
        Verifying editorial credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/books" element={<BooksCataloguePage />} />
            <Route path="/books/:slug" element={<BookDetailPage />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/authors/:slug" element={<AuthorDetailPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/enquire" element={<EnquiryPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="books" element={<AdminBooksPage />} />
            <Route path="authors" element={<AdminAuthorsPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="enquiries" element={<AdminEnquiriesPage />} />
            <Route path="enquiries/:id" element={<AdminEnquiryDetailPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-ivory-100 text-center">
              <h1 className="font-serif text-4xl font-bold text-charcoal-900">404 - Folio Not Found</h1>
              <p className="text-xs text-charcoal-600 mt-2">The page or chapter you are seeking does not exist.</p>
              <a href="/" className="mt-4 px-4 py-2 rounded bg-charcoal-900 text-ivory-100 text-xs font-semibold uppercase">
                Return to Front Cover
              </a>
            </div>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
