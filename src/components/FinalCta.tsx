import React from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const FinalCta: React.FC = () => {
  const { data, setIsContactOpen } = usePortfolio();
  const { ctaHeadline, ctaSubtext, ctaButtonText, phone } = data.contact;

  return (
    <section className="py-20 sm:py-28 border-t border-white/5 bg-[#030623]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            Collaboration
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {ctaHeadline}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-md mx-auto">
            {ctaSubtext}
          </p>
        </div>

        {/* Primary Single CTA Button */}
        <div>
          <button
            onClick={() => setIsContactOpen(true)}
            className="px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] active:bg-[#e6d200] transition-colors rounded cursor-pointer shadow-lg inline-flex items-center justify-center"
          >
            {ctaButtonText}
          </button>
        </div>

        {/* Minimal Direct Contact Info */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Phone:</span>
            <a
              href={`tel:${phone}`}
              className="text-white font-mono hover:text-[#ffea00] transition-colors"
            >
              {phone}
            </a>
          </div>

          <span className="hidden sm:inline text-slate-400" aria-hidden="true">·</span>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">WhatsApp:</span>
            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ffea00] font-mono hover:underline transition-colors"
            >
              +{phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
