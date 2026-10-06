import React from 'react';
import { usePortfolio } from '../store/PortfolioContext';
import { PageRoute } from '../types/portfolio';

export const Footer: React.FC = () => {
  const { data, setCurrentPage, setIsAdminOpen } = usePortfolio();
  const phone = data.contact.phone;

  const links: { label: string; page: PageRoute }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Projects', page: 'projects' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'Privacy Policy', page: 'privacy' },
  ];

  return (
    <footer className="w-full border-t border-white/5 bg-[#02041a] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand Lockup */}
        <div className="space-y-1">
          <div className="text-base font-bold tracking-tight text-white">
            {data.brand.brandName}
          </div>
          <div className="text-xs text-slate-400">
            {data.brand.creatorName} — {data.brand.profession}
          </div>
        </div>

        {/* Minimal Navigation */}
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
          {links.map((link) => (
            <button
              key={link.page}
              onClick={() => setCurrentPage(link.page)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Contact & Copyright */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-2 text-xs text-slate-400">
          <div>
            <span>Contact: </span>
            <a
              href={`tel:${phone}`}
              className="text-slate-300 hover:text-[#ffea00] transition-colors font-mono"
            >
              {phone}
            </a>
          </div>

          <div>
            <span>© {data.brand.creatorName} / {data.brand.brandName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
