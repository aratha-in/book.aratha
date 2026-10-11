import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { categoriesRepo, auditRepo } from '../db/repo';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

export const categoryRouter = Router();

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
});

// Public: List categories
categoryRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const list = await categoriesRepo.list();
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Admin: Create category
categoryRouter.post('/', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = categorySchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const newCategory = {
      ...parse.data,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
    };

    const created = await categoriesRepo.create(newCategory);
    await auditRepo.log(req.user?.id || null, 'create', 'category', created.id, { name: created.name });
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create category.' });
  }
});

// Admin: Update category
categoryRouter.put('/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = categorySchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const updated = await categoriesRepo.update(req.params.id, parse.data);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    await auditRepo.log(req.user?.id || null, 'update', 'category', req.params.id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update category.' });
  }
});

// Admin: Delete category
categoryRouter.delete('/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    await categoriesRepo.delete(req.params.id);
    await auditRepo.log(req.user?.id || null, 'delete', 'category', req.params.id);
    return res.json({ success: true, message: 'Category deleted.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete category.' });
  }
});
