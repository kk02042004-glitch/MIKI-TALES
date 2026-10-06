import React from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const AboutPreview: React.FC = () => {
  const { data, setCurrentPage } = usePortfolio();
  const { heading, shortBio } = data.about;

  return (
    <section className="py-16 sm:py-20 border-t border-white/5 bg-[#030626]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            Profile
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {heading}
          </h2>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed text-balance">
            {shortBio}
          </p>

          <div className="pt-2">
            <button
              onClick={() => setCurrentPage('about')}
              className="text-sm font-semibold text-[#ffea00] hover:text-[#fff033] transition-colors cursor-pointer group inline-flex items-center gap-1.5"
            >
              <span>More About Me</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
