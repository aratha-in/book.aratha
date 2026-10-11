import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { enquiriesRepo, auditRepo, usersRepo } from '../db/repo';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { sendEnquiryConfirmationEmail } from '../services/email';

export const enquiryRouter = Router();

const publicEnquirySchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(6, 'Contact phone number is required'),
  country: z.string().min(2, 'Country is required'),
  manuscriptTitle: z.string().min(1, 'Author or manuscript title is required'),
  serviceId: z.string().optional().nullable(),
  genre: z.string().min(1, 'Genre is required'),
  manuscriptStatus: z.string().min(1, 'Manuscript status is required'),
  estimatedWordCount: z.coerce.number().int().optional().nullable(),
  preferredFormat: z.string().optional().nullable(),
  projectDescription: z.string().min(15, 'Please provide project details (minimum 15 characters)'),
  expectedTimeline: z.string().optional().nullable(),
  budgetRange: z.string().optional().nullable(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy notice to submit an enquiry',
  }),
  manuscriptFileId: z.string().optional().nullable(),
  source: z.string().optional().default('website_form'),
});

// Helper to generate unique reference number: ARP-YYYY-XXXX
function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ARP-${year}-${randomSuffix}`;
}

// Public: Submit enquiry
enquiryRouter.post('/', async (req: Request, res: Response) => {
  try {
    const parse = publicEnquirySchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
    }

    const data = parse.data;
    let referenceNumber = generateReferenceNumber();
    
    // Ensure uniqueness
    let existing = await enquiriesRepo.getByRef(referenceNumber);
    while (existing) {
      referenceNumber = generateReferenceNumber();
      existing = await enquiriesRepo.getByRef(referenceNumber);
    }

    const enquiryRecord = {
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      referenceNumber,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      country: data.country,
      manuscriptTitle: data.manuscriptTitle,
      serviceId: data.serviceId || null,
      genre: data.genre,
      manuscriptStatus: data.manuscriptStatus,
      estimatedWordCount: data.estimatedWordCount || null,
      preferredFormat: data.preferredFormat || null,
      projectDescription: data.projectDescription,
      expectedTimeline: data.expectedTimeline || null,
      budgetRange: data.budgetRange || null,
      consentAt: new Date(),
      status: 'new',
      assignedTo: null,
      source: data.source || 'website_form',
      manuscriptFileId: data.manuscriptFileId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const saved = await enquiriesRepo.create(enquiryRecord);

    // Initial activity log
    await enquiriesRepo.addActivity({
      id: `act-sub-${Date.now()}`,
      enquiryId: saved.id,
      userId: null,
      activityType: 'submission',
      description: `Publishing enquiry submitted via website with reference ${referenceNumber}.`,
      createdAt: new Date(),
    });

    // Send emails asynchronously - failure never deletes the record
    sendEnquiryConfirmationEmail(saved).catch((err) => {
      console.error('Async email notification error:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Your publishing enquiry has been submitted successfully.',
      referenceNumber: saved.referenceNumber,
      enquiryId: saved.id,
    });
  } catch (err: any) {
    console.error('Enquiry submission error:', err);
    return res.status(500).json({ error: 'Failed to process publishing enquiry. Please try again.' });
  }
});

// Admin: List enquiries (Enquiry Manager, Editor, Super Admin)
enquiryRouter.get('/', requireAuth, requireRole(['super_admin', 'editor', 'enquiry_manager']), async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;
    const result = await enquiriesRepo.list({
      status: status as string,
      search: search as string,
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 20,
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
});

// Admin: Export enquiries to CSV
enquiryRouter.get('/export/csv', requireAuth, requireRole(['super_admin', 'enquiry_manager']), async (_req: AuthRequest, res: Response) => {
  try {
    const { enquiries } = await enquiriesRepo.list({ limit: 1000 });
    
    // Build CSV headers and rows
    const headers = [
      'Reference',
      'Submission Date',
      'Author Name',
      'Email',
      'Phone',
      'Country',
      'Manuscript Title',
      'Genre',
      'Status',
      'Word Count',
      'Preferred Format',
      'Assigned Staff',
      'Source'
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = enquiries.map((e: any) => [
      escapeCsv(e.referenceNumber),
      escapeCsv(new Date(e.createdAt).toISOString().split('T')[0]),
      escapeCsv(e.fullName),
      escapeCsv(e.email),
      escapeCsv(e.phone),
      escapeCsv(e.country),
      escapeCsv(e.manuscriptTitle),
      escapeCsv(e.genre),
      escapeCsv(e.status),
      escapeCsv(e.estimatedWordCount || ''),
      escapeCsv(e.preferredFormat || ''),
      escapeCsv(e.assignedUser?.name || 'Unassigned'),
      escapeCsv(e.source || '')
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="aratha_enquiries_${new Date().toISOString().split('T')[0]}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate CSV export.' });
  }
});

// Admin: Get enquiry details with notes & timeline
enquiryRouter.get('/:id', requireAuth, requireRole(['super_admin', 'editor', 'enquiry_manager']), async (req: AuthRequest, res: Response) => {
  try {
    const enquiry = await enquiriesRepo.getById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry record not found.' });
    }
    return res.json(enquiry);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch enquiry details.' });
  }
});

// Admin: Update enquiry status
const allowedStatuses = [
  'new',
  'contacted',
  'consultation_scheduled',
  'reviewing_manuscript',
  'proposal_sent',
  'negotiation',
  'accepted',
  'rejected',
  'completed',
  'closed',
];

enquiryRouter.put('/:id/status', requireAuth, requireRole(['super_admin', 'editor', 'enquiry_manager']), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Permitted statuses: ${allowedStatuses.join(', ')}` });
    }

    const current = await enquiriesRepo.getById(req.params.id);
    if (!current) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }

    const oldStatus = current.status;
    const updated = await enquiriesRepo.update(req.params.id, { status });

    await enquiriesRepo.addActivity({
      id: `act-${Date.now()}`,
      enquiryId: req.params.id,
      userId: req.user?.id || null,
      activityType: 'status_change',
      description: `Status changed from "${oldStatus}" to "${status}" by ${req.user?.name}.`,
      createdAt: new Date(),
    });

    await auditRepo.log(req.user?.id || null, 'update_status', 'enquiry', req.params.id, { oldStatus, newStatus: status });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update enquiry status.' });
  }
});

// Admin: Assign staff member to enquiry
enquiryRouter.put('/:id/assign', requireAuth, requireRole(['super_admin', 'enquiry_manager']), async (req: AuthRequest, res: Response) => {
  try {
    const { assignedTo } = req.body;
    let assigneeName = 'Unassigned';
    if (assignedTo) {
      const user = await usersRepo.findById(assignedTo);
      if (!user) return res.status(400).json({ error: 'Assignee user not found.' });
      assigneeName = user.name;
    }

    const updated = await enquiriesRepo.update(req.params.id, { assignedTo: assignedTo || null });

    await enquiriesRepo.addActivity({
      id: `act-asg-${Date.now()}`,
      enquiryId: req.params.id,
      userId: req.user?.id || null,
      activityType: 'assigned',
      description: `Enquiry assigned to ${assigneeName} by ${req.user?.name}.`,
      createdAt: new Date(),
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to assign enquiry.' });
  }
});

// Admin: Add internal note
enquiryRouter.post('/:id/notes', requireAuth, requireRole(['super_admin', 'editor', 'enquiry_manager']), async (req: AuthRequest, res: Response) => {
  try {
    const { note } = req.body;
    if (!note || note.trim().length === 0) {
      return res.status(400).json({ error: 'Note text cannot be empty.' });
    }

    const noteRecord = {
      id: `not-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      enquiryId: req.params.id,
      userId: req.user!.id,
      note: note.trim(),
      createdAt: new Date(),
    };

    const saved = await enquiriesRepo.addNote(noteRecord);

    await enquiriesRepo.addActivity({
      id: `act-not-${Date.now()}`,
      enquiryId: req.params.id,
      userId: req.user!.id,
      activityType: 'note_added',
      description: `Internal note added by ${req.user?.name}.`,
      createdAt: new Date(),
    });

    return res.status(201).json({
      ...saved,
      user: {
        id: req.user!.id,
        name: req.user!.name,
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to add internal note.' });
  }
});
