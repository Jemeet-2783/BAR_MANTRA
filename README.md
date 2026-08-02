# 🍸 Barmantra — Luxury Mobile Bar & Mixology Platform

Barmantra is a boutique, high-end bartending and luxury mixology platform based in Jaipur, Rajasthan. It weaves traditional Rajasthani royal heritage, modern artisanal mixology, and immaculate bar showmanship into high-end celebrations, destination weddings, and corporate galas.

---

## 🌟 Key Capabilities & Architecture

- **Public Client Showcase**: Interactive landing page, multi-tier service catalog, 16+ portfolio case studies gallery, and instant pricing estimator.
- **Custom AI Royal Mixologist**: Integrated Google Gemini API for formulation of custom Rajasthani luxury cocktail recipes.
- **Quote Lock Verification**: Server-side locked pricing calculator preventing front-end quote tampering.
- **Online Payment Gateway**: Integrated Razorpay & Stripe deposit retainer collection (`30%`) with interactive sandbox checkout portal (`#/pay/:id`).
- **Automated WhatsApp Business Notifications**: Automated delivery of booking confirmations, quote approval alerts, and deposit payment receipts.
- **Royal Command Studio (`#/admin`)**: Admin management panel with OWASP 600,000-iteration PBKDF2 authentication, RBAC access control, proposal management, soft-delete trash archive, live content CMS, dynamic pricing rules manager, and immutable audit logs.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🧪 Automated Testing (Playwright E2E)

Run the full end-to-end test suite covering booking submission, server price locking, OWASP authentication, soft-delete archive, payment checkout, and WhatsApp notifications:

```bash
npm run test:e2e
```
