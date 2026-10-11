import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { BookOpen, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  featured?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, featured = false }) => {
  return (
    <div className="group flex flex-col h-full bg-white rounded-lg border border-[#E5DFD5] overflow-hidden shadow-subtle hover:shadow-book transition-all duration-300">
      
      {/* Cover Container */}
      <Link 
        to={`/books/${book.slug}`} 
        className="relative aspect-[2/3] w-full bg-ivory-200 overflow-hidden book-spine-effect block"
      >
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-charcoal-900 text-ivory-100">
            <BookOpen className="w-10 h-10 text-gold-400 mb-2 opacity-80" />
            <h4 className="font-serif text-lg font-bold leading-tight">{book.title}</h4>
            <p className="text-xs text-gold-300 mt-2">{book.author?.name}</p>
          </div>
        )}

        {/* Featured Ribbon */}
        {book.isFeatured && (
          <div className="absolute top-3 right-3 bg-charcoal-900/90 text-gold-400 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold tracking-wider uppercase border border-gold-500/30 shadow flex items-center space-x-1">
            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
            <span>Featured</span>
          </div>
        )}

        {/* Category Badge on Cover */}
        {book.category && (
          <div className="absolute bottom-3 left-3 bg-white/90 text-charcoal-900 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-medium tracking-wide border border-[#E5DFD5] shadow-sm">
            {book.category.name}
          </div>
        )}
      </Link>

      {/* Book Metadata & Synopsis */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900 leading-snug group-hover:text-gold-700 transition-colors">
            <Link to={`/books/${book.slug}`}>
              {book.title}
            </Link>
          </h3>
          
          {book.subtitle && (
            <p className="text-xs text-charcoal-600 italic mt-1 font-serif line-clamp-1">
              {book.subtitle}
            </p>
          )}

          {book.author && (
            <div className="mt-2 text-xs font-medium text-gray-500">
              By{' '}
              <Link 
                to={`/authors/${book.author.slug}`} 
                className="text-charcoal-800 font-semibold hover:text-gold-600 transition-colors underline decoration-dotted"
              >
                {book.author.name}
              </Link>
            </div>
          )}

          <p className="text-xs text-charcoal-600 line-clamp-2 mt-3 leading-relaxed">
            {book.shortDescription}
          </p>
        </div>

        {/* Formats and Detail link */}
        <div className="mt-4 pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {Array.isArray(book.formats) && book.formats.map((f) => (
              <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-ivory-200 text-charcoal-700 font-mono">
                {f}
              </span>
            ))}
          </div>

          <Link
            to={`/books/${book.slug}`}
            className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 hover:text-gold-600 transition-colors"
          >
            Details &rarr;
          </Link>
        </div>

      </div>

    </div>
  );
};
