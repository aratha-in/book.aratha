import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, PublishingService, Author, Testimonial, FAQ } from '../types';
import { api } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';
import { BookCard } from '../components/common/BookCard';
import { 
  ArrowRight, 
  Feather, 
  BookOpen, 
  Award, 
  Globe, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [services, setServices] = useState<PublishingService[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [booksRes, srvRes, autRes, testRes, faqRes] = await Promise.all([
          api.getBooks({ limit: 4, status: 'published' }),
          api.getServices(),
          api.getAuthors(),
          api.getTestimonials(),
          api.getFaqs(),
        ]);
        setFeaturedBooks(booksRes.books);
        setServices(srvRes.slice(0, 6)); // Top 6 for homepage
        setAuthors(autRes.slice(0, 4));
        setTestimonials(testRes);
        setFaqs(faqRes.slice(0, 5));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-[#E5DFD5]">
        {/* Subtle background ambient texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory-50 via-ivory-100 to-ivory-200/50 -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-ivory-200 border border-[#E5DFD5] text-charcoal-800 text-xs font-semibold uppercase tracking-widest font-mono">
                <Feather className="w-3.5 h-3.5 text-gold-600" />
                <span>Premier Independent Book Publisher</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-900 tracking-tight leading-[1.12]">
                Your Story Deserves <br className="hidden sm:inline" />
                <span className="italic font-normal text-gold-700">to Be Published.</span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed font-sans max-w-xl">
                Aratha Publication is a sanctuary for serious writers, researchers, and storytellers. 
                From rigorous manuscript evaluation to classical typography and global distribution, 
                we craft books that linger in hands and minds for generations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link
                  to="/enquire"
                  className="inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-md bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-sm font-bold tracking-wider uppercase transition-all shadow-subtle hover:shadow-elevated"
                >
                  <span>Publish Your Book</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </Link>

                <Link
                  to="/books"
                  className="inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-md bg-white text-charcoal-900 hover:bg-ivory-200 border border-[#E5DFD5] text-sm font-bold tracking-wider uppercase transition-all shadow-subtle"
                >
                  <BookOpen className="w-4 h-4 text-charcoal-700" />
                  <span>Explore Book Catalogue</span>
                </Link>
              </div>

              {/* Editorial Heritage Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E5DFD5] max-w-lg">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">45+</div>
                  <div className="text-xs text-charcoal-600 font-medium mt-0.5">Curated Titles</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">100%</div>
                  <div className="text-xs text-charcoal-600 font-medium mt-0.5">Author Rights</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">40+</div>
                  <div className="text-xs text-charcoal-600 font-medium mt-0.5">Global Markets</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Book Display */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                
                {/* Book Showcase Mockup */}
                <div className="relative bg-white p-4 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-book-lg rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden book-spine-effect shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                      alt="The Silent Architecture"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold-300">Featured Literary Release</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight mt-1">The Silent Architecture</h3>
                      <p className="text-xs text-ivory-200 mt-1">By Dr. Alistair Finch</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between text-xs text-charcoal-600">
                    <span className="font-serif italic">Hardcover Edition • 384 Pages</span>
                    <Link to="/books/the-silent-architecture" className="font-semibold text-charcoal-900 hover:text-gold-700 underline">
                      View Book &rarr;
                    </Link>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -bottom-5 -left-5 bg-charcoal-900 text-ivory-100 p-4 rounded-xl border border-gold-500/40 shadow-elevated hidden sm:flex items-center space-x-3">
                  <Feather className="w-6 h-6 text-gold-400" />
                  <div>
                    <div className="text-xs font-serif font-bold">Editorial Excellence</div>
                    <div className="text-[10px] text-gray-400">Archival Paper & Hand-Set Types</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FEATURED BOOKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <SectionHeading
            tag="Curated Titles"
            title="Featured Publications"
            subtitle="Explore recent releases and distinguished works selected by the Aratha editorial board."
          />
          <Link
            to="/books"
            className="inline-flex items-center space-x-2 text-sm font-semibold uppercase tracking-wider text-charcoal-900 hover:text-gold-700 transition-colors self-start sm:self-auto mb-10 sm:mb-0"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 text-gold-500" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[2/3] bg-ivory-200 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} featured={book.isFeatured} />
            ))}
          </div>
        )}
      </section>

      {/* 3. PUBLISHING SERVICES OVERVIEW */}
      <section className="bg-ivory-50 border-y border-[#E5DFD5] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            centered
            tag="Our Publishing Craft"
            title="Tailored Pathways to Publication"
            subtitle="Whether you seek traditional editorial representation or full assisted publishing with complete rights retention, we accompany you through every stage."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-8 rounded-xl border border-[#E5DFD5] shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-ivory-200 flex items-center justify-center text-charcoal-900 mb-5">
                    <Feather className="w-5 h-5 text-gold-600" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-3 mb-6">
                    {service.description}
                  </p>
                  
                  {/* Deliverables snippet */}
                  <ul className="space-y-2 mb-6">
                    {service.deliverables?.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start text-xs text-charcoal-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 mr-2 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
                  <span className="text-xs font-semibold text-gold-700 font-mono">
                    {service.pricingLabel || 'Custom Scope'}
                  </span>
                  <Link
                    to={`/services#${service.slug}`}
                    className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 hover:text-gold-700 flex items-center space-x-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Explore All 11 Publishing Services</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. HOW PUBLISHING WORKS (7 STAGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          centered
          tag="The Roadmap"
          title="How Publishing Works at Aratha"
          subtitle="From your initial proposal to bookstores and international library catalogs, our transparent seven-stage pathway ensures your work reaches its highest potential."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            { step: '01', title: 'Intake & Submission', desc: 'Submit your book proposal or manuscript online with your project scope.' },
            { step: '02', title: 'Editorial Appraisal', desc: 'Our senior editors evaluate narrative pacing, voice, and market positioning.' },
            { step: '03', title: 'Scope & Agreement', desc: 'Transparent terms, timeline guarantees, and clear rights specifications.' },
            { step: '04', title: 'Substantive Editing', desc: 'Iterative revision passes focusing on prose clarity and stylistic precision.' },
            { step: '05', title: 'Bespoke Typography', desc: 'Custom cover design, classical interior grid layouts, and font curation.' },
            { step: '06', title: 'Galley Proofing', desc: 'Printer pre-flight verification, advance reader copies, and author sign-off.' },
            { step: '07', title: 'Release & Distribution', desc: 'ISBN allocation, global wholesale availability, and launch campaign orchestration.' },
            { step: '08', title: 'Ongoing Stewardship', desc: 'Author branding support, royalty transparency, and long-term catalogue care.' },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-lg border border-[#E5DFD5] bg-white relative">
              <span className="font-mono text-2xl font-bold text-gold-500/80 block mb-2">{item.step}</span>
              <h4 className="font-serif text-base font-bold text-charcoal-900 mb-2">{item.title}</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/process" className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 hover:text-gold-700 underline">
            Read complete publishing process documentation &rarr;
          </Link>
        </div>
      </section>

      {/* 5. WHY CHOOSE ARATHA */}
      <section className="bg-charcoal-900 text-ivory-100 py-20 rounded-2xl max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 border border-charcoal-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-gold-400">
              Editorial Stewardship
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Why Authors Partner with Aratha
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed pt-2">
              We reject formulaic self-publishing mills and impersonal conglomerates. 
              Every book published under Aratha is treated as an enduring cultural artifact.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-charcoal-800/60 border border-charcoal-700">
              <Award className="w-6 h-6 text-gold-400 mb-3" />
              <h4 className="font-serif text-base font-bold mb-1">Uncompromising Standards</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                We believe in true developmental editing, thoughtful typography, and meticulous galley proofing.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-charcoal-800/60 border border-charcoal-700">
              <Feather className="w-6 h-6 text-gold-400 mb-3" />
              <h4 className="font-serif text-base font-bold mb-1">Author Rights Retained</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                In assisted tracks, you keep 100% of your copyright, creative ownership, and net retail earnings.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-charcoal-800/60 border border-charcoal-700">
              <BookOpen className="w-6 h-6 text-gold-400 mb-3" />
              <h4 className="font-serif text-base font-bold mb-1">Artisanal Book Production</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Archival-grade paper stocks, textured jackets, foil stamping, and flawless digital ePub formatting.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-charcoal-800/60 border border-charcoal-700">
              <Globe className="w-6 h-6 text-gold-400 mb-3" />
              <h4 className="font-serif text-base font-bold mb-1">Global Retail Access</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Immediate presence on Amazon, IngramSpark, Apple Books, Kobo, and wholesale bookstore networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED AUTHORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <SectionHeading
            tag="The Voices"
            title="Our Published Authors"
            subtitle="Meet the novelists, historians, poets, and thinkers who make up the Aratha literary community."
          />
          <Link
            to="/authors"
            className="inline-flex items-center space-x-2 text-sm font-semibold uppercase tracking-wider text-charcoal-900 hover:text-gold-700 transition-colors self-start sm:self-auto mb-10 sm:mb-0"
          >
            <span>View All Authors</span>
            <ArrowRight className="w-4 h-4 text-gold-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {authors.map((author) => (
            <Link
              key={author.id}
              to={`/authors/${author.slug}`}
              className="group bg-white rounded-lg border border-[#E5DFD5] overflow-hidden p-6 text-center shadow-subtle hover:shadow-elevated transition-all"
            >
              <div className="w-24 h-24 rounded-full mx-auto overflow-hidden bg-ivory-200 border-2 border-gold-500/40 mb-4 group-hover:scale-105 transition-transform">
                <img
                  src={author.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-lg font-bold text-charcoal-900 group-hover:text-gold-700 transition-colors">
                {author.name}
              </h4>
              <p className="text-xs text-charcoal-600 line-clamp-2 mt-2 leading-relaxed">
                {author.biography}
              </p>
              <span className="inline-block mt-4 text-[11px] font-semibold uppercase tracking-wider text-gold-700 group-hover:underline">
                View Biography & Books &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. AUTHOR TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-ivory-50 border-y border-[#E5DFD5] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              centered
              tag="Author Reflections"
              title="Words from Our Writers"
              subtitle="Reflections on the editorial journey and publication craftsmanship at Aratha."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-8 rounded-xl border border-[#E5DFD5] shadow-subtle flex flex-col justify-between"
                >
                  <p className="font-serif italic text-sm text-charcoal-800 leading-relaxed mb-6">
                    "{t.testimonial}"
                  </p>
                  <div className="flex items-center space-x-3 pt-4 border-t border-[#E5DFD5]">
                    {t.imageUrl && (
                      <img
                        src={t.imageUrl}
                        alt={t.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-gold-500/40"
                      />
                    )}
                    <div>
                      <h5 className="font-serif text-sm font-bold text-charcoal-900 leading-tight">
                        {t.authorName}
                      </h5>
                      <span className="text-[11px] text-charcoal-500 block mt-0.5">
                        {t.roleOrDescription}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FREQUENTLY ASKED QUESTIONS PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          centered
          tag="Clarity & Transparency"
          title="Frequently Asked Questions"
          subtitle="Answers to common questions about manuscript evaluation, editorial tracks, rights, and timelines."
        />

        <div className="space-y-4 mt-12">
          {faqs.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-[#E5DFD5] rounded-lg overflow-hidden transition-all shadow-subtle"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-serif font-bold text-charcoal-900 hover:text-gold-700 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gold-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-charcoal-700 leading-relaxed border-t border-ivory-200 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/faq" className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 hover:text-gold-700 underline">
            View all publishing FAQs &rarr;
          </Link>
        </div>
      </section>

      {/* 9. FINAL CONSULTATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-charcoal-900 text-ivory-100 rounded-2xl p-8 sm:p-14 text-center border border-charcoal-800 shadow-elevated relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-gold-400">
              Take the First Step
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Begin Your Publishing Journey with Aratha
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
              Submit your manuscript or concept proposal today for an editorial review. 
              Our team will examine your work and respond with an actionable publishing pathway.
            </p>
            <div className="pt-2">
              <Link
                to="/enquire"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded bg-gold-500 text-charcoal-950 hover:bg-gold-400 text-sm font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                <span>Submit Publishing Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
