import { config } from '../config';
import { Pool } from 'pg';

async function migrate() {
  console.log('--- Initializing Neon Database Schema ---');
  if (!config.databaseUrl) {
    console.log('No DATABASE_URL configured. Local fallback store is active.');
    return;
  }

  const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Execute DDL SQL directly to ensure all 14 tables and indexes exist on Neon
    console.log('Creating tables in Neon PostgreSQL...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'editor',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS authors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        biography TEXT NOT NULL,
        profile_image_url TEXT,
        website_url TEXT,
        social_links JSONB,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        subtitle TEXT,
        author_id TEXT REFERENCES authors(id),
        category_id TEXT REFERENCES categories(id),
        cover_image_url TEXT,
        short_description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'English',
        isbn TEXT,
        formats JSONB NOT NULL DEFAULT '["Paperback", "eBook"]',
        page_count INTEGER,
        publication_date TEXT,
        publisher TEXT DEFAULT 'Aratha Publication',
        external_purchase_url TEXT,
        is_featured BOOLEAN NOT NULL DEFAULT false,
        status TEXT NOT NULL DEFAULT 'published',
        seo_title TEXT,
        seo_description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS publishing_services (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        deliverables JSONB NOT NULL DEFAULT '[]',
        pricing_label TEXT,
        image_url TEXT,
        display_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        seo_title TEXT,
        seo_description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS publishing_enquiries (
        id TEXT PRIMARY KEY,
        reference_number TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        country TEXT NOT NULL,
        manuscript_title TEXT NOT NULL,
        service_id TEXT REFERENCES publishing_services(id),
        genre TEXT NOT NULL,
        manuscript_status TEXT NOT NULL,
        estimated_word_count INTEGER,
        preferred_format TEXT,
        project_description TEXT NOT NULL,
        expected_timeline TEXT,
        budget_range TEXT,
        consent_at TIMESTAMP NOT NULL DEFAULT NOW(),
        status TEXT NOT NULL DEFAULT 'new',
        assigned_to TEXT REFERENCES users(id),
        source TEXT DEFAULT 'website_form',
        manuscript_file_id TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS enquiry_notes (
        id TEXT PRIMARY KEY,
        enquiry_id TEXT NOT NULL REFERENCES publishing_enquiries(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id),
        note TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS enquiry_activities (
        id TEXT PRIMARY KEY,
        enquiry_id TEXT NOT NULL REFERENCES publishing_enquiries(id) ON DELETE CASCADE,
        user_id TEXT REFERENCES users(id),
        activity_type TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS faqs (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'General',
        display_order INTEGER NOT NULL DEFAULT 0,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        author_name TEXT NOT NULL,
        role_or_description TEXT NOT NULL,
        testimonial TEXT NOT NULL,
        image_url TEXT,
        is_published BOOLEAN NOT NULL DEFAULT true,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS site_pages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content JSONB NOT NULL,
        status TEXT NOT NULL DEFAULT 'published',
        seo_title TEXT,
        seo_description TEXT,
        updated_by TEXT REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY,
        setting_key TEXT NOT NULL UNIQUE,
        setting_value JSONB NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS file_assets (
        id TEXT PRIMARY KEY,
        storage_provider TEXT NOT NULL DEFAULT 'local',
        storage_key TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        access_level TEXT NOT NULL DEFAULT 'public',
        uploaded_by TEXT REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author_id);
      CREATE INDEX IF NOT EXISTS idx_books_category ON books(category_id);
      CREATE INDEX IF NOT EXISTS idx_enquiries_status ON publishing_enquiries(status);
      CREATE INDEX IF NOT EXISTS idx_enquiries_ref ON publishing_enquiries(reference_number);
    `);
    console.log('--- Neon Database Schema Migrations Completed Successfully! ---');
  } catch (e) {
    console.error('Migration error:', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
