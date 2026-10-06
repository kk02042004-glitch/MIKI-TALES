import React, { useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext';
import { Logo } from './Logo';
import { PageRoute } from '../types/portfolio';

export const Header: React.FC = () => {
  const { currentPage, setCurrentPage, setIsContactOpen } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: PageRoute }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Projects', page: 'projects' },
    { label: 'Pricing', page: 'pricing' },
  ];

  const handleNavClick = (page: PageRoute) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#02051e]/90 backdrop-blur-md border-b border-white/5 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Left: Original MK Tales Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffea00] rounded-lg p-1"
          aria-label="MK Tales Homepage"
        >
          <Logo size={42} />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-white transition-colors">
              MK Tales
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-normal">
              Kishore Kumar · 2D Animator
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-150 py-1 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffea00] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button, Admin Panel Button & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsContactOpen(true)}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide uppercase text-[#000066] bg-[#ffea00] hover:bg-[#fff033] active:bg-[#e6d200] transition-colors rounded cursor-pointer whitespace-nowrap"
          >
            Let&apos;s Work Together
          </button>

          {/* Top-Right Admin Panel Button (Desktop) */}
          <button
            onClick={() => handleNavClick('admin')}
            className="hidden md:inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium tracking-wide text-slate-300 hover:text-white bg-[#04082c] hover:bg-[#000066] border border-white/20 hover:border-[#ffea00]/60 rounded transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            title="Open Admin Panel"
          >
            Admin Panel
          </button>

          {/* Simple Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current transition-transform duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-opacity duration-200 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-transform duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#04082c] border-b border-white/10 px-4 py-6 space-y-4 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`text-left py-2 text-base font-medium tracking-wide transition-colors ${
                  currentPage === item.page
                    ? 'text-[#ffea00] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsContactOpen(true);
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold tracking-wide uppercase text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded transition-colors text-center cursor-pointer"
            >
              Let&apos;s Work Together
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full py-2 px-4 text-xs font-medium text-slate-300 hover:text-white bg-[#02051e] border border-white/20 hover:border-[#ffea00]/50 rounded transition-colors text-center cursor-pointer"
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
