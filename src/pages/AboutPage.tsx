import React, { useRef, useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const AboutPage: React.FC = () => {
  const { data, updateField, setIsContactOpen, setIsAdminOpen } = usePortfolio();
  const about = data.about;

  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const introThumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isHoveredThumbnail, setIsHoveredThumbnail] = useState(false);

  // Direct upload handlers for Kishore
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            category: 'About Photo',
            usedOn: 'About Profile Photo',
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.file?.url) {
            updateField('about', {
              ...about,
              photoUrl: json.file.url,
            });
            return;
          }
        }
      } catch {}

      updateField('about', {
        ...about,
        photoUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleIntroThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

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
            category: 'About Showcase',
            usedOn: 'About Page Intro',
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const uploadedUrl = json.file?.url || result;
          updateField('about', {
            ...about,
            introThumbnailUrl: uploadedUrl,
            videoPosterUrl: uploadedUrl,
          });
          return;
        }
      } catch {}
      updateField('about', {
        ...about,
        introThumbnailUrl: result,
        videoPosterUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteIntroThumbnail = () => {
    updateField('about', {
      ...about,
      introThumbnailUrl: '',
      videoPosterUrl: '',
      videoUrl: '',
    });
  };

  const activeIntroThumbnail =
    about.introThumbnailUrl ||
    about.videoPosterUrl ||
    (about.videoUrl?.startsWith('data:image') || about.videoUrl?.includes('/uploads/') ? about.videoUrl : '');

  return (
    <main className="py-12 sm:py-20 animate-in fade-in duration-300">
      {/* Hidden file inputs for direct media upload */}
      <input
        type="file"
        ref={photoFileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={introThumbnailInputRef}
        onChange={handleIntroThumbnailUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* ==================================================
            1. PAGE HERO / INTRODUCTION
            ================================================== */}
        <section className="max-w-3xl space-y-4">
          <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
            {about.label || 'ABOUT MK TALES'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {about.mainHeading || 'Meet Kishore Kumar'}
          </h1>
          <p className="text-lg sm:text-xl text-[#ffea00] font-medium leading-snug">
            {about.introSubtitle || "I'm Kishore Kumar, a 2D Animator and the creator behind MK Tales."}
          </p>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            {about.introLead ||
              'I create engaging 2D animations and visual content designed to turn ideas and stories into meaningful visual experiences.'}
          </p>
        </section>

        {/* ==================================================
            2. MAIN ABOUT SECTION (TWO-COLUMN LAYOUT)
            Desktop: Left ~55%, Right ~45%
            Mobile: Stack vertically
            ================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start border-t border-white/10 pt-12">
          {/* LEFT SIDE (55%): Personal Information & Biography */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            {/* Elegant Personal Information Table / Grid */}
            <div className="space-y-3">
              <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
                Profile Overview
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-6 py-4 border-y border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono text-[11px] uppercase tracking-wider">
                    Name
                  </span>
                  <span className="font-semibold text-white text-sm mt-0.5 block">
                    {about.name || 'Kishore Kumar'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-mono text-[11px] uppercase tracking-wider">
                    Profession
                  </span>
                  <span className="font-semibold text-white text-sm mt-0.5 block">
                    {about.profession || '2D Animator'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-mono text-[11px] uppercase tracking-wider">
                    Brand
                  </span>
                  <span className="font-semibold text-white text-sm mt-0.5 block">
                    {about.brand || 'MK Tales'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-mono text-[11px] uppercase tracking-wider">
                    Experience
                  </span>
                  <span className="font-semibold text-white text-sm mt-0.5 block">
                    {about.experience || '4+ Years'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-mono text-[11px] uppercase tracking-wider">
                    Age
                  </span>
                  <span className="font-semibold text-white text-sm mt-0.5 block">
                    {about.age || '23, turning 24'}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-mono text-[11px] uppercase tracking-wider">
                    Education
                  </span>
                  <span className="font-semibold text-white text-sm mt-0.5 block">
                    {about.education || 'Graduation — Mathematics'}
                  </span>
                </div>
              </div>
            </div>

            {/* Biography Paragraphs */}
            <div className="space-y-5 text-slate-300 text-sm sm:text-base leading-relaxed">
              {about.biographyParagraphs?.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* My Experience */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {about.experienceHeading || 'My Experience'}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {about.experienceText ||
                  'With more than 4 years of experience in 2D animation, I have developed a strong understanding of visual storytelling, animation principles and creating engaging content for digital platforms.'}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {about.educationHeading || 'Education'}
              </h3>
              <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                {about.educationText || 'Currently pursuing graduation with Mathematics.'}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {about.educationSubtext ||
                  'Alongside my academic journey, I continue to develop my skills in animation, visual storytelling and creative content production.'}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE (45%): Personal Photo & Personal Video */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            {/* 1. Dedicated Personal Photo Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="uppercase text-[11px] tracking-wider text-[#ffea00]">
                  Portrait
                </span>
                <button
                  onClick={() => photoFileInputRef.current?.click()}
                  className="hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  {about.photoUrl && about.photoUrl.trim() !== '' ? 'Replace Photo' : 'Upload Photo'}
                </button>
              </div>

              <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#040828] border border-white/10 relative flex items-center justify-center group shadow-xl">
                {about.photoUrl && about.photoUrl.trim() !== '' ? (
                  <img
                    src={about.photoUrl}
                    alt="Kishore Kumar — 2D Animator"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  /* Dedicated Clean Editable Photo Placeholder (NO AI photo, NO stock image) */
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-[#030623] select-none space-y-3">
                    <div className="w-14 h-14 rounded-full border border-[#ffea00]/40 flex items-center justify-center text-[#ffea00] font-mono text-xs font-semibold">
                      MK
                    </div>
                    <span className="font-mono text-xs text-[#ffea00] tracking-wider font-semibold">
                      [ UPLOAD KISHORE KUMAR PHOTO ]
                    </span>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Dedicated portrait area for Kishore Kumar&apos;s original photograph.
                    </p>
                    <button
                      onClick={() => photoFileInputRef.current?.click()}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded transition-colors cursor-pointer"
                    >
                      Select Photo File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Dedicated Personal Showcase Thumbnail Area (Replacing Video Player) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="uppercase text-[11px] tracking-wider text-[#ffea00]">
                  Animation Showcase Thumbnail
                </span>
                <button
                  onClick={() => introThumbnailInputRef.current?.click()}
                  className="hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  {activeIntroThumbnail && activeIntroThumbnail.trim() !== '' ? 'Replace Image' : 'Upload Image'}
                </button>
              </div>

              <div
                className="w-full aspect-video rounded-lg overflow-hidden bg-[#040828] border border-white/10 relative flex items-center justify-center shadow-xl group"
                onMouseEnter={() => setIsHoveredThumbnail(true)}
                onMouseLeave={() => setIsHoveredThumbnail(false)}
              >
                {activeIntroThumbnail && activeIntroThumbnail.trim() !== '' ? (
                  /* Thumbnail Image Card with Play Icon Overlay */
                  <>
                    <img
                      src={activeIntroThumbnail}
                      alt={about.introTitle || 'Kishore Kumar 2D Animation Spotlight'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02051e]/90 via-[#02051e]/25 to-transparent pointer-events-none" />

                    {/* Center Play Icon (▶) Badge Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center text-sm font-bold shadow-2xl transition-transform duration-300 group-hover:scale-110 pl-0.5">
                        ▶
                      </div>
                    </div>

                    {/* Bottom Content (Title & Short Description) */}
                    <div
                      className={`absolute bottom-0 inset-x-0 p-3.5 transition-opacity duration-200 ${
                        isHoveredThumbnail ? 'opacity-100' : 'opacity-95'
                      }`}
                    >
                      <div className="flex items-end justify-between gap-2">
                        <div className="space-y-0.5 max-w-xs">
                          <span className="text-[10px] font-mono text-[#ffea00] uppercase tracking-wider block font-semibold">
                            2D ANIMATOR SHOWCASE
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1">
                            {about.introTitle || 'Kishore Kumar — 2D Animation Reel & Spotlight'}
                          </h4>
                          <p className="text-[11px] text-slate-300 line-clamp-1">
                            {about.introDescription || 'Visual storytelling, character animation, and creative motion showcase.'}
                          </p>
                        </div>

                        {/* Replace / Delete actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => introThumbnailInputRef.current?.click()}
                            className="px-2 py-1 text-[10px] font-mono bg-black/70 hover:bg-black text-slate-200 rounded border border-white/20 transition-colors cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            onClick={handleDeleteIntroThumbnail}
                            className="px-1.5 py-1 text-[10px] font-mono bg-black/70 hover:bg-black text-red-400 rounded border border-white/20 transition-colors cursor-pointer"
                            title="Delete Thumbnail"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Dedicated Clean Editable Thumbnail Placeholder (NO AI, NO Stock Media) */
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-[#02051e] select-none space-y-2">
                    {/* Play Icon Placeholder in Center */}
                    <div className="w-10 h-10 rounded-full border border-[#ffea00]/40 bg-[#000066]/50 flex items-center justify-center text-[#ffea00] pl-0.5 mb-1">
                      <span className="text-xs">▶</span>
                    </div>

                    <span className="font-mono text-xs text-[#ffea00] tracking-wider font-semibold">
                      [ UPLOAD SHOWCASE THUMBNAIL ]
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono">
                      JPG · PNG · WebP Image Supported
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => introThumbnailInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded transition-colors cursor-pointer shadow-md"
                      >
                        Upload Image
                      </button>
                      <button
                        onClick={() => setIsAdminOpen(true)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/20 rounded transition-colors cursor-pointer"
                      >
                        Admin Panel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            3. WHAT I DO
            ================================================== */}
        <section className="border-t border-white/10 pt-12 space-y-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {about.whatIDoHeading || 'What I Do'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {about.whatIDoList?.map((service, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#04082c] border border-white/10 rounded-lg hover:border-white/20 transition-colors"
              >
                <span className="text-xs font-mono text-[#ffea00] block mb-2 font-semibold">
                  0{idx + 1}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {service}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================
            4. MY APPROACH
            01 — Understand
            02 — Create
            03 — Refine
            ================================================== */}
        <section className="border-t border-white/10 pt-12 space-y-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Creative Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {about.approachHeading || 'My Approach'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {about.approachSteps?.map((step) => (
              <div
                key={step.number}
                className="p-6 bg-[#030626] border border-white/10 rounded-lg space-y-3"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-[#ffea00] font-bold">
                  <span>{step.number}</span>
                  <span>—</span>
                  <span className="uppercase tracking-wider">{step.title}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================
            5. WHY MK TALES
            ================================================== */}
        <section className="border-t border-white/10 pt-12">
          <div className="p-8 sm:p-10 bg-[#04082c] border-l-2 border-[#ffea00] rounded-r-lg space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Brand Mission
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {about.whyMkTalesHeading || 'Why MK Tales?'}
            </h2>
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
              {about.whyMkTalesLead ||
                'MK Tales is built around a simple idea — turning stories and ideas into engaging visual experiences through animation.'}
            </p>
            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl">
              {about.whyMkTalesSub ||
                'Every project is approached with creativity, clarity and attention to detail.'}
            </p>
          </div>
        </section>

        {/* ==================================================
            6. CALL TO ACTION
            ================================================== */}
        <section className="border-t border-white/10 pt-16 pb-8 text-center space-y-6">
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {about.ctaHeading || "Have an idea you'd like to bring to life?"}
            </h2>
            <p className="text-base text-slate-300">
              {about.ctaSubtext ||
                "Let's work together and turn your idea into engaging visual content."}
            </p>
          </div>

          <div>
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] active:bg-[#e6d200] transition-colors rounded cursor-pointer shadow-lg inline-flex items-center justify-center"
            >
              {about.ctaButtonText || "Let's Work Together"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
