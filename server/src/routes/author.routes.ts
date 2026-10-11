import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authorsRepo, booksRepo, auditRepo } from '../db/repo';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

export const authorRouter = Router();

const authorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  biography: z.string().min(10, 'Biography is required'),
  profileImageUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  socialLinks: z.record(z.string()).optional().nullable(),
  isPublished: z.boolean().default(true),
});

// Public: List authors
authorRouter.get('/', async (req: Request, res: Response) => {
  try {
    const onlyPublished = req.query.all !== 'true';
    const authors = await authorsRepo.list(onlyPublished);
    return res.json(authors);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch authors.' });
  }
});

// Public: Get author by slug, including their published books
authorRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const author = await authorsRepo.getBySlug(req.params.slug);
    if (!author) {
      return res.status(404).json({ error: 'Author not found.' });
    }

    // Get books by this author
    const booksResult = await booksRepo.list({ search: '', status: 'published', limit: 50 });
    const authorBooks = booksResult.books.filter((b: any) => b.authorId === author.id);

    return res.json({
      ...author,
      books: authorBooks,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch author details.' });
  }
});

// Admin: Create author
authorRouter.post('/', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = authorSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const newAuthor = {
      ...parse.data,
      id: `aut-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await authorsRepo.create(newAuthor);
    await auditRepo.log(req.user?.id || null, 'create', 'author', created.id, { name: created.name });

    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create author profile.' });
  }
});

// Admin: Update author
authorRouter.put('/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = authorSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const updated = await authorsRepo.update(req.params.id, parse.data);
    if (!updated) {
      return res.status(404).json({ error: 'Author not found.' });
    }

    await auditRepo.log(req.user?.id || null, 'update', 'author', req.params.id);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update author.' });
  }
});

// Admin: Delete author
authorRouter.delete('/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    await authorsRepo.delete(req.params.id);
    await auditRepo.log(req.user?.id || null, 'delete', 'author', req.params.id);
    return res.json({ success: true, message: 'Author deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete author.' });
  }
});
