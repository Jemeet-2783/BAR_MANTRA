import { test, expect } from '@playwright/test';

test.describe('Barmantra E2E Production Suite', () => {

  test('Scenario 1: Public booking submission with server-side price verification', async ({ request, page }) => {
    // 1. Verify pricing calculator API computes locked quote
    const pricingRes = await request.post('/api/pricing/calculate', {
      data: {
        eventType: 'wedding-bar',
        guestCount: 200
      }
    });
    expect(pricingRes.ok()).toBeTruthy();
    const pricingData = await pricingRes.json();
    expect(pricingData.success).toBe(true);
    // Base calculation: (200 * 2500) + 25000 = 525000 INR
    expect(pricingData.pricingEstimate).toBe(525000);

    // 2. Submit public booking via API with locked price calculation
    const bookingRes = await request.post('/api/bookings', {
      data: {
        name: 'Automated E2E Client',
        phone: '+91 99999 88888',
        email: 'e2e.test@barmantra.com',
        eventType: 'wedding-bar',
        eventDate: '2026-11-25',
        guestCount: 200,
        message: 'Automated Playwright booking test with locked server pricing.'
      }
    });

    expect(bookingRes.status()).toBe(201);
    const bookingBody = await bookingRes.json();
    expect(bookingBody.success).toBe(true);
    expect(bookingBody.booking.pricingEstimate).toBe(525000);
    expect(bookingBody.booking.status).toBe('Pending');
  });

  test('Scenario 2: Admin login with valid & invalid credentials and rate-limiting check', async ({ request }) => {
    // 1. Invalid login attempt
    const badLoginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: 'wrong_password_attempt'
      }
    });
    expect(badLoginRes.status()).toBe(401);
    const badData = await badLoginRes.json();
    expect(badData.error).toContain('Invalid royal credentials');

    // 2. Valid login attempt
    const validLoginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: process.env.ADMIN_PASSWORD || 'barmantra123'
      }
    });
    expect(validLoginRes.ok()).toBeTruthy();
    const validData = await validLoginRes.json();
    expect(validData.success).toBe(true);
    expect(validData.user.role).toBe('superadmin');
  });

  test('Scenario 3: Admin approve proposal, soft-delete, and restore from Trash Archive', async ({ request }) => {
    // 1. Log in to establish admin session cookie & CSRF token
    const loginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: process.env.ADMIN_PASSWORD || 'barmantra123'
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    const authHeaders = {
      Cookie: loginRes.headers()['set-cookie'],
      'X-CSRF-Token': loginData.csrfToken
    };

    // 2. Create test booking to manipulate
    const newBookingRes = await request.post('/api/bookings', {
      data: {
        name: 'Trash & Restore Test Subject',
        phone: '+91 90000 11111',
        email: 'trash.restore@barmantra.com',
        eventType: 'corporate-bar',
        eventDate: '2026-10-10',
        guestCount: 150,
        message: 'Testing soft delete lifecycle.'
      }
    });
    const bookingObj = (await newBookingRes.json()).booking;
    const bookingId = bookingObj.id;

    // 3. Admin approve proposal
    const approveRes = await request.patch(`/api/admin/bookings/${bookingId}/status`, {
      headers: authHeaders,
      data: { status: 'Approved' }
    });
    expect(approveRes.ok()).toBeTruthy();
    const approvedObj = (await approveRes.json()).booking;
    expect(approvedObj.status).toBe('Approved');

    // 4. Soft-delete record (Move to Trash Archive)
    const deleteRes = await request.delete(`/api/admin/bookings/${bookingId}`, {
      headers: authHeaders
    });
    expect(deleteRes.ok()).toBeTruthy();
    const deleteData = await deleteRes.json();
    expect(deleteData.success).toBe(true);
    expect(deleteData.booking.deletedAt).toBeDefined();

    // 5. Verify record appears in Trash Archive
    const trashRes = await request.get('/api/admin/trash', {
      headers: authHeaders
    });
    expect(trashRes.ok()).toBeTruthy();
    const trashData = await trashRes.json();
    const inTrash = trashData.bookings.some((b: any) => b.id === bookingId);
    expect(inTrash).toBe(true);

    // 6. Restore record from Trash Archive
    const restoreRes = await request.post(`/api/admin/bookings/${bookingId}/restore`, {
      headers: authHeaders
    });
    expect(restoreRes.ok()).toBeTruthy();
    const restoreData = await restoreRes.json();
    expect(restoreData.success).toBe(true);
    expect(restoreData.booking.deletedAt).toBeUndefined();
  });

  test('Scenario 4: Dynamic CMS API and Admin User Registration lifecycle', async ({ request }) => {
    // 1. Check public site content API
    const cmsRes = await request.get('/api/site-content');
    expect(cmsRes.ok()).toBeTruthy();
    const cmsData = await cmsRes.json();
    expect(cmsData.siteSettings).toBeDefined();

    // 2. Log in as superadmin
    const loginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: process.env.ADMIN_PASSWORD || 'barmantra123'
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    const authHeaders = {
      Cookie: loginRes.headers()['set-cookie'],
      'X-CSRF-Token': loginData.csrfToken
    };

    // 3. Update dynamic CMS branding section
    const updateCmsRes = await request.put('/api/admin/site-content/siteSettings', {
      headers: authHeaders,
      data: {
        ...cmsData.siteSettings,
        heroHeadline: 'E2E Dynamic Royal Bar'
      }
    });
    expect(updateCmsRes.ok()).toBeTruthy();

    // 4. Register new admin user
    const newAdminEmail = `e2e.admin.${Date.now()}@barmantra.com`;
    const regRes = await request.post('/api/admin/register', {
      headers: authHeaders,
      data: {
        email: newAdminEmail,
        name: 'E2E Admin User',
        password: 'e2eSecurePassword123',
        role: 'staff'
      }
    });
    expect(regRes.status()).toBe(201);
    const regData = await regRes.json();
    expect(regData.success).toBe(true);

    // 5. Test login with newly registered admin user
    const newAdminLogin = await request.post('/api/admin/login', {
      data: {
        email: newAdminEmail,
        password: 'e2eSecurePassword123'
      }
    });
    expect(newAdminLogin.ok()).toBeTruthy();
    const newAdminData = await newAdminLogin.json();
    expect(newAdminData.user.email).toBe(newAdminEmail);
  });

  test('Scenario 5: Phase 1 Security Boundary (HTTP 401 logged-out, HTTP 403 missing CSRF, Security Headers)', async ({ request }) => {
    // 1. Unauthenticated request to /api/admin/bookings must return 401
    const unauthRes = await request.get('/api/admin/bookings');
    expect(unauthRes.status()).toBe(401);

    // 2. Log in to get session cookie
    const loginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: process.env.ADMIN_PASSWORD || 'barmantra123'
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const cookieOnlyHeader = { Cookie: loginRes.headers()['set-cookie'] };

    // 3. State-changing request WITH cookie BUT WITHOUT CSRF header must return 403 Forbidden
    const csrfFailRes = await request.put('/api/admin/site-content/siteSettings', {
      headers: cookieOnlyHeader,
      data: { siteTitle: 'Attempt without CSRF' }
    });
    expect(csrfFailRes.status()).toBe(403);
    const csrfFailData = await csrfFailRes.json();
    expect(csrfFailData.error).toContain('CSRF');

    // 4. Verify HTTP Security Headers
    const healthRes = await request.get('/api/health');
    const headers = healthRes.headers();
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['content-security-policy']).toBeDefined();
  });

  test('Scenario 6: Dynamic Pricing Rules Engine & User Deactivation Lifecycle', async ({ request }) => {
    // 1. Log in as superadmin
    const loginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: process.env.ADMIN_PASSWORD || 'barmantra123'
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    const authHeaders = {
      Cookie: loginRes.headers()['set-cookie'],
      'X-CSRF-Token': loginData.csrfToken
    };

    // 2. Fetch current pricing rules
    const pricingRes = await request.get('/api/pricing/rules');
    expect(pricingRes.ok()).toBeTruthy();
    const currentRules = await pricingRes.json();
    expect(currentRules.eventTypes).toBeDefined();

    // 3. Update pricing rules dynamically
    const updatedSetupFee = 30000;
    const updatePricingRes = await request.put('/api/admin/pricing/rules', {
      headers: authHeaders,
      data: {
        setupFee: updatedSetupFee,
        eventTypes: currentRules.eventTypes
      }
    });
    expect(updatePricingRes.ok()).toBeTruthy();

    // 4. Verify pricing rules updated
    const newPricingRes = await request.get('/api/pricing/rules');
    const newRulesData = await newPricingRes.json();
    expect(newRulesData.setupFee).toBe(30000);

    // 5. Test user deactivation on staff account
    const staffUserRes = await request.patch('/api/admin/users/usr-staff-1/deactivate', {
      headers: authHeaders,
      data: { isDeactivated: true }
    });
    expect(staffUserRes.ok()).toBeTruthy();

    // 6. Attempt login with deactivated staff account -> should fail
    const deactivatedLoginRes = await request.post('/api/admin/login', {
      data: {
        email: 'events@barmantra.com',
        password: 'staff123'
      }
    });
    expect(deactivatedLoginRes.status()).toBe(401);

    // 7. Reactivate staff account
    const reactivateRes = await request.patch('/api/admin/users/usr-staff-1/deactivate', {
      headers: authHeaders,
      data: { isDeactivated: false }
    });
    expect(reactivateRes.ok()).toBeTruthy();
  });

});

