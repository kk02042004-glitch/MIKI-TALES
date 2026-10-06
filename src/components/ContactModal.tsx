import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const ContactModal: React.FC = () => {
  const { data, isContactOpen, setIsContactOpen } = usePortfolio();
  const { phone, email, location } = data.contact;

  const [name, setName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectType, setProjectType] = useState('2D Animation');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsContactOpen(false);
      }
    };
    if (isContactOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isContactOpen, setIsContactOpen]);

  if (!isContactOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientEmail) return;

    // Simulate clean dispatch
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setClientEmail('');
      setMessage('');
      setIsContactOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-[#04082c] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#ffea00] tracking-wider uppercase">
              Get in Touch
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Let&apos;s Work Together
            </h2>
          </div>
          <button
            onClick={() => setIsContactOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/5"
            aria-label="Close contact modal"
          >
            <span className="text-xl leading-none">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Direct Contact Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <a
              href={`tel:${phone}`}
              className="p-3 bg-[#02051e] border border-white/10 hover:border-[#ffea00]/50 rounded transition-colors block text-left"
            >
              <span className="text-slate-400 block font-mono text-[10px] uppercase">Direct Phone</span>
              <span className="text-white font-mono font-semibold text-sm hover:text-[#ffea00] block mt-0.5">
                {phone}
              </span>
            </a>

            <a
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#02051e] border border-white/10 hover:border-[#ffea00]/50 rounded transition-colors block text-left"
            >
              <span className="text-slate-400 block font-mono text-[10px] uppercase">WhatsApp Chat</span>
              <span className="text-[#ffea00] font-mono font-semibold text-sm block mt-0.5">
                +{phone}
              </span>
            </a>
          </div>

          {/* Form */}
          {isSubmitted ? (
            <div className="p-6 text-center bg-[#02051e] border border-white/10 rounded space-y-2">
              <span className="text-2xl text-[#ffea00]">✓</span>
              <h3 className="text-base font-bold text-white">Inquiry Sent Successfully</h3>
              <p className="text-xs text-slate-400">
                Thank you. Kishore Kumar will review your brief and contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-2 text-sm bg-[#02051e] border border-white/10 focus:border-[#ffea00] rounded text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase">Your Email</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-sm bg-[#02051e] border border-white/10 focus:border-[#ffea00] rounded text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase">Project Scope</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#02051e] border border-white/10 focus:border-[#ffea00] rounded text-white focus:outline-none transition-colors"
                >
                  <option value="2D Animation">2D Frame-by-Frame Animation</option>
                  <option value="Creative Video Content">Creative Animated Video / Music Video</option>
                  <option value="Storytelling & Motion">Storyboarding & Motion Design</option>
                  <option value="Character Design">Original Character Design & Model Sheet</option>
                  <option value="Other">Other Creative Commission</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-400 uppercase">Project Brief</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your timeline, animation style, and narrative goal..."
                  className="w-full px-3 py-2 text-sm bg-[#02051e] border border-white/10 focus:border-[#ffea00] rounded text-white focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] active:bg-[#e6d200] rounded transition-colors cursor-pointer"
              >
                Send Commission Inquiry
              </button>
            </form>
          )}

          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-white/5">
            Direct Studio Email: <a href={`mailto:${email}`} className="text-slate-300 hover:text-white underline">{email}</a> · {location}
          </div>
        </div>
      </div>
    </div>
  );
};
