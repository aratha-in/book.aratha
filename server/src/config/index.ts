import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or current dir
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'aratha_secret_key_at_least_32_chars_long_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminInitialEmail: process.env.ADMIN_INITIAL_EMAIL || 'admin@aratha.com',
  adminInitialPassword: process.env.ADMIN_INITIAL_PASSWORD || 'ArathaAdmin2026!',
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  uploadDir: process.env.UPLOAD_DIR || path.resolve(process.cwd(), '../uploads'),
  emailProvider: process.env.EMAIL_PROVIDER || 'console',
  resendApiKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'Aratha Publication <publishing@aratha.com>',
  contactReceiverEmail: process.env.CONTACT_RECEIVER_EMAIL || 'submissions@aratha.com',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
