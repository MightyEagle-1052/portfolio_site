/**
 * Centralized site content for the Daniel Stive portfolio.
 * Edit profile info, links, domains, expertise and skills here.
 */

export const PROFILE = {
  name: 'Daniel Stive',
  firstName: 'Daniel',
  monogram: 'DS',
  role: 'AI & CV | CG & AR/VR Developer',
  yearsExperience: 8,
  heroDescription:
    'I build intelligent computer vision systems, advanced 3D visualization experiences, immersive AR/VR applications, and interactive digital worlds.',
  shortBio:
    'Software developer specializing in AI, Computer Vision, Computer Graphics, 3D GIS, AR/VR and Game Development — building intelligent visual systems and immersive digital experiences.',
  hireNote: 'Available for new projects',
};

/** External links. Leave optional links empty ('') until a real URL is provided — they will be hidden automatically. */
export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/daniel-stive-patino-sepulveda-a8b351448/',
  telegram: 'https://t.me/MightyEagle1052',
  whatsapp: 'https://wa.me/639759738697',
  email: 'danielstivepartinosepulveda1@gmail.com',
  github: '',
  booking:
    'https://famous.ai/api/crm/6aec6bc022499b887aa4de5b/calendar/public?calendarId=c5250339-c24b-413f-8c0d-941195615852&view=booking',
};

export const CRM_SUBSCRIBE_URL = 'https://famous.ai/api/crm/6aec6bc022499b887aa4de5b/subscribe';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

/** The four official portfolio tags. */
export const TAGS = ['AI&CV', 'CG&3D', 'AR/VR&XR', 'GameDev'] as const;
export type Tag = (typeof TAGS)[number];

export type DomainKey = 'ai' | 'cg' | 'xr' | 'game';

export interface Domain {
  key: DomainKey;
  tag: Tag;
  title: string;
  short: string;
  description: string;
  technologies: string[];
  /** Tailwind classes for the domain color identity */
  accent: { text: string; bg: string; ring: string; gradient: string };
}

export const DOMAINS: Domain[] = [
  {
    key: 'ai',
    tag: 'AI&CV',
    title: 'AI & Computer Vision',
    short: 'Artificial Intelligence & Computer Vision',
    description:
      'Intelligent visual systems that detect, segment, track and analyze — turning images and video into actionable insight.',
    technologies: ['Python', 'OpenCV', 'PyTorch', 'YOLO', 'Object Detection', 'Image Segmentation', 'Motion Tracking', 'Deep Learning', 'AI Analytics'],
    accent: {
      text: 'text-sky-600 dark:text-cyan-300',
      bg: 'bg-sky-500/10 dark:bg-cyan-400/10',
      ring: 'ring-sky-500/30 dark:ring-cyan-400/30',
      gradient: 'from-sky-500 to-cyan-400',
    },
  },
  {
    key: 'cg',
    tag: 'CG&3D',
    title: 'Computer Graphics & 3D GIS',
    short: 'Computer Graphics, 3D Modeling & 3D GIS',
    description:
      'Real-time 3D rendering, modeling and geospatial visualization — from interactive web scenes to digital twins of entire cities.',
    technologies: ['Three.js', 'WebGL', 'React Three Fiber', 'Blender', 'SketchUp', 'Autodesk 3ds Max', 'CesiumJS', 'GeoPandas', 'GDAL', 'Rasterio'],
    accent: {
      text: 'text-violet-600 dark:text-violet-300',
      bg: 'bg-violet-500/10 dark:bg-violet-400/10',
      ring: 'ring-violet-500/30 dark:ring-violet-400/30',
      gradient: 'from-violet-500 to-fuchsia-500',
    },
  },
  {
    key: 'xr',
    tag: 'AR/VR&XR',
    title: 'AR/VR & XR Development',
    short: 'Augmented, Virtual & Extended Reality',
    description:
      'Immersive experiences that blend digital content with the physical world across headsets, mobile devices and the browser.',
    technologies: ['A-Frame', 'OpenXR', 'AR Foundation', 'WebXR', 'Virtual Reality', 'Augmented Reality', 'Interactive 3D Experiences'],
    accent: {
      text: 'text-blue-600 dark:text-blue-300',
      bg: 'bg-blue-500/10 dark:bg-blue-400/10',
      ring: 'ring-blue-500/30 dark:ring-blue-400/30',
      gradient: 'from-blue-600 to-indigo-500',
    },
  },
  {
    key: 'game',
    tag: 'GameDev',
    title: 'Game Development',
    short: 'Game Development',
    description:
      'Interactive games and real-time worlds with solid mechanics, networked multiplayer and polished visuals.',
    technologies: ['Unity', 'C#', 'Unreal Engine', 'C++', 'Game Mechanics', 'Multiplayer Systems', '3D Environments', 'Shaders'],
    accent: {
      text: 'text-emerald-600 dark:text-emerald-300',
      bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
      ring: 'ring-emerald-500/30 dark:ring-emerald-400/30',
      gradient: 'from-emerald-500 to-teal-400',
    },
  },
];

export const domainByTag = (tag: string) => DOMAINS.find((d) => d.tag === tag);

/* ---------------- Skills ---------------- */

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

export interface Skill {
  name: string;
  /** Optional logo URL (devicon). Skills without logos render a monogram badge. */
  logo?: string;
}

export interface SkillCategory {
  title: string;
  domain: DomainKey | 'web';
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'AI & Machine Learning',
    domain: 'ai',
    skills: [
      { name: 'Python', logo: `${DEVICON}/python/python-original.svg` },
      { name: 'PyTorch', logo: `${DEVICON}/pytorch/pytorch-original.svg` },
      { name: 'Deep Learning' },
      { name: 'AI Analytics' },
    ],
  },
  {
    title: 'Computer Vision',
    domain: 'ai',
    skills: [
      { name: 'OpenCV', logo: `${DEVICON}/opencv/opencv-original.svg` },
      { name: 'YOLO' },
      { name: 'Object Detection' },
      { name: 'Image Segmentation' },
      { name: 'Motion Tracking' },
    ],
  },
  {
    title: 'Computer Graphics',
    domain: 'cg',
    skills: [
      { name: 'Three.js', logo: `${DEVICON}/threejs/threejs-original.svg` },
      { name: 'WebGL', logo: `${DEVICON}/webgl/webgl-original.svg` },
      { name: 'React Three Fiber', logo: `${DEVICON}/react/react-original.svg` },
      { name: 'Shaders' },
    ],
  },
  {
    title: '3D Modeling & Visualization',
    domain: 'cg',
    skills: [
      { name: 'Blender', logo: `${DEVICON}/blender/blender-original.svg` },
      { name: 'SketchUp' },
      { name: 'Autodesk 3ds Max' },
    ],
  },
  {
    title: 'GIS & Geospatial Technologies',
    domain: 'cg',
    skills: [{ name: 'CesiumJS' }, { name: 'GeoPandas' }, { name: 'GDAL' }, { name: 'Rasterio' }],
  },
  {
    title: 'AR/VR & XR',
    domain: 'xr',
    skills: [{ name: 'A-Frame' }, { name: 'OpenXR' }, { name: 'AR Foundation' }, { name: 'WebXR' }],
  },
  {
    title: 'Game Development',
    domain: 'game',
    skills: [
      { name: 'Unity', logo: `${DEVICON}/unity/unity-original.svg` },
      { name: 'C#', logo: `${DEVICON}/csharp/csharp-original.svg` },
      { name: 'Unreal Engine', logo: `${DEVICON}/unrealengine/unrealengine-original.svg` },
      { name: 'C++', logo: `${DEVICON}/cplusplus/cplusplus-original.svg` },
    ],
  },
  {
    title: 'Web Development',
    domain: 'web',
    skills: [
      { name: 'JavaScript', logo: `${DEVICON}/javascript/javascript-original.svg` },
      { name: 'React', logo: `${DEVICON}/react/react-original.svg` },
      { name: 'Three.js', logo: `${DEVICON}/threejs/threejs-original.svg` },
      { name: 'WebXR' },
    ],
  },
];

/** Unique count of all technologies listed across skills and expertise. */
export const TECHNOLOGY_COUNT = new Set([
  ...SKILL_CATEGORIES.flatMap((c) => c.skills.map((s) => s.name)),
  ...DOMAINS.flatMap((d) => d.technologies),
]).size;

/* ---------------- Experience ----------------
 * Add verified employment records here. While empty, the Experience section
 * shows professional capabilities and selected project experience instead.
 */
export interface ExperienceItem {
  position: string;
  organization: string;
  period: string;
  responsibilities: string[];
  technologies: string[];
}

export const EXPERIENCE: ExperienceItem[] = [];

export const CAPABILITIES = [
  {
    domain: 'ai' as DomainKey,
    title: 'Intelligent Visual Systems',
    text: 'Designing computer vision pipelines for detection, segmentation and motion tracking, and turning their output into analytics.',
  },
  {
    domain: 'cg' as DomainKey,
    title: '3D Visualization & Geospatial Platforms',
    text: 'Building real-time 3D scenes, product visualizers and 3D GIS platforms that make complex spatial data explorable.',
  },
  {
    domain: 'xr' as DomainKey,
    title: 'Immersive AR/VR Experiences',
    text: 'Creating augmented and virtual reality applications that bring interactive 3D content into real and virtual spaces.',
  },
  {
    domain: 'game' as DomainKey,
    title: 'Interactive Games & Real-Time Worlds',
    text: 'Developing game mechanics, multiplayer systems and 3D environments with Unity and Unreal Engine.',
  },
];

/* ---------------- Testimonials ----------------
 * Only add authentic testimonials. The section is hidden while this list is empty.
 */
export interface Testimonial {
  name: string;
  position: string;
  company: string;
  quote: string;
  image?: string;
}
export const TESTIMONIALS: Testimonial[] = [];

export const IMAGES = {
  hero: 'https://d64gsuwffb70l.cloudfront.net/6aec6bc022499b887aa4de5b_1793879145452_c7b8ceda.jpg',
  about: 'https://d64gsuwffb70l.cloudfront.net/6aec6bc022499b887aa4de5b_1793879159151_99172907.jpg',
};
