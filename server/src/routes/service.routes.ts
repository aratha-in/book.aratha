import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { servicesRepo, auditRepo } from '../db/repo';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

export const serviceRouter = Router();

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(10, 'Description is required'),
  deliverables: z.array(z.string()).default([]),
  pricingLabel: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

// Public: List active services
serviceRouter.get('/', async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.all !== 'true';
    const list = await servicesRepo.list(activeOnly);
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch publishing services.' });
  }
});

// Public: Get service by slug
serviceRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const service = await servicesRepo.getBySlug(req.params.slug);
    if (!service) {
      return res.status(404).json({ error: 'Publishing service not found.' });
    }
    return res.json(service);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch service.' });
  }
});

// Admin: Create service
serviceRouter.post('/', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = serviceSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const newService = {
      ...parse.data,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await servicesRepo.create(newService);
    await auditRepo.log(req.user?.id || null, 'create', 'service', created.id, { title: created.title });
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create publishing service.' });
  }
});

// Admin: Update service
serviceRouter.put('/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = serviceSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const updated = await servicesRepo.update(req.params.id, parse.data);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    await auditRepo.log(req.user?.id || null, 'update', 'service', req.params.id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update publishing service.' });
  }
});

// Admin: Delete service
serviceRouter.delete('/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    await servicesRepo.delete(req.params.id);
    await auditRepo.log(req.user?.id || null, 'delete', 'service', req.params.id);
    return res.json({ success: true, message: 'Service removed.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete service.' });
  }
});
