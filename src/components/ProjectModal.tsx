import React, { useEffect } from 'react';
import { usePortfolio } from '../store/PortfolioContext';

export const ProjectModal: React.FC = () => {
  const { data, selectedProjectId, setSelectedProjectId, setIsContactOpen } = usePortfolio();

  const project = data.projects.find((p) => p.id === selectedProjectId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProjectId(null);
      }
    };
    if (selectedProjectId) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProjectId, setSelectedProjectId]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl bg-[#04082c] border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#ffea00] tracking-wider uppercase">
              {project.category}
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            onClick={() => setSelectedProjectId(null)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded hover:bg-white/5"
            aria-label="Close project modal"
          >
            <span className="text-xl leading-none">✕</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Media Container */}
          <div className="w-full aspect-video rounded overflow-hidden bg-[#02051e] border border-white/10 flex items-center justify-center">
            {project.thumbnailUrl && project.thumbnailUrl.trim() !== '' ? (
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="p-8 text-center space-y-2 select-none">
                <span className="font-mono text-sm text-[#ffea00]">
                  [ {project.placeholderLabel} ]
                </span>
                <p className="text-xs text-slate-400 font-mono">
                  {project.fps} · {project.technique}
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Original 2D artwork / frame container manageable from Admin Panel.
                </p>
              </div>
            )}
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block font-mono">YEAR</span>
              <span className="font-semibold text-white">{project.year}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">FRAME RATE</span>
              <span className="font-semibold text-white">{project.fps}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">RUN TIME</span>
              <span className="font-semibold text-white">{project.duration}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">TECHNIQUE</span>
              <span className="font-semibold text-white">{project.technique ? project.technique.split('&')[0] : '2D Animation'}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Project Synopsis & Direction
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-[#02051e]">
          <span className="text-xs text-slate-400 font-mono">
            MK Tales · Kishore Kumar
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedProjectId(null);
                setIsContactOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded transition-colors cursor-pointer"
            >
              Commission Similar Work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
