import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { booksRepo, auditRepo } from '../db/repo';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

export const bookRouter = Router();

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  subtitle: z.string().optional().nullable(),
  authorId: z.string().min(1, 'Author is required'),
  categoryId: z.string().min(1, 'Category is required'),
  coverImageUrl: z.string().optional().nullable(),
  shortDescription: z.string().min(10, 'Short description is required'),
  fullDescription: z.string().min(20, 'Full description is required'),
  language: z.string().default('English'),
  isbn: z.string().optional().nullable(),
  formats: z.array(z.string()).default(['Paperback', 'eBook']),
  pageCount: z.number().int().optional().nullable(),
  publicationDate: z.string().optional().nullable(),
  publisher: z.string().default('Aratha Publication'),
  externalPurchaseUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

// Public: List books with search, filters, pagination
bookRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      genre,
      language,
      format,
      sort,
      page = '1',
      limit = '12',
      status = 'published',
    } = req.query;

    const data = await booksRepo.list({
      search: search as string,
      category: (category || genre) as string,
      language: language as string,
      format: format as string,
      sort: sort as string,
      status: status as string,
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 12,
    });

    return res.json(data);
  } catch (err: any) {
    console.error('Books fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch books catalogue.' });
  }
});

// Public: Get book by slug
bookRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const book = await booksRepo.getBySlug(req.params.slug);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    return res.json(book);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch book details.' });
  }
});

// Admin: Create book
bookRouter.post('/', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const newBook = {
      ...parse.data,
      id: `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await booksRepo.create(newBook);
    await auditRepo.log(req.user?.id || null, 'create', 'book', created.id, { title: created.title });

    return res.status(201).json(created);
  } catch (err: any) {
    console.error('Book creation error:', err);
    return res.status(500).json({ error: 'Failed to create book record.' });
  }
});

// Admin: Update book
bookRouter.put('/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = bookSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const updated = await booksRepo.update(req.params.id, parse.data);
    if (!updated) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    await auditRepo.log(req.user?.id || null, 'update', 'book', req.params.id, { updates: parse.data });
    return res.json(updated);
  } catch (err: any) {
    console.error('Book update error:', err);
    return res.status(500).json({ error: 'Failed to update book.' });
  }
});

// Admin: Delete book
bookRouter.delete('/:id', requireAuth, requireRole(['super_admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    await booksRepo.delete(req.params.id);
    await auditRepo.log(req.user?.id || null, 'delete', 'book', req.params.id);
    return res.json({ success: true, message: 'Book deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete book.' });
  }
});
