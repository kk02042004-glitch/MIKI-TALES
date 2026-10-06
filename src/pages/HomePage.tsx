import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { AboutPreview } from '../components/AboutPreview';
import { ServicesSection } from '../components/ServicesSection';
import { FinalCta } from '../components/FinalCta';

export const HomePage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedProjects />
      <AboutPreview />
      <ServicesSection />
      <FinalCta />
    </main>
  );
};
