# Deploy Merry Berry on Vercel (step-by-step)

## Before you deploy

1. **PostgreSQL database** (free): [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy the connection string (must start with `postgresql://` and include `?sslmode=require` for Neon).

## 1. Push code to GitHub

Repo should already be on GitHub. After each update:

```bash
git add .
git commit -m "Your message"
git push origin main
```

## 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo (`merryberrys` or your fork)
3. **Root directory:** leave empty (project root has `package.json`)
4. **Framework:** Next.js (auto-detected)
5. **Do not deploy yet** — add `DATABASE_URL` first (step 3).

## 3. Environment variables (required before deploy)

Vercel → your project → **Settings** → **Environment Variables**

**Add `DATABASE_URL` first** (Production + Preview). Without it the site builds but the shop/API will not work.

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXT_PUBLIC_CURRENCY_SYMBOL` | No | `Rs.` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | `merryberrytshirts@gmail.com` |
| `NEXT_PUBLIC_CONTACT_PHONE` | No | `+92 300 0000000` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | No | Your Instagram URL |
| `NEXT_PUBLIC_FACEBOOK_URL` | No | Your Facebook URL |
| `NEXT_PUBLIC_BANK_NAME` | No | Bank name for checkout |
| `NEXT_PUBLIC_BANK_ACCOUNT_TITLE` | No | Account title |
| `NEXT_PUBLIC_BANK_ACCOUNT_NUMBER` | No | Account number |
| `NEXT_PUBLIC_WALLET_TITLE` | No | JazzCash/Easypaisa title |
| `NEXT_PUBLIC_WALLET_NUMBER` | No | Wallet number |

Apply to **Production** (and Preview if you use a separate preview database).

## 4. Deploy

Click **Deploy**. Build runs `prisma generate` + `next build` (no database needed at build time).

## 5. Create tables + seed (one time, after deploy)

On your PC, use the **same** `DATABASE_URL` as Vercel:

```bash
# Copy .env.example to .env and paste your Neon/Supabase URL
npm run db:push
npm run db:seed
```

Or:

```bash
npx prisma db push
node prisma/seed.js
```

This adds **18 categories**, **180 products**, and admin user:

- **Admin:** `admin@merryberry.com` / `admin123`
- **Admin URL:** `https://your-site.vercel.app/admin/login`

## 6. Verify live site

- [ ] Home page loads with hero and collections
- [ ] `/shop` shows products
- [ ] Register / login — navbar shows your name
- [ ] `/admin/login` — admin dashboard works
- [ ] Add to cart → checkout (logged in)

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails `DATABASE_URL not found` | Pull latest code (build no longer needs DB). For runtime, still add `DATABASE_URL` in Vercel env vars |
| Build fails on Prisma | Ensure `DATABASE_URL` is PostgreSQL (`postgresql://...`) in Vercel for **runtime** |
| Shop empty | Run `node prisma/seed.js` against production `DATABASE_URL` |
| Images missing | Hard refresh; ensure seed ran (Unsplash URLs in DB) |
| Admin 401 | Use seeded admin email/password |

## Local development (same as production DB optional)

```bash
cp .env.example .env
# Edit DATABASE_URL to your Postgres URL
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```

Do **not** commit `.env` — only `.env.example` is in the repo.
