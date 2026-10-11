import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import { initDatabase, dbMode } from './db';
import { authRouter } from './routes/auth.routes';
import { bookRouter } from './routes/book.routes';
import { authorRouter } from './routes/author.routes';
import { categoryRouter } from './routes/category.routes';
import { serviceRouter } from './routes/service.routes';
import { enquiryRouter } from './routes/enquiry.routes';
import { contentRouter } from './routes/content.routes';
import { uploadRouter } from './routes/upload.routes';
import { adminRouter } from './routes/admin.routes';
import { publicDir } from './middleware/upload';

const app = express();

// Security & Cross-Origin Resource Sharing
app.use(cors({
  origin: (origin, callback) => {
    // Allow local dev origins and production APP_URL
    if (!origin || origin.startsWith('http://localhost:') || origin === config.appUrl) {
      callback(null, true);
    } else {
      callback(null, true); // Dev flexible
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve public uploads (covers, thumbnails)
// Note: Manuscripts are stored in privateManuscriptDir and NEVER served statically
app.use('/uploads/public', express.static(publicDir));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Aratha Publication Backend API',
    databaseMode: dbMode,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/authors', authorRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/services', serviceRouter);
app.use('/api/enquiries', enquiryRouter);
app.use('/api/content', contentRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/admin', adminRouter);

// Serve frontend build in production if available
const candidatePaths = [
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(__dirname, '../../client/dist'),
];
const clientDistPath = candidatePaths.find((p) => fs.existsSync(p));

if (clientDistPath) {
  app.use(express.static(clientDistPath));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Database initialization middleware for serverless cold-starts
let isDbInitialized = false;
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (!isDbInitialized) {
    try {
      await initDatabase();
      isDbInitialized = true;
    } catch (e) {
      console.error('Database initialization error:', e);
    }
  }
  next();
});

// Global safe error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled API Error:', err);
  const status = err.status || 500;
  const message = config.nodeEnv === 'production' 
    ? 'An internal error occurred. Please contact the administrator.' 
    : err.message || 'Server error';

  res.status(status).json({
    error: message,
    status,
  });
});

// Start Server for standalone node / dev execution
async function startServer() {
  await initDatabase();
  isDbInitialized = true;

  app.listen(config.port, () => {
    console.log(`\n========================================================`);
    console.log(`📚 ARATHA PUBLICATION API SERVER`);
    console.log(`🚀 Running at: http://localhost:${config.port}`);
    console.log(`💾 Database Mode: ${dbMode.toUpperCase()}`);
    console.log(`🔒 Initial Admin: ${config.adminInitialEmail}`);
    console.log(`========================================================\n`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Fatal server startup failure:', err);
    process.exit(1);
  });
}

export default app;
