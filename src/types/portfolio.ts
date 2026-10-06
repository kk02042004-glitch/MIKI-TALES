/**
 * Portfolio Data Models for Kishore Kumar — 2D Animator | MK Tales
 */

export interface CountdownConfig {
  targetDate: string; // ISO date string e.g. "2026-10-24T00:00:00"
  label: string;
  isEnabled: boolean;
}

export interface HeroConfig {
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface HeroVideoConfig {
  thumbnailUrl?: string; // Thumbnail / image URL
  videoUrl?: string; // Kept for backward compatibility
  posterUrl?: string;
  title: string;
  description?: string;
  category?: string;
  placeholderLabel: string;
  isCustomUploaded: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  clientName: string;
  category: string;
  thumbnailUrl: string; // URL or data URL
  placeholderLabel: string;
  youtubeUrl: string; // Direct YouTube video URL
  description?: string;
  year?: string;
  duration?: string;
  fps?: string;
  technique?: string;
  videoUrl?: string;
}

export interface ProjectsPageFeaturedVideo {
  thumbnailUrl?: string; // Featured showcase image
  videoUrl?: string; // Kept for backward compatibility
  posterUrl?: string;
  title?: string;
  placeholderLabel: string;
  description: string;
  category?: string;
}

export interface ProjectsPageConfig {
  pageTitle: string;
  introSentence: string;
  featuredVideo: ProjectsPageFeaturedVideo;
  clientsHeading: string;
  clientsList: string[];
  experienceStatement: string;
  ctaHeading: string;
  ctaSubtext: string;
  ctaButtonText: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface ApproachStep {
  number: string;
  title: string;
  description: string;
}

export interface AboutConfig {
  label: string; // "ABOUT MK TALES"
  mainHeading: string; // "Meet Kishore Kumar"
  introSubtitle: string; // "I'm Kishore Kumar, a 2D Animator and the creator behind MK Tales."
  introLead: string; // "I create engaging 2D animations and visual content designed to turn ideas and stories into meaningful visual experiences."
  
  // Personal Info
  name: string; // "Kishore Kumar"
  profession: string; // "2D Animator"
  brand: string; // "MK Tales"
  experience: string; // "4+ Years"
  age: string; // "23, turning 24"
  education: string; // "Graduation — Mathematics"

  // Biography
  biographyParagraphs: string[];

  // Media
  photoUrl: string;
  introThumbnailUrl?: string;
  introTitle?: string;
  introDescription?: string;
  introCategory?: string;
  videoUrl?: string;
  videoPosterUrl?: string;

  // Experience & Education
  experienceHeading: string;
  experienceText: string;

  educationHeading: string;
  educationText: string;
  educationSubtext: string;

  // What I Do
  whatIDoHeading: string;
  whatIDoList: string[];

  // Approach
  approachHeading: string;
  approachSteps: ApproachStep[];

  // Why MK Tales
  whyMkTalesHeading: string;
  whyMkTalesLead: string;
  whyMkTalesSub: string;

  // CTA
  ctaHeading: string;
  ctaSubtext: string;
  ctaButtonText: string;

  // Backward compatibility for homepage preview
  heading?: string;
  shortBio?: string;
}

export interface ContactConfig {
  phone: string; // "93414628"
  email: string;
  location: string;
  ctaHeadline: string;
  ctaSubtext: string;
  ctaButtonText: string;
}

export interface PricingConfig {
  pageTitle: string;
  pageSubtitle: string;
  note: string;
  animationRatePerMinute: number;
  voiceOverRatePerMinute: number;
  scriptRatePerTwentyMinutes: number;
  storyCategories: string[];
  includedFeatures: string[];
  exampleDurationMinutes: number;
  monthlyMinutes: number;
  monthlyScriptsCount: number;
  ctaHeading: string;
  ctaSubtext: string;
  ctaButtonText: string;
}

export interface BrandConfig {
  brandName: string; // "MK Tales"
  creatorName: string; // "Kishore Kumar"
  profession: string; // "2D Animator"
  customLogoUrl: string; // Base64 data URL or custom image URL uploaded by user
}

export interface PortfolioData {
  brand: BrandConfig;
  countdown: CountdownConfig;
  hero: HeroConfig;
  heroVideo: HeroVideoConfig;
  projects: ProjectItem[];
  projectsPage: ProjectsPageConfig;
  about: AboutConfig;
  pricing: PricingConfig;
  services: ServiceItem[];
  contact: ContactConfig;
  siteSettings?: any;
  clients?: any[];
  media?: any[];
  navigation?: any[];
  footer?: any;
  seo?: any;
  privacyPolicy?: any;
  pageVisibility?: any;
  status?: string;
  updatedAt?: string;
  publishedAt?: string;
  updatedBy?: string;
}

export type PageRoute = 'home' | 'about' | 'projects' | 'pricing' | 'privacy' | 'admin';
