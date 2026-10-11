import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublishingService } from '../types';
import { api } from '../services/api';
import { SectionHeading } from '../components/common/SectionHeading';
import { CheckCircle2, ArrowRight, Feather, ShieldCheck } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<PublishingService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices().then((res) => {
      setServices(res);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div>
        <SectionHeading
          tag="Editorial Craft & Production"
          title="Publishing Services & Imprints"
          subtitle="Explore our comprehensive suite of editorial, typographic, and worldwide distribution services. Each offering is designed to uphold the highest publishing standards while honouring the author's voice."
        />
      </div>

      {/* Services List Grid */}
      {loading ? (
        <div className="space-y-12 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-ivory-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.slug}
              className="bg-white rounded-2xl border border-[#E5DFD5] p-8 lg:p-12 shadow-subtle hover:shadow-elevated transition-all scroll-mt-28"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Metadata & Deliverables */}
                <div className="lg:col-span-8 space-y-6">
                  
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-ivory-200 text-gold-800">
                      Service {String(index + 1).padStart(2, '0')}
                    </span>
                    {service.pricingLabel && (
                      <span className="text-xs font-semibold text-gold-700 font-mono">
                        {service.pricingLabel}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-sans max-w-2xl">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 font-mono">
                      What This Includes:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.deliverables?.map((item, idx) => (
                        <div key={idx} className="flex items-start text-xs sm:text-sm text-charcoal-800">
                          <CheckCircle2 className="w-4 h-4 text-gold-600 mr-2 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA button */}
                  <div className="pt-4 flex items-center space-x-4">
                    <Link
                      to={`/enquire?service=${service.id}`}
                      className="inline-flex items-center space-x-2 px-6 py-3 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-subtle"
                    >
                      <span>Enquire for This Service</span>
                      <ArrowRight className="w-4 h-4 text-gold-400" />
                    </Link>
                  </div>

                </div>

                {/* Right: Editorial Image Illustration */}
                <div className="lg:col-span-4">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E5DFD5] shadow-subtle bg-ivory-200 relative">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-charcoal-700">
                        <Feather className="w-10 h-10 text-gold-600 mb-2" />
                        <span className="font-serif font-bold text-sm">{service.title}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consultation Banner */}
      <div className="bg-ivory-50 border border-[#E5DFD5] rounded-xl p-8 sm:p-12 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-charcoal-900">
          Unsure Which Publishing Track Fits Your Manuscript?
        </h3>
        <p className="text-sm text-charcoal-600 max-w-xl mx-auto">
          Our senior editors are glad to evaluate your sample pages and advise whether traditional representation, assisted production, or an editorial evaluation is best.
        </p>
        <Link
          to="/enquire"
          className="inline-block mt-4 px-7 py-3.5 rounded bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Request an Editorial Consultation
        </Link>
      </div>

    </div>
  );
};
