# Merry Berry - Pakistan E-Commerce Platform

Welcome to the Merry Berry E-Commerce project. This is a production-ready Next.js App Router storefront for a Pakistan-based fashion and custom-print business, with cart management, checkout, PKR pricing, Prisma, PostgreSQL, and Vercel-friendly deployment.

## Tech Stack
- Frontend: Next.js App Router, React, Tailwind CSS
- Backend: Next.js Server Actions / API Routes + Node.js
- Database: PostgreSQL (via Prisma ORM; use Neon, Supabase, or any Postgres host)
- Currency: Pakistani Rupees (`Rs.` / PKR display formatting)

## Core Pages

- Home page with featured products
- Shop page with search, category filtering, and price sorting
- Product detail pages with image gallery, variants, quantity, and Add to Cart
- Cart page with quantity updates, item removal, subtotal, shipping, and total
- Checkout page with Pakistan-focused shipping and order summary
- About page focused on Pakistan-based operations
- Contact page with support form and public contact details

## Setup Instructions

1. **Install Dependencies**
   Run the following command to install all required dependencies (including Prisma):
   ```bash
   npm install @prisma/client
   npm install -D prisma
   npm install
   ```

2. **Database Configuration**
   Create a PostgreSQL database (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com)), then copy `.env.example` to `.env` and set:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
   NEXT_PUBLIC_CURRENCY_SYMBOL="Rs."
   NEXT_PUBLIC_CONTACT_EMAIL="merryberrytshirts@gmail.com"
   NEXT_PUBLIC_CONTACT_PHONE="+92 300 0000000"
   NEXT_PUBLIC_INSTAGRAM_URL="https://www.instagram.com/merryberry.pk?igsh=MXZqZWNqcmdwbHFsOQ=="
   NEXT_PUBLIC_FACEBOOK_URL="https://www.facebook.com/share/1abt67TZu4/"
   ```
   On Vercel, add the same variables under Project → Settings → Environment Variables.

3. **Database schema**
   Apply the schema to your database (creates tables):
   ```bash
   npx prisma db push
   ``` 

4. **Seed the Database**
   We have included a seeding script that will populate all required categories with exactly 10 products each (using placeholder premium imagery):
   ```bash
   node prisma/seed.js
   ```

5. **Start the Development Server**
   Start your Next.js application:
   ```bash
   npm run dev
   ```

6. **Access the Website**
   Open your browser and navigate to `http://localhost:3000`. You should now see the Merry Berry premium storefront.

## Features Included
- Outstanding Premium UI/UX inspired by leading luxury e-commerce sites.
- Complete 37 Sub-Categories (Men, Women, Kids, Winter Collection), each with 10 exact products.
- Fully filterable Shop page.
- Complete Frontend (Homepage, Shop, Detail, Categories, Contact, About, Cart, Checkout).
- "Custom Print" feature to design your own garment directly on the web and Add to Cart.
- Reusable cart helpers for add, remove, update quantity, and checkout totals.
- Server-side order creation recalculates totals from database prices before saving.
- PKR formatting across storefront, account, admin, and seller order/product views.

## Database
Data lives in your PostgreSQL instance. After changing `prisma/schema.prisma`, run `npx prisma db push` (or migrations) against the database pointed to by `DATABASE_URL`.
