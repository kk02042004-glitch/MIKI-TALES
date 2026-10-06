import { PortfolioData } from '../types/portfolio';

// Default countdown target: set to 14 days from initial load
const getDefaultCountdownDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
};

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  brand: {
    brandName: 'MK Tales',
    creatorName: 'Kishore Kumar',
    profession: '2D Animator',
    customLogoUrl: '', // Default uses the exact MK Tales vector emblem matching the uploaded logo
  },
  countdown: {
    targetDate: getDefaultCountdownDate(),
    label: 'Available for new projects in:',
    isEnabled: true,
  },
  hero: {
    headline: 'Bringing Stories to Life Through 2D Animation.',
    subheadline: "I'm Kishore Kumar, a 2D Animator creating engaging animated content, visual stories and creative videos.",
    primaryCta: "Let's Work Together",
    secondaryCta: 'View My Projects',
  },
  heroVideo: {
    thumbnailUrl: '',
    videoUrl: '',
    posterUrl: '',
    title: 'MK Tales Showreel & 2D Animation Spotlight',
    description: 'Showcase of original character animation, visual stories, and 2D animated scenes.',
    category: '2D ANIMATION SHOWREEL · 24 FPS',
    placeholderLabel: 'HERO SHOWCASE THUMBNAIL',
    isCustomUploaded: false,
  },
  projects: [
    {
      id: 'proj-1',
      title: '2D Animation Short',
      clientName: 'Hashim',
      category: '2D Animation / YouTube Content',
      thumbnailUrl: '',
      placeholderLabel: 'Upload Project 01 Thumbnail',
      youtubeUrl: '',
      description: 'Hand-drawn character study and fluid 2D animation created for digital storytelling.',
      year: '2026',
      duration: '01:45',
      fps: '24 FPS',
      technique: '2D Character Animation',
    },
    {
      id: 'proj-2',
      title: 'Character Narrative Series',
      clientName: 'Chetanya',
      category: '2D Animation / YouTube Content',
      thumbnailUrl: '',
      placeholderLabel: 'Upload Project 02 Thumbnail',
      youtubeUrl: '',
      description: 'Engaging character narrative and dynamic camera staging created for YouTube creator audience.',
      year: '2025',
      duration: '02:10',
      fps: '24 FPS',
      technique: 'Visual Storytelling',
    },
    {
      id: 'proj-3',
      title: 'Creative Animated Sequence',
      clientName: 'Sanjay',
      category: '2D Animation / YouTube Content',
      thumbnailUrl: '',
      placeholderLabel: 'Upload Project 03 Thumbnail',
      youtubeUrl: '',
      description: 'Atmospheric 2D animation sequence synchronized with creative video pacing and motion.',
      year: '2025',
      duration: '03:20',
      fps: '24 FPS',
      technique: 'Frame-by-Frame Motion',
    },
    {
      id: 'proj-4',
      title: 'Dynamic Story Visuals',
      clientName: 'Dhananjay',
      category: '2D Animation / YouTube Content',
      thumbnailUrl: '',
      placeholderLabel: 'Upload Project 04 Thumbnail',
      youtubeUrl: '',
      description: 'Stylized 2D motion and narrative visual beats crafted for YouTube digital content.',
      year: '2025',
      duration: '02:40',
      fps: '24 FPS',
      technique: '2D Animation & Motion Design',
    },
  ],
  projectsPage: {
    pageTitle: 'My Projects',
    introSentence: "Explore some of the animation and creative video projects I've worked on for YouTube channels and digital creators.",
    featuredVideo: {
      thumbnailUrl: '',
      videoUrl: '',
      posterUrl: '',
      title: 'Featured 2D Animation Project',
      category: '2D ANIMATION SHOWCASE · 24 FPS',
      placeholderLabel: 'UPLOAD FEATURED PROJECT THUMBNAIL',
      description: 'Selected work showcasing my approach to 2D animation, visual storytelling and creative video production.',
    },
    clientsHeading: "Clients I've Worked With",
    clientsList: ['Hashim', 'Chetanya', 'Sanjay', 'Dhananjay'],
    experienceStatement: "I've had the opportunity to work on animation and video content for multiple YouTube channels and digital creators.",
    ctaHeading: 'Have a project in mind?',
    ctaSubtext: "Let's work together and bring your idea to life through animation.",
    ctaButtonText: "Let's Work Together",
  },
  about: {
    label: 'ABOUT MK TALES',
    mainHeading: 'Meet Kishore Kumar',
    introSubtitle: "I'm Kishore Kumar, a 2D Animator and the creator behind MK Tales.",
    introLead: 'I create engaging 2D animations and visual content designed to turn ideas and stories into meaningful visual experiences.',
    
    name: 'Kishore Kumar',
    profession: '2D Animator',
    brand: 'MK Tales',
    experience: '4+ Years',
    age: '23, turning 24',
    education: 'Graduation — Mathematics',

    biographyParagraphs: [
      "Hi, I'm Kishore Kumar, a 2D Animator with more than four years of experience in animation and visual content creation.",
      "I enjoy turning ideas, stories and concepts into engaging visual experiences through 2D animation. My focus is on creating content that is visually appealing, easy to understand and meaningful for the audience.",
      "Alongside my creative work, I am currently pursuing my graduation with Mathematics. My education and creative experience allow me to approach projects with both creativity and structured thinking.",
      "Through MK Tales, my goal is to create high-quality animated content and help individuals, creators and businesses communicate their ideas through animation."
    ],

    photoUrl: '', // Editable user-uploaded photo placeholder
    introThumbnailUrl: '',
    introTitle: 'Kishore Kumar — 2D Animation Reel & Spotlight',
    introDescription: 'Visual storytelling, character animation, and creative motion showcase.',
    introCategory: '2D ANIMATION SPOTLIGHT · 24 FPS',
    videoUrl: '',
    videoPosterUrl: '',

    experienceHeading: 'My Experience',
    experienceText: 'With more than 4 years of experience in 2D animation, I have developed a strong understanding of visual storytelling, animation principles and creating engaging content for digital platforms.',

    educationHeading: 'Education',
    educationText: 'Currently pursuing graduation with Mathematics.',
    educationSubtext: 'Alongside my academic journey, I continue to develop my skills in animation, visual storytelling and creative content production.',

    whatIDoHeading: 'What I Do',
    whatIDoList: [
      '2D Animation',
      'Animated Storytelling',
      'Creative Video Content',
      'Visual Content Creation'
    ],

    approachHeading: 'My Approach',
    approachSteps: [
      {
        number: '01',
        title: 'Understand',
        description: 'Understand the idea, audience and purpose of the project.'
      },
      {
        number: '02',
        title: 'Create',
        description: 'Turn the concept into engaging visual content through animation.'
      },
      {
        number: '03',
        title: 'Refine',
        description: 'Polish the animation and visual details to create a clean final result.'
      }
    ],

    whyMkTalesHeading: 'Why MK Tales?',
    whyMkTalesLead: 'MK Tales is built around a simple idea — turning stories and ideas into engaging visual experiences through animation.',
    whyMkTalesSub: 'Every project is approached with creativity, clarity and attention to detail.',

    ctaHeading: "Have an idea you'd like to bring to life?",
    ctaSubtext: "Let's work together and turn your idea into engaging visual content.",
    ctaButtonText: "Let's Work Together",

    // Compatibility for homepage preview
    heading: 'About Me',
    shortBio: "I'm Kishore Kumar, a 2D Animator focused on creating engaging visual stories, animated content and creative videos.",
  },
  pricing: {
    pageTitle: 'Pricing',
    pageSubtitle: 'Simple and transparent pricing for professional 2D animated videos.',
    note: 'The animation rate is the same for all story categories.',
    animationRatePerMinute: 400,
    voiceOverRatePerMinute: 60,
    scriptRatePerTwentyMinutes: 800,
    storyCategories: [
      'Moral Stories',
      'Food Cartoon Videos',
      'Horror Stories',
      'Other Story-Based Videos',
    ],
    includedFeatures: [
      'Professional 2D Animation',
      'Visual Storytelling',
      'Story-Based Video Production',
      'YouTube-Friendly Video Content',
    ],
    exampleDurationMinutes: 20,
    monthlyMinutes: 80,
    monthlyScriptsCount: 4,
    ctaHeading: 'Ready to start your project?',
    ctaSubtext: "Let's discuss your video requirements and create something together.",
    ctaButtonText: "Let's Work Together",
  },
  services: [
    {
      id: 'serv-1',
      number: '01',
      title: '2D Animation',
      description: 'Full-spectrum frame-by-frame character animation, episodic shorts, and expressive 2D motion designed for digital broadcast, films, and creator series.',
      highlights: ['Character Keyframing & Inbetweens', 'Expressive Facial Acting', 'Fluid Action Choreography']
    },
    {
      id: 'serv-2',
      number: '02',
      title: 'Creative Video Content',
      description: 'Engaging animated video production tailored for creative brands, musicians, and digital publishers looking to capture immediate viewer retention.',
      highlights: ['Animated Music Video Sequences', 'Viral Narrative Clips & Reels', 'Custom Social Video Formats']
    },
    {
      id: 'serv-3',
      number: '03',
      title: 'Storytelling & Motion Design',
      description: 'End-to-end narrative development including story script visualization, thumbnail boards, animatic pacing, kinetic type, and stylized motion graphics.',
      highlights: ['Storyboards & Beat Boards', 'Animatic Timing & Rhythm', 'Stylized 2D Graphic Motion']
    }
  ],
  contact: {
    phone: '93414628',
    email: 'kk02042004@gmail.com',
    location: 'Available Globally / Remote Studio',
    ctaHeadline: 'Have a project in mind?',
    ctaSubtext: "Let's create something meaningful together.",
    ctaButtonText: "Let's Work Together",
  }
};
