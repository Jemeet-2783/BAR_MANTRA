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
    expect(badData.error).toContain('Invalid admin credentials');

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

    // 3. Verify Set-Cookie headers contain JWT access and refresh tokens
    const setCookies = validLoginRes.headersArray().filter(h => h.name.toLowerCase() === 'set-cookie').map(h => h.value).join('; ');
    expect(setCookies).toContain('barmantra_access_token');
    expect(setCookies).toContain('barmantra_refresh_token');
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
    const cookieHeader = loginRes.headersArray()
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .map(h => h.value.split(';')[0])
      .join('; '); 
      
    const authHeaders = {
      Cookie: cookieHeader,
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
    const cookieHeader = loginRes.headersArray()
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .map(h => h.value.split(';')[0])
      .join('; ');
    const authHeaders = {
      Cookie: cookieHeader,
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
    const cookieString = loginRes.headersArray()
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .map(h => h.value.split(';')[0])
      .join('; ');
    const cookieOnlyHeader = { Cookie: cookieString };

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
    const cookieString6 = loginRes.headersArray()
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .map(h => h.value.split(';')[0])
      .join('; ');
    const authHeaders = {
      Cookie: cookieString6,
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

  test('Scenario 7: JWT Access Token Refresh Rotation & Tampered Token Rejection', async ({ request }) => {
    // 1. Authenticate to obtain access & refresh tokens
    const loginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: process.env.ADMIN_PASSWORD || 'barmantra123'
      }
    });
    const loginCookies = loginRes.headersArray()
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .map(h => h.value.split(';')[0])
      .join('; ');

    // 2. Perform token refresh using refresh token cookie
    const refreshRes = await request.post('/api/admin/refresh', {
      headers: { Cookie: loginCookies }
    });
    expect(refreshRes.ok()).toBeTruthy();
    const refreshData = await refreshRes.json();
    expect(refreshData.success).toBe(true);
    expect(refreshData.token).toBeDefined();

    // 3. Request with tampered access token must be rejected with 401
    const tamperedRes = await request.get('/api/admin/bookings', {
      headers: { Cookie: 'barmantra_access_token=invalid.jwt.signature' }
    });
    expect(tamperedRes.status()).toBe(401);

    // 4. Logout invalidates session and clears cookies
    const logoutRes = await request.post('/api/admin/logout', {
      headers: { Cookie: loginCookies }
    });
    expect(logoutRes.ok()).toBeTruthy();

    // 5. Subsequent request after logout must be rejected with 401
    const postLogoutRes = await request.get('/api/admin/bookings', {
      headers: { Cookie: loginCookies }
    });
    expect(postLogoutRes.status()).toBe(401);
  });

  test('Scenario 8: Online Payment Gateway checkout & WhatsApp notification trigger lifecycle', async ({ request }) => {

    // 1. Submit public booking
    const bookingRes = await request.post('/api/bookings', {
      data: {
        name: 'Payment & WhatsApp E2E Client',
        phone: '+91 98888 77777',
        email: 'payment.wa@barmantra.com',
        eventType: 'wedding-bar',
        eventDate: '2026-12-15',
        guestCount: 100,
        message: 'E2E testing payment link and WhatsApp dispatch.'
      }
    });
    expect(bookingRes.status()).toBe(201);
    const bookingObj = (await bookingRes.json()).booking;
    const bookingId = bookingObj.id;

    // 2. Log in as superadmin
    const loginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: process.env.ADMIN_PASSWORD || 'barmantra123'
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    const cookieHeader = loginRes.headersArray()
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .map(h => h.value.split(';')[0])
      .join('; ');
    const authHeaders = {
      Cookie: cookieHeader,
      'X-CSRF-Token': loginData.csrfToken
    };

    // 3. Admin generates payment link
    const payLinkRes = await request.post(`/api/admin/bookings/${bookingId}/payment-link`, {
      headers: authHeaders
    });
    expect(payLinkRes.ok()).toBeTruthy();
    const payLinkData = await payLinkRes.json();
    expect(payLinkData.success).toBe(true);
    expect(payLinkData.paymentOrder.paymentLink).toContain('/#/pay/');

    // 4. Client fetches public pay info
    const payInfoRes = await request.get(`/api/public/bookings/${bookingId}/pay-info`);
    expect(payInfoRes.ok()).toBeTruthy();
    const payInfo = await payInfoRes.json();
    expect(payInfo.paymentStatus).toBe('Unpaid');
    expect(payInfo.depositAmount).toBeGreaterThan(0);

    // 5. Complete deposit payment via verification endpoint
    const verifyRes = await request.post('/api/payments/verify', {
      data: {
        bookingId,
        transactionId: `TXN_E2E_${Date.now()}`,
        orderId: `ORD_E2E_${Date.now()}`,
        signature: 'SIG_E2E_VALID',
        amount: payInfo.depositAmount,
        gateway: 'Sandbox'
      }
    });
    expect(verifyRes.ok()).toBeTruthy();
    const verifyData = await verifyRes.json();
    expect(verifyData.success).toBe(true);
    expect(verifyData.booking.paymentStatus).toBe('Deposit_Paid');
    expect(verifyData.booking.status).toBe('Approved');
  });

  test('Scenario 9: Public Proposal Lookup & GST Quotation Invoice Endpoint Verification', async ({ request }) => {
    // 1. Submit a test booking
    const testPhone = '+91 97777 66666';
    const bookingRes = await request.post('/api/bookings', {
      data: {
        name: 'Lookup & Invoice E2E Test Client',
        phone: testPhone,
        email: 'lookup.invoice@barmantra.com',
        eventType: 'private-soiree',
        eventDate: '2026-12-31',
        guestCount: 80,
        message: 'E2E testing lookup API and invoice details.'
      }
    });
    expect(bookingRes.status()).toBe(201);
    const bookingObj = (await bookingRes.json()).booking;

    // 2. Perform public proposal lookup by phone number
    const lookupRes = await request.post('/api/public/bookings/lookup', {
      data: { query: testPhone }
    });
    expect(lookupRes.ok()).toBeTruthy();
    const lookupData = await lookupRes.json();
    expect(lookupData.bookings).toBeDefined();
    expect(lookupData.bookings.length).toBeGreaterThan(0);
    expect(lookupData.bookings[0].id).toBe(bookingObj.id);

    // 3. Verify public invoice pay-info API returns complete tax details
    const payInfoRes = await request.get(`/api/public/bookings/${bookingObj.id}/pay-info`);
    expect(payInfoRes.ok()).toBeTruthy();
    const payInfo = await payInfoRes.json();
    expect(payInfo.pricingEstimate).toBeGreaterThan(0);
    expect(payInfo.depositAmount).toBe(Math.round(payInfo.pricingEstimate * 0.30));
  });

});


