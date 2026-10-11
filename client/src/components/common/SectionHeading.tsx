import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  tag?: string;
  centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  tag,
  centered = false,
}) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}`}>
      {tag && (
        <span className="inline-block text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase mb-2 font-mono">
          {tag}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold text-charcoal-900 tracking-tight leading-tight">
        {title}
      </h2>
      <div className={`h-0.5 w-16 bg-gold-500 my-4 ${centered ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className="text-base text-charcoal-600 leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};
