import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Setup directories
const uploadsBaseDir = path.resolve(process.cwd(), 'uploads');
const publicDir = path.join(uploadsBaseDir, 'public');
const privateManuscriptDir = path.join(uploadsBaseDir, 'manuscripts_private');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(privateManuscriptDir)) fs.mkdirSync(privateManuscriptDir, { recursive: true });

// Storage engine for public image assets (covers, author photos)
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, publicDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Storage engine for private manuscripts (isolated, strictly non-public directory)
const manuscriptStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, privateManuscriptDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = file.originalname.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    const uniqueKey = `ms_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${safeBase}${ext}`;
    cb(null, uniqueKey);
  }
});

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) under 5MB are permitted.'));
    }
  }
});

export const uploadManuscript = multer({
  storage: manuscriptStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.rtf', '.txt', '.epub'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Permitted manuscript file formats: PDF, DOCX, DOC, RTF, TXT, EPUB under 25MB.'));
    }
  }
});

export { publicDir, privateManuscriptDir };
