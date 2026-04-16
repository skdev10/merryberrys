# Merry Berry - E-Commerce Platform

Welcome to the Merry Berry E-Commerce project. This is a fully functional web application built with Next.js (App Router), React, Tailwind CSS, Prisma, and SQLite (for easy local setup).

## Tech Stack
- Frontend: Next.js 15, React, Tailwind CSS
- Backend: Next.js Server Actions / API Routes + Node.js
- Database: SQLite (via Prisma ORM)

## Setup Instructions

1. **Install Dependencies**
   Run the following command to install all required dependencies (including Prisma):
   ```bash
   npm install @prisma/client
   npm install -D prisma
   npm install
   ```

2. **Database Configuration**
   The project uses SQLite by default. Ensure you have an `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Database Migration**
   Run Prisma db push to create the `dev.db` database and apply the schema:
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

## Database Location
The database is an SQLite file named `dev.db` created in the `prisma` folder (or root, depending on SQLite config) automatically upon running `npx prisma db push`.
