import { localStore, dbMode, neonClient } from './index';
import * as schema from './schema';
import { eq, desc, asc, ilike, and, or, sql } from 'drizzle-orm';

// Repository Abstraction Layer
export const usersRepo = {
  async findByEmail(email: string) {
    if (dbMode === 'neon' && neonClient) {
      const results = await neonClient.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
      return results[0] || null;
    }
    return localStore.data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findById(id: string) {
    if (dbMode === 'neon' && neonClient) {
      const results = await neonClient.select().from(schema.users).where(eq(schema.users.id, id));
      return results[0] || null;
    }
    return localStore.data.users.find((u: any) => u.id === id) || null;
  },

  async list() {
    if (dbMode === 'neon' && neonClient) {
      return await neonClient.select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        isActive: schema.users.isActive,
        createdAt: schema.users.createdAt,
      }).from(schema.users).orderBy(desc(schema.users.createdAt));
    }
    return localStore.data.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
    }));
  },

  async create(user: any) {
    if (dbMode === 'neon' && neonClient) {
      const inserted = await neonClient.insert(schema.users).values(user).returning();
      return inserted[0];
    }
    localStore.data.users.push(user);
    localStore.save();
    return user;
  },

  async update(id: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const updated = await neonClient.update(schema.users).set({ ...updates, updatedAt: new Date() }).where(eq(schema.users.id, id)).returning();
      return updated[0];
    }
    const idx = localStore.data.users.findIndex((u: any) => u.id === id);
    if (idx === -1) return null;
    localStore.data.users[idx] = { ...localStore.data.users[idx], ...updates, updatedAt: new Date() };
    localStore.save();
    return localStore.data.users[idx];
  }
};

export const categoriesRepo = {
  async list() {
    if (dbMode === 'neon' && neonClient) {
      return await neonClient.select().from(schema.categories).orderBy(asc(schema.categories.name));
    }
    return [...localStore.data.categories].sort((a, b) => a.name.localeCompare(b.name));
  },

  async getById(id: string) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.select().from(schema.categories).where(eq(schema.categories.id, id));
      return res[0] || null;
    }
    return localStore.data.categories.find((c: any) => c.id === id) || null;
  },

  async create(category: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.categories).values(category).returning();
      return res[0];
    }
    localStore.data.categories.push(category);
    localStore.save();
    return category;
  },

  async update(id: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.update(schema.categories).set(updates).where(eq(schema.categories.id, id)).returning();
      return res[0];
    }
    const idx = localStore.data.categories.findIndex((c: any) => c.id === id);
    if (idx === -1) return null;
    localStore.data.categories[idx] = { ...localStore.data.categories[idx], ...updates };
    localStore.save();
    return localStore.data.categories[idx];
  },

  async delete(id: string) {
    if (dbMode === 'neon' && neonClient) {
      await neonClient.delete(schema.categories).where(eq(schema.categories.id, id));
      return true;
    }
    localStore.data.categories = localStore.data.categories.filter((c: any) => c.id !== id);
    localStore.save();
    return true;
  }
};

export const authorsRepo = {
  async list(onlyPublished = false) {
    if (dbMode === 'neon' && neonClient) {
      const query = neonClient.select().from(schema.authors);
      if (onlyPublished) {
        return await query.where(eq(schema.authors.isPublished, true)).orderBy(asc(schema.authors.name));
      }
      return await query.orderBy(asc(schema.authors.name));
    }
    let list = localStore.data.authors;
    if (onlyPublished) {
      list = list.filter((a: any) => a.isPublished);
    }
    return [...list].sort((a: any, b: any) => a.name.localeCompare(b.name));
  },

  async getBySlug(slug: string) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.select().from(schema.authors).where(eq(schema.authors.slug, slug));
      return res[0] || null;
    }
    return localStore.data.authors.find((a: any) => a.slug === slug) || null;
  },

  async getById(id: string) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.select().from(schema.authors).where(eq(schema.authors.id, id));
      return res[0] || null;
    }
    return localStore.data.authors.find((a: any) => a.id === id) || null;
  },

  async create(author: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.authors).values(author).returning();
      return res[0];
    }
    localStore.data.authors.push(author);
    localStore.save();
    return author;
  },

  async update(id: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.update(schema.authors).set({ ...updates, updatedAt: new Date() }).where(eq(schema.authors.id, id)).returning();
      return res[0];
    }
    const idx = localStore.data.authors.findIndex((a: any) => a.id === id);
    if (idx === -1) return null;
    localStore.data.authors[idx] = { ...localStore.data.authors[idx], ...updates, updatedAt: new Date() };
    localStore.save();
    return localStore.data.authors[idx];
  },

  async delete(id: string) {
    if (dbMode === 'neon' && neonClient) {
      await neonClient.delete(schema.authors).where(eq(schema.authors.id, id));
      return true;
    }
    localStore.data.authors = localStore.data.authors.filter((a: any) => a.id !== id);
    localStore.save();
    return true;
  }
};

export const booksRepo = {
  async list({
    search = '',
    category = '',
    genre = '',
    language = '',
    format = '',
    status = 'published',
    sort = 'newest',
    page = 1,
    limit = 12
  }: any = {}) {
    let allBooks = [];
    if (dbMode === 'neon' && neonClient) {
      // In neon mode, fetch enriched records
      const rows = await neonClient.query.books.findMany({
        with: {
          author: true,
          category: true,
        },
        orderBy: [desc(schema.books.createdAt)]
      });
      allBooks = rows;
    } else {
      allBooks = localStore.data.books.map((b: any) => {
        const author = localStore.data.authors.find((a: any) => a.id === b.authorId);
        const cat = localStore.data.categories.find((c: any) => c.id === b.categoryId);
        return {
          ...b,
          author,
          category: cat,
        };
      });
    }

    // Filter by status if specified
    if (status && status !== 'all') {
      allBooks = allBooks.filter((b: any) => b.status === status);
    }

    // Filter by category slug or id
    if (category) {
      allBooks = allBooks.filter((b: any) => 
        b.categoryId === category || (b.category && b.category.slug === category)
      );
    }

    // Filter by language
    if (language) {
      allBooks = allBooks.filter((b: any) => b.language?.toLowerCase() === language.toLowerCase());
    }

    // Filter by format
    if (format) {
      allBooks = allBooks.filter((b: any) => 
        Array.isArray(b.formats) && b.formats.some((f: string) => f.toLowerCase().includes(format.toLowerCase()))
      );
    }

    // Search query
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      allBooks = allBooks.filter((b: any) => 
        b.title.toLowerCase().includes(q) ||
        (b.subtitle && b.subtitle.toLowerCase().includes(q)) ||
        (b.shortDescription && b.shortDescription.toLowerCase().includes(q)) ||
        (b.author && b.author.name.toLowerCase().includes(q)) ||
        (b.isbn && b.isbn.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'title_asc') {
      allBooks.sort((a: any, b: any) => a.title.localeCompare(b.title));
    } else if (sort === 'title_desc') {
      allBooks.sort((a: any, b: any) => b.title.localeCompare(a.title));
    } else {
      // Newest
      allBooks.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = allBooks.length;
    const startIndex = (page - 1) * limit;
    const paginated = allBooks.slice(startIndex, startIndex + limit);

    return {
      books: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getBySlug(slug: string) {
    if (dbMode === 'neon' && neonClient) {
      const b = await neonClient.query.books.findFirst({
        where: eq(schema.books.slug, slug),
        with: {
          author: true,
          category: true,
        }
      });
      return b || null;
    }
    const b = localStore.data.books.find((item: any) => item.slug === slug);
    if (!b) return null;
    const author = localStore.data.authors.find((a: any) => a.id === b.authorId);
    const category = localStore.data.categories.find((c: any) => c.id === b.categoryId);
    return { ...b, author, category };
  },

  async getById(id: string) {
    if (dbMode === 'neon' && neonClient) {
      const b = await neonClient.query.books.findFirst({
        where: eq(schema.books.id, id),
        with: {
          author: true,
          category: true,
        }
      });
      return b || null;
    }
    const b = localStore.data.books.find((item: any) => item.id === id);
    if (!b) return null;
    const author = localStore.data.authors.find((a: any) => a.id === b.authorId);
    const category = localStore.data.categories.find((c: any) => c.id === b.categoryId);
    return { ...b, author, category };
  },

  async create(book: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.books).values(book).returning();
      return res[0];
    }
    localStore.data.books.unshift(book);
    localStore.save();
    return book;
  },

  async update(id: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.update(schema.books).set({ ...updates, updatedAt: new Date() }).where(eq(schema.books.id, id)).returning();
      return res[0];
    }
    const idx = localStore.data.books.findIndex((b: any) => b.id === id);
    if (idx === -1) return null;
    localStore.data.books[idx] = { ...localStore.data.books[idx], ...updates, updatedAt: new Date() };
    localStore.save();
    return localStore.data.books[idx];
  },

  async delete(id: string) {
    if (dbMode === 'neon' && neonClient) {
      await neonClient.delete(schema.books).where(eq(schema.books.id, id));
      return true;
    }
    localStore.data.books = localStore.data.books.filter((b: any) => b.id !== id);
    localStore.save();
    return true;
  }
};

export const servicesRepo = {
  async list(activeOnly = true) {
    if (dbMode === 'neon' && neonClient) {
      const query = neonClient.select().from(schema.publishingServices);
      if (activeOnly) {
        return await query.where(eq(schema.publishingServices.isActive, true)).orderBy(asc(schema.publishingServices.displayOrder));
      }
      return await query.orderBy(asc(schema.publishingServices.displayOrder));
    }
    let list = localStore.data.publishingServices;
    if (activeOnly) {
      list = list.filter((s: any) => s.isActive);
    }
    return [...list].sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  },

  async getBySlug(slug: string) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.select().from(schema.publishingServices).where(eq(schema.publishingServices.slug, slug));
      return res[0] || null;
    }
    return localStore.data.publishingServices.find((s: any) => s.slug === slug) || null;
  },

  async getById(id: string) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.select().from(schema.publishingServices).where(eq(schema.publishingServices.id, id));
      return res[0] || null;
    }
    return localStore.data.publishingServices.find((s: any) => s.id === id) || null;
  },

  async create(service: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.publishingServices).values(service).returning();
      return res[0];
    }
    localStore.data.publishingServices.push(service);
    localStore.save();
    return service;
  },

  async update(id: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.update(schema.publishingServices).set({ ...updates, updatedAt: new Date() }).where(eq(schema.publishingServices.id, id)).returning();
      return res[0];
    }
    const idx = localStore.data.publishingServices.findIndex((s: any) => s.id === id);
    if (idx === -1) return null;
    localStore.data.publishingServices[idx] = { ...localStore.data.publishingServices[idx], ...updates, updatedAt: new Date() };
    localStore.save();
    return localStore.data.publishingServices[idx];
  },

  async delete(id: string) {
    if (dbMode === 'neon' && neonClient) {
      await neonClient.delete(schema.publishingServices).where(eq(schema.publishingServices.id, id));
      return true;
    }
    localStore.data.publishingServices = localStore.data.publishingServices.filter((s: any) => s.id !== id);
    localStore.save();
    return true;
  }
};

export const enquiriesRepo = {
  async list({ status = '', search = '', page = 1, limit = 20 }: any = {}) {
    let enquiries = [];
    if (dbMode === 'neon' && neonClient) {
      enquiries = await neonClient.query.publishingEnquiries.findMany({
        with: {
          service: true,
          assignedUser: true,
          notes: true,
          activities: true,
        },
        orderBy: [desc(schema.publishingEnquiries.createdAt)]
      });
    } else {
      enquiries = localStore.data.publishingEnquiries.map((e: any) => {
        const service = localStore.data.publishingServices.find((s: any) => s.id === e.serviceId);
        const assignedUser = localStore.data.users.find((u: any) => u.id === e.assignedTo);
        const notes = (localStore.data.enquiryNotes || []).filter((n: any) => n.enquiryId === e.id);
        const activities = (localStore.data.enquiryActivities || []).filter((a: any) => a.enquiryId === e.id);
        return {
          ...e,
          service,
          assignedUser,
          notes,
          activities,
        };
      });
    }

    if (status && status !== 'all') {
      enquiries = enquiries.filter((e: any) => e.status === status);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      enquiries = enquiries.filter((e: any) => 
        e.referenceNumber?.toLowerCase().includes(q) ||
        e.fullName?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.manuscriptTitle?.toLowerCase().includes(q)
      );
    }

    const total = enquiries.length;
    const startIndex = (page - 1) * limit;
    const paginated = enquiries.slice(startIndex, startIndex + limit);

    return {
      enquiries: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getById(id: string) {
    if (dbMode === 'neon' && neonClient) {
      const e = await neonClient.query.publishingEnquiries.findFirst({
        where: eq(schema.publishingEnquiries.id, id),
        with: {
          service: true,
          assignedUser: true,
          notes: {
            with: { user: true },
            orderBy: [desc(schema.enquiryNotes.createdAt)]
          },
          activities: {
            with: { user: true },
            orderBy: [desc(schema.enquiryActivities.createdAt)]
          }
        }
      });
      return e || null;
    }
    const e = localStore.data.publishingEnquiries.find((item: any) => item.id === id);
    if (!e) return null;
    const service = localStore.data.publishingServices.find((s: any) => s.id === e.serviceId);
    const assignedUser = localStore.data.users.find((u: any) => u.id === e.assignedTo);
    const notes = (localStore.data.enquiryNotes || []).filter((n: any) => n.enquiryId === e.id).map((n: any) => ({
      ...n,
      user: localStore.data.users.find((u: any) => u.id === n.userId)
    })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const activities = (localStore.data.enquiryActivities || []).filter((a: any) => a.enquiryId === e.id).map((a: any) => ({
      ...a,
      user: localStore.data.users.find((u: any) => u.id === a.userId)
    })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { ...e, service, assignedUser, notes, activities };
  },

  async getByRef(referenceNumber: string) {
    if (dbMode === 'neon' && neonClient) {
      return await neonClient.query.publishingEnquiries.findFirst({
        where: eq(schema.publishingEnquiries.referenceNumber, referenceNumber),
      });
    }
    return localStore.data.publishingEnquiries.find((e: any) => e.referenceNumber === referenceNumber) || null;
  },

  async create(enquiry: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.publishingEnquiries).values(enquiry).returning();
      return res[0];
    }
    localStore.data.publishingEnquiries.unshift(enquiry);
    localStore.save();
    return enquiry;
  },

  async update(id: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.update(schema.publishingEnquiries).set({ ...updates, updatedAt: new Date() }).where(eq(schema.publishingEnquiries.id, id)).returning();
      return res[0];
    }
    const idx = localStore.data.publishingEnquiries.findIndex((e: any) => e.id === id);
    if (idx === -1) return null;
    localStore.data.publishingEnquiries[idx] = { ...localStore.data.publishingEnquiries[idx], ...updates, updatedAt: new Date() };
    localStore.save();
    return localStore.data.publishingEnquiries[idx];
  },

  async addNote(note: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.enquiryNotes).values(note).returning();
      return res[0];
    }
    if (!localStore.data.enquiryNotes) localStore.data.enquiryNotes = [];
    localStore.data.enquiryNotes.unshift(note);
    localStore.save();
    return note;
  },

  async addActivity(activity: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.enquiryActivities).values(activity).returning();
      return res[0];
    }
    if (!localStore.data.enquiryActivities) localStore.data.enquiryActivities = [];
    localStore.data.enquiryActivities.unshift(activity);
    localStore.save();
    return activity;
  }
};

export const contentRepo = {
  async getPage(slug: string) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.select().from(schema.sitePages).where(eq(schema.sitePages.slug, slug));
      return res[0] || null;
    }
    return localStore.data.sitePages.find((p: any) => p.slug === slug) || null;
  },

  async listPages() {
    if (dbMode === 'neon' && neonClient) {
      return await neonClient.select().from(schema.sitePages);
    }
    return localStore.data.sitePages;
  },

  async updatePage(slug: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.update(schema.sitePages).set({ ...updates, updatedAt: new Date() }).where(eq(schema.sitePages.slug, slug)).returning();
      return res[0];
    }
    const idx = localStore.data.sitePages.findIndex((p: any) => p.slug === slug);
    if (idx === -1) return null;
    localStore.data.sitePages[idx] = { ...localStore.data.sitePages[idx], ...updates, updatedAt: new Date() };
    localStore.save();
    return localStore.data.sitePages[idx];
  },

  async getSetting(key: string) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.select().from(schema.siteSettings).where(eq(schema.siteSettings.settingKey, key));
      return res[0]?.settingValue || null;
    }
    const item = localStore.data.siteSettings.find((s: any) => s.settingKey === key);
    return item ? item.settingValue : null;
  },

  async updateSetting(key: string, value: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.siteSettings)
        .values({ id: `set-${key}`, settingKey: key, settingValue: value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: schema.siteSettings.settingKey,
          set: { settingValue: value, updatedAt: new Date() }
        }).returning();
      return res[0];
    }
    let item = localStore.data.siteSettings.find((s: any) => s.settingKey === key);
    if (item) {
      item.settingValue = value;
      item.updatedAt = new Date();
    } else {
      localStore.data.siteSettings.push({
        id: `set-${key}`,
        settingKey: key,
        settingValue: value,
        updatedAt: new Date()
      });
    }
    localStore.save();
    return value;
  },

  async listFaqs(onlyPublished = false) {
    if (dbMode === 'neon' && neonClient) {
      const q = neonClient.select().from(schema.faqs);
      if (onlyPublished) {
        return await q.where(eq(schema.faqs.isPublished, true)).orderBy(asc(schema.faqs.displayOrder));
      }
      return await q.orderBy(asc(schema.faqs.displayOrder));
    }
    let list = localStore.data.faqs;
    if (onlyPublished) list = list.filter((f: any) => f.isPublished);
    return [...list].sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  },

  async createFaq(faq: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.faqs).values(faq).returning();
      return res[0];
    }
    localStore.data.faqs.push(faq);
    localStore.save();
    return faq;
  },

  async updateFaq(id: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.update(schema.faqs).set({ ...updates, updatedAt: new Date() }).where(eq(schema.faqs.id, id)).returning();
      return res[0];
    }
    const idx = localStore.data.faqs.findIndex((f: any) => f.id === id);
    if (idx === -1) return null;
    localStore.data.faqs[idx] = { ...localStore.data.faqs[idx], ...updates, updatedAt: new Date() };
    localStore.save();
    return localStore.data.faqs[idx];
  },

  async deleteFaq(id: string) {
    if (dbMode === 'neon' && neonClient) {
      await neonClient.delete(schema.faqs).where(eq(schema.faqs.id, id));
      return true;
    }
    localStore.data.faqs = localStore.data.faqs.filter((f: any) => f.id !== id);
    localStore.save();
    return true;
  },

  async listTestimonials(onlyPublished = false) {
    if (dbMode === 'neon' && neonClient) {
      const q = neonClient.select().from(schema.testimonials);
      if (onlyPublished) {
        return await q.where(eq(schema.testimonials.isPublished, true)).orderBy(asc(schema.testimonials.displayOrder));
      }
      return await q.orderBy(asc(schema.testimonials.displayOrder));
    }
    let list = localStore.data.testimonials;
    if (onlyPublished) list = list.filter((t: any) => t.isPublished);
    return [...list].sort((a: any, b: any) => a.displayOrder - b.displayOrder);
  },

  async createTestimonial(testimonial: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.testimonials).values(testimonial).returning();
      return res[0];
    }
    localStore.data.testimonials.push(testimonial);
    localStore.save();
    return testimonial;
  },

  async updateTestimonial(id: string, updates: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.update(schema.testimonials).set(updates).where(eq(schema.testimonials.id, id)).returning();
      return res[0];
    }
    const idx = localStore.data.testimonials.findIndex((t: any) => t.id === id);
    if (idx === -1) return null;
    localStore.data.testimonials[idx] = { ...localStore.data.testimonials[idx], ...updates };
    localStore.save();
    return localStore.data.testimonials[idx];
  },

  async deleteTestimonial(id: string) {
    if (dbMode === 'neon' && neonClient) {
      await neonClient.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
      return true;
    }
    localStore.data.testimonials = localStore.data.testimonials.filter((t: any) => t.id !== id);
    localStore.save();
    return true;
  }
};

export const auditRepo = {
  async log(userId: string | null, action: string, entityType: string, entityId: string | null = null, metadata: any = {}) {
    const entry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      action,
      entityType,
      entityId,
      metadata,
      createdAt: new Date(),
    };
    if (dbMode === 'neon' && neonClient) {
      try {
        await neonClient.insert(schema.auditLogs).values(entry);
      } catch (e) {
        console.error('Failed to log audit event to Neon:', e);
      }
    } else {
      if (!localStore.data.auditLogs) localStore.data.auditLogs = [];
      localStore.data.auditLogs.unshift(entry);
      // Keep recent 200 logs
      if (localStore.data.auditLogs.length > 200) localStore.data.auditLogs.length = 200;
      localStore.save();
    }
    return entry;
  },

  async list(limit = 50) {
    if (dbMode === 'neon' && neonClient) {
      return await neonClient.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(limit);
    }
    return (localStore.data.auditLogs || []).slice(0, limit);
  }
};

export const filesRepo = {
  async create(fileAsset: any) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.insert(schema.fileAssets).values(fileAsset).returning();
      return res[0];
    }
    if (!localStore.data.fileAssets) localStore.data.fileAssets = [];
    localStore.data.fileAssets.push(fileAsset);
    localStore.save();
    return fileAsset;
  },

  async getById(id: string) {
    if (dbMode === 'neon' && neonClient) {
      const res = await neonClient.select().from(schema.fileAssets).where(eq(schema.fileAssets.id, id));
      return res[0] || null;
    }
    return (localStore.data.fileAssets || []).find((f: any) => f.id === id) || null;
  }
};
