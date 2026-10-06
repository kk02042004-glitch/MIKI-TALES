import React, { useState, useRef } from 'react';
import { usePortfolio } from '../store/PortfolioContext';
import { Logo } from './Logo';

export const AdminModal: React.FC = () => {
  const {
    data,
    updateData,
    resetToDefaults,
    exportConfigJson,
    importConfigJson,
    isAdminOpen,
    setIsAdminOpen,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    'countdown' | 'brand' | 'hero' | 'projects' | 'about' | 'pricing' | 'contact' | 'backup'
  >('countdown');

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const heroVideoFileInputRef = useRef<HTMLInputElement>(null);
  const heroPosterFileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const aboutPhotoInputRef = useRef<HTMLInputElement>(null);
  const aboutVideoInputRef = useRef<HTMLInputElement>(null);
  const projectsFeaturedVideoInputRef = useRef<HTMLInputElement>(null);
  const projectsFeaturedPosterInputRef = useRef<HTMLInputElement>(null);

  if (!isAdminOpen) return null;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      updateData((prev) => ({
        ...prev,
        brand: { ...prev.brand, customLogoUrl: result },
      }));
      showStatus('Custom logo uploaded and applied.');
    };
    reader.readAsDataURL(file);
  };

  // Handle Hero Video Upload
  const handleHeroVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    updateData((prev) => ({
      ...prev,
      heroVideo: {
        ...prev.heroVideo,
        videoUrl: objectUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        isCustomUploaded: true,
      },
    }));
    showStatus('Hero video uploaded.');
  };

  // Handle Hero Poster Upload
  const handleHeroPosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      updateData((prev) => ({
        ...prev,
        heroVideo: { ...prev.heroVideo, posterUrl: result },
      }));
      showStatus('Hero poster image updated.');
    };
    reader.readAsDataURL(file);
  };

  // Handle About Photo Upload
  const handleAboutPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      updateData((prev) => ({
        ...prev,
        about: { ...prev.about, photoUrl: result },
      }));
      showStatus('Personal photo uploaded and updated.');
    };
    reader.readAsDataURL(file);
  };

  // Handle About Video Upload
  const handleAboutVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    updateData((prev) => ({
      ...prev,
      about: { ...prev.about, videoUrl: objectUrl },
    }));
    showStatus('Personal intro video uploaded.');
  };

  // Handle Projects Page Featured Video Upload
  const handleProjectsFeaturedVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    updateData((prev) => ({
      ...prev,
      projectsPage: {
        ...prev.projectsPage,
        featuredVideo: {
          ...prev.projectsPage.featuredVideo,
          videoUrl: objectUrl,
        },
      },
    }));
    showStatus('Projects page featured video uploaded.');
  };

  // Handle Projects Page Featured Poster Upload
  const handleProjectsFeaturedPosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      updateData((prev) => ({
        ...prev,
        projectsPage: {
          ...prev.projectsPage,
          featuredVideo: {
            ...prev.projectsPage.featuredVideo,
            posterUrl: result,
          },
        },
      }));
      showStatus('Projects featured video poster updated.');
    };
    reader.readAsDataURL(file);
  };

  // Quick preset helper for countdown
  const setCountdownDaysAhead = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(10, 0, 0, 0);
    updateData((prev) => ({
      ...prev,
      countdown: {
        ...prev.countdown,
        targetDate: d.toISOString(),
      },
    }));
    showStatus(`Countdown set to ${days} days from today.`);
  };

  // Format date for datetime-local input
  const getDatetimeLocalValue = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    } catch {
      return '';
    }
  };

  const handleDatetimeChange = (val: string) => {
    if (!val) return;
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      updateData((prev) => ({
        ...prev,
        countdown: {
          ...prev.countdown,
          targetDate: d.toISOString(),
        },
      }));
    }
  };

  // Handle JSON config file import
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const text = uploadEvent.target?.result as string;
      const success = importConfigJson(text);
      if (success) {
        showStatus('Configuration imported successfully!');
      } else {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl bg-[#04082c] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#02051e]">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>MK Tales Content Admin</span>
                <span className="text-[10px] font-mono bg-[#ffea00] text-[#000066] font-bold px-1.5 py-0.5 rounded">
                  LIVE CMS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage website media, videos, copy, and countdown without editing code.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/5"
            aria-label="Close Admin Modal"
          >
            <span className="text-xl leading-none">✕</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-[#ffea00] text-[#000066] px-6 py-1.5 text-xs font-semibold tracking-wide text-center">
            {statusMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-[#030623] px-4 gap-2 text-xs font-medium scrollbar-none">
          {[
            { id: 'countdown', label: '1. Countdown Bar' },
            { id: 'brand', label: '2. Brand & Logo' },
            { id: 'hero', label: '3. Hero & Video' },
            { id: 'projects', label: '4. Selected Projects' },
            { id: 'about', label: '5. About & Services' },
            { id: 'pricing', label: '6. Pricing Rates' },
            { id: 'contact', label: '7. Contact & Phone' },
            { id: 'backup', label: '8. Backup & Export' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#ffea00] text-[#ffea00] font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: COUNTDOWN */}
          {activeTab === 'countdown' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-white text-sm">
                    Enable Top Countdown Bar
                  </label>
                  <input
                    type="checkbox"
                    checked={data.countdown.isEnabled}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        countdown: { ...prev.countdown, isEnabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 accent-[#ffea00] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Countdown Label</label>
                  <input
                    type="text"
                    value={data.countdown.label}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        countdown: { ...prev.countdown, label: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none focus:border-[#ffea00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">
                    Target Date & Time (Live JS Countdown)
                  </label>
                  <input
                    type="datetime-local"
                    value={getDatetimeLocalValue(data.countdown.targetDate)}
                    onChange={(e) => handleDatetimeChange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none focus:border-[#ffea00]"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Current ISO Target: {data.countdown.targetDate}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="text-slate-400 block font-mono mb-2">Quick Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCountdownDaysAhead(7)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white cursor-pointer"
                    >
                      +7 Days
                    </button>
                    <button
                      onClick={() => setCountdownDaysAhead(14)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white cursor-pointer"
                    >
                      +14 Days (Default)
                    </button>
                    <button
                      onClick={() => setCountdownDaysAhead(30)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white cursor-pointer"
                    >
                      +30 Days
                    </button>
                    <button
                      onClick={() => setCountdownDaysAhead(60)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white cursor-pointer"
                    >
                      +60 Days
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRAND & LOGO */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <div className="flex items-center gap-4">
                  <Logo size={64} />
                  <div>
                    <h3 className="text-sm font-bold text-white">MK Tales Official Logo</h3>
                    <p className="text-xs text-slate-400">
                      {data.brand.customLogoUrl
                        ? 'Using uploaded custom logo file.'
                        : 'Using original MK Tales vector emblem (Deep navy blue #000066 + Bright yellow #FFFF00).'}
                    </p>
                  </div>
                </div>

                {/* Logo file input */}
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => logoFileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#ffea00] text-[#000066] font-semibold rounded hover:bg-[#fff033] cursor-pointer"
                  >
                    Upload / Replace Logo File (PNG/SVG)
                  </button>

                  {data.brand.customLogoUrl && (
                    <button
                      onClick={() => {
                        updateData((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, customLogoUrl: '' },
                        }));
                        showStatus('Reset to default MK Tales vector logo.');
                      }}
                      className="px-4 py-2 border border-white/20 text-slate-300 hover:text-white rounded cursor-pointer"
                    >
                      Reset to Default MK Tales Vector
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Brand Name</label>
                    <input
                      type="text"
                      value={data.brand.brandName}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, brandName: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Creator Name</label>
                    <input
                      type="text"
                      value={data.brand.creatorName}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, creatorName: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Profession</label>
                    <input
                      type="text"
                      value={data.brand.profession}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, profession: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HERO & VIDEO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              {/* Copy fields */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Hero Copy</h3>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Main Headline</label>
                  <input
                    type="text"
                    value={data.hero.headline}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, headline: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none focus:border-[#ffea00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Hero Subheadline</label>
                  <textarea
                    rows={2}
                    value={data.hero.subheadline}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subheadline: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none focus:border-[#ffea00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Primary CTA Text</label>
                    <input
                      type="text"
                      value={data.hero.primaryCta}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, primaryCta: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Secondary CTA Link Text</label>
                    <input
                      type="text"
                      value={data.hero.secondaryCta}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryCta: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Video Media Management */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Hero Video Media Container</h3>
                <p className="text-xs text-slate-400">
                  Upload your original .mp4 or .webm animation reel file or paste a video link.
                </p>

                <input
                  type="file"
                  ref={heroVideoFileInputRef}
                  onChange={handleHeroVideoUpload}
                  accept="video/mp4,video/webm"
                  className="hidden"
                />

                <input
                  type="file"
                  ref={heroPosterFileInputRef}
                  onChange={handleHeroPosterUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => heroVideoFileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#ffea00] text-[#000066] font-semibold rounded hover:bg-[#fff033] cursor-pointer"
                  >
                    Upload Video File (.mp4 / .webm)
                  </button>

                  <button
                    onClick={() => heroPosterFileInputRef.current?.click()}
                    className="px-4 py-2 border border-white/20 text-slate-300 hover:text-white rounded cursor-pointer"
                  >
                    Upload Poster Image
                  </button>

                  {data.heroVideo.videoUrl && (
                    <button
                      onClick={() => {
                        updateData((prev) => ({
                          ...prev,
                          heroVideo: {
                            ...prev.heroVideo,
                            videoUrl: '',
                            posterUrl: '',
                            isCustomUploaded: false,
                          },
                        }));
                        showStatus('Video cleared. Media placeholder restored.');
                      }}
                      className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                    >
                      Clear Video & Restore Placeholder
                    </button>
                  )}
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-slate-400 block font-mono">Or Direct Video URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/animation-reel.mp4"
                    value={data.heroVideo.videoUrl}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        heroVideo: { ...prev.heroVideo, videoUrl: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SELECTED PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* 1. Projects Page Featured Video */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Projects Page Featured Video</h3>
                <p className="text-xs text-slate-400">
                  Upload the large featured video displayed at the top of the &quot;My Projects&quot; page.
                </p>

                <input
                  type="file"
                  ref={projectsFeaturedVideoInputRef}
                  onChange={handleProjectsFeaturedVideoUpload}
                  accept="video/mp4,video/webm"
                  className="hidden"
                />

                <input
                  type="file"
                  ref={projectsFeaturedPosterInputRef}
                  onChange={handleProjectsFeaturedPosterUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => projectsFeaturedVideoInputRef.current?.click()}
                    className="px-4 py-2 bg-[#ffea00] text-[#000066] font-semibold rounded hover:bg-[#fff033] cursor-pointer"
                  >
                    Upload Featured Video (.mp4 / .webm)
                  </button>

                  <button
                    onClick={() => projectsFeaturedPosterInputRef.current?.click()}
                    className="px-4 py-2 border border-white/20 text-slate-300 hover:text-white rounded cursor-pointer"
                  >
                    Upload Video Poster Image
                  </button>

                  {data.projectsPage.featuredVideo.videoUrl && (
                    <button
                      onClick={() => {
                        updateData((prev) => ({
                          ...prev,
                          projectsPage: {
                            ...prev.projectsPage,
                            featuredVideo: {
                              ...prev.projectsPage.featuredVideo,
                              videoUrl: '',
                              posterUrl: '',
                            },
                          },
                        }));
                        showStatus('Featured video cleared. Placeholder restored.');
                      }}
                      className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                    >
                      Clear Video & Restore Placeholder
                    </button>
                  )}
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-slate-400 block font-mono">Or Direct Video URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/featured-project.mp4"
                    value={data.projectsPage.featuredVideo.videoUrl}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        projectsPage: {
                          ...prev.projectsPage,
                          featuredVideo: {
                            ...prev.projectsPage.featuredVideo,
                            videoUrl: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Featured Video Description</label>
                  <textarea
                    rows={2}
                    value={data.projectsPage.featuredVideo.description}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        projectsPage: {
                          ...prev.projectsPage,
                          featuredVideo: {
                            ...prev.projectsPage.featuredVideo,
                            description: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Exactly 4 Dedicated Project Slots */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">4 Project Slots & YouTube Links</h3>
                  <span className="text-[11px] font-mono text-[#ffea00]">
                    Clients: Hashim · Chetanya · Sanjay · Dhananjay
                  </span>
                </div>

                {data.projects.slice(0, 4).map((project, idx) => (
                  <div
                    key={project.id}
                    className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="font-mono text-[#ffea00] font-bold text-xs uppercase">
                        PROJECT 0{idx + 1} — CLIENT: {project.clientName}
                      </span>
                      {project.thumbnailUrl ? (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          THUMBNAIL LOADED
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-mono">
                          PLACEHOLDER ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 block font-mono">Project Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === project.id ? { ...p, title: val } : p
                              ),
                            }));
                          }}
                          className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 block font-mono">Client Name</label>
                        <input
                          type="text"
                          value={project.clientName}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === project.id ? { ...p, clientName: val } : p
                              ),
                            }));
                          }}
                          className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 block font-mono">Category</label>
                        <input
                          type="text"
                          value={project.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === project.id ? { ...p, category: val } : p
                              ),
                            }));
                          }}
                          className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 block font-mono">YouTube Video URL</label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={project.youtubeUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === project.id ? { ...p, youtubeUrl: val } : p
                            ),
                          }));
                        }}
                        className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <label className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-semibold rounded hover:bg-[#fff033] cursor-pointer text-xs">
                        Upload Project 0{idx + 1} Thumbnail
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const result = ev.target?.result as string;
                              updateData((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) =>
                                  p.id === project.id ? { ...p, thumbnailUrl: result } : p
                                ),
                              }));
                              showStatus(`Thumbnail uploaded for Project 0${idx + 1}.`);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>

                      {project.thumbnailUrl && (
                        <button
                          onClick={() => {
                            updateData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === project.id ? { ...p, thumbnailUrl: '' } : p
                              ),
                            }));
                            showStatus(`Thumbnail cleared for Project 0${idx + 1}.`);
                          }}
                          className="px-3 py-1.5 border border-white/20 text-slate-300 hover:text-white rounded cursor-pointer text-xs"
                        >
                          Clear Thumbnail
                        </button>
                      )}

                      {project.youtubeUrl && (
                        <a
                          href={project.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#ffea00] hover:underline ml-auto"
                        >
                          Test YouTube Link ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. Clients & Experience Statement */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Clients & Experience Copy</h3>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Clients Section Heading</label>
                  <input
                    type="text"
                    value={data.projectsPage.clientsHeading}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        projectsPage: { ...prev.projectsPage, clientsHeading: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Experience Statement</label>
                  <textarea
                    rows={2}
                    value={data.projectsPage.experienceStatement}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        projectsPage: { ...prev.projectsPage, experienceStatement: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT & SERVICES */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Media: Photo & Intro Video */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">About Page Media (Photo & Video)</h3>
                <p className="text-xs text-slate-400">
                  Upload your authentic personal portrait photo and introduction video (.mp4 or .webm).
                </p>

                <input
                  type="file"
                  ref={aboutPhotoInputRef}
                  onChange={handleAboutPhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <input
                  type="file"
                  ref={aboutVideoInputRef}
                  onChange={handleAboutVideoUpload}
                  accept="video/mp4,video/webm"
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Photo Control */}
                  <div className="p-3 bg-[#04082c] border border-white/10 rounded space-y-2">
                    <span className="text-xs font-mono text-[#ffea00] uppercase block">
                      1. Personal Photo
                    </span>
                    <div className="text-xs text-slate-400">
                      {data.about.photoUrl ? 'Custom photo loaded.' : 'Using [ UPLOAD PHOTO ] placeholder.'}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => aboutPhotoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-semibold rounded hover:bg-[#fff033] cursor-pointer"
                      >
                        Upload Photo
                      </button>
                      {data.about.photoUrl && (
                        <button
                          onClick={() => {
                            updateData((prev) => ({
                              ...prev,
                              about: { ...prev.about, photoUrl: '' },
                            }));
                            showStatus('Photo cleared. Placeholder restored.');
                          }}
                          className="px-3 py-1.5 border border-white/20 text-slate-300 rounded cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Intro Video Control */}
                  <div className="p-3 bg-[#04082c] border border-white/10 rounded space-y-2">
                    <span className="text-xs font-mono text-[#ffea00] uppercase block">
                      2. Introduction Video
                    </span>
                    <div className="text-xs text-slate-400">
                      {data.about.videoUrl ? 'Custom video loaded.' : 'Using [ UPLOAD VIDEO ] placeholder.'}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => aboutVideoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-semibold rounded hover:bg-[#fff033] cursor-pointer"
                      >
                        Upload Video
                      </button>
                      {data.about.videoUrl && (
                        <button
                          onClick={() => {
                            updateData((prev) => ({
                              ...prev,
                              about: { ...prev.about, videoUrl: '' },
                            }));
                            showStatus('Video cleared. Placeholder restored.');
                          }}
                          className="px-3 py-1.5 border border-white/20 text-slate-300 rounded cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Name</label>
                    <input
                      type="text"
                      value={data.about.name}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          about: { ...prev.about, name: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Profession</label>
                    <input
                      type="text"
                      value={data.about.profession}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          about: { ...prev.about, profession: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Brand</label>
                    <input
                      type="text"
                      value={data.about.brand}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          about: { ...prev.about, brand: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Experience</label>
                    <input
                      type="text"
                      value={data.about.experience}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          about: { ...prev.about, experience: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Age</label>
                    <input
                      type="text"
                      value={data.about.age}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          about: { ...prev.about, age: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">Education</label>
                    <input
                      type="text"
                      value={data.about.education}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          about: { ...prev.about, education: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Biography Paragraphs */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">About Kishore Kumar Biography</h3>
                {data.about.biographyParagraphs?.map((paragraph, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="text-slate-400 block font-mono">Paragraph {idx + 1}</label>
                    <textarea
                      rows={2}
                      value={paragraph}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData((prev) => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            biographyParagraphs: prev.about.biographyParagraphs.map((p, pIdx) =>
                              pIdx === idx ? val : p
                            ),
                          },
                        }));
                      }}
                      className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none text-xs"
                    />
                  </div>
                ))}
              </div>

              {/* Experience & Education Text */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Experience & Education Details</h3>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">My Experience Description</label>
                  <textarea
                    rows={2}
                    value={data.about.experienceText}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        about: { ...prev.about, experienceText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Education Main Line</label>
                  <input
                    type="text"
                    value={data.about.educationText}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        about: { ...prev.about, educationText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Education Supporting Line</label>
                  <textarea
                    rows={2}
                    value={data.about.educationSubtext}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        about: { ...prev.about, educationSubtext: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* What I Do List */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">What I Do (Services)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.about.whatIDoList?.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-slate-400 block font-mono">Service {idx + 1}</label>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              whatIDoList: prev.about.whatIDoList.map((srv, sIdx) =>
                                sIdx === idx ? val : srv
                              ),
                            },
                          }));
                        }}
                        className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* My Approach Steps */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">My Approach (3 Steps)</h3>
                <div className="space-y-3">
                  {data.about.approachSteps?.map((step, idx) => (
                    <div key={step.number} className="p-3 bg-[#04082c] border border-white/10 rounded space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#ffea00] font-bold">{step.number}</span>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateData((prev) => ({
                              ...prev,
                              about: {
                                ...prev.about,
                                approachSteps: prev.about.approachSteps.map((st, stIdx) =>
                                  stIdx === idx ? { ...st, title: val } : st
                                ),
                              },
                            }));
                          }}
                          className="px-2 py-1 bg-[#02051e] border border-white/10 rounded text-white font-bold text-xs"
                        />
                      </div>
                      <textarea
                        rows={1}
                        value={step.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              approachSteps: prev.about.approachSteps.map((st, stIdx) =>
                                stIdx === idx ? { ...st, description: val } : st
                              ),
                            },
                          }));
                        }}
                        className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-slate-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Why MK Tales */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Why MK Tales?</h3>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Main Statement</label>
                  <textarea
                    rows={2}
                    value={data.about.whyMkTalesLead}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        about: { ...prev.about, whyMkTalesLead: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Supporting Statement</label>
                  <input
                    type="text"
                    value={data.about.whyMkTalesSub}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        about: { ...prev.about, whyMkTalesSub: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* About Page CTA */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">About Page Call To Action</h3>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">CTA Heading</label>
                  <input
                    type="text"
                    value={data.about.ctaHeading}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        about: { ...prev.about, ctaHeading: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">CTA Subtext</label>
                  <input
                    type="text"
                    value={data.about.ctaSubtext}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        about: { ...prev.about, ctaSubtext: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              {/* Core Rates */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Core Pricing Rates (Data-Driven)</h3>
                <p className="text-xs text-slate-400">
                  Manage the transparent standard rates displayed on the Pricing page and used in calculations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">
                      2D Animation Rate (₹ / minute)
                    </label>
                    <input
                      type="number"
                      value={data.pricing.animationRatePerMinute}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        updateData((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, animationRatePerMinute: val },
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white font-mono focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block font-mono">Same for all story categories</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">
                      Voice-Over Add-On (₹ / minute)
                    </label>
                    <input
                      type="number"
                      value={data.pricing.voiceOverRatePerMinute}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        updateData((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, voiceOverRatePerMinute: val },
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white font-mono focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block font-mono">Charged separately from animation</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">
                      Script Add-On (₹ / 20 min unit)
                    </label>
                    <input
                      type="number"
                      value={data.pricing.scriptRatePerTwentyMinutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        updateData((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, scriptRatePerTwentyMinutes: val },
                        }));
                      }}
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white font-mono focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block font-mono">Based on 20-minute script units</span>
                  </div>
                </div>
              </div>

              {/* Story Categories */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Story Categories (All use same ₹{data.pricing.animationRatePerMinute}/min rate)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.pricing.storyCategories?.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-slate-400 block font-mono">Category {idx + 1}</label>
                      <input
                        type="text"
                        value={cat}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateData((prev) => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              storyCategories: prev.pricing.storyCategories.map((c, cIdx) =>
                                cIdx === idx ? val : c
                              ),
                            },
                          }));
                        }}
                        className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Copy & Transparency Notes */}
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Pricing Page Copy & Transparency</h3>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Page Title</label>
                  <input
                    type="text"
                    value={data.pricing.pageTitle}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        pricing: { ...prev.pricing, pageTitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Supporting Subtitle</label>
                  <textarea
                    rows={2}
                    value={data.pricing.pageSubtitle}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        pricing: { ...prev.pricing, pageSubtitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Highlight Note</label>
                  <input
                    type="text"
                    value={data.pricing.note}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        pricing: { ...prev.pricing, note: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">CTA Heading</label>
                    <input
                      type="text"
                      value={data.pricing.ctaHeading}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, ctaHeading: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block font-mono">CTA Subtext</label>
                    <input
                      type="text"
                      value={data.pricing.ctaSubtext}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, ctaSubtext: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT & PHONE */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Contact & CTA Configuration</h3>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">
                    Official Contact Number (Current: {data.contact.phone})
                  </label>
                  <input
                    type="text"
                    value={data.contact.phone}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Must strictly match the user specified number: 93414628
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">Studio Email</label>
                  <input
                    type="email"
                    value={data.contact.email}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">CTA Headline</label>
                  <input
                    type="text"
                    value={data.contact.ctaHeadline}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, ctaHeadline: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block font-mono">CTA Subtext</label>
                  <input
                    type="text"
                    value={data.contact.ctaSubtext}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, ctaSubtext: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#04082c] border border-white/10 rounded text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BACKUP & EXPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-4">
                <h3 className="text-sm font-bold text-white">Import & Export Data</h3>
                <p className="text-xs text-slate-400">
                  Export your entire portfolio content as a single JSON file or import a saved configuration.
                </p>

                <input
                  type="file"
                  ref={jsonFileInputRef}
                  onChange={handleImportJsonFile}
                  accept=".json,application/json"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={exportConfigJson}
                    className="px-4 py-2 bg-[#ffea00] text-[#000066] font-semibold rounded hover:bg-[#fff033] cursor-pointer"
                  >
                    Export Portfolio JSON
                  </button>

                  <button
                    onClick={() => jsonFileInputRef.current?.click()}
                    className="px-4 py-2 border border-white/20 text-slate-300 hover:text-white rounded cursor-pointer"
                  >
                    Import Portfolio JSON
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Reset all website content back to initial defaults?')) {
                        resetToDefaults();
                        showStatus('Reset to defaults complete.');
                      }
                    }}
                    className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                  >
                    Reset to Initial Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#02051e] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Auto-saves immediately to browser storage
          </span>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-5 py-2 bg-[#ffea00] text-[#000066] font-semibold uppercase text-xs tracking-wider rounded hover:bg-[#fff033] cursor-pointer"
          >
            Done & View Website
          </button>
        </div>
      </div>
    </div>
  );
};
