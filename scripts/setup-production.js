/**
 * Local one-time setup — paste your Neon DATABASE_URL into .env first.
 * npm run setup:production
 */
const { execSync } = require('child_process');

function run(cmd) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
}

const dbUrl = process.env.DATABASE_URL || '';

if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  console.error(
    '\n❌ .env mein DATABASE_URL set karo (Vercel wala Neon PostgreSQL URL).\n' +
      '   Example: DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"\n'
  );
  process.exit(1);
}

run('npx prisma generate');
run('npx prisma db push');
run('node prisma/seed.js');
console.log('\n✅ Production database ready — 180 products + admin seeded.\n');
