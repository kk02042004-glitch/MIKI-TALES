import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Increase payload limit for media uploads (base64)
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

// Ensure data and uploads directories exist
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Paths for persistent JSON databases
const SITE_DATA_FILE = path.join(DATA_DIR, 'siteData.json');
const ADMIN_USER_FILE = path.join(DATA_DIR, 'adminUser.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// --- Helper: Secure Password Hashing ---
function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 10000, 64, 'sha512').toString('hex');
  return { salt: generatedSalt, hash };
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
  const hashedAttempt = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hashedAttempt), Buffer.from(hash));
}

// --- Initialize Admin Credentials ---
function initializeAdminUser() {
  if (!fs.existsSync(ADMIN_USER_FILE)) {
    // Default bootstrap admin: kk02042004@gmail.com / admin, default temporary password
    const defaultPassword = process.env.INITIAL_ADMIN_PASSWORD || 'MKTales@2026Admin';
    const { salt, hash } = hashPassword(defaultPassword);
    const adminData = {
      id: 'admin-1',
      email: 'kk02042004@gmail.com',
      username: 'admin',
      fullName: 'Kishore Kumar',
      role: 'Administrator',
      salt,
      hash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(ADMIN_USER_FILE, JSON.stringify(adminData, null, 2), 'utf-8');
    console.log('[Auth] Admin user initialized for kk02042004@gmail.com / admin');
  }
}

// --- Initialize Site Data ---
function getInitialSiteData() {
  return {
    version: '2.0.0',
    status: 'published',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: 'Kishore Kumar',
    siteSettings: {
      websiteName: 'MK Tales',
      ownerName: 'Kishore Kumar',
      profession: '2D Animator',
      customLogoUrl: '',
      faviconUrl: '',
      primaryBrandColor: '#000066',
      secondaryBrandColor: '#02051e',
      accentColor: '#ffea00',
    },
    countdown: {
      targetDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      label: 'Available for new projects in:',
      completionMessage: 'Currently accepting select commissions for 2D Animation & Storytelling.',
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
      photoUrl: '',
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
        { number: '01', title: 'Understand', description: 'Understand the idea, audience and purpose of the project.' },
        { number: '02', title: 'Create', description: 'Turn the concept into engaging visual content through animation.' },
        { number: '03', title: 'Refine', description: 'Polish the animation and visual details to create a clean final result.' }
      ],
      whyMkTalesHeading: 'Why MK Tales?',
      whyMkTalesLead: 'MK Tales is built around a simple idea — turning stories and ideas into engaging visual experiences through animation.',
      whyMkTalesSub: 'Every project is approached with creativity, clarity and attention to detail.',
      ctaHeading: "Have an idea you'd like to bring to life?",
      ctaSubtext: "Let's work together and turn your idea into engaging visual content.",
      ctaButtonText: "Let's Work Together",
      heading: 'About Me',
      shortBio: "I'm Kishore Kumar, a 2D Animator focused on creating engaging visual stories, animated content and creative videos.",
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
        placeholderLabel: 'UPLOAD FEATURED PROJECT THUMBNAIL',
        description: 'Selected work showcasing my approach to 2D animation, visual storytelling and creative video production.',
        category: '2D ANIMATION SHOWCASE · 24 FPS',
      },
      clientsHeading: "Clients I've Worked With",
      clientsList: ['Hashim', 'Chetanya', 'Sanjay', 'Dhananjay'],
      experienceStatement: "I've had the opportunity to work on animation and video content for multiple YouTube channels and digital creators.",
      ctaHeading: 'Have a project in mind?',
      ctaSubtext: "Let's work together and bring your idea to life through animation.",
      ctaButtonText: "Let's Work Together",
    },
    clients: [
      { id: 'client-1', name: 'Hashim', projectCount: 3, notes: 'YouTube Narrative Series' },
      { id: 'client-2', name: 'Chetanya', projectCount: 2, notes: 'Character Storytelling' },
      { id: 'client-3', name: 'Sanjay', projectCount: 4, notes: 'Animated Creative Clips' },
      { id: 'client-4', name: 'Dhananjay', projectCount: 2, notes: 'Digital 2D Shorts' }
    ],
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
    },
    navigation: [
      { id: 'nav-home', label: 'Home', path: 'home', isEnabled: true, isSystem: true },
      { id: 'nav-about', label: 'About', path: 'about', isEnabled: true, isSystem: true },
      { id: 'nav-projects', label: 'Projects', path: 'projects', isEnabled: true, isSystem: true },
      { id: 'nav-pricing', label: 'Pricing', path: 'pricing', isEnabled: true, isSystem: true },
    ],
    footer: {
      brandName: 'MK Tales',
      description: 'Handcrafted 2D animation, story visual design, and creative video content by Kishore Kumar.',
      copyrightText: '© 2026 Kishore Kumar / MK Tales. All rights reserved.',
      socialLinks: {
        youtube: '',
        instagram: '',
        twitter: '',
        linkedin: '',
      }
    },
    seo: {
      homeTitle: 'Kishore Kumar — 2D Animator | MK Tales',
      homeDescription: 'Professional 2D Animator creating engaging animated stories, creative video content, and motion design.',
      aboutTitle: 'About Kishore Kumar — 2D Animator | MK Tales',
      aboutDescription: 'Meet Kishore Kumar, founder and 2D animator behind MK Tales. Specialized in frame-by-frame visual storytelling.',
      projectsTitle: 'My Projects — 2D Animation Portfolio | MK Tales',
      projectsDescription: 'Explore selected 2D animation shorts and creative video projects created for YouTube channels and digital creators.',
      pricingTitle: 'Transparent 2D Animation Pricing | MK Tales',
      pricingDescription: 'Simple ₹400/min 2D animation rate across all story categories. Optional voice-over and script writing add-ons.',
      ogImageUrl: '',
      faviconUrl: '',
    },
    pageVisibility: {
      home: 'published',
      about: 'published',
      projects: 'published',
      pricing: 'published',
      privacy: 'published',
    },
    privacyPolicy: {
      title: 'Privacy Policy',
      content: 'MK Tales values your privacy. We do not sell or trade your personal information. Any details shared through our direct contact channels (including email or phone) are strictly utilized for discussing client commissions and animation production details.',
      lastUpdated: 'October 2026'
    },
    media: []
  };
}

function initializeSiteData() {
  if (!fs.existsSync(SITE_DATA_FILE)) {
    const initial = getInitialSiteData();
    fs.writeFileSync(SITE_DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    console.log('[DB] Site database initialized successfully at', SITE_DATA_FILE);
  }
}

// Session store
function getSessions(): Record<string, { userId: string; email: string; expiresAt: number }> {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading sessions:', e);
  }
  return {};
}

function saveSessions(sessions: Record<string, { userId: string; email: string; expiresAt: number }>) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving sessions:', e);
  }
}

// Auth Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token.' });
  }

  const token = authHeader.split(' ')[1];
  const sessions = getSessions();
  const session = sessions[token];

  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  // Attach session info to req
  (req as any).user = session;
  next();
}

// Initialize databases
initializeAdminUser();
initializeSiteData();

// ==========================================
// API ROUTES
// ==========================================

// 1. PUBLIC: Get current published content
app.get('/api/public/content', (req: Request, res: Response) => {
  try {
    const raw = fs.readFileSync(SITE_DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    res.json({
      success: true,
      data,
    });
  } catch (e) {
    console.error('Failed to read public content:', e);
    res.status(500).json({ error: 'Could not load site content.' });
  }
});

// 2. AUTH: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required.' });
    }

    const adminRaw = fs.readFileSync(ADMIN_USER_FILE, 'utf-8');
    const admin = JSON.parse(adminRaw);

    const matchesUser =
      emailOrUsername.toLowerCase().trim() === admin.email.toLowerCase().trim() ||
      emailOrUsername.toLowerCase().trim() === admin.username.toLowerCase().trim();

    if (!matchesUser) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const isPasswordValid = verifyPassword(password, admin.salt, admin.hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const sessions = getSessions();
    sessions[token] = {
      userId: admin.id,
      email: admin.email,
      expiresAt,
    };
    saveSessions(sessions);

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Internal login error.' });
  }
});

// 3. AUTH: Logout
app.post('/api/auth/logout', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const sessions = getSessions();
      delete sessions[token];
      saveSessions(sessions);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (e) {
    res.status(500).json({ error: 'Logout failed.' });
  }
});

// 4. AUTH: Current Session Check
app.get('/api/auth/me', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminRaw = fs.readFileSync(ADMIN_USER_FILE, 'utf-8');
    const admin = JSON.parse(adminRaw);
    res.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (e) {
    res.status(500).json({ error: 'Could not retrieve profile.' });
  }
});

// 5. AUTH: Change Password & Settings
app.post('/api/auth/change-password', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, newEmail, newUsername } = req.body;
    const adminRaw = fs.readFileSync(ADMIN_USER_FILE, 'utf-8');
    const admin = JSON.parse(adminRaw);

    if (currentPassword) {
      const isCurrentValid = verifyPassword(currentPassword, admin.salt, admin.hash);
      if (!isCurrentValid) {
        return res.status(400).json({ error: 'Current password does not match.' });
      }
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
      }
      const { salt, hash } = hashPassword(newPassword);
      admin.salt = salt;
      admin.hash = hash;
    }

    if (newEmail) admin.email = newEmail.trim();
    if (newUsername) admin.username = newUsername.trim();
    admin.updatedAt = new Date().toISOString();

    fs.writeFileSync(ADMIN_USER_FILE, JSON.stringify(admin, null, 2), 'utf-8');
    res.json({ success: true, message: 'Admin credentials updated successfully.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update credentials.' });
  }
});

// 6. ADMIN: Get Full Content (Draft + Published)
app.get('/api/admin/content', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const raw = fs.readFileSync(SITE_DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ error: 'Could not read content data.' });
  }
});

// 7. ADMIN: Save Content (Draft)
app.put('/api/admin/content', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updatedData = req.body;
    if (!updatedData || typeof updatedData !== 'object') {
      return res.status(400).json({ error: 'Invalid content payload.' });
    }

    const payload = {
      ...updatedData,
      status: updatedData.status || 'draft',
      updatedAt: new Date().toISOString(),
      updatedBy: (req as any).user?.email || 'Administrator',
    };

    fs.writeFileSync(SITE_DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    res.json({ success: true, message: 'Changes saved successfully.', data: payload });
  } catch (e) {
    console.error('Error saving content:', e);
    res.status(500).json({ error: 'Failed to save content.' });
  }
});

// 8. ADMIN: Publish Content
app.post('/api/admin/publish', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const raw = fs.readFileSync(SITE_DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);

    const publishedData = {
      ...data,
      ...(req.body || {}),
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: (req as any).user?.email || 'Administrator',
    };

    fs.writeFileSync(SITE_DATA_FILE, JSON.stringify(publishedData, null, 2), 'utf-8');
    res.json({
      success: true,
      message: 'Website published successfully! Changes are now live on the public site.',
      data: publishedData,
    });
  } catch (e) {
    console.error('Error publishing content:', e);
    res.status(500).json({ error: 'Failed to publish content.' });
  }
});

// 9. ADMIN: Upload Media File (Images & Thumbnails only - Video uploads disabled)
app.post('/api/admin/upload', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { fileName, fileType, base64Data, category, usedOn } = req.body;

    if (!fileName || !base64Data) {
      return res.status(400).json({ error: 'File name and file data are required.' });
    }

    // Clean base64 string
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let mimeType = fileType;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Strict validation: Reject video files as requested
    const ext = (path.extname(fileName) || '').toLowerCase();
    const isVideo = mimeType?.toLowerCase().includes('video') || ['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext);
    if (isVideo) {
      return res.status(400).json({
        error: 'Video uploads and video storage are disabled. Please upload an image/thumbnail file (JPG, PNG, WebP, SVG).'
      });
    }

    // Validate size limit (max 15MB for images)
    const sizeInBytes = buffer.length;
    if (sizeInBytes > 15 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image file is too large. Maximum supported image size is 15MB.' });
    }

    // Safe sanitized unique filename
    const safeExt = ext || (mimeType?.includes('png') ? '.png' : mimeType?.includes('webp') ? '.webp' : '.jpg');
    const safeBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${Date.now()}_${safeBaseName}${safeExt}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    const sizeFormatted =
      sizeInBytes > 1024 * 1024
        ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${(sizeInBytes / 1024).toFixed(0)} KB`;

    // Add to Media Library collection in siteData
    const siteRaw = fs.readFileSync(SITE_DATA_FILE, 'utf-8');
    const siteData = JSON.parse(siteRaw);
    const mediaItem = {
      id: `media-${Date.now()}`,
      fileName: fileName,
      storedName: uniqueFileName,
      fileType: mimeType || 'image/jpeg',
      url: publicUrl,
      sizeInBytes,
      sizeFormatted,
      uploadDate: new Date().toISOString().slice(0, 10),
      category: category || 'Thumbnail',
      usedOn: usedOn || 'Unassigned',
    };

    siteData.media = [mediaItem, ...(siteData.media || [])];
    fs.writeFileSync(SITE_DATA_FILE, JSON.stringify(siteData, null, 2), 'utf-8');

    res.json({
      success: true,
      message: 'Thumbnail image uploaded and saved successfully.',
      file: mediaItem,
    });
  } catch (e) {
    console.error('File upload error:', e);
    res.status(500).json({ error: 'File upload failed. Please try again.' });
  }
});

// 10. ADMIN: Delete Media Item
app.delete('/api/admin/media/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const siteRaw = fs.readFileSync(SITE_DATA_FILE, 'utf-8');
    const siteData = JSON.parse(siteRaw);

    const mediaList = siteData.media || [];
    const target = mediaList.find((m: any) => m.id === id);

    if (target && target.storedName) {
      const filePath = path.join(UPLOADS_DIR, target.storedName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn('Could not remove file from disk:', unlinkErr);
        }
      }
    }

    siteData.media = mediaList.filter((m: any) => m.id !== id);
    fs.writeFileSync(SITE_DATA_FILE, JSON.stringify(siteData, null, 2), 'utf-8');

    res.json({ success: true, message: 'Media item deleted.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete media.' });
  }
});

// 11. ADMIN: Reset to Factory Defaults
app.post('/api/admin/reset', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const initial = getInitialSiteData();
    fs.writeFileSync(SITE_DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    res.json({ success: true, message: 'Site data reset to defaults.', data: initial });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reset site data.' });
  }
});

// --- Vite Middleware Integration ---
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted in development mode');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MK Tales Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
