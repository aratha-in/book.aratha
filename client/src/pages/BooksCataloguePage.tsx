import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book, Category } from '../types';
import { api } from '../services/api';
import { BookCard } from '../components/common/BookCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { Search, Filter, SlidersHorizontal, BookOpen, X } from 'lucide-react';

export const BooksCataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Filter states from URL or defaults
  const searchTerm = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedFormat = searchParams.get('format') || '';
  const selectedLanguage = searchParams.get('language') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchTerm);

  // Fetch categories on load
  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch books on filter change
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const res = await api.getBooks({
          search: searchTerm,
          category: selectedCategory,
          format: selectedFormat,
          language: selectedLanguage,
          sort: sortBy,
          page: currentPage,
          limit: 8,
          status: 'published',
        });
        setBooks(res.books);
        setTotalPages(res.totalPages);
        setTotalBooks(res.total);
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [searchTerm, selectedCategory, selectedFormat, selectedLanguage, sortBy, currentPage]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Reset to page 1 on filter changes
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = !!(searchTerm || selectedCategory || selectedFormat || selectedLanguage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div>
        <SectionHeading
          tag="Curated Editions"
          title="The Aratha Book Catalogue"
          subtitle="Explore our library of literary fiction, scholarly research, poetry, memoirs, and critical philosophies."
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-6 rounded-xl border border-[#E5DFD5] shadow-subtle space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, keyword, ISBN..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E5DFD5] bg-ivory-50 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:bg-white transition-all"
            />
          </form>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <span className="text-xs text-charcoal-600 whitespace-nowrap font-medium flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-gold-600" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => updateParam('sort', e.target.value)}
              aria-label="Sort books catalogue"
              className="py-2 px-3 rounded-lg border border-[#E5DFD5] bg-white text-xs font-medium text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-gold-500"
            >
              <option value="newest">Newest Releases</option>
              <option value="title_asc">Title (A &rarr; Z)</option>
              <option value="title_desc">Title (Z &rarr; A)</option>
            </select>
          </div>

        </div>

        {/* Filter Pills row */}
        <div className="pt-4 border-t border-[#E5DFD5] flex flex-wrap gap-3 items-center text-xs">
          
          {/* Category Filter */}
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-charcoal-700 mr-1">Category:</span>
            <button
              onClick={() => updateParam('category', '')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedCategory ? 'bg-charcoal-900 text-ivory-100' : 'bg-ivory-200 text-charcoal-700 hover:bg-ivory-300'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam('category', cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat.slug ? 'bg-charcoal-900 text-ivory-100' : 'bg-ivory-200 text-charcoal-700 hover:bg-ivory-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Additional Filters: Format & Language */}
        <div className="flex flex-wrap gap-4 items-center text-xs pt-2">
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Format:</span>
            {['Hardcover', 'Paperback', 'eBook'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => updateParam('format', selectedFormat === fmt ? '' : fmt)}
                className={`px-2.5 py-1 rounded border text-xs font-medium ${
                  selectedFormat === fmt
                    ? 'border-gold-600 bg-gold-100 text-gold-900 font-bold'
                    : 'border-[#E5DFD5] bg-white text-charcoal-700 hover:bg-ivory-100'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Language:</span>
            {['English'].map((lang) => (
              <button
                key={lang}
                onClick={() => updateParam('language', selectedLanguage === lang ? '' : lang)}
                className={`px-2.5 py-1 rounded border text-xs font-medium ${
                  selectedLanguage === lang
                    ? 'border-gold-600 bg-gold-100 text-gold-900 font-bold'
                    : 'border-[#E5DFD5] bg-white text-charcoal-700 hover:bg-ivory-100'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-auto text-xs text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-charcoal-600 px-1 font-mono">
        <span>
          Showing {books.length} of {totalBooks} publication{totalBooks === 1 ? '' : 's'}
        </span>
        {totalPages > 1 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="aspect-[2/3] bg-ivory-200 rounded-lg" />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} featured={book.isFeatured} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-[#E5DFD5] p-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-charcoal-900">No Publications Found</h3>
          <p className="text-xs text-charcoal-600 mt-2 max-w-sm mx-auto">
            We couldn't find any books matching your current search or filter combination.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-6 px-5 py-2.5 rounded bg-charcoal-900 text-ivory-100 text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-8">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateParam('page', (currentPage - 1).toString())}
            className="px-4 py-2 rounded border border-[#E5DFD5] bg-white text-xs font-medium text-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory-100"
          >
            &larr; Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updateParam('page', p.toString())}
              className={`w-9 h-9 rounded text-xs font-bold ${
                p === currentPage
                  ? 'bg-charcoal-900 text-ivory-100'
                  : 'bg-white border border-[#E5DFD5] text-charcoal-800 hover:bg-ivory-100'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => updateParam('page', (currentPage + 1).toString())}
            className="px-4 py-2 rounded border border-[#E5DFD5] bg-white text-xs font-medium text-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ivory-100"
          >
            Next &rarr;
          </button>
        </div>
      )}

    </div>
  );
};
