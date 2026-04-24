# Production Deployment Cursor: GitHub + Vercel

Ye guide GoCart / Merry Berry Next.js project ko GitHub par push karne aur Vercel par deploy karne ke liye step-by-step checklist hai. Isko release se pehle follow karo taake build, env, database, aur routing errors deploy ke baad surprise na dein.

## 1. Pre-Deployment Checklist

1. **Correct project root confirm karo**

   Commands hamesha repo root se run karo, jahan `package.json`, `next.config.mjs`, `vercel.json`, aur `prisma/schema.prisma` present hain.

   ```powershell
   pwd
   dir package.json, next.config.mjs, vercel.json, prisma\schema.prisma
   ```

2. **Node version verify karo**

   Project `package.json` ke mutabiq Node `>=20.9.0` chahiye.

   ```powershell
   node -v
   npm -v
   ```

   Agar Node old hai, Node 20+ install karo, phir terminal restart karo.

3. **Dependencies clean install karo**

   ```powershell
   npm install
   ```

   `postinstall` automatically `prisma generate` run karta hai. Agar Prisma client issue aaye:

   ```powershell
   npx prisma generate
   ```

4. **Environment variables local machine par set karo**

   `.env.local` ya `.env` mein ye values honi chahiye:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
   NEXT_PUBLIC_CURRENCY_SYMBOL="$"
   ```

   Important: `.env.local`, `.env`, aur real secrets GitHub par commit mat karo. Sirf `.env.example` commit hona chahiye.

5. **Database schema verify karo**

   Production/hosted database ke saath deploy karna hai to pehle schema push karo:

   ```powershell
   npx prisma db push
   ```

   Demo data chahiye ho to seed run karo:

   ```powershell
   node prisma/seed.js
   ```

6. **Local production build must pass**

   ```powershell
   npm run build
   ```

   Build fail ho to GitHub push ya Vercel deploy mat karo. Pehle error fix karo.

7. **Sensitive files check karo**

   ```powershell
   git status --short
   git check-ignore -v .env.local
   ```

   `.env.local` ignored hona chahiye. Agar ignored nahi hai, `.gitignore` mein add karo:

   ```gitignore
   .env.local
   .env.*.local
   ```

8. **Vercel deploy files verify karo**

   Required files:

   ```text
   vercel.json
   .vercelignore
   next.config.mjs
   package.json
   prisma/schema.prisma
   lib/prisma.js
   ```

   `vercel.json` should be:

   ```json
   {
     "$schema": "https://openapi.vercel.sh/vercel.json",
     "framework": "nextjs"
   }
   ```

## 2. GitHub Push Process

1. **Latest branch status dekho**

   ```powershell
   git status
   git branch --show-current
   ```

2. **Remote configured hai ya nahi check karo**

   ```powershell
   git remote -v
   ```

   Agar remote missing hai:

   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```

3. **Unwanted files stage hone se pehle inspect karo**

   ```powershell
   git status --short
   git diff
   ```

   Commit mein ye files nahi honi chahiye:

   ```text
   .env
   .env.local
   .next/
   node_modules/
   *.pem
   ```

4. **Relevant files stage karo**

   Safe option:

   ```powershell
   git add app components lib prisma package.json package-lock.json next.config.mjs vercel.json .vercelignore .gitignore .env.example README.md VERCEL_DEPLOYMENT.md DEPLOYMENT_CURSOR.md
   ```

   Agar aap sure ho ke working tree mein sirf valid project changes hain:

   ```powershell
   git add .
   ```

5. **Staged diff final check**

   ```powershell
   git diff --staged
   ```

6. **Professional commit message ke saath commit karo**

   Recommended format:

   ```powershell
   git commit -m "Prepare Next.js app for Vercel deployment"
   ```

   Agar changes multiple categories cover karte hain, detailed message:

   ```powershell
   git commit -m "Prepare Next.js app for Vercel deployment" -m "Add Vercel config, Prisma singleton, deployment docs, and missing admin order routes."
   ```

7. **Push to GitHub**

   First push on new branch:

   ```powershell
   git push -u origin main
   ```

   Agar branch ka naam `master` hai:

   ```powershell
   git push -u origin master
   ```

   Existing branch ke liye:

   ```powershell
   git push
   ```

8. **GitHub par verify karo**

   Browser mein repo open karo aur confirm karo:

   - Latest commit visible hai.
   - Secrets accidentally commit nahi hue.
   - `vercel.json`, `.vercelignore`, `DEPLOYMENT_CURSOR.md`, aur `VERCEL_DEPLOYMENT.md` present hain.
   - `.env.local` GitHub par nahi hai.

## 3. Vercel Deployment Process

### Option A: Vercel Dashboard se Deploy

1. [Vercel](https://vercel.com) open karo.
2. **Add New Project** select karo.
3. GitHub repo import karo.
4. **Root Directory** repo root hi rakho. Is project mein root wahi folder hai jahan `package.json` hai.
5. Framework preset automatically **Next.js** detect hona chahiye.
6. Build settings:

   ```text
   Framework Preset: Next.js
   Install Command: npm install
   Build Command: npm run build
   Output Directory: Leave empty / default
   ```

7. Environment Variables add karo:

   ```text
   DATABASE_URL = postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
   NEXT_PUBLIC_CURRENCY_SYMBOL = $
   ```

   Tip: Neon/Supabase use kar rahe ho to pooled Postgres URL prefer karo.

8. **Deploy** click karo.

### Option B: Vercel CLI se Deploy

1. Vercel CLI install karo:

   ```powershell
   npm install -g vercel
   ```

2. Login:

   ```powershell
   vercel login
   ```

3. Project link karo:

   ```powershell
   vercel link
   ```

4. Environment variables add karo:

   ```powershell
   vercel env add DATABASE_URL production
   vercel env add NEXT_PUBLIC_CURRENCY_SYMBOL production
   ```

   Preview deployments ke liye bhi add karna ho:

   ```powershell
   vercel env add DATABASE_URL preview
   vercel env add NEXT_PUBLIC_CURRENCY_SYMBOL preview
   ```

5. Local build Vercel environment ke saath test karo:

   ```powershell
   vercel pull
   vercel build
   ```

6. Production deploy:

   ```powershell
   vercel --prod
   ```

## 4. Live Verification Steps

Deploy complete hone ke baad Vercel URL open karo aur ye checks karo:

1. **Home page**

   ```text
   /
   ```

   Expected: Homepage load ho, hero section show ho, console mein fatal errors na hon.

2. **Product APIs**

   Browser mein open karo:

   ```text
   https://YOUR_DOMAIN.vercel.app/api/products
   https://YOUR_DOMAIN.vercel.app/api/categories
   https://YOUR_DOMAIN.vercel.app/api/hero-slides
   ```

   Expected: JSON response aaye. Agar `500` aaye, mostly `DATABASE_URL` ya database schema issue hai.

3. **Shop page**

   ```text
   /shop
   ```

   Expected: Products/categories load hon. Empty list acceptable hai agar database seeded nahi hai, lekin page crash nahi hona chahiye.

4. **Auth pages**

   ```text
   /login
   /register
   /admin/login
   ```

   Expected: Forms render hon. Register/login database ke saath connect hon.

5. **Admin order flow**

   ```text
   /admin/orders
   /api/admin/orders
   ```

   Expected: Orders list JSON ya empty list return ho. Existing order ho to status update ka API route work kare:

   ```text
   /api/admin/orders/ORDER_ID
   ```

6. **Vercel logs check karo**

   Dashboard:

   ```text
   Vercel Project → Deployments → Latest Deployment → Runtime Logs / Build Logs
   ```

   CLI:

   ```powershell
   vercel logs YOUR_DOMAIN.vercel.app
   ```

## 5. Common Issues and Solutions

1. **Build fails: `PrismaClientInitializationError`**

   Cause: `DATABASE_URL` missing/invalid, DB inaccessible, ya schema not pushed.

   Fix:

   ```powershell
   npx prisma generate
   npx prisma db push
   npm run build
   ```

   Vercel dashboard mein `DATABASE_URL` exactly same set karo.

2. **Vercel build passes but API returns `500`**

   Cause: Runtime env variable missing, database blocked, wrong connection URL, ya schema mismatch.

   Fix:

   - Vercel Environment Variables check karo.
   - `DATABASE_URL` production environment mein added hai ya nahi verify karo.
   - Hosted DB mein SSL required ho to URL mein `sslmode=require` rakho.
   - `npx prisma db push` run karo.

3. **Products/categories empty aa rahe hain**

   Cause: Database seeded nahi hai.

   Fix:

   ```powershell
   node prisma/seed.js
   ```

4. **Git push rejected**

   Cause: Remote branch ahead hai.

   Fix:

   ```powershell
   git pull --rebase origin main
   npm run build
   git push
   ```

   Agar branch `master` hai:

   ```powershell
   git pull --rebase origin master
   npm run build
   git push
   ```

5. **Accidentally secret staged ho gaya**

   Fix before commit:

   ```powershell
   git restore --staged .env .env.local
   git status --short
   ```

   Agar secret already pushed ho chuka hai, key/DB password rotate karo. Sirf git history se delete karna enough nahi hota.

6. **`.next` files GitHub par show ho rahe hain**

   Cause: Build artifacts tracked/staged ho gaye.

   Fix:

   ```powershell
   git restore --staged .next
   ```

   Agar already tracked hain:

   ```powershell
   git rm -r --cached .next
   git commit -m "Remove Next.js build artifacts from repository"
   git push
   ```

7. **Vercel root directory wrong select ho gaya**

   Symptom: Vercel bolta hai `package.json` not found ya wrong app deploy ho rahi hai.

   Fix:

   ```text
   Vercel Project → Settings → General → Root Directory
   ```

   Root directory repo root rakho, not `merry-berry/frontend` and not `gravity-ecommerce`.

8. **Node version mismatch**

   Symptom: Build locally pass, Vercel par fail.

   Fix: `package.json` already has:

   ```json
   "engines": {
     "node": ">=20.9.0"
   }
   ```

   Vercel automatically compatible Node use karega. Local machine par bhi Node 20+ use karo.

9. **Admin login works locally but not live**

   Cause: Production DB mein admin user seeded nahi hai.

   Fix:

   ```powershell
   node prisma/seed.js
   ```

   Ya Prisma Studio/local script se production DB mein admin user create karo.

10. **Images not loading**

    Cause: External image host `next.config.mjs` ke `images.remotePatterns` mein missing ho sakta hai.

    Fix: Agar new image domain use kar rahe ho to `next.config.mjs` mein add karo, phir:

    ```powershell
    npm run build
    git add next.config.mjs
    git commit -m "Allow external image host for product assets"
    git push
    ```

## Final Safe Release Flow

Har production release se pehle ye exact command sequence run karo:

```powershell
npm install
npx prisma generate
npm run build
git status --short
git diff
git add .
git diff --staged
git commit -m "Prepare app for production deployment"
git push
```

Phir Vercel dashboard mein latest deployment complete hone do, live URL open karo, aur `Live Verification Steps` section ke endpoints check karo.

