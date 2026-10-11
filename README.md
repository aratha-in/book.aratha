# Aratha Publication — Premium Book Publishing Platform & CMS

**Aratha Publication** is a comprehensive, production-oriented digital publishing platform developed for authors, academics, poets, and researchers. The platform combines a public-facing editorial website, a searchable book catalogue, a publishing enquiry intake portal, and a custom administrative CMS and CRM.

---

## 1. Architectural Highlights

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router v6.
- **Editorial Brand Aesthetic:** Deep Charcoal (`#171717`), Warm Ivory (`#F8F5EF`), Muted Gold (`#B99A5B`), and classical typography (Playfair Display, Cormorant Garamond, Plus Jakarta Sans).
- **Backend API:** Node.js with Express & TypeScript, structured under `/api` routes with input validation via Zod.
- **Database & ORM:** **Neon PostgreSQL** with **Drizzle ORM**, automated migrations, and schema definitions across 14 normalized tables. Includes resilient local persistence fallback for offline and local testing.
- **Role-Based Access Control (RBAC):**
  - `super_admin`: Full administrative access, staff user & permission management, audit logs.
  - `editor`: Catalogue books, author profiles, publishing services, and CMS site content.
  - `enquiry_manager`: Author submission pipeline, intake triage, staff assignment, private internal notes, and CSV exports.
- **Enquiry Intake & CRM Pipeline:** Multi-step author wizard with auto-generated reference numbers (`ARP-YYYY-XXXX`), automated author confirmation receipt emails, staff email notifications, and an administrative pipeline (New, Contacted, Reviewing Manuscript, Proposal Sent, Accepted, etc.).
- **Private Manuscript Storage:** Secure uploads directory isolating manuscripts from public web endpoints, protected by authenticated staff downloads.

---

## 2. Directory Structure

```text
book.aratha/
├── client/                      # Vite + React + TypeScript Frontend
│   ├── index.html               # Editorial font preloading & meta tags
│   ├── package.json
│   ├── tailwind.config.js       # Brand color palette & typography tokens
│   └── src/
│       ├── components/common/   # Navbar, Footer, BookCard, SectionHeading
│       ├── context/             # AuthContext (JWT session management)
│       ├── pages/               # Public pages (Home, About, Books, Services, Process, FAQ, Contact, Enquiry, Legal)
│       │   └── admin/           # Administrative CMS pages (Dashboard, Books, Authors, Services, Enquiries, Content, Users)
│       ├── services/api.ts      # Type-safe API client
│       └── types/index.ts       # Shared data models & TypeScript interfaces
├── server/                      # Node.js + Express + TypeScript Backend
│   ├── package.json
│   ├── drizzle.config.ts        # Drizzle ORM configuration for Neon PostgreSQL
│   ├── src/
│   │   ├── config/              # Environment variables & runtime settings
│   │   ├── db/
│   │   │   ├── schema.ts        # 14 Drizzle PostgreSQL table definitions
│   │   │   ├── migrate.ts       # Neon database migration runner
│   │   │   ├── seed-data.ts     # Curated initial publishing dataset
│   │   │   ├── seed.ts          # Database seed script
│   │   │   └── repo.ts          # Repository abstraction layer
│   │   ├── middleware/          # JWT authentication, RBAC, file upload filters
│   │   ├── routes/              # Express API routers (auth, books, authors, services, enquiries, content, upload, admin)
│   │   ├── services/            # Email notifications & file asset management
│   │   └── index.ts             # Express server entry point
│   └── test/
│       └── api.test.ts          # Automated integration & security test suite
├── uploads/                     # File asset storage
│   ├── public/                  # Public assets (covers, author portraits)
│   └── manuscripts_private/     # Confidential manuscript storage (strictly non-public)
├── .env.example                 # Environment variable templates
├── package.json                 # Monorepo workspace configuration
└── README.md
```

---

## 3. Database Schema (14 Tables)

1. `users`: Administrative staff with password hashes (`bcryptjs`) and roles (`super_admin`, `editor`, `enquiry_manager`).
2. `authors`: Author biographies, portraits, slugs, websites, and publication associations.
3. `categories`: Genres and literary classifications (Literary Fiction, Academic, Memoir, etc.).
4. `books`: Detailed bibliographical records, ISBNs, formats, page counts, synopsis, and cover images.
5. `publishing_services`: 11 curated publishing tracks with deliverables and pricing labels.
6. `publishing_enquiries`: Author project submissions with unique reference numbers and pipeline statuses.
7. `enquiry_notes`: Confidential staff-only notes (never exposed to public or authors).
8. `enquiry_activities`: Chronological audit trail of intake actions, status changes, and staff assignments.
9. `faqs`: Categorized publishing house questions and answers.
10. `testimonials`: Curated author feedback and reflections.
11. `site_pages`: Dynamic CMS pages (About Us, Process, Privacy Policy, Terms).
12. `site_settings`: Brand information, contact email/phone, and homepage hero copy.
13. `file_assets`: Metadata tracking for public images and private manuscripts.
14. `audit_logs`: Administrative mutation logs tracking staff actions.

---

## 4. Setup and Installation

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### 1. Install Dependencies
From the repository root:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
PORT=5000
APP_URL=http://localhost:5173
API_URL=http://localhost:5000

# Neon PostgreSQL Database
# Leave blank to use local development storage, or paste your Neon connection string:
DATABASE_URL=postgresql://[user]:[password]@[neon-hostname]/[dbname]?sslmode=require

# Security Secrets
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long_for_security_aratha_pub
JWT_EXPIRES_IN=7d

# Initial Administrator Credentials
ADMIN_INITIAL_EMAIL=admin@aratha.com
ADMIN_INITIAL_PASSWORD=ArathaAdmin2026!

# Email Delivery (e.g. resend or console simulator)
EMAIL_PROVIDER=console
RESEND_API_KEY=
CONTACT_RECEIVER_EMAIL=submissions@aratha.com
```

### 3. Provisioning Neon PostgreSQL
If you are connecting to a Neon PostgreSQL instance, run migrations and seeds:
```bash
# Execute DDL schema migrations on Neon
npm run db:migrate

# Seed initial titles, authors, services, FAQs, and default staff users
npm run db:seed
```

### 4. Running the Development Servers
Run both backend and frontend concurrently:
```bash
npm run dev
```
Or run individually:
```bash
npm run dev:server   # Starts backend API on http://localhost:5000
npm run dev:client   # Starts Vite React dev server on http://localhost:5173
```

---

## 5. Development Staff Accounts

Pre-configured staff accounts for development testing:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@aratha.com` | `ArathaAdmin2026!` | Full administrative access, staff user management, audit logs |
| **Senior Editor** | `editor@aratha.com` | `StaffPass2026!` | Book catalogue, author profiles, publishing services, CMS content |
| **Enquiry Manager** | `crm@aratha.com` | `StaffPass2026!` | Intake CRM pipeline, author communication notes, assignments, CSV export |

*Note: On the `/admin/login` page, click any of the 1-click Quick Fill buttons to automatically test each role.*

---

## 6. Running Automated Tests

Run the comprehensive integration and security test suite:
```bash
npm run test
```

Tests verify:
- Server health check
- Public book catalogue search & filtering
- Book detail by slug with author relations
- Author detail with published books
- Publishing services active list
- Enquiry form validation (rejection of malformed submissions)
- Valid enquiry submission and unique reference generation (`ARP-YYYY-XXXX`)
- Unauthorized admin endpoint rejection (401 Unauthorized)
- Super Admin JWT authentication
- Dashboard KPI calculation
- Role-based access control (Editor forbidden from user management - 403 Forbidden)
- CRM status update and confidential internal notes
- Authorized CSV enquiry export

---

## 7. Production Deployment Guide

### Frontend Deployment (e.g., Vercel)
1. Link your GitHub repository to Vercel.
2. Set root directory to `client`.
3. Set build command to `npm run build` and output directory to `dist`.
4. Configure environment variable:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://api.aratha.com`).

### Backend Deployment (e.g., Render, Railway, Fly.io)
1. Set root directory to `server`.
2. Set build command to `npm run build`.
3. Set start command to `npm start`.
4. Add environment variables:
   - `DATABASE_URL`: Your pooled Neon PostgreSQL connection string.
   - `JWT_SECRET`: Random 64-character secret.
   - `APP_URL`: Your production frontend domain.
   - `STORAGE_PROVIDER`: Object storage provider (`local`, `cloudinary`, or `s3`).
   - `EMAIL_PROVIDER`: `resend` with `RESEND_API_KEY`.
5. Run `npm run db:migrate` and `npm run db:seed` during deployment setup.

### Neon PostgreSQL Backup & Disaster Recovery
- Neon provides **point-in-time recovery (PITR)** and automated branch snapshots.
- Prior to major catalog updates or schema migrations, create a Neon snapshot branch in the Neon console.
- For daily offsite backups, configure a GitHub Actions workflow using `pg_dump` targeting your Neon pooled endpoint.
