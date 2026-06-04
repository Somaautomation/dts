# Deployment Guide — D.T. Srinivas Connect

Everything below is achievable on **free tiers** for a personal / non-commercial political platform.

---

## 1. Database — Neon Postgres (Free)

1. Create an account at https://neon.tech
2. Create a project: `dtsc-prod` (region: **Mumbai / Asia**)
3. Copy the **pooled** connection string → set as `DATABASE_URL`
4. Copy the **direct** connection string → set as `DIRECT_URL`
5. Run migrations: `npx prisma migrate deploy`
6. (Optional) Seed: `npm run db:seed`

**Free tier:** 0.5 GB storage, autosuspend after idle, 1 project, multiple branches.

---

## 2. SMS / OTP — MSG91 (Free trial) or Twilio

1. Sign up at https://msg91.com and request DLT template approval (mandatory in India).
2. Create an OTP template like: `Your D.T. Srinivas Connect verification code is ##OTP##. Valid for 5 minutes.`
3. Set:
   - `MSG91_AUTH_KEY`
   - `MSG91_TEMPLATE_ID`
   - `MSG91_SENDER_ID` (6-char, e.g. `DTSCNT`)
4. Leave `OTP_BYPASS_CODE` **unset** in production.

> For development you can leave MSG91 unset — OTPs are then logged to the server console.

---

## 3. Redis — Upstash (Free)

1. Create a database at https://upstash.com (region: Mumbai).
2. Copy REST URL + token → `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
3. Used for rate limiting + OTP attempt counters.

> Without Upstash, an in-memory fallback is used (fine for single-instance dev only).

---

## 4. AI Chatbot — Groq (Free) or OpenAI

**Groq** is recommended — it's free and OpenAI-API compatible.

1. Sign up at https://console.groq.com and create an API key.
2. Set:
   - `OPENAI_API_KEY=gsk_...`
   - `OPENAI_BASE_URL=https://api.groq.com/openai/v1`
   - `OPENAI_MODEL=llama-3.3-70b-versatile`

If no key is set, the chatbot returns a friendly fallback message — the app still works.

---

## 5. Email — Resend (Free)

1. Sign up at https://resend.com
2. Verify domain `dtsrinivas.com`
3. Set `RESEND_API_KEY` and `EMAIL_FROM`

---

## 6. Vercel deploy

1. Push the repo to GitHub.
2. Visit https://vercel.com/new and import the repo.
3. Framework auto-detected as **Next.js**. Region: **Mumbai (bom1)** (already set in `vercel.json`).
4. Add all environment variables from `.env.example` (production values).
5. Click **Deploy**.

### One-time DB migration

After first deploy, in **Project → Settings → Cron Jobs**, you don't need anything — `vercel.json` already runs `prisma migrate deploy` as part of `buildCommand`. For schema changes:

```bash
npm run db:migrate   # locally creates migration
git push             # CI/Vercel applies it
```

### Domain

1. **Project → Domains** → add `dtsrinivas.com` and `www.dtsrinivas.com` (set `www.dtsrinivas.com` as primary).
2. Update DNS at registrar (A → `76.76.21.21`, CNAME `www → cname.vercel-dns.com`).
3. SSL is automatic.

---

## 7. GitHub Actions

The CI workflow (`.github/workflows/ci.yml`) automatically:
- Provisions a temporary Postgres
- Runs lint, typecheck, build
- Runs Playwright E2E tests

The deploy workflow (`.github/workflows/deploy.yml`) requires these **GitHub Secrets**:
- `VERCEL_TOKEN` — from https://vercel.com/account/tokens
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` — from `.vercel/project.json` after first `vercel link`

> Alternatively, rely on Vercel's GitHub integration (automatic deploys on push) and disable the deploy workflow.

---

## 8. Post-deploy checklist

- [ ] Visit `https://your-domain/en` — homepage loads with hero + stats
- [ ] Toggle language → `/kn` renders Kannada
- [ ] Install PWA on mobile (Add to Home Screen)
- [ ] Sign up a member with a real phone number (OTP arrives)
- [ ] Generate & download membership PDF
- [ ] Submit a public grievance, confirm ticket ID returned
- [ ] Login as admin → `/en/admin` shows KPIs + charts
- [ ] Lighthouse: PWA ≥ 90, Performance ≥ 90, A11y ≥ 95
- [ ] Set Vercel Analytics + Speed Insights (free) → Project Settings → Analytics

---

## 9. Cost summary (free tier scope)

| Service | Free quota | Sufficient for |
|---|---|---|
| Vercel Hobby | 100 GB bandwidth / mo | ~50k page views |
| Neon Postgres | 0.5 GB | ~500k members |
| Upstash Redis | 10k cmds/day | ~2k OTPs/day |
| MSG91 | trial credits | initial rollout |
| Groq | generous free chat | thousands of chats/day |
| Resend | 3k emails/mo | early operations |

For scale beyond, upgrade Neon ($19/mo) and MSG91 (pay-per-SMS).

---

## 10. Operations

- **Backups:** Neon has point-in-time recovery on free tier (7 days).
- **Logs:** Vercel → Functions tab → live logs.
- **Errors:** Add Sentry (free 5k events/mo) — wire via `@sentry/nextjs`.
- **Status page:** Use BetterStack free tier.

---

## 11. Hardening before launch

- [ ] Rotate `NEXTAUTH_SECRET` and `ADMIN_PASSWORD`
- [ ] Disable `OTP_BYPASS_CODE` (remove from prod env)
- [ ] Confirm DLT template + sender ID for MSG91
- [ ] Add real photos + final copy
- [ ] Configure rate limits in `src/lib/rate-limit.ts` to match expected traffic
- [ ] Enable Vercel WAF / Bot Detection (Pro plan if budget allows)
- [ ] Pen-test the grievance + chatbot endpoints

You're ready to launch.
