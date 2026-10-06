import React from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const ServicesSection: React.FC = () => {
  const { data } = usePortfolio();
  const services = data.services;

  return (
    <section className="py-16 sm:py-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            Expertise
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            What I Do
          </h2>
        </div>

        {/* 3 Core Services — Minimal Typography Layout */}
        <div className="divide-y divide-white/10">
          {services.map((service) => (
            <div
              key={service.id}
              className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start group"
            >
              {/* Editorial Number */}
              <div className="md:col-span-2">
                <span className="font-mono text-sm sm:text-base text-[#ffea00] font-semibold tracking-wider">
                  {service.number}.
                </span>
              </div>

              {/* Service Title */}
              <div className="md:col-span-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-[#ffea00] transition-colors">
                  {service.title}
                </h3>
              </div>

              {/* Service Description */}
              <div className="md:col-span-6 space-y-3">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {service.description}
                </p>
                {service.highlights && service.highlights.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono">
                    {service.highlights.map((highlight, idx) => (
                      <React.Fragment key={idx}>
                        <span>{highlight}</span>
                        {idx < service.highlights.length - 1 && (
                          <span aria-hidden="true" className="text-slate-400">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
