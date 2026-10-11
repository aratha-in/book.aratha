import { config } from '../config';
import { getInitialSeedData } from './seed-data';
import * as schema from './schema';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

async function seed() {
  console.log('--- Starting Aratha Publication Database Seeding ---');
  if (!config.databaseUrl || (!config.databaseUrl.startsWith('postgres://') && !config.databaseUrl.startsWith('postgresql://'))) {
    console.log('No PostgreSQL DATABASE_URL detected in environment.');
    console.log('Populating local store instead...');
    const { localStore } = await import('./index');
    await localStore.init();
    console.log('Local store populated successfully!');
    process.exit(0);
  }

  console.log(`Connecting to Neon database: ${config.databaseUrl.replace(/:[^:]*@/, ':****@')}`);
  const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  const db = drizzle(pool, { schema });

  try {
    const data = await getInitialSeedData();

    console.log('Seeding users...');
    for (const u of data.usersData) {
      await db.insert(schema.users).values(u).onConflictDoNothing();
    }

    console.log('Seeding categories...');
    for (const c of data.categoriesData) {
      await db.insert(schema.categories).values(c).onConflictDoNothing();
    }

    console.log('Seeding authors...');
    for (const a of data.authorsData) {
      await db.insert(schema.authors).values(a).onConflictDoNothing();
    }

    console.log('Seeding books...');
    for (const b of data.booksData) {
      await db.insert(schema.books).values(b).onConflictDoNothing();
    }

    console.log('Seeding publishing services...');
    for (const s of data.servicesData) {
      await db.insert(schema.publishingServices).values(s).onConflictDoNothing();
    }

    console.log('Seeding FAQs...');
    for (const f of data.faqsData) {
      await db.insert(schema.faqs).values(f).onConflictDoNothing();
    }

    console.log('Seeding testimonials...');
    for (const t of data.testimonialsData) {
      await db.insert(schema.testimonials).values(t).onConflictDoNothing();
    }

    console.log('Seeding site pages...');
    for (const p of data.sitePagesData) {
      await db.insert(schema.sitePages).values(p).onConflictDoNothing();
    }

    console.log('Seeding site settings...');
    for (const st of data.siteSettingsData) {
      await db.insert(schema.siteSettings).values(st).onConflictDoNothing();
    }

    console.log('Seeding sample publishing enquiries & activity CRM records...');
    for (const enq of data.sampleEnquiriesData) {
      await db.insert(schema.publishingEnquiries).values(enq).onConflictDoNothing();
    }

    for (const n of data.sampleNotesData) {
      await db.insert(schema.enquiryNotes).values(n).onConflictDoNothing();
    }

    for (const act of data.sampleActivitiesData) {
      await db.insert(schema.enquiryActivities).values(act).onConflictDoNothing();
    }

    console.log('--- Database Seeding Completed Successfully! ---');
  } catch (err) {
    console.error('Error during database seeding:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
