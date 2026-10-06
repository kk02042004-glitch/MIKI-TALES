import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { usePortfolio } from '../store/PortfolioContext';

export const AdminCMS: React.FC = () => {
  const { adminUser, logout, authFetch } = useAdminAuth();
  const { refreshContentFromServer, setCurrentPage } = usePortfolio();

  // Active Sidebar Section
  const [activeSection, setActiveSection] = useState<
    | 'dashboard'
    | 'settings'
    | 'home'
    | 'about'
    | 'projects'
    | 'pricing'
    | 'clients'
    | 'media'
    | 'contact'
    | 'countdown'
    | 'navigation'
    | 'footer'
    | 'seo'
    | 'visibility'
    | 'privacy'
    | 'account'
  >('dashboard');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Media upload input refs
  const generalFileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroVideoInputRef = useRef<HTMLInputElement>(null);
  const aboutPhotoInputRef = useRef<HTMLInputElement>(null);
  const aboutVideoInputRef = useRef<HTMLInputElement>(null);
  const projectsFeaturedVideoInputRef = useRef<HTMLInputElement>(null);

  // Account password change form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Fetch full content from backend on load
  const loadAdminContent = async () => {
    setIsDataLoading(true);
    try {
      const res = await authFetch('/api/admin/content');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSiteData(json.data);
          if (adminUser) setNewEmail(adminUser.email);
        }
      } else {
        showError('Could not load site data from server.');
      }
    } catch (e) {
      showError('Failed to connect to backend database.');
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadAdminContent();
  }, []);

  // Save Draft to Server
  const handleSaveDraft = async () => {
    if (!siteData) return;
    setIsSaving(true);
    try {
      const res = await authFetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...siteData,
          status: 'draft',
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSiteData(json.data);
        showToast('Changes saved successfully as draft.');
        await refreshContentFromServer();
      } else {
        showError(json.error || 'Failed to save changes.');
      }
    } catch (e) {
      showError('Network error while saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Changes to Public Site
  const handlePublish = async () => {
    if (!siteData) return;
    setIsPublishing(true);
    try {
      const res = await authFetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSiteData(json.data);
        showToast('Website published successfully! Changes are now live on the public site.');
        await refreshContentFromServer();
      } else {
        showError(json.error || 'Failed to publish changes.');
      }
    } catch (e) {
      showError('Network error while publishing.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Media Upload Handler (Base64 chunk upload to disk & catalog)
  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    category: string = 'General',
    usedOn: string = 'Unassigned',
    callback?: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showError('File is too large. Maximum supported size is 50MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Data = ev.target?.result as string;
      try {
        showToast(`Uploading ${file.name}...`);
        const res = await authFetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Data,
            category,
            usedOn,
          }),
        });

        const json = await res.json();
        if (res.ok && json.success) {
          showToast(`Uploaded ${file.name} successfully.`);
          if (callback && json.file?.url) {
            callback(json.file.url);
          }
          await loadAdminContent();
        } else {
          showError(json.error || 'Upload failed.');
        }
      } catch (err) {
        showError('Network error during media upload.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Delete Media File
  const handleDeleteMedia = async (id: string) => {
    try {
      const res = await authFetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Media item deleted.');
        await loadAdminContent();
      } else {
        showError('Failed to delete media item.');
      }
    } catch (e) {
      showError('Network error deleting media.');
    }
  };

  // Update nested field helper
  const updateNestedField = (section: string, field: string, value: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  // Handle Account Update
  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountStatus(null);
    try {
      const res = await authFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass || undefined,
          newEmail: newEmail || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAccountStatus('Account credentials updated successfully.');
        setCurrentPass('');
        setNewPass('');
      } else {
        setAccountStatus(`Error: ${json.error || 'Failed to update credentials'}`);
      }
    } catch (err) {
      setAccountStatus('Network error while updating credentials.');
    }
  };

  if (isDataLoading || !siteData) {
    return (
      <div className="min-h-screen bg-[#02051e] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-3 border-[#ffea00] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-slate-300">Loading MK Tales Admin CMS...</span>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'settings', label: 'Website Settings', icon: '⚙️' },
    { id: 'home', label: 'Home Page', icon: '🏠' },
    { id: 'about', label: 'About Page', icon: '👤' },
    { id: 'projects', label: 'Projects', icon: '🎬' },
    { id: 'pricing', label: 'Pricing', icon: '💎' },
    { id: 'clients', label: 'Clients', icon: '🤝' },
    { id: 'media', label: 'Media Library', icon: '📁' },
    { id: 'contact', label: 'Contact & CTA', icon: '📞' },
    { id: 'countdown', label: 'Countdown Bar', icon: '⏱️' },
    { id: 'navigation', label: 'Navigation', icon: '🧭' },
    { id: 'footer', label: 'Footer', icon: '📄' },
    { id: 'seo', label: 'SEO Settings', icon: '🔍' },
    { id: 'visibility', label: 'Page Visibility', icon: '👁️' },
    { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
    { id: 'account', label: 'Admin Settings', icon: '🔑' },
  ];

  return (
    <div className="min-h-screen bg-[#02051e] text-slate-200 flex flex-col font-sans selection:bg-[#ffea00] selection:text-[#000066]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#ffea00] text-[#000066] font-bold text-xs px-5 py-3 rounded-lg shadow-2xl animate-in slide-in-from-top-2 border border-black/10 flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white font-bold text-xs px-5 py-3 rounded-lg shadow-2xl animate-in slide-in-from-top-2 flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#04082c] border border-white/20 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">{confirmModal.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-white/20 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          TOP CONTROL BAR
          ================================================== */}
      <header className="bg-[#030623] border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded border border-white/10"
            aria-label="Toggle Menu"
          >
            ☰
          </button>
          <div className="w-8 h-8 rounded bg-[#ffea00] text-[#000066] font-black flex items-center justify-center text-sm shadow">
            MK
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>MK Tales Admin Panel</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                  siteData.status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {siteData.status || 'PUBLISHED'}
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Connected as {adminUser?.fullName} ({adminUser?.email})
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentPage('home')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-white/15 hover:border-white/30 rounded cursor-pointer flex items-center gap-1 transition-colors"
            title="Preview Public Website"
          >
            <span>Preview Site</span>
            <span>↗</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 text-xs font-bold text-[#000066] bg-[#ffea00] hover:bg-[#fff033] rounded cursor-pointer shadow-md disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            {isPublishing ? (
              <>
                <span className="w-3 h-3 border-2 border-[#000066] border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <span>Publish Changes</span>
            )}
          </button>
        </div>
      </header>

      {/* ==================================================
          MAIN LAYOUT: SIDEBAR + CONTENT
          ================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#030623] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3 overflow-y-auto space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-3 py-2 block">
              Control Modules
            </span>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as typeof activeSection);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  activeSection === item.id
                    ? 'bg-[#000066] text-[#ffea00] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => logout()}
              className="w-full py-2 px-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>🚪</span>
              <span>Logout Administrator</span>
            </button>
            <div className="text-[10px] font-mono text-slate-500 text-center">
              MK Tales CMS v2.0
            </div>
          </div>
        </aside>

        {/* MAIN EDITING WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#02051e]">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* ==================================================
                MODULE 1: DASHBOARD OVERVIEW
                ================================================== */}
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Website Dashboard Overview
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Central status and operational metrics for the MK Tales platform.
                  </p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#04082c] border border-white/10 rounded-lg space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 block">WEBSITE</span>
                    <span className="text-lg font-bold text-white block">
                      {siteData.siteSettings?.websiteName || 'MK Tales'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Live & Operational</span>
                  </div>

                  <div className="p-4 bg-[#04082c] border border-white/10 rounded-lg space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 block">PAGES</span>
                    <span className="text-lg font-bold text-white block">5 Pages</span>
                    <span className="text-[10px] text-[#ffea00] font-mono">Home · About · Projects...</span>
                  </div>

                  <div className="p-4 bg-[#04082c] border border-white/10 rounded-lg space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 block">PROJECTS</span>
                    <span className="text-lg font-bold text-white block">
                      {siteData.projects?.length || 4} Slots
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">YouTube Integrated</span>
                  </div>

                  <div className="p-4 bg-[#04082c] border border-white/10 rounded-lg space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 block">MEDIA ASSETS</span>
                    <span className="text-lg font-bold text-white block">
                      {siteData.media?.length || 0} Files
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">Cloud Disk Stored</span>
                  </div>
                </div>

                {/* Audit & Publish Status Box */}
                <div className="p-5 bg-[#030626] border border-white/10 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#ffea00] uppercase font-bold">
                      Publish & Audit Status
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Status: <strong className="text-white uppercase">{siteData.status}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-mono pt-2 border-t border-white/10">
                    <div>
                      <span className="text-slate-400 block text-[10px]">LAST PUBLISHED</span>
                      <span>{siteData.publishedAt ? new Date(siteData.publishedAt).toLocaleString() : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">LAST EDITED</span>
                      <span>{siteData.updatedAt ? new Date(siteData.updatedAt).toLocaleString() : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">EDITED BY</span>
                      <span>{siteData.updatedBy || 'Kishore Kumar'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Quick Management Actions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveSection('projects')}
                      className="p-4 bg-[#04082c] border border-white/10 hover:border-[#ffea00]/40 rounded-lg text-left transition-colors cursor-pointer space-y-1"
                    >
                      <span className="text-sm font-bold text-white block">🎬 Manage Projects</span>
                      <span className="text-[11px] text-slate-400 block">Edit 4 project slots & YouTube URLs</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('pricing')}
                      className="p-4 bg-[#04082c] border border-white/10 hover:border-[#ffea00]/40 rounded-lg text-left transition-colors cursor-pointer space-y-1"
                    >
                      <span className="text-sm font-bold text-white block">💎 Update Pricing Rates</span>
                      <span className="text-[11px] text-slate-400 block">₹400/min animation & add-ons</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('media')}
                      className="p-4 bg-[#04082c] border border-white/10 hover:border-[#ffea00]/40 rounded-lg text-left transition-colors cursor-pointer space-y-1"
                    >
                      <span className="text-sm font-bold text-white block">📁 Upload Media</span>
                      <span className="text-[11px] text-slate-400 block">Upload photos, videos & thumbnails</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 2: WEBSITE SETTINGS & BRANDING
                ================================================== */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Website & Brand Settings</h2>
                  <p className="text-xs text-slate-400">Manage identity, name, profession, logo and brand colors.</p>
                </div>

                {/* Hidden File Inputs */}
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={(e) =>
                    handleMediaUpload(e, 'Logo', 'Site Logo', (url) => {
                      updateNestedField('siteSettings', 'customLogoUrl', url);
                      updateNestedField('brand', 'customLogoUrl', url);
                    })
                  }
                  accept="image/*"
                  className="hidden"
                />

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Website Name</label>
                      <input
                        type="text"
                        value={siteData.siteSettings?.websiteName || 'MK Tales'}
                        onChange={(e) => updateNestedField('siteSettings', 'websiteName', e.target.value)}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Owner Name</label>
                      <input
                        type="text"
                        value={siteData.siteSettings?.ownerName || 'Kishore Kumar'}
                        onChange={(e) => {
                          updateNestedField('siteSettings', 'ownerName', e.target.value);
                          updateNestedField('brand', 'creatorName', e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Profession</label>
                      <input
                        type="text"
                        value={siteData.siteSettings?.profession || '2D Animator'}
                        onChange={(e) => {
                          updateNestedField('siteSettings', 'profession', e.target.value);
                          updateNestedField('brand', 'profession', e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Logo Management */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <span className="text-xs font-mono text-[#ffea00] uppercase block">
                      Brand Logo Asset
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#02051e] border border-white/15 rounded flex items-center justify-center p-2 overflow-hidden">
                        {siteData.siteSettings?.customLogoUrl && siteData.siteSettings.customLogoUrl.trim() !== '' ? (
                          <img
                            src={siteData.siteSettings.customLogoUrl}
                            alt="Logo"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="font-mono text-xs font-bold text-[#ffea00]">MK</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => logoInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-bold text-xs rounded hover:bg-[#fff033] cursor-pointer"
                        >
                          Upload / Replace Logo
                        </button>
                        {siteData.siteSettings?.customLogoUrl && (
                          <button
                            onClick={() => {
                              updateNestedField('siteSettings', 'customLogoUrl', '');
                              updateNestedField('brand', 'customLogoUrl', '');
                              showToast('Logo cleared to vector emblem default.');
                            }}
                            className="block text-[11px] text-slate-400 hover:text-white cursor-pointer mt-1"
                          >
                            Reset to Default MK Tales Emblem
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Color Pickers */}
                  <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Primary Brand Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteData.siteSettings?.primaryBrandColor || '#000066'}
                          onChange={(e) => updateNestedField('siteSettings', 'primaryBrandColor', e.target.value)}
                          className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-300">
                          {siteData.siteSettings?.primaryBrandColor || '#000066'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Secondary Color (Background)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteData.siteSettings?.secondaryBrandColor || '#02051e'}
                          onChange={(e) => updateNestedField('siteSettings', 'secondaryBrandColor', e.target.value)}
                          className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-300">
                          {siteData.siteSettings?.secondaryBrandColor || '#02051e'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Accent Color (Yellow)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteData.siteSettings?.accentColor || '#ffea00'}
                          onChange={(e) => updateNestedField('siteSettings', 'accentColor', e.target.value)}
                          className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-300">
                          {siteData.siteSettings?.accentColor || '#ffea00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 3: HOME PAGE MANAGEMENT
                ================================================== */}
            {activeSection === 'home' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Home Page Management</h2>
                  <p className="text-xs text-slate-400">Edit hero headline, subheadline, call to action, and the showcase thumbnail card.</p>
                </div>

                <input
                  type="file"
                  ref={heroVideoInputRef}
                  onChange={(e) =>
                    handleMediaUpload(e, 'Showcase Thumbnail', 'Home Hero Showcase', (url) => {
                      updateNestedField('heroVideo', 'thumbnailUrl', url);
                      updateNestedField('heroVideo', 'posterUrl', url);
                      updateNestedField('heroVideo', 'isCustomUploaded', true);
                      showToast('Hero showcase thumbnail uploaded.');
                    })
                  }
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                />

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Hero Section Copy</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Main Headline</label>
                      <input
                        type="text"
                        value={siteData.hero?.headline || ''}
                        onChange={(e) => updateNestedField('hero', 'headline', e.target.value)}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Subheadline</label>
                      <textarea
                        rows={2}
                        value={siteData.hero?.subheadline || ''}
                        onChange={(e) => updateNestedField('hero', 'subheadline', e.target.value)}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Primary CTA Text</label>
                        <input
                          type="text"
                          value={siteData.hero?.primaryCta || "Let's Work Together"}
                          onChange={(e) => updateNestedField('hero', 'primaryCta', e.target.value)}
                          className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Secondary CTA Text</label>
                        <input
                          type="text"
                          value={siteData.hero?.secondaryCta || 'View My Projects'}
                          onChange={(e) => updateNestedField('hero', 'secondaryCta', e.target.value)}
                          className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Showcase Thumbnail Card (Image/Thumbnail Section - Strictly No Video Storage) */}
                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">Hero Showcase Thumbnail Card</h3>
                      <p className="text-[11px] text-slate-400">Upload and manage the 16:9 thumbnail image card shown on the Home hero.</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#ffea00] px-2 py-0.5 border border-[#ffea00]/30 rounded uppercase">
                      THUMBNAIL CARD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Image Preview & Action Buttons */}
                    <div className="md:col-span-5 space-y-2">
                      <label className="text-xs font-mono text-slate-400 block">Thumbnail Preview</label>
                      <div className="relative aspect-video w-full rounded bg-[#02051e] border border-white/15 overflow-hidden flex items-center justify-center shadow-inner group">
                        {(siteData.heroVideo?.thumbnailUrl?.trim() || siteData.heroVideo?.posterUrl?.trim()) ? (
                          <>
                            <img
                              src={(siteData.heroVideo?.thumbnailUrl || siteData.heroVideo?.posterUrl)!.trim()}
                              alt="Hero Showcase Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-10 h-10 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center text-sm font-bold shadow-xl pl-0.5">
                                ▶
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4 space-y-1.5 select-none">
                            <div className="w-9 h-9 rounded-full border border-[#ffea00]/40 bg-[#000066]/50 mx-auto flex items-center justify-center text-[#ffea00] text-xs pl-0.5">
                              ▶
                            </div>
                            <span className="text-[11px] font-mono text-[#ffea00] block">
                              [ SHOWCASE THUMBNAIL ]
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              1920 × 1080 · 16:9 Aspect Ratio
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Image Upload, Replace, Delete Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => heroVideoInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-bold text-xs rounded hover:bg-[#fff033] cursor-pointer flex-1 text-center shadow-md"
                        >
                          {siteData.heroVideo?.thumbnailUrl ? 'Replace Image' : 'Upload Image'}
                        </button>
                        {siteData.heroVideo?.thumbnailUrl && (
                          <button
                            onClick={() => {
                              setSiteData((prev: any) => ({
                                ...prev,
                                heroVideo: {
                                  ...prev.heroVideo,
                                  thumbnailUrl: '',
                                  posterUrl: '',
                                  videoUrl: '',
                                  isCustomUploaded: false,
                                },
                              }));
                              showToast('Hero showcase thumbnail deleted.');
                            }}
                            className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded text-xs cursor-pointer"
                          >
                            Delete Image
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metadata: Title, Short Description, Category */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Card Title</label>
                        <input
                          type="text"
                          value={siteData.heroVideo?.title || ''}
                          onChange={(e) => updateNestedField('heroVideo', 'title', e.target.value)}
                          placeholder="MK Tales Showreel & 2D Animation Spotlight"
                          className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Short Description</label>
                        <textarea
                          rows={2}
                          value={siteData.heroVideo?.description || ''}
                          onChange={(e) => updateNestedField('heroVideo', 'description', e.target.value)}
                          placeholder="Showcase of original character animation, visual stories, and 2D animated scenes."
                          className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Category (Optional)</label>
                        <input
                          type="text"
                          value={siteData.heroVideo?.category || ''}
                          onChange={(e) => updateNestedField('heroVideo', 'category', e.target.value)}
                          placeholder="2D ANIMATION SHOWREEL · 24 FPS"
                          className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 4: ABOUT PAGE MANAGEMENT
                ================================================== */}
            {activeSection === 'about' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">About Page Management</h2>
                  <p className="text-xs text-slate-400">
                    Edit biography paragraphs, profile photo, introduction video, education, and workflow.
                  </p>
                </div>

                <input
                  type="file"
                  ref={aboutPhotoInputRef}
                  onChange={(e) =>
                    handleMediaUpload(e, 'Photo', 'About Profile Photo', (url) => {
                      updateNestedField('about', 'photoUrl', url);
                    })
                  }
                  accept="image/*"
                  className="hidden"
                />

                <input
                  type="file"
                  ref={aboutVideoInputRef}
                  onChange={(e) =>
                    handleMediaUpload(e, 'About Showcase Thumbnail', 'About Showcase', (url) => {
                      updateNestedField('about', 'introThumbnailUrl', url);
                      updateNestedField('about', 'videoPosterUrl', url);
                      showToast('Showcase thumbnail uploaded.');
                    })
                  }
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                />

                {/* Personal Profile Media */}
                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Profile & Showcase Media (No Video Storage)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Manage portrait photograph and the 2D animation showcase thumbnail card.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#ffea00] px-2 py-0.5 border border-[#ffea00]/30 rounded uppercase">
                      THUMBNAIL CARD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Personal Portrait Photo */}
                    <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-3">
                      <span className="text-xs font-mono text-[#ffea00] font-semibold block uppercase">
                        Personal Portrait Photo
                      </span>
                      <div className="aspect-[4/3] w-full bg-[#030623] rounded border border-white/10 overflow-hidden flex items-center justify-center relative">
                        {siteData.about?.photoUrl && siteData.about.photoUrl.trim() !== '' ? (
                          <img
                            src={siteData.about.photoUrl}
                            alt="Personal Photo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4 space-y-1">
                            <span className="text-xl block">👤</span>
                            <span className="text-[10px] font-mono text-slate-400">No Photo Uploaded</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => aboutPhotoInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-bold text-xs rounded hover:bg-[#fff033] cursor-pointer flex-1"
                        >
                          {siteData.about?.photoUrl ? 'Replace Photo' : 'Upload Photo'}
                        </button>
                        {siteData.about?.photoUrl && (
                          <button
                            onClick={() => {
                              updateNestedField('about', 'photoUrl', '');
                              showToast('Photo cleared.');
                            }}
                            className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs rounded cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 2. Animation Showcase Thumbnail Card */}
                    <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-3">
                      <span className="text-xs font-mono text-[#ffea00] font-semibold block uppercase">
                        Showcase Thumbnail Card
                      </span>
                      <div className="aspect-[4/3] w-full bg-[#030623] rounded border border-white/10 overflow-hidden flex items-center justify-center relative group">
                        {(siteData.about?.introThumbnailUrl?.trim() || siteData.about?.videoPosterUrl?.trim()) ? (
                          <>
                            <img
                              src={(siteData.about?.introThumbnailUrl || siteData.about?.videoPosterUrl)!.trim()}
                              alt="Showcase Thumbnail"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-10 h-10 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center text-sm font-bold shadow-xl pl-0.5">
                                ▶
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4 space-y-1">
                            <div className="w-8 h-8 rounded-full border border-[#ffea00]/40 mx-auto flex items-center justify-center text-[#ffea00] text-xs pl-0.5">
                              ▶
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">No Thumbnail Uploaded</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => aboutVideoInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-bold text-xs rounded hover:bg-[#fff033] cursor-pointer flex-1"
                        >
                          {siteData.about?.introThumbnailUrl ? 'Replace Image' : 'Upload Image'}
                        </button>
                        {siteData.about?.introThumbnailUrl && (
                          <button
                            onClick={() => {
                              updateNestedField('about', 'introThumbnailUrl', '');
                              updateNestedField('about', 'videoPosterUrl', '');
                              updateNestedField('about', 'videoUrl', '');
                              showToast('Showcase thumbnail cleared.');
                            }}
                            className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs rounded cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metadata fields for About Showcase Thumbnail Card */}
                  <div className="p-4 bg-[#02051e] border border-white/10 rounded-lg space-y-3">
                    <span className="text-xs font-mono text-slate-300 font-semibold block uppercase">
                      Showcase Card Information (Title & Description)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Card Title</label>
                        <input
                          type="text"
                          value={siteData.about?.introTitle || ''}
                          onChange={(e) => updateNestedField('about', 'introTitle', e.target.value)}
                          placeholder="Kishore Kumar — 2D Animation Reel & Spotlight"
                          className="w-full px-3 py-1.5 bg-[#030623] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Category (Optional)</label>
                        <input
                          type="text"
                          value={siteData.about?.introCategory || ''}
                          onChange={(e) => updateNestedField('about', 'introCategory', e.target.value)}
                          placeholder="2D ANIMATOR SHOWCASE"
                          className="w-full px-3 py-1.5 bg-[#030623] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Short Description</label>
                      <textarea
                        rows={2}
                        value={siteData.about?.introDescription || ''}
                        onChange={(e) => updateNestedField('about', 'introDescription', e.target.value)}
                        placeholder="Visual storytelling, character animation, and creative motion showcase."
                        className="w-full px-3 py-1.5 bg-[#030623] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Biography Paragraphs */}
                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
                    Biography Paragraphs
                  </h3>
                  {siteData.about?.biographyParagraphs?.map((paragraph: string, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Paragraph {idx + 1}</label>
                      <textarea
                        rows={2}
                        value={paragraph}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSiteData((prev: any) => ({
                            ...prev,
                            about: {
                              ...prev.about,
                              biographyParagraphs: prev.about.biographyParagraphs.map(
                                (p: string, pIdx: number) => (pIdx === idx ? val : p)
                              ),
                            },
                          }));
                        }}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  ))}
                </div>

                {/* Experience & Education */}
                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
                    Experience & Education Details
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Experience Description</label>
                      <textarea
                        rows={2}
                        value={siteData.about?.experienceText || ''}
                        onChange={(e) => updateNestedField('about', 'experienceText', e.target.value)}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Education Main Line</label>
                      <input
                        type="text"
                        value={siteData.about?.educationText || ''}
                        onChange={(e) => updateNestedField('about', 'educationText', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Education Supporting Line</label>
                      <textarea
                        rows={2}
                        value={siteData.about?.educationSubtext || ''}
                        onChange={(e) => updateNestedField('about', 'educationSubtext', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 5: PROJECTS MANAGEMENT
                ================================================== */}
            {activeSection === 'projects' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Projects Manager</h2>
                  <p className="text-xs text-slate-400">
                    Manage the 4 dedicated project slots, YouTube video URLs, and top featured showcase video.
                  </p>
                </div>

                <input
                  type="file"
                  ref={projectsFeaturedVideoInputRef}
                  onChange={(e) =>
                    handleMediaUpload(e, 'Projects Showcase Thumbnail', 'Projects Featured Showcase', (url) => {
                      updateNestedField('projectsPage', 'featuredVideo', {
                        ...siteData.projectsPage?.featuredVideo,
                        thumbnailUrl: url,
                        posterUrl: url,
                      });
                      showToast('Featured showcase thumbnail uploaded.');
                    })
                  }
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                />

                {/* Top Featured Project Showcase Thumbnail Card (No Video Storage) */}
                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Top Featured Showcase Thumbnail Card
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Top 16:9 banner showcase thumbnail on the Projects page (No video storage).
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#ffea00] px-2 py-0.5 border border-[#ffea00]/30 rounded uppercase">
                      THUMBNAIL CARD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Thumbnail Preview */}
                    <div className="md:col-span-5 space-y-2">
                      <label className="text-xs font-mono text-slate-400 block">Thumbnail Preview</label>
                      <div className="relative aspect-video w-full rounded bg-[#02051e] border border-white/15 overflow-hidden flex items-center justify-center shadow-inner group">
                        {(siteData.projectsPage?.featuredVideo?.thumbnailUrl?.trim() || siteData.projectsPage?.featuredVideo?.posterUrl?.trim()) ? (
                          <>
                            <img
                              src={(siteData.projectsPage?.featuredVideo?.thumbnailUrl || siteData.projectsPage?.featuredVideo?.posterUrl)!.trim()}
                              alt="Featured Showcase Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-10 h-10 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center text-sm font-bold shadow-xl pl-0.5">
                                ▶
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4 space-y-1.5 select-none">
                            <div className="w-9 h-9 rounded-full border border-[#ffea00]/40 bg-[#000066]/50 mx-auto flex items-center justify-center text-[#ffea00] text-xs pl-0.5">
                              ▶
                            </div>
                            <span className="text-[11px] font-mono text-[#ffea00] block">
                              [ FEATURED THUMBNAIL ]
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              1920 × 1080 · 16:9 Aspect Ratio
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => projectsFeaturedVideoInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-bold text-xs rounded hover:bg-[#fff033] cursor-pointer flex-1 text-center shadow-md"
                        >
                          {siteData.projectsPage?.featuredVideo?.thumbnailUrl ? 'Replace Image' : 'Upload Image'}
                        </button>
                        {siteData.projectsPage?.featuredVideo?.thumbnailUrl && (
                          <button
                            onClick={() => {
                              updateNestedField('projectsPage', 'featuredVideo', {
                                ...siteData.projectsPage.featuredVideo,
                                thumbnailUrl: '',
                                posterUrl: '',
                                videoUrl: '',
                              });
                              showToast('Featured showcase thumbnail deleted.');
                            }}
                            className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded text-xs cursor-pointer"
                          >
                            Delete Image
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Featured Card Title</label>
                        <input
                          type="text"
                          value={siteData.projectsPage?.featuredVideo?.title || ''}
                          onChange={(e) => {
                            updateNestedField('projectsPage', 'featuredVideo', {
                              ...siteData.projectsPage?.featuredVideo,
                              title: e.target.value,
                            });
                          }}
                          placeholder="Featured 2D Animation Project"
                          className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Category (Optional)</label>
                        <input
                          type="text"
                          value={siteData.projectsPage?.featuredVideo?.category || ''}
                          onChange={(e) => {
                            updateNestedField('projectsPage', 'featuredVideo', {
                              ...siteData.projectsPage?.featuredVideo,
                              category: e.target.value,
                            });
                          }}
                          placeholder="2D ANIMATION SHOWCASE · 24 FPS"
                          className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Description</label>
                        <textarea
                          rows={2}
                          value={siteData.projectsPage?.featuredVideo?.description || ''}
                          onChange={(e) => {
                            updateNestedField('projectsPage', 'featuredVideo', {
                              ...siteData.projectsPage?.featuredVideo,
                              description: e.target.value,
                            });
                          }}
                          placeholder="Selected work showcasing my approach to 2D animation..."
                          className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Dedicated Project Slots */}
                <div className="space-y-4">
                  <span className="text-xs font-mono text-[#ffea00] uppercase tracking-wider block">
                    Four Project Slots
                  </span>

                  {siteData.projects?.slice(0, 4).map((project: any, idx: number) => (
                    <div
                      key={project.id}
                      className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-mono text-xs text-[#ffea00] font-bold uppercase">
                          Project 0{idx + 1} — Client: {project.clientName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {project.thumbnailUrl ? 'Thumbnail Loaded' : 'Placeholder Active'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400">Project Title</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSiteData((prev: any) => ({
                                ...prev,
                                projects: prev.projects.map((p: any) =>
                                  p.id === project.id ? { ...p, title: val } : p
                                ),
                              }));
                            }}
                            className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400">Client Name</label>
                          <input
                            type="text"
                            value={project.clientName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSiteData((prev: any) => ({
                                ...prev,
                                projects: prev.projects.map((p: any) =>
                                  p.id === project.id ? { ...p, clientName: val } : p
                                ),
                              }));
                            }}
                            className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-slate-400">Category</label>
                          <input
                            type="text"
                            value={project.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSiteData((prev: any) => ({
                                ...prev,
                                projects: prev.projects.map((p: any) =>
                                  p.id === project.id ? { ...p, category: val } : p
                                ),
                              }));
                            }}
                            className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* YouTube URL */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono text-slate-400">
                            YouTube Video URL
                          </label>
                          {project.youtubeUrl && (
                            <a
                              href={project.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#ffea00] hover:underline"
                            >
                              Test Link ↗
                            </a>
                          )}
                        </div>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={project.youtubeUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiteData((prev: any) => ({
                              ...prev,
                              projects: prev.projects.map((p: any) =>
                                p.id === project.id ? { ...p, youtubeUrl: val } : p
                              ),
                            }));
                          }}
                          className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white font-mono text-xs"
                        />
                      </div>

                      {/* Thumbnail Preview & Upload */}
                      <div className="pt-2 border-t border-white/10 space-y-2">
                        <label className="text-xs font-mono text-slate-400 block">
                          Project Thumbnail Card (16:9 Image Preview)
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="relative aspect-video w-36 sm:w-44 bg-[#02051e] rounded border border-white/15 overflow-hidden flex items-center justify-center shadow-inner group shrink-0">
                            {project.thumbnailUrl && project.thumbnailUrl.trim() !== '' ? (
                              <>
                                <img
                                  src={project.thumbnailUrl}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-7 h-7 rounded-full bg-[#ffea00] text-[#000066] flex items-center justify-center text-[10px] font-bold shadow-md pl-0.5">
                                    ▶
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center p-2 select-none">
                                <span className="text-[10px] font-mono text-slate-400 block">No Image</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-bold text-xs rounded hover:bg-[#fff033] cursor-pointer shadow-sm">
                              {project.thumbnailUrl ? 'Replace Thumbnail' : 'Upload Thumbnail'}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                className="hidden"
                                onChange={(e) =>
                                  handleMediaUpload(e, 'Project Thumbnail', `Project Slot 0${idx + 1}`, (url) => {
                                    setSiteData((prev: any) => ({
                                      ...prev,
                                      projects: prev.projects.map((p: any) =>
                                        p.id === project.id ? { ...p, thumbnailUrl: url } : p
                                      ),
                                    }));
                                    showToast(`Thumbnail uploaded for Project 0${idx + 1}.`);
                                  })
                                }
                              />
                            </label>
                            {project.thumbnailUrl && (
                              <button
                                onClick={() => {
                                  setSiteData((prev: any) => ({
                                    ...prev,
                                    projects: prev.projects.map((p: any) =>
                                      p.id === project.id ? { ...p, thumbnailUrl: '' } : p
                                    ),
                                  }));
                                  showToast(`Thumbnail cleared for Project 0${idx + 1}.`);
                                }}
                                className="px-3 py-1.5 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs rounded cursor-pointer"
                              >
                                Delete Thumbnail
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 6: PRICING MANAGEMENT
                ================================================== */}
            {activeSection === 'pricing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Pricing Manager</h2>
                  <p className="text-xs text-slate-400">
                    Manage the base ₹400/min animation rate, voice-over, script writing, and story categories.
                  </p>
                </div>

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
                    Core Rates (Calculations update automatically)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">
                        2D Animation (₹ / minute)
                      </label>
                      <input
                        type="number"
                        value={siteData.pricing?.animationRatePerMinute || 400}
                        onChange={(e) =>
                          updateNestedField(
                            'pricing',
                            'animationRatePerMinute',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white font-mono text-sm font-bold"
                      />
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Same across all story types
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">
                        Voice-Over (₹ / minute)
                      </label>
                      <input
                        type="number"
                        value={siteData.pricing?.voiceOverRatePerMinute || 60}
                        onChange={(e) =>
                          updateNestedField(
                            'pricing',
                            'voiceOverRatePerMinute',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white font-mono text-sm font-bold"
                      />
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Optional add-on
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">
                        Script Writing (₹ / 20 min unit)
                      </label>
                      <input
                        type="number"
                        value={siteData.pricing?.scriptRatePerTwentyMinutes || 800}
                        onChange={(e) =>
                          updateNestedField(
                            'pricing',
                            'scriptRatePerTwentyMinutes',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white font-mono text-sm font-bold"
                      />
                      <span className="text-[10px] text-slate-500 block font-mono">
                        20-minute script unit
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story Categories */}
                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
                    Story Categories (All use the same rate)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {siteData.pricing?.storyCategories?.map((cat: string, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <label className="text-xs font-mono text-slate-400">Category {idx + 1}</label>
                        <input
                          type="text"
                          value={cat}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiteData((prev: any) => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                storyCategories: prev.pricing.storyCategories.map(
                                  (c: string, cIdx: number) => (cIdx === idx ? val : c)
                                ),
                              },
                            }));
                          }}
                          className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 7: CLIENTS MANAGEMENT
                ================================================== */}
            {activeSection === 'clients' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Clients Management</h2>
                    <p className="text-xs text-slate-400">
                      Manage client names displayed in the Projects collaborations section.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newClient = {
                        id: `client-${Date.now()}`,
                        name: 'New Client',
                        notes: 'YouTube Channel',
                      };
                      setSiteData((prev: any) => ({
                        ...prev,
                        clients: [...(prev.clients || []), newClient],
                        projectsPage: {
                          ...prev.projectsPage,
                          clientsList: [...(prev.projectsPage?.clientsList || []), newClient.name],
                        },
                      }));
                      showToast('Client slot added.');
                    }}
                    className="px-3 py-1.5 bg-[#ffea00] text-[#000066] font-bold text-xs rounded hover:bg-[#fff033] cursor-pointer"
                  >
                    + Add Client
                  </button>
                </div>

                <div className="space-y-3">
                  {siteData.clients?.map((client: any, idx: number) => (
                    <div
                      key={client.id}
                      className="p-4 bg-[#04082c] border border-white/10 rounded-lg flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-mono text-xs text-[#ffea00] font-bold">
                          0{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={client.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiteData((prev: any) => ({
                              ...prev,
                              clients: prev.clients.map((c: any) =>
                                c.id === client.id ? { ...c, name: val } : c
                              ),
                              projectsPage: {
                                ...prev.projectsPage,
                                clientsList: prev.clients.map((c: any) =>
                                  c.id === client.id ? val : c.name
                                ),
                              },
                            }));
                          }}
                          className="px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs font-semibold flex-1 max-w-xs"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Delete Client',
                            message: `Are you sure you want to remove "${client.name}"?`,
                            onConfirm: () => {
                              setSiteData((prev: any) => {
                                const filtered = prev.clients.filter((c: any) => c.id !== client.id);
                                return {
                                  ...prev,
                                  clients: filtered,
                                  projectsPage: {
                                    ...prev.projectsPage,
                                    clientsList: filtered.map((c: any) => c.name),
                                  },
                                };
                              });
                              showToast('Client removed.');
                            },
                          });
                        }}
                        className="text-xs text-red-400 hover:text-red-300 cursor-pointer px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 8: MEDIA LIBRARY
                ================================================== */}
            {activeSection === 'media' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Central Media Library</h2>
                    <p className="text-xs text-slate-400">
                      Manage images, thumbnails, portraits, and logo assets in persistent server storage.
                    </p>
                  </div>

                  <button
                    onClick={() => generalFileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#ffea00] text-[#000066] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#fff033] cursor-pointer shadow-md"
                  >
                    + Upload Image
                  </button>
                </div>

                <input
                  type="file"
                  ref={generalFileInputRef}
                  onChange={(e) => handleMediaUpload(e, 'General', 'Media Library')}
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                />

                {/* Media Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {siteData.media?.map((media: any) => (
                    <div
                      key={media.id}
                      className="p-3 bg-[#04082c] border border-white/10 rounded-lg flex flex-col justify-between space-y-3"
                    >
                      <div className="aspect-video w-full bg-[#02051e] rounded overflow-hidden flex items-center justify-center relative">
                        {media.url && media.url.trim() !== '' ? (
                          <img
                            src={media.url}
                            alt={media.fileName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-3 select-none">
                            <span className="text-2xl block mb-1">🖼️</span>
                            <span className="text-[10px] font-mono text-slate-400">IMAGE ASSET</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="font-semibold text-white truncate" title={media.fileName}>
                          {media.fileName}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>{media.sizeFormatted || 'Unknown size'}</span>
                          <span>{media.uploadDate || '2026-10'}</span>
                        </div>
                        <div className="text-[10px] text-[#ffea00] font-mono">
                          Used on: {media.usedOn || 'General'}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        {media.url && (
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ffea00] hover:underline text-[11px]"
                          >
                            Open File ↗
                          </a>
                        )}

                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Delete Media Asset',
                              message: `Are you sure you want to permanently delete "${media.fileName}"?`,
                              onConfirm: () => handleDeleteMedia(media.id),
                            });
                          }}
                          className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 9: CONTACT & CTA
                ================================================== */}
            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Contact & CTA Management</h2>
                  <p className="text-xs text-slate-400">
                    Manage studio telephone number and global call to action messaging.
                  </p>
                </div>

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Official Phone Number</label>
                      <input
                        type="text"
                        value={siteData.contact?.phone || '93414628'}
                        onChange={(e) => updateNestedField('contact', 'phone', e.target.value)}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white font-mono text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Contact Email</label>
                      <input
                        type="email"
                        value={siteData.contact?.email || 'kk02042004@gmail.com'}
                        onChange={(e) => updateNestedField('contact', 'email', e.target.value)}
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <label className="text-xs font-mono text-slate-400">Global CTA Headline</label>
                    <input
                      type="text"
                      value={siteData.contact?.ctaHeadline || 'Have a project in mind?'}
                      onChange={(e) => updateNestedField('contact', 'ctaHeadline', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Global CTA Subtext</label>
                    <textarea
                      rows={2}
                      value={siteData.contact?.ctaSubtext || "Let's create something meaningful together."}
                      onChange={(e) => updateNestedField('contact', 'ctaSubtext', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">CTA Button Text</label>
                    <input
                      type="text"
                      value={siteData.contact?.ctaButtonText || "Let's Work Together"}
                      onChange={(e) => updateNestedField('contact', 'ctaButtonText', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 10: COUNTDOWN BAR
                ================================================== */}
            {activeSection === 'countdown' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Countdown Manager</h2>
                  <p className="text-xs text-slate-400">Configure target date, visibility, and availability text.</p>
                </div>

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Enable Top Countdown Bar</span>
                    <input
                      type="checkbox"
                      checked={siteData.countdown?.isEnabled ?? true}
                      onChange={(e) => updateNestedField('countdown', 'isEnabled', e.target.checked)}
                      className="w-4 h-4 cursor-pointer text-[#ffea00]"
                    />
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-mono text-slate-400">Target Date & Time (ISO format)</label>
                    <input
                      type="text"
                      value={siteData.countdown?.targetDate || ''}
                      onChange={(e) => updateNestedField('countdown', 'targetDate', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Countdown Label</label>
                    <input
                      type="text"
                      value={siteData.countdown?.label || 'Available for new projects in:'}
                      onChange={(e) => updateNestedField('countdown', 'label', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 11: NAVIGATION & FOOTER
                ================================================== */}
            {activeSection === 'navigation' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Navigation Management</h2>
                  <p className="text-xs text-slate-400">Edit menu labels and ordering.</p>
                </div>

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-3">
                  {siteData.navigation?.map((nav: any, idx: number) => (
                    <div
                      key={nav.id}
                      className="flex items-center justify-between p-3 bg-[#02051e] border border-white/10 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#ffea00]">0{idx + 1}</span>
                        <input
                          type="text"
                          value={nav.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiteData((prev: any) => ({
                              ...prev,
                              navigation: prev.navigation.map((n: any) =>
                                n.id === nav.id ? { ...n, label: val } : n
                              ),
                            }));
                          }}
                          className="px-2 py-1 bg-[#04082c] border border-white/10 rounded text-white text-xs font-semibold"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Path: #{nav.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 12: FOOTER EDITOR
                ================================================== */}
            {activeSection === 'footer' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Footer Management</h2>
                  <p className="text-xs text-slate-400">Edit copyright, description, and footer links.</p>
                </div>

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Footer Brand Name</label>
                    <input
                      type="text"
                      value={siteData.footer?.brandName || 'MK Tales'}
                      onChange={(e) => updateNestedField('footer', 'brandName', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Footer Description</label>
                    <textarea
                      rows={2}
                      value={siteData.footer?.description || ''}
                      onChange={(e) => updateNestedField('footer', 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Copyright Text</label>
                    <input
                      type="text"
                      value={siteData.footer?.copyrightText || '© 2026 Kishore Kumar / MK Tales.'}
                      onChange={(e) => updateNestedField('footer', 'copyrightText', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 13: SEO SETTINGS
                ================================================== */}
            {activeSection === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">SEO & Meta Configuration</h2>
                  <p className="text-xs text-slate-400">Edit titles and meta descriptions for search engines.</p>
                </div>

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Homepage Meta Title</label>
                      <input
                        type="text"
                        value={siteData.seo?.homeTitle || ''}
                        onChange={(e) => updateNestedField('seo', 'homeTitle', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Homepage Meta Description</label>
                      <textarea
                        rows={2}
                        value={siteData.seo?.homeDescription || ''}
                        onChange={(e) => updateNestedField('seo', 'homeDescription', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">About Page Title</label>
                      <input
                        type="text"
                        value={siteData.seo?.aboutTitle || ''}
                        onChange={(e) => updateNestedField('seo', 'aboutTitle', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Projects Page Title</label>
                      <input
                        type="text"
                        value={siteData.seo?.projectsTitle || ''}
                        onChange={(e) => updateNestedField('seo', 'projectsTitle', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Pricing Page Title</label>
                      <input
                        type="text"
                        value={siteData.seo?.pricingTitle || ''}
                        onChange={(e) => updateNestedField('seo', 'pricingTitle', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 14: PAGE VISIBILITY
                ================================================== */}
            {activeSection === 'visibility' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Page Visibility & Publishing</h2>
                  <p className="text-xs text-slate-400">Control published or draft state for major pages.</p>
                </div>

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-3">
                  {['home', 'about', 'projects', 'pricing', 'privacy'].map((pageKey) => (
                    <div
                      key={pageKey}
                      className="p-3 bg-[#02051e] border border-white/10 rounded flex items-center justify-between"
                    >
                      <span className="font-bold text-white capitalize text-xs">{pageKey} Page</span>
                      <select
                        value={siteData.pageVisibility?.[pageKey] || 'published'}
                        onChange={(e) => updateNestedField('pageVisibility', pageKey, e.target.value)}
                        className="bg-[#04082c] border border-white/15 text-xs text-white rounded px-2.5 py-1"
                      >
                        <option value="published">Published (Live)</option>
                        <option value="draft">Draft (Admin Only)</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 15: PRIVACY POLICY
                ================================================== */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Privacy Policy Management</h2>
                  <p className="text-xs text-slate-400">Edit privacy policy disclosure text.</p>
                </div>

                <div className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Policy Title</label>
                    <input
                      type="text"
                      value={siteData.privacyPolicy?.title || 'Privacy Policy'}
                      onChange={(e) => updateNestedField('privacyPolicy', 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Policy Content</label>
                    <textarea
                      rows={6}
                      value={siteData.privacyPolicy?.content || ''}
                      onChange={(e) => updateNestedField('privacyPolicy', 'content', e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                MODULE 16: ADMIN SETTINGS & SECURITY
                ================================================== */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Admin Security & Credentials</h2>
                  <p className="text-xs text-slate-400">Update admin password, login email, and authentication settings.</p>
                </div>

                {accountStatus && (
                  <div
                    className={`p-3 rounded text-xs ${
                      accountStatus.startsWith('Error')
                        ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {accountStatus}
                  </div>
                )}

                <form onSubmit={handleAccountUpdate} className="p-5 bg-[#04082c] border border-white/10 rounded-lg space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-400">Admin Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">Current Password</label>
                      <input
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Required to change password"
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-400">New Password</label>
                      <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full px-3 py-2 bg-[#02051e] border border-white/10 rounded text-white text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ffea00] text-[#000066] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#fff033] cursor-pointer mt-2"
                  >
                    Update Credentials
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
