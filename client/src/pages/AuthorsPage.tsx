import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Author } from '../types';
import { api } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';
import { User, ArrowRight, ExternalLink } from 'lucide-react';

export const AuthorsPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuthors().then((res) => {
      setAuthors(res);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <SectionHeading
        tag="Literary Community"
        title="Authors & Contributors"
        subtitle="Meet the published novelists, scholars, historians, and poets whose books represent the editorial lineage of Aratha Publication."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-ivory-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author) => (
            <div
              key={author.id}
              className="bg-white rounded-xl border border-[#E5DFD5] p-6 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-ivory-200 border-2 border-gold-500/40 shrink-0">
                    <img
                      src={author.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900 leading-tight">
                      <Link to={`/authors/${author.slug}`} className="hover:text-gold-700 transition-colors">
                        {author.name}
                      </Link>
                    </h3>
                    {author.websiteUrl && (
                      <a
                        href={author.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold-700 hover:underline flex items-center space-x-1 mt-1 font-mono"
                      >
                        <span>Official Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-charcoal-600 line-clamp-3 leading-relaxed">
                  {author.biography}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E5DFD5]">
                <Link
                  to={`/authors/${author.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 hover:text-gold-700 flex items-center justify-between"
                >
                  <span>View Author Biography & Works</span>
                  <ArrowRight className="w-4 h-4 text-gold-500" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
