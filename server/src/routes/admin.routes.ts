import { Router, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import { booksRepo, authorsRepo, enquiriesRepo, usersRepo, auditRepo } from '../db/repo';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

export const adminRouter = Router();

// Admin Dashboard KPI metrics
adminRouter.get('/dashboard', requireAuth, requireRole(['super_admin', 'editor', 'enquiry_manager']), async (_req: AuthRequest, res: Response) => {
  try {
    const { books: allBooks, total: totalBooks } = await booksRepo.list({ status: 'all', limit: 1000 });
    const publishedBooks = allBooks.filter((b: any) => b.status === 'published').length;
    const draftBooks = allBooks.filter((b: any) => b.status === 'draft').length;

    const allAuthors = await authorsRepo.list(false);
    const totalAuthors = allAuthors.length;

    const { enquiries: allEnquiries, total: totalEnquiries } = await enquiriesRepo.list({ limit: 1000 });
    const newEnquiries = allEnquiries.filter((e: any) => e.status === 'new').length;
    const awaitingResponse = allEnquiries.filter((e: any) => ['new', 'contacted', 'reviewing_manuscript'].includes(e.status)).length;

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    for (const enq of allEnquiries) {
      statusCounts[enq.status] = (statusCounts[enq.status] || 0) + 1;
    }

    const recentAuditLogs = await auditRepo.list(10);

    return res.json({
      metrics: {
        totalBooks,
        publishedBooks,
        draftBooks,
        totalAuthors,
        totalEnquiries,
        newEnquiries,
        awaitingResponse,
      },
      statusCounts,
      recentActivity: recentAuditLogs,
      recentEnquiries: allEnquiries.slice(0, 5),
    });
  } catch (err: any) {
    console.error('Dashboard metrics error:', err);
    return res.status(500).json({ error: 'Failed to compute dashboard metrics.' });
  }
});

// Admin Users Management (Super Admin only)
adminRouter.get('/users', requireAuth, requireRole(['super_admin']), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await usersRepo.list();
    return res.json(users);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['super_admin', 'editor', 'enquiry_manager']),
});

adminRouter.post('/users', requireAuth, requireRole(['super_admin']), async (req: AuthRequest, res: Response) => {
  try {
    const parse = createUserSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });

    const existing = await usersRepo.findByEmail(parse.data.email);
    if (existing) {
      return res.status(400).json({ error: 'A staff user with this email address already exists.' });
    }

    const passwordHash = await bcryptjs.hash(parse.data.password, 10);
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: parse.data.name,
      email: parse.data.email.toLowerCase(),
      passwordHash,
      role: parse.data.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await usersRepo.create(newUser);
    await auditRepo.log(req.user?.id || null, 'create_user', 'user', created.id, { email: created.email, role: created.role });

    return res.status(201).json({
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      isActive: created.isActive,
      createdAt: created.createdAt,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create user.' });
  }
});

adminRouter.put('/users/:id', requireAuth, requireRole(['super_admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, isActive, password } = req.body;
    const updates: any = {};
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (typeof isActive === 'boolean') updates.isActive = isActive;
    if (password && password.length >= 8) {
      updates.passwordHash = await bcryptjs.hash(password, 10);
    }

    const updated = await usersRepo.update(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: 'User not found.' });

    await auditRepo.log(req.user?.id || null, 'update_user', 'user', req.params.id);
    return res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update user.' });
  }
});

// Audit Logs list (Super Admin only)
adminRouter.get('/audit-logs', requireAuth, requireRole(['super_admin']), async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const logs = await auditRepo.list(limit);
    return res.json(logs);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});
