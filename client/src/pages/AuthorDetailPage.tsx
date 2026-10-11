import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Author, Book } from '../types';
import { api } from '../services/api';
import { BookCard } from '../components/common/BookCard';
import { ArrowLeft, Globe, ExternalLink, BookOpen } from 'lucide-react';

export const AuthorDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthor() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getAuthorBySlug(slug);
        setAuthor(res);
      } catch (err) {
        console.error('Failed to load author profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthor();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-ivory-200 rounded" />
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-ivory-200" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-ivory-200 rounded" />
            <div className="h-4 w-32 bg-ivory-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold">Author Profile Not Found</h2>
        <Link to="/authors" className="inline-block mt-4 text-xs font-semibold uppercase text-gold-700 underline">
          &larr; Return to Authors Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back link */}
      <Link to="/authors" className="inline-flex items-center space-x-1.5 text-xs text-charcoal-500 hover:text-charcoal-900 font-mono">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Authors</span>
      </Link>

      {/* Author Bio Section */}
      <div className="bg-white rounded-2xl border border-[#E5DFD5] p-8 lg:p-12 shadow-subtle">
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-ivory-200 shadow-md shrink-0 mx-auto md:mx-0">
            <img
              src={author.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 flex-grow text-center md:text-left">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gold-600 block">
                Aratha Author Profile
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
                {author.name}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-sans max-w-3xl whitespace-pre-line">
              {author.biography}
            </p>

            {/* Social / External Links */}
            <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
              {author.websiteUrl && (
                <a
                  href={author.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal-800 hover:text-gold-700 font-mono"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Author Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Published Works by Author */}
      <div className="space-y-8">
        <div className="border-b border-[#E5DFD5] pb-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Published Works by {author.name}
          </h2>
          <p className="text-xs text-charcoal-600 mt-1">
            Titles published under the Aratha imprint.
          </p>
        </div>

        {author.books && author.books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {author.books.map((book: Book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-ivory-50 p-8 rounded-xl text-center border border-[#E5DFD5]">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-charcoal-600 font-serif italic">
              Upcoming titles by {author.name} are currently in editorial production.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
