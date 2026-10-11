export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'editor' | 'enquiry_manager';
  isActive?: boolean;
  createdAt?: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  biography: string;
  profileImageUrl?: string;
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
  isPublished: boolean;
  books?: Book[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  authorId: string;
  categoryId: string;
  author?: Author;
  category?: Category;
  coverImageUrl?: string | null;
  shortDescription: string;
  fullDescription: string;
  language: string;
  isbn?: string | null;
  formats: string[];
  pageCount?: number | null;
  publicationDate?: string | null;
  publisher?: string | null;
  externalPurchaseUrl?: string | null;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublishingService {
  id: string;
  title: string;
  slug: string;
  description: string;
  deliverables: string[];
  pricingLabel?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface EnquiryNote {
  id: string;
  enquiryId: string;
  userId: string;
  note: string;
  user?: User;
  createdAt: string;
}

export interface EnquiryActivity {
  id: string;
  enquiryId: string;
  userId?: string;
  activityType: string;
  description: string;
  user?: User;
  createdAt: string;
}

export interface PublishingEnquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  manuscriptTitle: string;
  serviceId?: string;
  service?: PublishingService;
  genre: string;
  manuscriptStatus: string;
  estimatedWordCount?: number;
  preferredFormat?: string;
  projectDescription: string;
  expectedTimeline?: string;
  budgetRange?: string;
  consentAt: string;
  status: string;
  assignedTo?: string;
  assignedUser?: User;
  source?: string;
  manuscriptFileId?: string;
  notes?: EnquiryNote[];
  activities?: EnquiryActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface Testimonial {
  id: string;
  authorName: string;
  roleOrDescription: string;
  testimonial: string;
  imageUrl?: string;
  isPublished: boolean;
  displayOrder: number;
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  content: any;
  status: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface DashboardMetrics {
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  totalAuthors: number;
  totalEnquiries: number;
  newEnquiries: number;
  awaitingResponse: number;
}
