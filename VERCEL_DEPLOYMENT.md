# Vercel deployment — GoCart / Merry Berry

This document summarizes how the repo is organized for Vercel, what was fixed for production, and how to deploy.

## Project layout (Vercel-relevant)

| Area | Path | Role |
|------|------|------|
| **Frontend** | `app/**/*.jsx`, `components/**` | Next.js App Router UI (public storefront, admin, store seller UI). |
| **Backend** | `app/api/**/route.js` | Serverless API routes (Prisma + PostgreSQL). |
| **Database** | `prisma/schema.prisma`, `prisma/seed.js` | Schema and seed script; client generated on `npm install` via `postinstall`. |
| **Shared** | `lib/**` | Utilities, Redux store, **`lib/prisma.js`** singleton for DB access. |

**Not deployed / ignored on Vercel:** `gravity-ecommerce/` (legacy Express + Mongo demo) and `merry-berry/` (separate Vite app) are listed in `.vercelignore` so they are not uploaded. They are not wired to this Next.js app.

## Issues found and fixes

1. **Missing API route for admin order updates**  
   **Symptom:** `/admin/orders` called `PUT /api/admin/orders/:id`, but only `app/api/admin/orders/route.js` existed, so status updates and the “view” flow could not work.  
   **Fix:** Added `app/api/admin/orders/[id]/route.js` with `GET` (single order) and `PUT` (status update, validated against allowed statuses).

2. **Broken admin order detail link**  
   **Symptom:** Links pointed to `/admin/orders/[id]` with no page.  
   **Fix:** Added `app/admin/orders/[id]/page.jsx` that loads the order via the new API.

3. **Checkout success redirect**   
   **Symptom:** After checkout, `router.push('/order-confirmation')` targeted a route that does not exist (confirmation lives at `/confirmation`).  
   **Fix:** Redirect updated to `/confirmation`.

4. **PrismaClient instantiation per route**  
   **Symptom:** Each API file did `new PrismaClient()`, which is a common source of connection exhaustion and flaky behavior under Vercel’s serverless model.  
   **Fix:** Centralized client in `lib/prisma.js` (reused via `globalThis`) and updated all `app/api/**` routes to import `prisma` from `@/lib/prisma`.

5. **Environment files**  
   **Symptom:** `.env.local` was not documented and could be committed by mistake.  
   **Fix:** `.gitignore` updated to ignore `.env.local` and `.env.*.local`. `.env.example` documents required variables. A template `.env.local` is present locally for copy-paste workflows (do not commit secrets).

6. **Vercel configuration and upload size**  
   **Fix:** Added root `vercel.json` with `"framework": "nextjs"`. Added `.vercelignore` to exclude legacy folders from the deployment bundle.

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (and in `.env` or `.env.local` locally):

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (`sslmode=require` for hosted DBs). |
| `NEXT_PUBLIC_CURRENCY_SYMBOL` | No | Defaults to `Rs.` in code; set to `Rs.` for Pakistani Rupees. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Public support email displayed on the footer/contact page. |
| `NEXT_PUBLIC_CONTACT_PHONE` | No | Public Pakistan phone/WhatsApp number displayed on the footer/contact page. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | No | Public Instagram URL. |
| `NEXT_PUBLIC_FACEBOOK_URL` | No | Public Facebook URL. |
| `NEXT_PUBLIC_BANK_NAME` | No | Bank name shown during bank transfer checkout. |
| `NEXT_PUBLIC_BANK_ACCOUNT_TITLE` | No | Bank account title shown during bank transfer checkout. |
| `NEXT_PUBLIC_BANK_ACCOUNT_NUMBER` | No | Bank account number shown during bank transfer checkout. |
| `NEXT_PUBLIC_WALLET_TITLE` | No | JazzCash/Easypaisa wallet title shown during digital payment checkout. |
| `NEXT_PUBLIC_WALLET_NUMBER` | No | JazzCash/Easypaisa wallet number shown during digital payment checkout. |

After setting `DATABASE_URL`, run migrations or push schema against that database:

```bash
npx prisma db push
node prisma/seed.js
```

(Use your CI or a one-off machine with network access to the DB; Vercel does not run seeds automatically unless you add a step.)

## Deploy steps

1. Push this repository to GitHub (or GitLab / Bitbucket).
2. In [Vercel](https://vercel.com), **Add New Project** → import the repo.
3. **Root directory:** leave as repository root (where `package.json` and `next.config.mjs` live).
4. **Build command:** default `npm run build` (postinstall runs `prisma generate`).
5. **Install command:** default `npm install`.
6. Add **`DATABASE_URL`** (and optional **`NEXT_PUBLIC_CURRENCY_SYMBOL`**) for Production (and Preview if you use a preview DB).
7. Deploy.

## Verify locally

```bash
npm install
npm run build
npm start
```

Ensure `DATABASE_URL` is set so API routes that hit the database succeed at runtime.

## Optional: legacy folders

- **`gravity-ecommerce/`** — separate Node/Express + Mongo stack; different env vars (`MONGO_URI`, `JWT_SECRET`, etc.). Not used by the Next.js app.
- **`merry-berry/`** — standalone Vite frontend + backend packages. Deploy separately if needed.
