import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Aratha Publication Automated API & Security Tests...\n');
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  await test('Server Health Check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
  });

  // 2. Public Book Catalogue
  await test('Public Book Catalogue: List & Search', async () => {
    const res = await fetch(`${BASE_URL}/books?page=1&limit=5`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.books.length > 0, 'Should have seeded books');
    assert(data.total >= 5, 'Total books count >= 5');
  });

  // 3. Book Details by Slug
  await test('Public Book Details: Fetch by Slug', async () => {
    const res = await fetch(`${BASE_URL}/books/the-silent-architecture`);
    assert.strictEqual(res.status, 200);
    const book = await res.json();
    assert.strictEqual(book.title, 'The Silent Architecture');
    assert(book.author, 'Author details should be populated');
  });

  // 4. Author Details and Published Books
  await test('Public Author Details: Fetch by Slug with Books', async () => {
    const res = await fetch(`${BASE_URL}/authors/camilla-moreau`);
    assert.strictEqual(res.status, 200);
    const author = await res.json();
    assert.strictEqual(author.name, 'Camilla Moreau');
    assert(Array.isArray(author.books), 'Author books should be returned');
  });

  // 5. Publishing Services
  await test('Public Services: List Active Services', async () => {
    const res = await fetch(`${BASE_URL}/services`);
    assert.strictEqual(res.status, 200);
    const services = await res.json();
    assert(services.length >= 10, 'Should return all publishing services');
  });

  // 6. Enquiry Validation (Form Validation Failure)
  await test('Enquiry Submission: Reject Invalid Data', async () => {
    const res = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'A', // too short
        email: 'invalid-email',
      }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert(data.error, 'Should return validation error');
  });

  // 7. Valid Enquiry Submission & Unique Reference
  let createdRefNumber = '';
  let createdEnquiryId = '';
  await test('Enquiry Submission: Create Valid Enquiry with Unique Reference', async () => {
    const res = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Isabella Bennett',
        email: 'isabella@testauthor.com',
        phone: '+1 202 555 0144',
        country: 'Canada',
        manuscriptTitle: 'The Cartographer of Lost Rivers',
        genre: 'Literary Fiction',
        manuscriptStatus: 'Completed',
        estimatedWordCount: 78000,
        preferredFormat: 'Print & eBook',
        projectDescription: 'A historical novel following river cartographers in late 19th-century Quebec.',
        consent: true,
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert(data.referenceNumber.startsWith('ARP-'), 'Reference number should follow format ARP-YYYY-XXXX');
    assert(data.enquiryId, 'Should return enquiry ID');
    createdRefNumber = data.referenceNumber;
    createdEnquiryId = data.enquiryId;
  });

  // 8. Security & RBAC: Unauthorized Access Blocked
  await test('Security: Protected Admin Endpoint Rejects Unauthenticated Requests', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard`);
    assert.strictEqual(res.status, 401);
  });

  // 9. Admin Authentication
  let adminToken = '';
  await test('Authentication: Super Admin Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@aratha.com',
        password: 'ArathaAdmin2026!',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.token, 'Token should be returned');
    assert.strictEqual(data.user.role, 'super_admin');
    adminToken = data.token;
  });

  // 10. Admin Dashboard Metrics
  await test('Admin Dashboard: Fetch KPI Metrics with Token', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.metrics.totalBooks > 0);
    assert(data.metrics.totalEnquiries > 0);
  });

  // 11. Role-Based Access Control: Editor Token Cannot Access User Management
  await test('RBAC: Editor Login & Denied Access to User Management', async () => {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'editor@aratha.com',
        password: 'StaffPass2026!',
      }),
    });
    assert.strictEqual(loginRes.status, 200);
    const { token: editorToken } = await loginRes.json();

    const usersRes = await fetch(`${BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${editorToken}` },
    });
    assert.strictEqual(usersRes.status, 403, 'Editor must receive 403 Forbidden on user management');
  });

  // 12. CRM Operations: Update Enquiry Status & Add Internal Note
  await test('CRM Operations: Update Status & Add Private Note', async () => {
    if (!createdEnquiryId) throw new Error('Enquiry ID not set');

    // Update status
    const statusRes = await fetch(`${BASE_URL}/enquiries/${createdEnquiryId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'reviewing_manuscript' }),
    });
    assert.strictEqual(statusRes.status, 200);

    // Add note
    const noteRes = await fetch(`${BASE_URL}/enquiries/${createdEnquiryId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ note: 'Sample chapters downloaded and verified for literary critique.' }),
    });
    assert.strictEqual(noteRes.status, 201);

    // Verify detail
    const detailRes = await fetch(`${BASE_URL}/enquiries/${createdEnquiryId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    assert.strictEqual(detailRes.status, 200);
    const detail = await detailRes.json();
    assert.strictEqual(detail.status, 'reviewing_manuscript');
    assert(detail.notes.length >= 1);
    assert(detail.activities.length >= 2);
  });

  // 13. Export Enquiries to CSV
  await test('CRM Operations: CSV Export', async () => {
    const res = await fetch(`${BASE_URL}/enquiries/export/csv`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert(text.includes('Reference,Submission Date'), 'CSV must contain standard headers');
    assert(text.includes(createdRefNumber), 'CSV must contain newly submitted reference number');
  });

  console.log(`\n========================================================`);
  console.log(`Test Summary: ${passed} passed, ${failed} failed.`);
  console.log(`========================================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
