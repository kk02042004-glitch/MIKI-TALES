import React from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { data } = usePortfolio();
  const phone = data.contact.phone;

  return (
    <main className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            Legal & Confidentiality
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Last Updated: October 2026 · MK Tales / Kishore Kumar
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              1. Creative Client Confidentiality & NDAs
            </h2>
            <p>
              At MK Tales, we respect the intellectual property and confidentiality of all original scripts, character designs, treatments, and storyboards shared with Kishore Kumar. Any project brief or creative material submitted via this website or direct correspondence is treated as strictly confidential under customary non-disclosure principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              2. Information We Collect
            </h2>
            <p>
              We only collect contact details (such as your name, email address, and project brief notes) that you explicitly provide when submitting an inquiry or contacting the studio via phone ({phone}) or email ({data.contact.email}).
            </p>
            <p>
              We do not sell, trade, or share your contact data with third-party advertising brokers or external marketing networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              3. Work-for-Hire & Copyright
            </h2>
            <p>
              All animation commissions and creative services provided by Kishore Kumar / MK Tales are governed by individual client production contracts. Copyright transfer, master file ownership, and licensing rights are established explicitly upon final milestone settlement according to mutual agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              4. Cookies & Local Storage
            </h2>
            <p>
              This website uses standard browser local storage solely to retain your client-side website state and custom portfolio configurations. No invasive tracking cookies or telemetry trackers are utilized on this portfolio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              5. Contacting the Studio
            </h2>
            <p>
              For any questions regarding this privacy policy or to discuss a project under strict NDA, please contact:
            </p>
            <div className="p-4 bg-[#02051e] border border-white/10 rounded font-mono text-xs space-y-1">
              <div>Kishore Kumar — 2D Animator (MK Tales)</div>
              <div>Phone: {phone}</div>
              <div>Email: {data.contact.email}</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
