import React, { useRef, useState } from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const HeroVideoPlayer: React.FC = () => {
  const { data, updateField, setIsAdminOpen, refreshContentFromServer } = usePortfolio();
  const heroConfig = data.heroVideo || {};
  const activeThumbnail = heroConfig.thumbnailUrl || heroConfig.posterUrl || (heroConfig.videoUrl?.startsWith('data:image') || heroConfig.videoUrl?.includes('/uploads/') ? heroConfig.videoUrl : '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload thumbnail image file and persist to backend storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (uploadEv) => {
      const base64Data = uploadEv.target?.result as string;

      try {
        // Persist file through backend server API
        const token = localStorage.getItem('mk_tales_admin_auth_token_v1');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Data,
            category: 'Showcase Thumbnail',
            usedOn: 'Home Hero Showcase',
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const uploadedUrl = json.file?.url || base64Data;
          updateField('heroVideo', {
            ...heroConfig,
            thumbnailUrl: uploadedUrl,
            posterUrl: uploadedUrl,
            title: heroConfig.title || 'MK Tales Showreel & 2D Animation Spotlight',
            isCustomUploaded: true,
          });
          await refreshContentFromServer();
        } else {
          // Fallback to local state if offline or unauthenticated
          updateField('heroVideo', {
            ...heroConfig,
            thumbnailUrl: base64Data,
            posterUrl: base64Data,
            title: heroConfig.title || 'MK Tales Showreel & 2D Animation Spotlight',
            isCustomUploaded: true,
          });
        }
      } catch (err) {
        console.warn('Network upload fallback to local state:', err);
        updateField('heroVideo', {
          ...heroConfig,
          thumbnailUrl: base64Data,
          posterUrl: base64Data,
          title: heroConfig.title || 'MK Tales Showreel & 2D Animation Spotlight',
          isCustomUploaded: true,
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteThumbnail = () => {
    updateField('heroVideo', {
      ...heroConfig,
      thumbnailUrl: '',
      posterUrl: '',
      videoUrl: '',
      isCustomUploaded: false,
    });
  };

  const title = heroConfig.title || 'MK Tales Showreel & 2D Animation Spotlight';
  const description = heroConfig.description || 'Showcase of original character animation, visual stories, and 2D animated scenes.';
  const category = heroConfig.category || '2D ANIMATION SHOWREEL · 24 FPS';

  return (
    <div
      className="w-full relative rounded-lg overflow-hidden bg-[#040828] border border-white/10 shadow-2xl transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
      />

      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-[#02051e]">
        {activeThumbnail && activeThumbnail.trim() !== '' ? (
          /* Thumbnail Image Card with Play Icon Overlay */
          <div className="relative w-full h-full flex items-center justify-center group">
            {/* Loading spinner while image is loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#02051e] z-10">
                <div className="w-8 h-8 border-2 border-[#ffea00] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <img
              src={activeThumbnail}
              alt={title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />

            {/* Dark gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#02051e]/90 via-[#02051e]/30 to-transparent pointer-events-none" />

            {/* Prominent Play Icon (▶) Badge Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 pointer-events-none pl-1">
                <span className="text-xl sm:text-2xl font-black">▶</span>
              </div>
            </div>

            {/* Bottom Meta Overlay (Title, Description, Category) */}
            <div
              className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-95'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1 max-w-xl">
                  <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#ffea00] uppercase tracking-wider font-semibold">
                    <span>{category}</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {description}
                  </p>
                </div>

                {/* Management Action Buttons on Hover */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:text-white bg-black/60 hover:bg-black/80 border border-white/20 rounded transition-colors cursor-pointer"
                  >
                    {isUploading ? 'Uploading...' : 'Replace Image'}
                  </button>
                  <button
                    onClick={handleDeleteThumbnail}
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
          /* Clean, Professional Cinematic Frame Placeholder (Strictly No Video Storage) */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#030623] relative">
            {/* Cinematic frame guides */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 tracking-widest hidden sm:block">
              [ 1920 × 1080 · 16:9 · 24 FPS ]
            </div>
            <div className="absolute top-4 right-4 text-[10px] font-mono text-[#ffea00] tracking-widest uppercase">
              STATUS: THUMBNAIL READY
            </div>
            <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-400 hidden sm:block">
              FRAME: 00:00:00:00
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-400 hidden sm:block">
              MK TALES · 2D ANIMATION
            </div>

            {/* Play Icon Placeholder in Center */}
            <div className="w-14 h-14 rounded-full border border-[#ffea00]/40 bg-[#000066]/50 flex items-center justify-center text-[#ffea00] mb-3 shadow-lg pl-0.5">
              <span className="text-lg">▶</span>
            </div>

            {/* Center Content */}
            <div className="max-w-md mx-auto space-y-2 z-10">
              <div className="inline-block py-0.5 px-2.5 border border-[#ffea00]/40 text-[#ffea00] font-mono text-[11px] tracking-wider rounded">
                [ SHOWCASE THUMBNAIL CARD ]
              </div>

              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                {title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                {description}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
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
  );
};
