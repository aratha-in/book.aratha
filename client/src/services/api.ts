import { Book, Author, Category, PublishingService, PublishingEnquiry, FAQ, Testimonial, SitePage, DashboardMetrics, User } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('aratha_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'An unexpected server error occurred.';
    try {
      const data = await res.json();
      errorMsg = data.error || errorMsg;
    } catch {
      errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse<{ token: string; user: User }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ user: User }>(res);
  },

  // Books
  async getBooks(params?: { search?: string; category?: string; language?: string; format?: string; sort?: string; page?: number; limit?: number; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.language) query.set('language', params.language);
    if (params?.format) query.set('format', params.format);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.status) query.set('status', params.status);

    const res = await fetch(`${API_BASE}/books?${query.toString()}`);
    return handleResponse<{ books: Book[]; total: number; page: number; totalPages: number }>(res);
  },

  async getBookBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/books/${slug}`);
    return handleResponse<Book>(res);
  },

  async createBook(data: Partial<Book>) {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Book>(res);
  },

  async updateBook(id: string, data: Partial<Book>) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Book>(res);
  },

  async deleteBook(id: string) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Authors
  async getAuthors(all = false) {
    const res = await fetch(`${API_BASE}/authors${all ? '?all=true' : ''}`);
    return handleResponse<Author[]>(res);
  },

  async getAuthorBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/authors/${slug}`);
    return handleResponse<Author>(res);
  },

  async createAuthor(data: Partial<Author>) {
    const res = await fetch(`${API_BASE}/authors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Author>(res);
  },

  async updateAuthor(id: string, data: Partial<Author>) {
    const res = await fetch(`${API_BASE}/authors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Author>(res);
  },

  async deleteAuthor(id: string) {
    const res = await fetch(`${API_BASE}/authors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse<Category[]>(res);
  },

  async createCategory(data: Partial<Category>) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Category>(res);
  },

  // Services
  async getServices(all = false) {
    const res = await fetch(`${API_BASE}/services${all ? '?all=true' : ''}`);
    return handleResponse<PublishingService[]>(res);
  },

  async getServiceBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/services/${slug}`);
    return handleResponse<PublishingService>(res);
  },

  async createService(data: Partial<PublishingService>) {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<PublishingService>(res);
  },

  async updateService(id: string, data: Partial<PublishingService>) {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<PublishingService>(res);
  },

  // Enquiries
  async submitEnquiry(data: any) {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string; referenceNumber: string; enquiryId: string }>(res);
  },

  async getEnquiries(params?: { status?: string; search?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/enquiries?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ enquiries: PublishingEnquiry[]; total: number; page: number; totalPages: number }>(res);
  },

  async getEnquiryById(id: string) {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<PublishingEnquiry>(res);
  },

  async updateEnquiryStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse<PublishingEnquiry>(res);
  },

  async assignEnquiry(id: string, assignedTo: string | null) {
    const res = await fetch(`${API_BASE}/enquiries/${id}/assign`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ assignedTo })
    });
    return handleResponse<PublishingEnquiry>(res);
  },

  async addEnquiryNote(id: string, note: string) {
    const res = await fetch(`${API_BASE}/enquiries/${id}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note })
    });
    return handleResponse<any>(res);
  },

  // Content (FAQs, Testimonials, Settings, Pages)
  async getFaqs(all = false) {
    const res = await fetch(`${API_BASE}/content/faqs${all ? '?all=true' : ''}`);
    return handleResponse<FAQ[]>(res);
  },

  async createFaq(data: Partial<FAQ>) {
    const res = await fetch(`${API_BASE}/content/faqs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<FAQ>(res);
  },

  async updateFaq(id: string, data: Partial<FAQ>) {
    const res = await fetch(`${API_BASE}/content/faqs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<FAQ>(res);
  },

  async deleteFaq(id: string) {
    const res = await fetch(`${API_BASE}/content/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  async getTestimonials(all = false) {
    const res = await fetch(`${API_BASE}/content/testimonials${all ? '?all=true' : ''}`);
    return handleResponse<Testimonial[]>(res);
  },

  async createTestimonial(data: Partial<Testimonial>) {
    const res = await fetch(`${API_BASE}/content/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Testimonial>(res);
  },

  async updateTestimonial(id: string, data: Partial<Testimonial>) {
    const res = await fetch(`${API_BASE}/content/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Testimonial>(res);
  },

  async deleteTestimonial(id: string) {
    const res = await fetch(`${API_BASE}/content/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  async getPage(slug: string) {
    const res = await fetch(`${API_BASE}/content/pages/${slug}`);
    return handleResponse<SitePage>(res);
  },

  async updatePage(slug: string, content: any) {
    const res = await fetch(`${API_BASE}/content/pages/${slug}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse<SitePage>(res);
  },

  async getSetting(key: string) {
    const res = await fetch(`${API_BASE}/content/settings/${key}`);
    return handleResponse<{ key: string; value: any }>(res);
  },

  async updateSetting(key: string, value: any) {
    const res = await fetch(`${API_BASE}/content/settings/${key}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ value })
    });
    return handleResponse<{ key: string; value: any }>(res);
  },

  async submitContact(data: { fullName: string; email: string; phone?: string; subject: string; message: string }) {
    const res = await fetch(`${API_BASE}/content/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Uploads
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('aratha_token');

    const res = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    return handleResponse<{ success: boolean; url: string; assetId: string }>(res);
  },

  async uploadManuscript(file: File) {
    const formData = new FormData();
    formData.append('manuscript', file);

    const res = await fetch(`${API_BASE}/upload/manuscript`, {
      method: 'POST',
      body: formData
    });
    return handleResponse<{ success: boolean; fileId: string; originalFilename: string }>(res);
  },

  // Admin Dashboard & Users
  async getDashboardMetrics() {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{
      metrics: DashboardMetrics;
      statusCounts: Record<string, number>;
      recentActivity: any[];
      recentEnquiries: PublishingEnquiry[];
    }>(res);
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse<User[]>(res);
  },

  async createUser(data: any) {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<User>(res);
  },

  async updateUser(id: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<User>(res);
  }
};
