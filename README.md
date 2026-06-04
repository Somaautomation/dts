# D.T. Srinivas Connect

Official political leadership, citizen engagement and membership platform for **MLC D.T. Srinivas** — Member of the Legislative Council, South East Teachers Constituency, Karnataka.

> **Tagline:** Education • Empowerment • Equality • Service
> **Vision:** Voice of Teachers, Strength of Communities, Vision for Karnataka

Built as a **Vercel-first, free-tier-deployable**, bilingual (English / ಕನ್ನಡ) Progressive Web App on Next.js 14 (App Router).

---

## ✨ Features

| Domain | Capabilities |
|---|---|
| **Public site** | Home, About, Achievements, Timeline, News & Media, Events, Contact |
| **Membership** | OTP-based signup (6 types), digital QR membership card (PDF download), member dashboard |
| **Teacher Portal** | Profile registration, grievance / transfer / promotion / pension / policy requests, ticket tracking |
| **Public Grievances** | 10-category submission, real-time status, district/taluk routing |
| **Volunteer Mgmt** | Skills, availability, tasks, badges, recognition |
| **Events** | Listings, registration, QR check-in, volunteer assignment |
| **AI Chatbot** | Bilingual assistant (OpenAI / Groq compatible) |
| **Admin** | Analytics dashboard, KPIs, charts, role-based access |
| **PWA** | Installable, offline-ready, push-notification capable |
| **i18n** | English + Kannada, full UI + content |

---

## 🧱 Stack

- **Framework:** Next.js 14 (App Router, TypeScript, Server Components)
- **DB:** PostgreSQL via [Neon](https://neon.tech) (free tier) + Prisma ORM
- **Auth:** NextAuth (Phone+OTP, Admin Credentials) + Prisma Adapter
- **i18n:** next-intl
- **UI:** Tailwind CSS + Radix UI + shadcn-style primitives, Lucide icons, Framer Motion
- **Charts:** Recharts
- **AI:** OpenAI SDK (works with Groq free tier via `OPENAI_BASE_URL`)
- **OTP / SMS:** MSG91 (free trial) — pluggable to Twilio
- **Rate limiting / cache:** Upstash Redis (free tier) with in-memory fallback
- **PWA:** next-pwa
- **Testing:** Playwright (Chromium + mobile)
- **CI/CD:** GitHub Actions + Vercel
- **Hosting:** Vercel (Hobby tier free for personal/non-profit use)

---

## 🚀 Quick start (local) — step by step

> Verified Windows 11 + PowerShell + Node.js 20+. The same commands work on macOS / Linux (replace `Copy-Item` with `cp`).

### Step 1 — Install dependencies
```powershell
npm install
```
Installs ~960 packages and auto-runs `prisma generate`. Expect ~3 minutes on first run.

> If you hit an `ERESOLVE` peer-dep error on ESLint, ensure `package.json` has `"eslint": "^8.57.1"` (not v9) — `eslint-config-next@14` is incompatible with ESLint 9.

### Step 2 — Create your `.env`
```powershell
Copy-Item .env.example .env
```

### Step 3 — Provision a Neon Postgres database (free)
1. Sign up at https://neon.tech (no card required).
2. **Create Project** → name `dts-connect`, Postgres 16, region **AWS ap-south-1 (Mumbai)** or the closest to your users.
3. Open **Connection Details**, copy the **pooled** connection string (host contains `-pooler`).
4. The **direct** string is the same URL with `-pooler` removed from the host.

### Step 4 — Generate `NEXTAUTH_SECRET`
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copy the printed value.

### Step 5 — Fill `.env`
Open `.env` and set at minimum:
```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxx.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_SECRET="<paste output of step 4>"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@dtsrinivas.com"
ADMIN_PASSWORD="ChangeMe!Strong#2026"
OTP_BYPASS_CODE="123456"
```
All other vars (MSG91, Upstash, OpenAI/Groq, Resend, Blob) are **optional** for local dev — the app falls back gracefully.

### Step 6 — Sync the schema to Neon
```powershell
npm run db:push
```
Expected output: *“Your database is now in sync with your Prisma schema.”*

### Step 7 — Seed initial data
```powershell
npm run db:seed
```
Creates super-admin user, 7 timeline events, achievements, news, and a sample event.

### Step 8 — Add the leader's photo
Place a portrait JPG at:
```
public/dt-srinivas.jpg
```
Square 1:1 (~800×800px) renders best in the hero frame.

### Step 9 — Run the dev server
```powershell
npm run dev
```
Open **http://localhost:3000/en** (or `/kn` for Kannada). If port 3000 is busy, Next.js automatically falls back to 3001.

### Step 10 — Log in
- **Admin:** http://localhost:3000/en/auth/admin → `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
- **Phone OTP (dev):** http://localhost:3000/en/auth/login → any phone starting with 6-9, then enter `OTP_BYPASS_CODE` (default `123456`)

### Step 11 — Verify everything works
- Home page shows hero with photo and live stats from DB
- `/en/achievements`, `/en/news`, `/en/events` show seeded content
- Floating chat widget opens (will show a fallback message until `OPENAI_API_KEY` is set)
- Admin dashboard at `/en/admin` shows KPIs

### Step 12 — Run tests (optional)
```powershell
npx playwright install chromium
npm test
```

---

## 🛠 Common commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm start` | Start production server |
| `npm run db:push` | Sync Prisma schema to DB (no migration file) |
| `npm run db:migrate` | Create + apply a named migration |
| `npm run db:seed` | Re-seed reference data |
| `npm run lint` | ESLint |
| `npm test` | Playwright E2E |
| `npx prisma studio` | Open DB GUI at http://localhost:5555 |

**Dev OTP bypass:** set `OTP_BYPASS_CODE=123456` and use that code at OTP screens (only when `NODE_ENV !== 'production'`).

---

## 🗂 Folder structure

```
.
├── prisma/
│   ├── schema.prisma          # 20+ models: users, membership, teachers, grievances, events, news, chat, audit
│   └── seed.ts
├── messages/
│   ├── en.json                # English UI strings
│   └── kn.json                # Kannada UI strings
├── public/
│   ├── manifest.json
│   ├── robots.txt
│   └── icons/                 # PWA icons (add 192/512 px PNGs)
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── achievements/page.tsx
│   │   │   ├── membership/{join,card}/
│   │   │   ├── teachers/page.tsx
│   │   │   ├── grievances/{page,new}/
│   │   │   ├── events/page.tsx
│   │   │   ├── news/page.tsx
│   │   │   ├── volunteer/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── auth/login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   └── admin/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── auth/otp/send/route.ts
│   │   │   ├── membership/{register,me}/route.ts
│   │   │   ├── grievances/route.ts
│   │   │   ├── teachers/requests/route.ts
│   │   │   ├── volunteers/route.ts
│   │   │   ├── events/register/route.ts
│   │   │   └── chat/route.ts
│   │   ├── sitemap.ts
│   │   └── page.tsx           # → redirects /en
│   ├── components/
│   │   ├── ui/                # Button, Card, Input, Badge
│   │   ├── layout/            # Header, Footer
│   │   ├── providers/         # AuthProvider
│   │   ├── chatbot/           # Floating chat widget
│   │   └── admin/             # Analytics charts
│   ├── lib/                   # prisma, auth, otp, validators, utils, karnataka, rate-limit
│   ├── i18n/request.ts        # next-intl config
│   └── types/                 # NextAuth augmentation
├── e2e/                       # Playwright tests
├── .github/workflows/         # CI + Vercel deploy
├── middleware.ts              # Locale routing
├── next.config.js             # PWA + i18n composition
├── tailwind.config.js         # Brand palette
├── playwright.config.ts
├── tsconfig.json
└── vercel.json                # Security headers + build hook
```

---

## 🌐 API reference (summary)

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/otp/send` | Request OTP (rate limited 3/min) |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handler |
| POST | `/api/membership/register` | OTP-verified signup, returns member ID + QR |
| GET | `/api/membership/me` | Current user's membership |
| POST/GET | `/api/grievances` | Submit / list (own or all if admin) |
| POST | `/api/teachers/requests` | File teacher constituency request |
| POST | `/api/volunteers` | Create/update volunteer profile |
| POST | `/api/events/register` | Register for event (returns QR) |
| POST | `/api/chat` | AI chat (bilingual, falls back gracefully without API key) |

All mutating endpoints are protected by NextAuth + Zod validation + rate limiting.

---

## 🔐 Security

- Phone+OTP authentication (no passwords for citizens)
- Admin separate role gate (`ADMIN`, `SUPER_ADMIN`, `MODERATOR`, `OFFICE_STAFF`)
- Bcrypt password hashes (admin only)
- OTP stored hashed, single-use, 5-min TTL, max 5 attempts
- Rate limiting on OTP + APIs (Upstash Redis or in-memory fallback)
- Security headers via `vercel.json` (HSTS, X-Frame-Options, CSP-style)
- Audit log for sensitive actions

---

## ☁️ Deploying (free tier)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions covering:
- Neon Postgres setup
- Vercel project + env vars
- MSG91 / Groq / Upstash configuration
- Domain + DNS
- Post-deploy verification
- Cron / observability tips

---

## 🧪 Testing

```bash
npm run test          # Playwright (uses local dev server)
npm run test:ui       # Interactive runner
```

CI runs the full suite against a Postgres service container on every PR.

---

## 🛣 Roadmap

- WhatsApp Cloud API channel (replace SMS)
- Push notifications via Web Push
- Booth-level analytics heatmaps
- Speech-to-text for Kannada grievances
- Aadhaar e-Sign integration for verified members
- Open-data API for press / researchers

---

## 📄 License

© Office of D.T. Srinivas. All rights reserved.
