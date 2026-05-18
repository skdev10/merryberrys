# Merry Berry - Vercel Deployment Guide

This document provides step-by-step instructions for deploying the Merry Berry application to Vercel.

## 1. Prerequisites
- A GitHub/GitLab/Bitbucket account with the repository pushed.
- A Vercel account (free tier is sufficient).
- A PostgreSQL database (e.g., Neon, Supabase, or AWS RDS).

## 2. Environment Variables
You need to configure the following environment variables in Vercel. You can find a template for these in `.env.example`.

| Variable | Required | Description | Example Value |
|----------|----------|-------------|---------------|
| `DATABASE_URL` | **Yes** | Connection string to your PostgreSQL database. | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXT_PUBLIC_CURRENCY_SYMBOL` | No | Currency symbol for storefront (Defaults to `$`) | `$` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | No | Brand Instagram URL | `https://www.instagram.com/merryberry.pk?igsh=MXZqZWNqcmdwbHFsOQ==` |
| `NEXT_PUBLIC_FACEBOOK_URL` | No | Brand Facebook URL | `https://www.facebook.com/share/1abt67TZu4/` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Contact Email Address | `merryberrytshirts@gmail.com` |
| `NEXT_PUBLIC_CONTACT_PHONE` | No | Contact Phone Number | `+1 (800) 123-4567` |

*Note: The `NEXT_PUBLIC_` prefix is required for these variables to be accessible on the client-side.*

## 3. Deployment Steps

1. **Import Project**: In Vercel, click "Add New Project" and import your repository.
2. **Framework Preset**: Vercel should automatically detect "Next.js". Leave it as default.
3. **Build Settings**: 
   - Build Command: `npm run build` (or leave default, Vercel detects it). The `postinstall` script in `package.json` will automatically run `prisma generate`.
   - Install Command: `npm install`
4. **Environment Variables**: Add all the required variables from the table above in the "Environment Variables" section.
5. **Deploy**: Click the "Deploy" button.

## 4. Post-Deployment Setup

After the first successful deployment, you need to push the Prisma schema to your database and seed the initial data.

1. **Connect to your database** using a tool like `psql`, pgAdmin, or your database provider's web console to ensure it's accessible.
2. Run the following commands from your local machine (with the `DATABASE_URL` configured locally):

```bash
# Push the schema to the database
npx prisma db push

# Seed the initial products and admin user
node prisma/seed.js
```

3. **Verify**: Visit your deployed Vercel URL and navigate to the `/admin/login` page. Check that your products are displaying correctly.
