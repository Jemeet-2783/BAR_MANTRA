# Barmantra — Architecture, Data Flow, Status & Next Steps Roadmap

This document provides a complete technical breakdown of **Barmantra**, including the website architecture, application data flow, work completed to date, and recommended next steps for future expansion.

---

## 1. Website Architecture & Directory Structure

```
barmantra/
├── public/                     # Static public assets & SEO files
│   ├── robots.txt              # Search engine crawler instructions
│   └── sitemap.xml             # XML Sitemap indexing all public routes
├── src/                        # React TypeScript Single-Page Application (SPA)
│   ├── components/             # Reusable UI Section Components
│   │   ├── views/              # Route View Components (Lazy Loaded)
│   │   │   ├── HomeView.tsx    # Landing page view
│   │   │   ├── AboutView.tsx   # Heritage & brand philosophy view
│   │   │   ├── ServicesView.tsx# Services, packages & AI mixologist view
│   │   │   ├── ServicesDetailView.tsx # Service detail view
│   │   │   ├── GalleryView.tsx # 16+ Portfolio case studies view
│   │   │   ├── ContactView.tsx # Public enquiry & booking view
│   │   │   └── AdminView.tsx   # Royal Command Studio admin panel
│   │   ├── About.tsx           # Brand story section
│   │   ├── BarmantraLogo.tsx   # Vector branding logo
│   │   ├── ContactForm.tsx     # Public enquiry form with rate-limiting & price lock
│   │   ├── DynamicIcon.tsx     # Dynamic Lucide icon renderer
│   │   ├── FAQAccordion.tsx    # Frequently asked questions accordion
│   │   ├── Footer.tsx          # Global footer & floating WhatsApp callout
│   │   ├── Hero.tsx            # Hero banner with dynamic background slides
│   │   ├── Navbar.tsx          # Sticky responsive header navigation
│   │   ├── NewsletterCTA.tsx   # Lead capture callout
│   │   ├── PortfolioGallery.tsx# Portfolio teaser section
│   │   ├── Process.tsx         # 4-step curation workflow section
│   │   ├── SEO.tsx             # Route meta-tag manager (react-helmet-async)
│   │   ├── ServicesGrid.tsx    # Service offerings summary grid
│   │   ├── SignatureEvents.tsx # Event categories section
│   │   ├── TeamSection.tsx     # Executive leadership team grid & bios
│   │   ├── TestimonialsCarousel.tsx # Review carousel (keyboard focus-pause & controls)
│   │   └── WhyBarmantra.tsx    # Brand advantages & trust markers
│   ├── server/                 # Server-side Database & Business Logic
│   │   └── db.ts               # PBKDF2 hashing, sessions, locked pricing, soft delete, audit log
│   ├── utils/                  # Utility Functions
│   │   ├── cloudinary.ts       # Responsive Cloudinary & Unsplash image transformer
│   │   └── monitoring.ts       # Structured error capture & telemetry reporter
│   ├── App.tsx                 # Root application component & lazy route orchestrator
│   ├── data.ts                 # Master mock data & service catalogs
│   ├── index.css               # Design system tokens (Tailwind v4, Royal palette, fonts)
│   ├── main.tsx                # Client entry point with HelmetProvider
│   ├── types.ts                # TypeScript interface definitions
│   └── useHashRoute.ts         # Client hash-based navigation hook
├── e2e/                        # End-to-End Test Suite
│   └── barmantra.spec.ts       # Playwright E2E tests (Booking, Auth, Soft Delete, Pricing)
├── db.json                     # Persistent database ledger (Atomic JSON storage)
├── server.ts                   # Full-Stack Express API server & static file host
├── vite.config.ts              # Vite 6 bundler configuration
├── playwright.config.ts        # Playwright test runner configuration
└── package.json                # Project manifest, scripts & dependencies
```

---

## 2. Application Flow & User Journeys

### A. Public Client Flow
1. **Navigation & Initial Load**:
   - The user opens `https://barmantra.com/` (`#/`).
   - `App.tsx` reads the URL hash via `useHashRoute.ts` and lazily imports `HomeView`.
   - Off-screen portfolio/gallery images load lazily (`loading="lazy"`) with dynamic responsive width/quality transforms (`getResponsiveImageUrl()`).

2. **Exploration & Custom AI Cocktail Generation**:
   - User browses `# /services`, `#/gallery`, and `#/about`.
   - On the Services page, users can test the **AI Custom Cocktail Generator** (`POST /api/ai/suggest-cocktail`).
   - If a Gemini API key is configured, Google Gemini formulates a Rajasthani royal cocktail; otherwise, a luxury fallback mixology recipe is returned.

3. **Booking & Quote Lock Request**:
   - User fills out the enquiry form in `ContactForm.tsx`.
   - Request is submitted to `POST /api/bookings` (Rate limited: max 10 requests per 15 min per IP).
   - The backend `db.ts` independently re-calculates the luxury pricing quote using `calculatePricingEstimate(eventType, guestCount)` and locks the price in `db.json`.
   - Audit log entry (`STATUS_UPDATE` / `addBooking`) is recorded in the ledger.
   - If any API failure occurs, `reportErrorAlert()` captures actionable error telemetry.

### B. Admin Command Studio Flow
1. **Access Control**:
   - Admin accesses `#/admin` (Hidden from search engines via `noindex` meta tags and `robots.txt`).
   - Admin submits credentials to `POST /api/admin/login` (Rate limited: max 5 login attempts per 15 min per IP).

2. **OWASP PBKDF2 Password Verification & Auto-Migration**:
   - `validateUserCredentials()` verifies the password against stored PBKDF2 parameters.
   - If the account uses legacy 10,000-iteration hashing, credentials are validated and the user hash is **automatically re-hashed to OWASP-recommended 600,000 iterations (PBKDF2-SHA256)** without interrupting the user.
   - Session cookie (`barmantra_session`) is issued.

3. **Ledger Management & Soft Delete Lifecycle**:
   - Admin views active proposals (`GET /api/admin/bookings`), contacts (`GET /api/admin/contacts`), and analytics stats (`GET /api/admin/stats`).
   - Status transitions (`Pending` -> `Approved` / `Contacted` / `Cancelled`) update records and log audit events.
   - Soft Delete (`DELETE /api/admin/bookings/:id`) sets `deletedAt` and `deletedBy` timestamps instead of permanently removing data.
   - Trash Archive (`GET /api/admin/trash`) allows Superadmins/Staff to review deleted records and restore them (`POST /api/admin/bookings/:id/restore`).
   - All administrative actions are recorded in the real-time Audit Log Ledger (`GET /api/admin/audit-logs`).

---

## 3. Work Completed (100% Production Ready)

| Category | Feature Implemented | Verification / Result |
| :--- | :--- | :--- |
| **Authentication** | Individual PBKDF2 Admin Accounts (Superadmin / Staff roles) | OWASP 600,000 iterations PBKDF2-SHA256 with auto-migration on login |
| **Rate Limiting** | IP-based rate limiting on public forms & admin login | 10 reqs/15m on forms, 5 reqs/15m on admin auth |
| **Data Security** | Soft-Delete with Trash Archive & One-Click Restore | Soft delete preserves client data with full audit trail |
| **Price Locking** | Server-side locked pricing verification engine | Prevents client-side price tampering on booking proposals |
| **Audit Ledger** | Real-time immutable audit log system | Logs logins, status changes, soft-deletes, and restorations |
| **Performance** | Dynamic Cloudinary transforms & route code-splitting | Initial bundle reduced by **82.9%** (1,318 kB -> 225 kB) |
| **SEO** | `react-helmet-async` meta manager, `sitemap.xml`, `robots.txt` | Route-specific titles, Open Graph cards, crawler instructions |
| **Accessibility** | Focus-within carousel pause, Play/Pause toggle, contrast fixes | WCAG 2.1 AA compliant across Crimson/Gold/Charcoal palette |
| **Monitoring** | Structured error capture & enriched `/api/health` | Uptime, database status, memory RSS/heap metrics |
| **Automated Testing** | Playwright E2E test suite (`npm run test:e2e`) | All 3 test scenarios passing cleanly (Booking, Auth, Soft Delete) |

---

## 4. What Should You Update and Add Next (Future Roadmap)

While the core web application is 100% production-ready and fully tested, here are the top recommended features to update and add next:

### 1. Payment Gateway & Deposit Invoice Integration (High Priority)
- **What to add**: Integrate **Razorpay** or **Stripe India** API.
- **Workflow**: Allow admins to generate a digital deposit invoice directly from the Admin Panel upon proposal approval (`Approved` status). Send a payment link to the client for automated retainer collection.

### 2. Automated SMS & WhatsApp Client Notifications
- **What to add**: Integrate **Twilio** or **Interakt WhatsApp Business API**.
- **Workflow**: Send instant automated WhatsApp confirmation messages to clients upon submitting a booking inquiry, and notify them when their event quote status is updated by the Barmantra concierge team.

### 3. Real-Time Venue Availability & Calendar Sync
- **What to add**: Integrate **Google Calendar API** or **iCal export feed**.
- **Workflow**: Prevent double-booking across Rajasthan palace venues by auto-checking team date availability during public form submission.

### 4. Cloud Managed Database Migration (For High Transaction Scaling)
- **What to add**: Migrate `db.ts` file persistence to **MongoDB Atlas** or **Supabase PostgreSQL**.
- **Workflow**: Replace local `db.json` file writes with an ORM/Driver (e.g. Mongoose or Prisma) when booking volume exceeds thousands of concurrent requests.

### 5. Server-Side Rendering (SSR / SSG) for Advanced Crawler Pre-rendering
- **What to add**: Upgrade Vite SPA setup to **Vite SSG** or **Next.js App Router**.
- **Workflow**: Pre-render static HTML for public pages at build time so search engine crawlers without JavaScript execution can index page text seamlessly.
