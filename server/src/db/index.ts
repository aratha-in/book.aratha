import { config } from '../config';
import * as schema from './schema';
import { getInitialSeedData } from './seed-data';
import fs from 'fs';
import path from 'path';

// Memory/File-backed persistence store for local offline development when DATABASE_URL is not yet set
class LocalDataStore {
  private dbPath: string;
  public data: any = null;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = path.join(dataDir, 'local-store.json');
  }

  async init() {
    if (fs.existsSync(this.dbPath)) {
      try {
        const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
        this.data = JSON.parse(fileContent);
        return;
      } catch (e) {
        console.warn('Could not read existing local-store.json, re-initializing.');
      }
    }

    // Initialize with fresh seed data
    const seed = await getInitialSeedData();
    this.data = {
      users: seed.usersData,
      categories: seed.categoriesData,
      authors: seed.authorsData,
      books: seed.booksData,
      publishingServices: seed.servicesData,
      publishingEnquiries: seed.sampleEnquiriesData,
      enquiryNotes: seed.sampleNotesData,
      enquiryActivities: seed.sampleActivitiesData,
      faqs: seed.faqsData,
      testimonials: seed.testimonialsData,
      sitePages: seed.sitePagesData,
      siteSettings: seed.siteSettingsData,
      fileAssets: [],
      auditLogs: []
    };
    this.save();
  }

  save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist local store:', err);
    }
  }
}

export const localStore = new LocalDataStore();

// Database initialization
export let dbMode: 'neon' | 'local' = 'local';
export let neonClient: any = null;

export async function initDatabase() {
  if (config.databaseUrl && (config.databaseUrl.startsWith('postgres://') || config.databaseUrl.startsWith('postgresql://'))) {
    try {
      console.log('Connecting to Neon PostgreSQL database...');
      // Lazy load neon to prevent errors if network is offline
      const { Pool } = await import('pg');
      const { drizzle } = await import('drizzle-orm/node-postgres');
      const pool = new Pool({
        connectionString: config.databaseUrl,
        ssl: { rejectUnauthorized: false }
      });
      neonClient = drizzle(pool, { schema });
      dbMode = 'neon';
      console.log('Successfully connected to Neon PostgreSQL!');
      return;
    } catch (err) {
      console.warn('Neon connection failed, falling back to local persistence mode:', (err as Error).message);
    }
  }

  // Fallback to local store
  await localStore.init();
  dbMode = 'local';
  console.log('Initialized local persistence store with full seed dataset.');
}
