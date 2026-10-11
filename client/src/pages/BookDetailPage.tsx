import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book } from '../types';
import { api } from '../services/api';
import { BookCard } from '../components/common/BookCard';
import { 
  BookOpen, 
  ExternalLink, 
  ArrowLeft, 
  Calendar, 
  Globe, 
  Bookmark, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadBook() {
      if (!slug) return;
      setLoading(true);
      try {
        const fetchedBook = await api.getBookBySlug(slug);
        setBook(fetchedBook);

        // Fetch related books in same category
        if (fetchedBook.categoryId) {
          const listRes = await api.getBooks({ category: fetchedBook.categoryId, limit: 4 });
          setRelatedBooks(listRes.books.filter((b: Book) => b.id !== fetchedBook.id));
        }
      } catch (err) {
        console.error('Failed to load book details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-ivory-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 aspect-[2/3] bg-ivory-200 rounded-xl" />
          <div className="lg:col-span-7 space-y-4">
            <div className="h-10 w-3/4 bg-ivory-200 rounded" />
            <div className="h-6 w-1/2 bg-ivory-200 rounded" />
            <div className="h-40 bg-ivory-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Publication Not Found</h2>
        <p className="text-sm text-charcoal-600 mt-2">
          The requested title is either unavailable or has been archived.
        </p>
        <Link
          to="/books"
          className="inline-block mt-6 px-6 py-2.5 rounded bg-charcoal-900 text-ivory-100 text-xs font-semibold uppercase tracking-wider"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-500 font-mono">
        <Link to="/books" className="hover:text-charcoal-900 flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Catalogue</span>
        </Link>
        <span>/</span>
        {book.category && (
          <>
            <Link to={`/books?category=${book.category.slug}`} className="hover:text-charcoal-900">
              {book.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-charcoal-900 font-semibold truncate max-w-xs">{book.title}</span>
      </nav>

      {/* Main Book Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left: Book Cover Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-md bg-white p-4 rounded-xl border border-[#E5DFD5] shadow-book-lg">
            <div className="aspect-[2/3] w-full rounded overflow-hidden book-spine-effect">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-charcoal-900 text-ivory-100 flex flex-col items-center justify-center p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gold-400 mb-4" />
                  <h3 className="font-serif text-2xl font-bold">{book.title}</h3>
                  <p className="text-xs text-gold-300 mt-2">{book.author?.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Share action */}
          <div className="mt-4 flex items-center space-x-4 text-xs text-charcoal-600">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 hover:text-gold-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Publication'}</span>
            </button>
          </div>
        </div>

        {/* Right: Book Details & Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            {book.category && (
              <span className="inline-block px-3 py-1 rounded bg-ivory-200 text-charcoal-800 text-xs font-semibold uppercase tracking-wider font-mono mb-3">
                {book.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="font-serif italic text-lg sm:text-xl text-charcoal-600 mt-2">
                {book.subtitle}
              </p>
            )}
          </div>

          {/* Author Byline Box */}
          {book.author && (
            <div className="flex items-center space-x-3 py-3 border-y border-[#E5DFD5]">
              {book.author.profileImageUrl && (
                <img
                  src={book.author.profileImageUrl}
                  alt={book.author.name}
                  className="w-11 h-11 rounded-full object-cover border border-gold-500/40"
                />
              )}
              <div>
                <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Author</span>
                <Link
                  to={`/authors/${book.author.slug}`}
                  className="font-serif text-base font-bold text-charcoal-900 hover:text-gold-700 underline"
                >
                  {book.author.name}
                </Link>
              </div>
            </div>
          )}

          {/* Synopsis */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-charcoal-900 uppercase tracking-wider">
              Synopsis
            </h3>
            <p className="text-sm sm:text-base text-charcoal-800 leading-relaxed font-sans whitespace-pre-line">
              {book.fullDescription || book.shortDescription}
            </p>
          </div>

          {/* Available Formats */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-600 block">
              Available Formats
            </span>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(book.formats) && book.formats.map((fmt: string) => (
                <div
                  key={fmt}
                  className="px-4 py-2 rounded-lg border border-[#E5DFD5] bg-white text-xs font-bold text-charcoal-900 shadow-subtle flex items-center space-x-2"
                >
                  <Bookmark className="w-3.5 h-3.5 text-gold-600" />
                  <span>{fmt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase / Enquiry CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            {book.externalPurchaseUrl ? (
              <a
                href={book.externalPurchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-subtle"
              >
                <span>Purchase from Retailer</span>
                <ExternalLink className="w-4 h-4 text-gold-400" />
              </a>
            ) : (
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-subtle"
              >
                <span>Order / Enquire Regarding This Title</span>
              </Link>
            )}

            <Link
              to="/enquire"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded bg-white text-charcoal-900 border border-[#E5DFD5] hover:bg-ivory-200 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Publish a Similar Book</span>
            </Link>
          </div>

          {/* Publication Specifications Table */}
          <div className="pt-6 border-t border-[#E5DFD5]">
            <h4 className="font-serif text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-4">
              Bibliographical Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-white p-5 rounded-lg border border-[#E5DFD5]">
              <div>
                <span className="text-gray-500 block">Publisher</span>
                <span className="font-semibold text-charcoal-900">{book.publisher || 'Aratha Publication'}</span>
              </div>
              {book.isbn && (
                <div>
                  <span className="text-gray-500 block">ISBN</span>
                  <span className="font-mono font-semibold text-charcoal-900">{book.isbn}</span>
                </div>
              )}
              {book.pageCount && (
                <div>
                  <span className="text-gray-500 block">Page Count</span>
                  <span className="font-semibold text-charcoal-900">{book.pageCount} pages</span>
                </div>
              )}
              <div>
                <span className="text-gray-500 block">Language</span>
                <span className="font-semibold text-charcoal-900">{book.language}</span>
              </div>
              {book.publicationDate && (
                <div>
                  <span className="text-gray-500 block">Publication Date</span>
                  <span className="font-semibold text-charcoal-900">{book.publicationDate}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500 block">Catalogue Status</span>
                <span className="inline-flex items-center text-green-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Published
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Related Books in Same Category */}
      {relatedBooks.length > 0 && (
        <div className="pt-16 border-t border-[#E5DFD5] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-charcoal-900">
              Related Titles in {book.category?.name}
            </h3>
            <Link to="/books" className="text-xs font-semibold uppercase tracking-wider text-gold-700 hover:underline">
              View All Catalogue &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
