import React, { useRef, useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext';
import { ProjectItem } from '../types/portfolio';

export const ProjectsPage: React.FC = () => {
  const { data, updateField, setIsContactOpen, setIsAdminOpen } = usePortfolio();
  const projectsConfig = data.projectsPage;
  const projects = data.projects.slice(0, 4);
  const phone = data.contact.phone;

  // Featured thumbnail controls & refs
  const featuredThumbnailInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [isHoveredThumbnail, setIsHoveredThumbnail] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Direct featured thumbnail image upload
  const handleFeaturedThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (uploadEv) => {
      const result = uploadEv.target?.result as string;
      try {
        const token = localStorage.getItem('mk_tales_admin_auth_token_v1');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Data: result,
            category: 'Featured Project Showcase',
            usedOn: 'Projects Page Top',
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const uploadedUrl = json.file?.url || result;
          updateField('projectsPage', {
            ...projectsConfig,
            featuredVideo: {
              ...projectsConfig.featuredVideo,
              thumbnailUrl: uploadedUrl,
              posterUrl: uploadedUrl,
            },
          });
          setIsUploading(false);
          return;
        }
      } catch {}

      updateField('projectsPage', {
        ...projectsConfig,
        featuredVideo: {
          ...projectsConfig.featuredVideo,
          thumbnailUrl: result,
          posterUrl: result,
        },
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteFeaturedThumbnail = () => {
    updateField('projectsPage', {
      ...projectsConfig,
      featuredVideo: {
        ...projectsConfig.featuredVideo,
        thumbnailUrl: '',
        posterUrl: '',
        videoUrl: '',
      },
    });
  };

  const activeFeaturedThumbnail =
    projectsConfig.featuredVideo.thumbnailUrl ||
    projectsConfig.featuredVideo.posterUrl ||
    (projectsConfig.featuredVideo.videoUrl?.startsWith('data:image') || projectsConfig.featuredVideo.videoUrl?.includes('/uploads/') ? projectsConfig.featuredVideo.videoUrl : '');

  // Direct thumbnail upload handler for project slot
  const handleThumbnailUpload = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      try {
        const token = localStorage.getItem('mk_tales_admin_auth_token_v1');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Data: result,
            category: 'Project Thumbnail',
            usedOn: `Project Slot ${projectId}`,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.file?.url) {
            const updated = data.projects.map((p) =>
              p.id === projectId ? { ...p, thumbnailUrl: json.file.url } : p
            );
            updateField('projects', updated);
            return;
          }
        }
      } catch {}

      const updated = data.projects.map((p) =>
        p.id === projectId ? { ...p, thumbnailUrl: result } : p
      );
      updateField('projects', updated);
    };
    reader.readAsDataURL(file);
  };

  // Handle YouTube link navigation
  const handleWatchOnYouTube = (project: ProjectItem) => {
    if (project.youtubeUrl && project.youtubeUrl.trim() !== '') {
      window.open(project.youtubeUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(`YouTube URL for "${project.title}" has not been set yet. You can paste the direct YouTube URL in the Admin Panel.`);
      setIsAdminOpen(true);
    }
  };

  return (
    <main className="py-12 sm:py-20 animate-in fade-in duration-300">
      {/* Hidden file input for featured showcase thumbnail */}
      <input
        type="file"
        ref={featuredThumbnailInputRef}
        onChange={handleFeaturedThumbnailUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* ==================================================
            1. PAGE TITLE & INTRODUCTION
            ================================================== */}
        <section className="max-w-3xl space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            Portfolio & Client Work
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {projectsConfig.pageTitle || 'My Projects'}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            {projectsConfig.introSentence ||
              "Explore some of the animation and creative video projects I've worked on for YouTube channels and digital creators."}
          </p>
        </section>

        {/* ==================================================
            2. FEATURED PROJECT SHOWCASE THUMBNAIL — TOP OF PAGE
            ================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase text-[11px] tracking-wider text-[#ffea00]">
              Featured Project Showcase
            </span>
            <button
              onClick={() => featuredThumbnailInputRef.current?.click()}
              disabled={isUploading}
              className="hover:text-white transition-colors cursor-pointer text-[11px]"
            >
              {activeFeaturedThumbnail && activeFeaturedThumbnail.trim() !== ''
                ? 'Replace Image'
                : 'Upload Image'}
            </button>
          </div>

          <div
            className="w-full relative rounded-lg overflow-hidden bg-[#040828] border border-white/10 shadow-2xl transition-all"
            onMouseEnter={() => setIsHoveredThumbnail(true)}
            onMouseLeave={() => setIsHoveredThumbnail(false)}
          >
            {/* 16:9 Aspect Ratio Container */}
            <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-[#02051e]">
              {activeFeaturedThumbnail && activeFeaturedThumbnail.trim() !== '' ? (
                /* Real Thumbnail Showcase Card with Play Icon Overlay */
                <div className="relative w-full h-full flex items-center justify-center group">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#02051e] z-10">
                      <div className="w-8 h-8 border-2 border-[#ffea00] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <img
                    src={activeFeaturedThumbnail}
                    alt={projectsConfig.featuredVideo.title || 'Featured 2D Animation Project'}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                  />

                  {/* Gradient shadow overlay for text clarity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02051e]/90 via-[#02051e]/25 to-transparent pointer-events-none" />

                  {/* Prominent Play Icon (▶) Badge in Center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 pl-1">
                      <span className="text-xl sm:text-2xl font-black">▶</span>
                    </div>
                  </div>

                  {/* Meta Information Bar (Title, Description, Category) */}
                  <div
                    className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 transition-opacity duration-200 ${
                      isHoveredThumbnail ? 'opacity-100' : 'opacity-95'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="space-y-1 max-w-xl">
                        <span className="text-[10px] sm:text-xs font-mono text-[#ffea00] uppercase tracking-wider block font-semibold">
                          {projectsConfig.featuredVideo.category || '2D ANIMATION SHOWCASE · 24 FPS'}
                        </span>
                        <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
                          {projectsConfig.featuredVideo.title || 'Featured 2D Animation Project'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                          {projectsConfig.featuredVideo.description ||
                            'Selected work showcasing my approach to 2D animation, visual storytelling and creative video production.'}
                        </p>
                      </div>

                      {/* Replace / Delete actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => featuredThumbnailInputRef.current?.click()}
                          disabled={isUploading}
                          className="px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:text-white bg-black/60 hover:bg-black/80 border border-white/20 rounded transition-colors cursor-pointer"
                        >
                          {isUploading ? 'Uploading...' : 'Replace Image'}
                        </button>
                        <button
                          onClick={handleDeleteFeaturedThumbnail}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-red-400 hover:text-red-300 bg-black/60 hover:bg-black/80 border border-white/20 rounded transition-colors cursor-pointer"
                          title="Delete Thumbnail"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Dedicated Clean Editable Thumbnail Placeholder (NO AI, NO Stock Video) */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#030623] select-none relative">
                  {/* Subtle Framing Cue */}
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 tracking-widest hidden sm:block">
                    [ 1920 × 1080 · 16:9 · 24 FPS ]
                  </div>
                  <div className="absolute top-4 right-4 text-[10px] font-mono text-[#ffea00] tracking-widest uppercase">
                    FEATURED 2D PROJECT
                  </div>

                  {/* Center Play Icon Placeholder */}
                  <div className="w-14 h-14 rounded-full border border-[#ffea00]/40 bg-[#000066]/50 flex items-center justify-center text-[#ffea00] mb-3 shadow-lg pl-0.5">
                    <span className="text-lg">▶</span>
                  </div>

                  <div className="max-w-md mx-auto space-y-2 z-10">
                    <div className="inline-block py-0.5 px-2.5 border border-[#ffea00]/40 text-[#ffea00] font-mono text-[11px] tracking-wider rounded font-semibold">
                      [ {projectsConfig.featuredVideo.placeholderLabel || 'UPLOAD FEATURED PROJECT THUMBNAIL'} ]
                    </div>

                    <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                      {projectsConfig.featuredVideo.title || 'Featured 2D Animation Project'}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                      {projectsConfig.featuredVideo.description ||
                        'Selected work showcasing my approach to 2D animation, visual storytelling and creative video production.'}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => featuredThumbnailInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded transition-colors cursor-pointer shadow-md"
                      >
                        {isUploading ? 'Uploading Image...' : 'Upload Thumbnail Image'}
                      </button>

                      <button
                        onClick={() => setIsAdminOpen(true)}
                        className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-white border border-white/20 hover:border-white/40 rounded transition-colors cursor-pointer"
                      >
                        Manage in Admin Panel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. FEATURED DESCRIPTION */}
          <p className="text-sm text-slate-300 font-normal leading-relaxed pt-1 max-w-3xl">
            {projectsConfig.featuredVideo.description ||
              'Selected work showcasing my approach to 2D animation, visual storytelling and creative video production.'}
          </p>
        </section>

        {/* ==================================================
            4. SELECTED PROJECTS (EXACTLY 4 PROJECT SLOTS)
            Desktop: 2 × 2 grid
            Tablet: 2-column layout
            Mobile: Single-column layout
            ================================================== */}
        <section className="border-t border-white/10 pt-12 space-y-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Client Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Selected Projects
            </h2>
          </div>

          {/* 2 × 2 Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {projects.map((project: ProjectItem, index: number) => (
              <div
                key={project.id}
                className="group flex flex-col bg-[#04082c] border border-white/10 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/20"
              >
                {/* Hidden file input for direct thumbnail upload */}
                <input
                  type="file"
                  ref={(el) => {
                    thumbnailInputRefs.current[project.id] = el;
                  }}
                  onChange={(e) => handleThumbnailUpload(project.id, e)}
                  accept="image/*"
                  className="hidden"
                />

                {/* 1. Thumbnail Container */}
                <div
                  className="relative aspect-video w-full bg-[#02051e] overflow-hidden flex items-center justify-center cursor-pointer"
                  onClick={() => handleWatchOnYouTube(project)}
                >
                  {project.thumbnailUrl && project.thumbnailUrl.trim() !== '' ? (
                    <>
                      <img
                        src={project.thumbnailUrl}
                        alt={`${project.title} - ${project.clientName}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                        loading="lazy"
                      />
                      {/* Play Icon (▶) Indicator */}
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center text-xs font-bold shadow-lg pointer-events-none pl-0.5 group-hover:scale-110 transition-transform">
                        ▶
                      </div>
                      {/* Subtle hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs font-mono text-[#ffea00] bg-black/80 px-3 py-1.5 rounded font-semibold tracking-wide">
                          Watch on YouTube →
                        </span>
                      </div>
                    </>
                  ) : (
                    /* Clean Editable Upload Placeholder (NO AI images, NO stock images) */
                    <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-[#02051e] select-none space-y-2 border-b border-white/10">
                      <span className="font-mono text-xs text-[#ffea00] tracking-wider font-semibold">
                        [ {project.placeholderLabel || `Upload Project 0${index + 1} Thumbnail`} ]
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Client: {project.clientName} · 16:9 Aspect Ratio
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          thumbnailInputRefs.current[project.id]?.click();
                        }}
                        className="mt-2 text-[10px] text-slate-300 hover:text-white border border-white/15 px-2.5 py-1 rounded uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Choose Thumbnail File
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Project Card Meta Info */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                  <div className="space-y-3">
                    {/* Category */}
                    <div className="text-xs font-medium text-[#ffea00] tracking-wide">
                      {project.category || '2D Animation / YouTube Content'}
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#ffea00] transition-colors">
                      {project.title}
                    </h3>

                    {/* Client Name */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                        Client:
                      </span>
                      <span className="font-semibold text-white font-mono text-xs">
                        {project.clientName}
                      </span>
                    </div>

                    {/* YouTube URL status indication */}
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      {project.youtubeUrl ? (
                        <span className="text-slate-400">URL: <span className="text-slate-300">{project.youtubeUrl}</span></span>
                      ) : (
                        <span className="text-slate-500 italic">No YouTube URL entered yet</span>
                      )}
                    </div>
                  </div>

                  {/* 3. Action Buttons: Watch on YouTube & Upload Thumbnail */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleWatchOnYouTube(project)}
                      className="font-bold text-sm text-[#ffea00] hover:text-[#fff033] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Watch on YouTube</span>
                      <span aria-hidden="true">→</span>
                    </button>

                    <button
                      onClick={() => thumbnailInputRefs.current[project.id]?.click()}
                      className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {project.thumbnailUrl ? 'Replace Image' : 'Upload Image'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================
            5. CLIENTS I'VE WORKED WITH & EXPERIENCE STATEMENT
            ================================================== */}
        <section className="border-t border-white/10 pt-12 space-y-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Collaborations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {projectsConfig.clientsHeading || "Clients I've Worked With"}
            </h2>
          </div>

          {/* Simple Minimal Text Names (No fake logos, No fake ratings) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {projectsConfig.clientsList?.map((clientName: string, idx: number) => (
              <div
                key={idx}
                className="p-5 bg-[#030626] border border-white/10 rounded-lg text-center"
              >
                <span className="text-xs font-mono text-[#ffea00] block mb-1">
                  0{idx + 1}
                </span>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {clientName}
                </span>
              </div>
            ))}
          </div>

          {/* Experience Statement */}
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-3xl">
            {projectsConfig.experienceStatement ||
              "I've had the opportunity to work on animation and video content for multiple YouTube channels and digital creators."}
          </p>
        </section>

        {/* ==================================================
            6. CALL TO ACTION
            ================================================== */}
        <section className="border-t border-white/10 pt-16 pb-4 text-center space-y-6">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {projectsConfig.ctaHeading || 'Have a project in mind?'}
            </h2>
            <p className="text-base text-slate-300">
              {projectsConfig.ctaSubtext ||
                "Let's work together and bring your idea to life through animation."}
            </p>
          </div>

          <div>
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] active:bg-[#e6d200] transition-colors rounded cursor-pointer shadow-lg inline-flex items-center justify-center"
            >
              {projectsConfig.ctaButtonText || "Let's Work Together"}
            </button>
          </div>

          {/* 7. Minimal Direct Contact Info */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-400">
            <span>Let&apos;s talk about your next project.</span>
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
