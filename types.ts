export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface CustomItem {
  id: string;
  name: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

export interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    website: string;
    summary: string;
    jobTitle: string;
  };
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  customSections: CustomSection[];
  sectionOrder: string[]; // Contains 'summary', 'experience', 'education', 'projects', and custom section IDs
}

export enum TemplateType {
  MODERN = 'modern',
  CLASSIC = 'classic',
  MINIMAL = 'minimal',
  PROFESSIONAL = 'professional',
  EXECUTIVE = 'executive',
  CREATIVE = 'creative',
  TECH = 'tech',
  ELEGANT = 'elegant',
  COMPACT = 'compact',
  TIMELINE = 'timeline',
}

export interface SuggestionResult {
  summary?: {
    original: string;
    improved: string;
    critique: string;
  };
  experiences?: {
    id: string;
    company: string;
    original: string;
    improved: string;
    critique: string;
  }[];
}

export const INITIAL_RESUME_DATA: ResumeData = {
  personal: {
    fullName: 'Alex Doe',
    email: 'alex.doe@example.com',
    phone: '(555) 123-4567',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexdoe',
    website: 'alexdoe.dev',
    jobTitle: 'Senior Software Engineer',
    summary: 'Experienced software engineer with a passion for building scalable web applications. Proven track record of leadership and technical excellence.',
  },
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'B.S. Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      current: false,
      description: 'Graduated with Honors. Member of the ACM Student Chapter.',
    },
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Frontend Developer',
      startDate: '2019-06',
      endDate: 'Present',
      current: true,
      description: 'Developed and maintained the main customer-facing dashboard using React. Improved site performance by 40%.',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'GraphQL', 'AWS'],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      link: 'github.com/alexdoe/shop',
      description: 'A full-featured e-commerce solution built with Next.js and Stripe.',
    },
  ],
  customSections: [],
  sectionOrder: ['summary', 'experience', 'education', 'projects'],
};