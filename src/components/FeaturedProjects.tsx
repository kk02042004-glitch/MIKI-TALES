import React, { useRef } from 'react';
import { usePortfolio } from '../store/PortfolioContext';
import { ProjectItem } from '../types/portfolio';

export const FeaturedProjects: React.FC = () => {
  const { data, updateField, setSelectedProjectId, setCurrentPage } = usePortfolio();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const projects = data.projects.slice(0, 3);

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
            usedOn: `Featured Project ${projectId}`,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.file?.url) {
            const updatedProjects = data.projects.map((p) =>
              p.id === projectId ? { ...p, thumbnailUrl: json.file.url } : p
            );
            updateField('projects', updatedProjects);
            return;
          }
        }
      } catch {}

      const updatedProjects = data.projects.map((p) =>
        p.id === projectId ? { ...p, thumbnailUrl: result } : p
      );
      updateField('projects', updatedProjects);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="py-16 sm:py-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#ffea00] uppercase">
              Portfolio
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Selected Projects
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('projects')}
            className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer group flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Works</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </button>
        </div>

        {/* 3 Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project: ProjectItem) => (
            <div
              key={project.id}
              className="group flex flex-col bg-[#04082c] border border-white/10 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/20"
            >
              {/* Hidden file input for direct thumbnail upload */}
              <input
                type="file"
                ref={(el) => {
                  fileInputRefs.current[project.id] = el;
                }}
                onChange={(e) => handleThumbnailUpload(project.id, e)}
                accept="image/*"
                className="hidden"
              />

              {/* Thumbnail Container / Media Placeholder */}
              <div
                className="relative aspect-video w-full bg-[#030620] overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedProjectId(project.id)}
              >
                {project.thumbnailUrl && project.thumbnailUrl.trim() !== '' ? (
                  <>
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      loading="lazy"
                    />
                    {/* Small Play Icon (▶) overlay indicating animated video/project */}
                    <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center text-[10px] font-bold shadow-lg pointer-events-none pl-0.5 group-hover:scale-110 transition-transform">
                      ▶
                    </div>
                  </>
                ) : (
                  /* Dedicated Clean Editable Placeholder (NO AI images, NO stock photos) */
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-[#02051e] border-b border-white/10 select-none">
                    <span className="font-mono text-xs text-[#ffea00] tracking-wider mb-2">
                      [ {project.placeholderLabel} ]
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono tracking-tight">
                      {project.fps || '24 FPS'} · {project.technique ? project.technique.split('&')[0] : '2D Animation'}
                    </span>
                    <span className="mt-3 text-[10px] text-slate-400 border border-white/10 px-2 py-0.5 rounded uppercase tracking-wider group-hover:text-slate-200 group-hover:border-white/20 transition-colors">
                      Click to View Details
                    </span>
                  </div>
                )}
              </div>

              {/* Project Meta Information */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  {/* Clean unboxed metadata separator without pill enclosure */}
                  <div className="text-xs font-medium text-[#ffea00] flex items-center gap-2 mb-1.5">
                    <span>{project.category}</span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="text-slate-400 font-mono text-[11px]">{project.year}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#ffea00] transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Footer link & quick upload */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedProjectId(project.id)}
                    className="font-semibold text-white group-hover:text-[#ffea00] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <span aria-hidden="true">→</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRefs.current[project.id]?.click();
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Upload custom thumbnail file"
                  >
                    Upload Thumbnail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
