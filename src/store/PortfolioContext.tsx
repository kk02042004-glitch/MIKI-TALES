import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, PageRoute } from '../types/portfolio';
import { INITIAL_PORTFOLIO_DATA } from './initialData';

const STORAGE_KEY = 'mk_tales_portfolio_config_v1';

interface PortfolioContextType {
  data: PortfolioData;
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  updateData: (updater: (prev: PortfolioData) => PortfolioData) => void;
  updateField: <K extends keyof PortfolioData>(section: K, value: PortfolioData[K]) => void;
  resetToDefaults: () => void;
  exportConfigJson: () => void;
  importConfigJson: (jsonString: string) => boolean;
  refreshContentFromServer: () => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure essential fields exist even if schema evolved
        const mergedProjects = INITIAL_PORTFOLIO_DATA.projects.map((initialProj, index) => {
          const existing = parsed.projects && parsed.projects[index];
          return existing ? { ...initialProj, ...existing } : initialProj;
        });

        return {
          ...INITIAL_PORTFOLIO_DATA,
          ...parsed,
          projects: mergedProjects,
          projectsPage: {
            ...INITIAL_PORTFOLIO_DATA.projectsPage,
            ...(parsed.projectsPage || {}),
            featuredVideo: {
              ...INITIAL_PORTFOLIO_DATA.projectsPage.featuredVideo,
              ...((parsed.projectsPage && parsed.projectsPage.featuredVideo) || {}),
            },
          },
          about: {
            ...INITIAL_PORTFOLIO_DATA.about,
            ...(parsed.about || {}),
          },
          pricing: {
            ...INITIAL_PORTFOLIO_DATA.pricing,
            ...(parsed.pricing || {}),
          },
          contact: {
            ...INITIAL_PORTFOLIO_DATA.contact,
            ...parsed.contact,
            phone: '93414628', // preserve exact phone number
          },
          brand: {
            ...INITIAL_PORTFOLIO_DATA.brand,
            ...parsed.brand,
          }
        };
      }
    } catch (e) {
      console.error('Failed to load portfolio data from storage:', e);
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Sync to localStorage safely without exceeding browser quota
  useEffect(() => {
    try {
      const sanitized = JSON.parse(JSON.stringify(data));
      // Remove any data: base64 URLs from localStorage cache so quota is never exceeded
      const stripLargeStrings = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        for (const key of Object.keys(obj)) {
          if (typeof obj[key] === 'string') {
            if (obj[key].startsWith('data:') || obj[key].length > 8000) {
              obj[key] = '';
            }
          } else if (typeof obj[key] === 'object') {
            stripLargeStrings(obj[key]);
          }
        }
      };
      stripLargeStrings(sanitized);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch {
      // Gracefully prevent browser quota exception from bubbling up
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [data]);

  // Fetch published data from backend server on mount
  const refreshContentFromServer = async () => {
    try {
      const res = await fetch('/api/public/content');
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          setData((prev) => ({
            ...prev,
            ...json.data,
            about: {
              ...prev.about,
              ...(json.data.about || {}),
            },
            projectsPage: {
              ...prev.projectsPage,
              ...(json.data.projectsPage || {}),
              featuredVideo: {
                ...prev.projectsPage.featuredVideo,
                ...((json.data.projectsPage && json.data.projectsPage.featuredVideo) || {}),
              },
            },
            pricing: {
              ...prev.pricing,
              ...(json.data.pricing || {}),
            },
            contact: {
              ...prev.contact,
              ...(json.data.contact || {}),
              phone: json.data.contact?.phone || '93414628',
            },
          }));
        }
      }
    } catch (err) {
      console.warn('Could not fetch server data, utilizing local cache:', err);
    }
  };

  useEffect(() => {
    refreshContentFromServer();
  }, []);

  // Sync with browser URL hash and path
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '') as PageRoute;

      if (path === '/admin' || hash === 'admin') {
        setCurrentPage('admin');
      } else if (['home', 'about', 'projects', 'pricing', 'privacy'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  const navigateToPage = (page: PageRoute) => {
    setCurrentPage(page);
    if (page === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = page === 'home' ? '' : page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateData = (updater: (prev: PortfolioData) => PortfolioData) => {
    setData((prev) => updater(prev));
  };

  const updateField = <K extends keyof PortfolioData>(section: K, value: PortfolioData[K]) => {
    setData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const resetToDefaults = () => {
    setData(INITIAL_PORTFOLIO_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportConfigJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mk-tales-portfolio-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfigJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        setData({
          ...INITIAL_PORTFOLIO_DATA,
          ...parsed,
          contact: {
            ...INITIAL_PORTFOLIO_DATA.contact,
            ...parsed.contact,
            phone: '93414628',
          }
        });
        return true;
      }
    } catch (e) {
      console.error('Import failed:', e);
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        currentPage,
        setCurrentPage: navigateToPage,
        updateData,
        updateField,
        resetToDefaults,
        exportConfigJson,
        importConfigJson,
        refreshContentFromServer,
        isAdminOpen,
        setIsAdminOpen,
        isContactOpen,
        setIsContactOpen,
        selectedProjectId,
        setSelectedProjectId,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
