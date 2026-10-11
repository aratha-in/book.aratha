import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { uploadImage, uploadManuscript, privateManuscriptDir } from '../middleware/upload';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { filesRepo, auditRepo } from '../db/repo';

export const uploadRouter = Router();

// Upload public image (cover image or author profile photo)
uploadRouter.post('/image', requireAuth, requireRole(['super_admin', 'editor']), uploadImage.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const publicUrl = `/uploads/public/${req.file.filename}`;

    const asset = {
      id: `ast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      storageProvider: 'local',
      storageKey: req.file.filename,
      originalFilename: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      accessLevel: 'public',
      uploadedBy: req.user?.id || null,
      createdAt: new Date(),
    };

    await filesRepo.create(asset);
    await auditRepo.log(req.user?.id || null, 'upload_image', 'file_asset', asset.id, { filename: req.file.originalname });

    return res.json({
      success: true,
      url: publicUrl,
      assetId: asset.id,
      filename: req.file.originalname,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Image upload failed.' });
  }
});

// Upload private manuscript (used in author enquiry submission or author portal)
uploadRouter.post('/manuscript', uploadManuscript.single('manuscript'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No manuscript file uploaded.' });
    }

    const asset = {
      id: `ms-ast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      storageProvider: 'local',
      storageKey: req.file.filename,
      originalFilename: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      accessLevel: 'private', // Strictly private access
      uploadedBy: null,
      createdAt: new Date(),
    };

    await filesRepo.create(asset);

    return res.json({
      success: true,
      fileId: asset.id,
      originalFilename: req.file.originalname,
      sizeBytes: req.file.size,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Manuscript upload failed.' });
  }
});

// Authenticated staff download of private manuscript
uploadRouter.get('/manuscript/:id/download', requireAuth, requireRole(['super_admin', 'editor', 'enquiry_manager']), async (req: AuthRequest, res: Response) => {
  try {
    const asset = await filesRepo.getById(req.params.id);
    if (!asset || asset.accessLevel !== 'private') {
      return res.status(404).json({ error: 'Manuscript asset record not found.' });
    }

    const filePath = path.join(privateManuscriptDir, asset.storageKey);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Physical manuscript file not found on disk.' });
    }

    await auditRepo.log(req.user?.id || null, 'download_manuscript', 'file_asset', asset.id, {
      originalFilename: asset.originalFilename,
    });

    res.setHeader('Content-Disposition', `attachment; filename="${asset.originalFilename}"`);
    res.setHeader('Content-Type', asset.mimeType);
    return res.sendFile(filePath);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve manuscript file.' });
  }
});
