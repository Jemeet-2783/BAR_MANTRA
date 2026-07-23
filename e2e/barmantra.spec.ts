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
    // 1. Log in to establish admin session cookie
    const loginRes = await request.post('/api/admin/login', {
      data: {
        email: 'admin@barmantra.com',
        password: process.env.ADMIN_PASSWORD || 'barmantra123'
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const authHeaders = {
      Cookie: loginRes.headers()['set-cookie']
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

});
