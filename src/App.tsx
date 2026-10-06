import React from 'react';
import { PortfolioProvider, usePortfolio } from './store/PortfolioContext';
import { AdminAuthProvider, useAdminAuth } from './admin/AdminAuthContext';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminCMS } from './admin/AdminCMS';

import { CountdownBar } from './components/CountdownBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ContactModal } from './components/ContactModal';
import { AdminModal } from './components/AdminModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

const AppContent: React.FC = () => {
  const { currentPage } = usePortfolio();
  const { isAuthenticated, isLoading } = useAdminAuth();

  // If viewing Admin Route
  if (currentPage === 'admin') {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#02051e] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-[#ffea00] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLoginPage />;
    }

    return <AdminCMS />;
  }

  // Public Website Render
  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'pricing':
        return <PricingPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#02051e] text-[#f8fafc] font-sans">
      {/* 1. Very small & minimal countdown bar at the very top */}
      <CountdownBar />

      {/* 2. Clean header navigation with original MK Tales logo */}
      <Header />

      {/* 3. Page Body */}
      <div className="flex-1">
        {renderPage()}
      </div>

      {/* 4. Minimal Footer */}
      <Footer />

      {/* 5. Modals */}
      <ProjectModal />
      <ContactModal />
      <AdminModal />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </PortfolioProvider>
  );
}

