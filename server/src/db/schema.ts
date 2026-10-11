import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('editor'), // 'super_admin' | 'editor' | 'enquiry_manager'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Authors
export const authors = pgTable('authors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  biography: text('biography').notNull(),
  profileImageUrl: text('profile_image_url'),
  websiteUrl: text('website_url'),
  socialLinks: jsonb('social_links'), // { twitter?: string, linkedin?: string, instagram?: string, goodreads?: string }
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Categories
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Books
export const books = pgTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  subtitle: text('subtitle'),
  authorId: text('author_id').references(() => authors.id),
  categoryId: text('category_id').references(() => categories.id),
  coverImageUrl: text('cover_image_url'),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  language: text('language').notNull().default('English'),
  isbn: text('isbn'),
  formats: jsonb('formats').notNull().default(['Paperback', 'eBook']), // Array of strings
  pageCount: integer('page_count'),
  publicationDate: text('publication_date'),
  publisher: text('publisher').default('Aratha Publication'),
  externalPurchaseUrl: text('external_purchase_url'),
  isFeatured: boolean('is_featured').notNull().default(false),
  status: text('status').notNull().default('published'), // 'published' | 'draft' | 'archived'
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Publishing Services
export const publishingServices = pgTable('publishing_services', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  deliverables: jsonb('deliverables').notNull().default([]), // array of strings
  pricingLabel: text('pricing_label'), // e.g. "Starting at $499" or "Request a Quote"
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. Publishing Enquiries
export const publishingEnquiries = pgTable('publishing_enquiries', {
  id: text('id').primaryKey(),
  referenceNumber: text('reference_number').notNull().unique(), // e.g. ARP-2026-0812
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull(),
  manuscriptTitle: text('manuscript_title').notNull(),
  serviceId: text('service_id').references(() => publishingServices.id),
  genre: text('genre').notNull(),
  manuscriptStatus: text('manuscript_status').notNull(), // 'Completed' | 'In Progress' | 'Outline / Concept'
  estimatedWordCount: integer('estimated_word_count'),
  preferredFormat: text('preferred_format'), // 'Print & eBook' | 'eBook only' | 'Hardcover Edition'
  projectDescription: text('project_description').notNull(),
  expectedTimeline: text('expected_timeline'),
  budgetRange: text('budget_range'),
  consentAt: timestamp('consent_at').defaultNow().notNull(),
  status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'consultation_scheduled' | 'reviewing_manuscript' | 'proposal_sent' | 'negotiation' | 'accepted' | 'rejected' | 'completed' | 'closed'
  assignedTo: text('assigned_to').references(() => users.id),
  source: text('source').default('website_form'),
  manuscriptFileId: text('manuscript_file_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7. Enquiry Notes
export const enquiryNotes = pgTable('enquiry_notes', {
  id: text('id').primaryKey(),
  enquiryId: text('enquiry_id').notNull().references(() => publishingEnquiries.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  note: text('note').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Enquiry Activities
export const enquiryActivities = pgTable('enquiry_activities', {
  id: text('id').primaryKey(),
  enquiryId: text('enquiry_id').notNull().references(() => publishingEnquiries.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id),
  activityType: text('activity_type').notNull(), // 'status_change' | 'note_added' | 'assigned' | 'email_sent'
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 9. FAQs
export const faqs = pgTable('faqs', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull().default('General'),
  displayOrder: integer('display_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 10. Testimonials
export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  authorName: text('author_name').notNull(),
  roleOrDescription: text('role_or_description').notNull(),
  testimonial: text('testimonial').notNull(),
  imageUrl: text('image_url'),
  isPublished: boolean('is_published').notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Site Pages
export const sitePages = pgTable('site_pages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: jsonb('content').notNull(), // structured page content blocks
  status: text('status').notNull().default('published'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  updatedBy: text('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 12. Site Settings
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: jsonb('setting_value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 13. File Assets
export const fileAssets = pgTable('file_assets', {
  id: text('id').primaryKey(),
  storageProvider: text('storage_provider').notNull().default('local'),
  storageKey: text('storage_key').notNull(),
  originalFilename: text('original_filename').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  accessLevel: text('access_level').notNull().default('public'), // 'public' | 'private'
  uploadedBy: text('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 14. Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  enquiryNotes: many(enquiryNotes),
  assignedEnquiries: many(publishingEnquiries),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  books: many(books),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  books: many(books),
}));

export const booksRelations = relations(books, ({ one }) => ({
  author: one(authors, {
    fields: [books.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [books.categoryId],
    references: [categories.id],
  }),
}));

export const publishingEnquiriesRelations = relations(publishingEnquiries, ({ one, many }) => ({
  service: one(publishingServices, {
    fields: [publishingEnquiries.serviceId],
    references: [publishingServices.id],
  }),
  assignedUser: one(users, {
    fields: [publishingEnquiries.assignedTo],
    references: [users.id],
  }),
  notes: many(enquiryNotes),
  activities: many(enquiryActivities),
}));

export const enquiryNotesRelations = relations(enquiryNotes, ({ one }) => ({
  enquiry: one(publishingEnquiries, {
    fields: [enquiryNotes.enquiryId],
    references: [publishingEnquiries.id],
  }),
  user: one(users, {
    fields: [enquiryNotes.userId],
    references: [users.id],
  }),
}));

export const enquiryActivitiesRelations = relations(enquiryActivities, ({ one }) => ({
  enquiry: one(publishingEnquiries, {
    fields: [enquiryActivities.enquiryId],
    references: [publishingEnquiries.id],
  }),
  user: one(users, {
    fields: [enquiryActivities.userId],
    references: [users.id],
  }),
}));
