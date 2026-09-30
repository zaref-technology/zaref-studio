// Firestore types for Zaref Studio

import { Timestamp } from 'firebase/firestore';

export interface Project {
  id?: string;
  title: string;
  slug: string;
  clientName: string;
  category: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  videoUrl: string;
  instagramReelUrl?: string;   // Instagram Reel embed/link
  gallery: string[];
  projectUrl: string;
  tools: string[];
  featured: boolean;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Service {
  id?: string;
  number: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  featured: boolean;
  enabled: boolean;
  displayOrder: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Testimonial {
  id?: string;
  clientName: string;
  company: string;
  role: string;
  testimonial: string;
  clientImage: string;
  rating: number;
  project: string;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Lead {
  id?: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  serviceRequired: string;
  budget: string;
  message: string;
  status: 'new' | 'contacted' | 'in-progress' | 'converted' | 'closed';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface MediaFile {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  storagePath: string;
  createdAt: Timestamp;
}

export interface Settings {
  id?: string;
  studioName: string;
  logo: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  ctaText: string;
  whatsappCta: string;
}
