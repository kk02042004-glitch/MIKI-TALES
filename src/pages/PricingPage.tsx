import React, { useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const PricingPage: React.FC = () => {
  const { data, setIsContactOpen } = usePortfolio();
  const pricing = data.pricing;
  const phone = data.contact.phone;

  // Simple quick calculator state (interactive and transparent)
  const [calcMinutes, setCalcMinutes] = useState<number>(20);
  const [includeVoice, setIncludeVoice] = useState<boolean>(false);
  const [includeScript, setIncludeScript] = useState<boolean>(false);

  const animRate = pricing.animationRatePerMinute || 400;
  const voiceRate = pricing.voiceOverRatePerMinute || 60;
  const scriptRate = pricing.scriptRatePerTwentyMinutes || 800;

  // Derive calculated totals based on standard unit formula
  const animationTotal = calcMinutes * animRate;
  const voiceTotal = includeVoice ? calcMinutes * voiceRate : 0;
  // Script is charged in 20-minute units
  const scriptUnits = Math.ceil(calcMinutes / 20);
  const scriptTotal = includeScript ? scriptUnits * scriptRate : 0;
  const grandTotal = animationTotal + voiceTotal + scriptTotal;

  return (
    <main className="py-12 sm:py-20 animate-in fade-in duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* ==================================================
            1. PAGE TITLE & TRANSPARENT NOTE
            ================================================== */}
        <section className="max-w-3xl space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            Simple & Transparent
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {pricing.pageTitle || 'Pricing'}
          </h1>
          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            {pricing.pageSubtitle ||
              'Simple and transparent pricing for professional 2D animated videos.'}
          </p>
          <div className="pt-1">
            <span className="inline-block text-xs font-mono text-[#ffea00] bg-[#000066]/70 border border-[#ffea00]/30 px-3 py-1.5 rounded">
              {pricing.note || 'The animation rate is the same for all story categories.'}
            </span>
          </div>
        </section>

        {/* ==================================================
            2. STORY TYPE PRICING & ONE SIMPLE RATE (₹400/MIN)
            ================================================== */}
        <section className="p-8 sm:p-10 bg-[#04082c] border border-white/10 rounded-lg space-y-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase block mb-1">
                Standard Pricing Model
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                One Simple Rate
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Same animation rate for all story types.
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs font-mono uppercase text-slate-400 block tracking-wider">
                2D Animation
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#ffea00] font-mono tracking-tight mt-0.5">
                ₹{animRate}
                <span className="text-sm font-sans text-slate-300 font-normal"> / minute</span>
              </div>
            </div>
          </div>

          {/* Supported Categories as simple text */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Supported Story Categories (All at ₹{animRate} / min):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pricing.storyCategories?.map((category, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-[#02051e] border border-white/10 rounded text-sm text-white font-medium flex items-center justify-between"
                >
                  <span>{category}</span>
                  <span className="text-xs font-mono text-[#ffea00]">₹{animRate}/m</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 pt-1">
              No category markups or hidden fees. Whether creating moral stories, horror animation, or cartoon shorts, the base rate is identical.
            </p>
          </div>
        </section>

        {/* ==================================================
            3. PRICE EXAMPLES & INTERACTIVE CALCULATOR
            ================================================== */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Quick Calculation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Price Examples
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              See how video duration directly translates into your animation cost.
            </p>
          </div>

          {/* 3 Reference Benchmark Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setCalcMinutes(10)}
              className={`p-5 rounded-lg border transition-all cursor-pointer ${
                calcMinutes === 10
                  ? 'bg-[#040838] border-[#ffea00] shadow-lg'
                  : 'bg-[#04082c] border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-xs font-mono text-[#ffea00] font-bold block mb-1">
                10 MINUTES
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                ₹{(10 * animRate).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-1">2D Animation</p>
            </div>

            <div
              onClick={() => setCalcMinutes(20)}
              className={`p-5 rounded-lg border transition-all cursor-pointer ${
                calcMinutes === 20
                  ? 'bg-[#040838] border-[#ffea00] shadow-lg'
                  : 'bg-[#04082c] border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-xs font-mono text-[#ffea00] font-bold block mb-1">
                20 MINUTES
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                ₹{(20 * animRate).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-1">2D Animation (Standard)</p>
            </div>

            <div
              onClick={() => setCalcMinutes(30)}
              className={`p-5 rounded-lg border transition-all cursor-pointer ${
                calcMinutes === 30
                  ? 'bg-[#040838] border-[#ffea00] shadow-lg'
                  : 'bg-[#04082c] border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-xs font-mono text-[#ffea00] font-bold block mb-1">
                30 MINUTES
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                ₹{(30 * animRate).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-1">2D Animation</p>
            </div>
          </div>

          {/* Simple Duration Selector Bar */}
          <div className="p-6 bg-[#030626] border border-white/10 rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Select Your Custom Duration: <span className="text-white font-bold">{calcMinutes} Minutes</span>
              </label>

              <div className="flex items-center gap-2">
                {[5, 10, 15, 20, 25, 30, 40].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setCalcMinutes(mins)}
                    className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                      calcMinutes === mins
                        ? 'bg-[#ffea00] text-[#000066] font-bold'
                        : 'bg-[#04082c] text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Add-on Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVoice}
                  onChange={(e) => setIncludeVoice(e.target.checked)}
                  className="rounded border-white/20 text-[#ffea00] focus:ring-0 cursor-pointer"
                />
                <span>Include Voice-Over (+₹{voiceRate}/min)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeScript}
                  onChange={(e) => setIncludeScript(e.target.checked)}
                  className="rounded border-white/20 text-[#ffea00] focus:ring-0 cursor-pointer"
                />
                <span>Include Script Writing (+₹{scriptRate} / 20 min unit)</span>
              </label>
            </div>

            {/* Total Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
              <div className="text-xs text-slate-400 font-mono">
                <span>{calcMinutes} min Animation: ₹{animationTotal.toLocaleString('en-IN')}</span>
                {includeVoice && <span> + Voice: ₹{voiceTotal.toLocaleString('en-IN')}</span>}
                {includeScript && <span> + Script ({scriptUnits} unit): ₹{scriptTotal.toLocaleString('en-IN')}</span>}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xl sm:text-2xl font-extrabold text-[#ffea00] font-mono">
                  Total: ₹{grandTotal.toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded transition-colors cursor-pointer"
                >
                  Start Project
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            4. BASIC ANIMATION RATE CARD & 5. ADD-ONS
            ================================================== */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Services & Add-Ons
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Animation & Add-On Rates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Core Animation Card */}
            <div className="p-6 sm:p-8 bg-[#040838] border-2 border-[#ffea00] rounded-lg flex flex-col justify-between shadow-xl relative">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#ffea00] font-bold block mb-1">
                    Primary Service
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    2D Animation
                  </h3>
                  <div className="text-3xl font-extrabold text-[#ffea00] font-mono mt-2">
                    ₹{animRate}
                    <span className="text-sm font-sans text-slate-300 font-normal"> / minute</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Professional 2D animated video production.
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="text-[#ffea00] font-mono font-bold">✓</span>
                    <span>Story-based 2D animation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#ffea00] font-mono font-bold">✓</span>
                    <span>Clean visual storytelling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#ffea00] font-mono font-bold">✓</span>
                    <span>Suitable for YouTube and digital content</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#ffea00] font-mono font-bold">✓</span>
                    <span>Same rate for different story categories</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded transition-colors cursor-pointer text-center"
                >
                  Let&apos;s Work Together
                </button>
              </div>
            </div>

            {/* Voice-Over Add-On */}
            <div className="p-6 sm:p-8 bg-[#04082c] border border-white/10 rounded-lg flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Optional Add-On
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    Voice-Over
                  </h3>
                  <div className="text-3xl font-extrabold text-white font-mono mt-2">
                    ₹{voiceRate}
                    <span className="text-sm font-sans text-slate-300 font-normal"> / minute</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Voice-over is charged separately from the animation.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-slate-300">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Duration Examples:
                  </span>
                  <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                    <span>10 minutes</span>
                    <span className="text-white font-semibold">₹{(10 * voiceRate).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                    <span>20 minutes</span>
                    <span className="text-white font-semibold">₹{(20 * voiceRate).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                    <span>30 minutes</span>
                    <span className="text-white font-semibold">₹{(30 * voiceRate).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <span className="text-[11px] text-slate-400 font-mono block text-center">
                  Optional service · Not included in ₹{animRate}/min
                </span>
              </div>
            </div>

            {/* Script Add-On */}
            <div className="p-6 sm:p-8 bg-[#04082c] border border-white/10 rounded-lg flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Optional Add-On
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    Script
                  </h3>
                  <div className="text-3xl font-extrabold text-white font-mono mt-2">
                    ₹{scriptRate}
                    <span className="text-sm font-sans text-slate-300 font-normal"> / 20 minutes</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Script writing is charged separately from animation.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-slate-300">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Unit Example:
                  </span>
                  <div className="flex justify-between py-1 border-b border-white/5 font-mono">
                    <span>20-minute script</span>
                    <span className="text-white font-semibold">₹{scriptRate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Pricing is calculated based on 20-minute units. Clean narrative structure and character dialogue.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <span className="text-[11px] text-slate-400 font-mono block text-center">
                  Optional service · Charged per 20 min unit
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            7. 20-MINUTE VIDEO REFERENCE EXAMPLE (CORE BENCHMARK)
            ================================================== */}
        <section className="p-8 sm:p-10 bg-[#030626] border border-white/10 rounded-lg space-y-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Main Reference
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Example — 20 Minute Video
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Clear price breakdown for a standard 20-minute YouTube animated episode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-white/10 pt-6">
            {/* Left: Itemized Formula */}
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3.5 bg-[#04082c] border border-white/10 rounded flex justify-between items-center">
                <div>
                  <span className="text-white font-bold block text-sm">2D Animation</span>
                  <span className="text-slate-400 text-[11px]">₹400 × 20 minutes</span>
                </div>
                <span className="text-base text-white font-bold">₹8,000</span>
              </div>

              <div className="p-3.5 bg-[#04082c] border border-white/10 rounded flex justify-between items-center">
                <div>
                  <span className="text-slate-300 font-semibold block text-sm">Optional Voice-Over</span>
                  <span className="text-slate-400 text-[11px]">₹60 × 20 minutes</span>
                </div>
                <span className="text-base text-slate-300 font-bold">₹1,200</span>
              </div>

              <div className="p-3.5 bg-[#04082c] border border-white/10 rounded flex justify-between items-center">
                <div>
                  <span className="text-slate-300 font-semibold block text-sm">Optional Script</span>
                  <span className="text-slate-400 text-[11px]">1 script (20 min unit)</span>
                </div>
                <span className="text-base text-slate-300 font-bold">₹800</span>
              </div>
            </div>

            {/* Right: Tier Summary */}
            <div className="p-6 bg-[#04082c] border-l-2 border-[#ffea00] rounded-r-lg space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Total Price Scenarios:
              </span>

              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-sm">
                  <span className="text-slate-300">Animation only:</span>
                  <span className="font-mono font-bold text-white text-base">₹8,000</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-sm">
                  <span className="text-slate-300">Animation + Voice:</span>
                  <span className="font-mono font-bold text-white text-base">₹9,200</span>
                </div>

                <div className="flex justify-between items-center pt-1 text-sm">
                  <span className="text-[#ffea00] font-semibold">Animation + Voice + Script:</span>
                  <span className="font-mono font-bold text-[#ffea00] text-lg">₹10,000</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10 leading-relaxed">
                Voice-over and script writing are optional add-ons. You only pay for what your project requires.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            8. SINGLE VIDEO & 9. MONTHLY PACKAGE
            ================================================== */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Production Options
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Project & Monthly Options
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Standard transparent rates applied whether ordering single episodes or regular monthly content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Video Option */}
            <div className="p-6 sm:p-8 bg-[#04082c] border border-white/10 rounded-lg flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#ffea00] uppercase tracking-wider block">
                  Per-Episode
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Single Video
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For creators who want one standalone video or pilot episode. Scoped exactly to your duration.
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Animation</span>
                    <span className="text-white font-bold">₹{animRate} / min</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Voice-Over (Optional)</span>
                    <span className="text-slate-300">₹{voiceRate} / min</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Script Writing (Optional)</span>
                    <span className="text-slate-300">₹{scriptRate} / 20 min</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded transition-colors cursor-pointer"
                >
                  Start a Project
                </button>
              </div>
            </div>

            {/* Monthly Content Option */}
            <div className="p-6 sm:p-8 bg-[#04082c] border border-white/10 rounded-lg flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#ffea00] uppercase tracking-wider block">
                  Ongoing Creator Workflow
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Monthly Content
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For creators and YouTube channels looking for regular animated content. Monthly pricing is calculated according to the total video minutes required during the month.
                </p>

                {/* Transparent Monthly Example */}
                <div className="p-4 bg-[#02051e] border border-white/10 rounded space-y-2 text-xs font-mono">
                  <span className="text-[11px] text-[#ffea00] block font-bold">
                    Example: 80 Minutes / Month
                  </span>
                  <div className="flex justify-between text-slate-300">
                    <span>80 min animation (80 × ₹{animRate})</span>
                    <span className="text-white font-semibold">₹32,000</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Optional Voice (80 × ₹{voiceRate})</span>
                    <span className="text-slate-300">₹4,800</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Optional Script (4 × ₹{scriptRate})</span>
                    <span className="text-slate-300">₹3,200</span>
                  </div>
                  <div className="flex justify-between text-[#ffea00] font-bold pt-2 border-t border-white/10">
                    <span>Total with all add-ons:</span>
                    <span>₹40,000</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Final monthly pricing depends on your total required minutes and needed add-ons.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/20 text-white hover:bg-white/5 rounded transition-colors cursor-pointer"
                >
                  Discuss Monthly Schedule
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            10. SIMPLE PRICING TABLE
            ================================================== */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Reference
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Simple Pricing Table
            </h2>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#02051e] border-b border-white/10 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="p-4 font-semibold">Service</th>
                  <th className="p-4 font-semibold">Rate</th>
                  <th className="p-4 font-semibold">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#04082c]">
                <tr>
                  <td className="p-4 font-bold text-white">2D Animation</td>
                  <td className="p-4 font-mono text-[#ffea00]">₹{animRate} / minute</td>
                  <td className="p-4 font-mono text-slate-300">20 min = ₹8,000</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Voice-Over</td>
                  <td className="p-4 font-mono text-[#ffea00]">₹{voiceRate} / minute</td>
                  <td className="p-4 font-mono text-slate-300">20 min = ₹1,200</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Script</td>
                  <td className="p-4 font-mono text-[#ffea00]">₹{scriptRate} / 20 min</td>
                  <td className="p-4 font-mono text-slate-300">20 min = ₹800</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ==================================================
            11. WHAT'S INCLUDED & 12. OPTIONAL ADD-ONS
            ================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-12">
          {/* What's Included */}
          <div className="p-6 bg-[#030626] border border-white/10 rounded-lg space-y-4">
            <span className="text-xs font-mono text-[#ffea00] uppercase tracking-wider block">
              Base Animation Service
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              What&apos;s Included
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {pricing.includedFeatures?.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-[#ffea00] font-mono font-bold">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Optional Add-Ons */}
          <div className="p-6 bg-[#030626] border border-white/10 rounded-lg space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Charged Separately
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Optional Add-Ons
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-[#04082c] border border-white/10 rounded flex justify-between items-center">
                <span className="font-semibold text-white">Voice-Over</span>
                <span className="font-mono text-[#ffea00]">₹{voiceRate} / minute</span>
              </div>
              <div className="p-3 bg-[#04082c] border border-white/10 rounded flex justify-between items-center">
                <span className="font-semibold text-white">Script Writing</span>
                <span className="font-mono text-[#ffea00]">₹{scriptRate} / 20 minutes</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Add-ons are charged separately from the base animation price.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            13. STORY CATEGORIES CONSTITUTION & 14. TRANSPARENCY
            ================================================== */}
        <section className="p-8 bg-[#04082c] border-l-2 border-[#ffea00] rounded-r-lg space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            Consistency
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            One Rate. Different Stories.
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            Whether you&apos;re creating a Moral Story, Food Cartoon Video, Horror Story or another story-based animation, the base 2D animation rate remains the same.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {pricing.storyCategories?.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#02051e] border border-white/10 text-xs font-mono text-slate-300 rounded"
              >
                {cat}: <strong className="text-white">₹{animRate}/min</strong>
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1 text-xs text-slate-400">
            <p>• Final pricing depends on the total video duration and any optional services such as voice-over and script writing.</p>
            <p>• Voice-over and script writing are charged separately from animation.</p>
          </div>
        </section>

        {/* ==================================================
            15. CALL TO ACTION & 16. CONTACT INFORMATION
            ================================================== */}
        <section className="border-t border-white/10 pt-16 pb-4 text-center space-y-6">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {pricing.ctaHeading || 'Ready to start your project?'}
            </h2>
            <p className="text-base text-slate-300">
              {pricing.ctaSubtext ||
                "Let's discuss your video requirements and create something together."}
            </p>
          </div>

          <div>
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] active:bg-[#e6d200] transition-colors rounded cursor-pointer shadow-lg inline-flex items-center justify-center"
            >
              {pricing.ctaButtonText || "Let's Work Together"}
            </button>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-400">
            <span>Direct studio contact for instant project scoping:</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Phone:</span>
              <a
                href={`tel:${phone}`}
                className="text-white font-mono hover:text-[#ffea00] transition-colors font-semibold"
              >
                {phone}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
