import React from 'react';
import { usePortfolio } from '../store/PortfolioContext';
import { HeroVideoPlayer } from './HeroVideoPlayer';

export const HeroSection: React.FC = () => {
  const { data, setCurrentPage, setIsContactOpen } = usePortfolio();
  const { headline, subheadline, primaryCta, secondaryCta } = data.hero;

  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Main Hero Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Subtle creative category kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            <span>Portfolio</span>
            <span aria-hidden="true">·</span>
            <span>2D Animator</span>
            <span aria-hidden="true">·</span>
            <span>MK Tales</span>
          </div>

          {/* Large Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
            {headline}
          </h1>

          {/* Hero Short Description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {subheadline}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-5">
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] active:bg-[#e6d200] transition-colors rounded cursor-pointer shadow-lg"
            >
              {primaryCta}
            </button>

            <button
              onClick={() => setCurrentPage('projects')}
              className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors cursor-pointer group flex items-center gap-1.5"
            >
              <span>{secondaryCta}</span>
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Dedicated Hero Video Area */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <HeroVideoPlayer />
        </div>
      </div>
    </section>
  );
};
