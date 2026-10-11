import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { contentRepo, auditRepo } from '../db/repo';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { sendEmail } from '../services/email';
import { config } from '../config';

export const contentRouter = Router();

// ================= FAQ Endpoints =================
contentRouter.get('/faqs', async (req: Request, res: Response) => {
  try {
    const onlyPublished = req.query.all !== 'true';
    const faqs = await contentRepo.listFaqs(onlyPublished);
    return res.json(faqs);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch FAQs.' });
  }
});

const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  category: z.string().default('General'),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

contentRouter.post('/faqs', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = faqSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });

    const newFaq = {
      ...parse.data,
      id: `faq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const created = await contentRepo.createFaq(newFaq);
    await auditRepo.log(req.user?.id || null, 'create', 'faq', created.id);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create FAQ.' });
  }
});

contentRouter.put('/faqs/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = faqSchema.partial().safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation failed' });

    const updated = await contentRepo.updateFaq(req.params.id, parse.data);
    if (!updated) return res.status(404).json({ error: 'FAQ not found.' });

    await auditRepo.log(req.user?.id || null, 'update', 'faq', req.params.id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update FAQ.' });
  }
});

contentRouter.delete('/faqs/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    await contentRepo.deleteFaq(req.params.id);
    await auditRepo.log(req.user?.id || null, 'delete', 'faq', req.params.id);
    return res.json({ success: true, message: 'FAQ deleted.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete FAQ.' });
  }
});

// ================= Testimonial Endpoints =================
contentRouter.get('/testimonials', async (req: Request, res: Response) => {
  try {
    const onlyPublished = req.query.all !== 'true';
    const testimonials = await contentRepo.listTestimonials(onlyPublished);
    return res.json(testimonials);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch testimonials.' });
  }
});

const testimonialSchema = z.object({
  authorName: z.string().min(2),
  roleOrDescription: z.string().min(2),
  testimonial: z.string().min(10),
  imageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

contentRouter.post('/testimonials', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = testimonialSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation failed' });

    const newTestimonial = {
      ...parse.data,
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
    };
    const created = await contentRepo.createTestimonial(newTestimonial);
    await auditRepo.log(req.user?.id || null, 'create', 'testimonial', created.id);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create testimonial.' });
  }
});

contentRouter.put('/testimonials/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = testimonialSchema.partial().safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation failed' });

    const updated = await contentRepo.updateTestimonial(req.params.id, parse.data);
    if (!updated) return res.status(404).json({ error: 'Testimonial not found.' });

    await auditRepo.log(req.user?.id || null, 'update', 'testimonial', req.params.id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update testimonial.' });
  }
});

contentRouter.delete('/testimonials/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    await contentRepo.deleteTestimonial(req.params.id);
    await auditRepo.log(req.user?.id || null, 'delete', 'testimonial', req.params.id);
    return res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete testimonial.' });
  }
});

// ================= Site Pages & Settings =================
contentRouter.get('/pages/:slug', async (req: Request, res: Response) => {
  try {
    const page = await contentRepo.getPage(req.params.slug);
    if (!page) return res.status(404).json({ error: 'Page not found.' });
    return res.json(page);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch page content.' });
  }
});

contentRouter.put('/pages/:slug', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const updated = await contentRepo.updatePage(req.params.slug, {
      ...req.body,
      updatedBy: req.user?.id,
    });
    if (!updated) return res.status(404).json({ error: 'Page not found.' });

    await auditRepo.log(req.user?.id || null, 'update', 'site_page', req.params.slug);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update page.' });
  }
});

contentRouter.get('/settings/:key', async (req: Request, res: Response) => {
  try {
    const value = await contentRepo.getSetting(req.params.key);
    return res.json({ key: req.params.key, value });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch setting.' });
  }
});

contentRouter.put('/settings/:key', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const saved = await contentRepo.updateSetting(req.params.key, req.body.value);
    await auditRepo.log(req.user?.id || null, 'update', 'site_setting', req.params.key);
    return res.json({ key: req.params.key, value: saved });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update setting.' });
  }
});

// ================= Public Contact Form =================
const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

contentRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const parse = contactSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });

    const { fullName, email, phone, subject, message } = parse.data;

    await sendEmail({
      to: config.contactReceiverEmail,
      subject: `[Contact Form] ${subject} - from ${fullName}`,
      html: `
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    return res.json({ success: true, message: 'Your message has been delivered to the Aratha team.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to send message.' });
  }
});
