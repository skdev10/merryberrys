/**
 * Vercel production build: generate Prisma client, sync schema, seed if empty, then Next build.
 * Requires DATABASE_URL (postgresql://...) in Vercel Environment Variables.
 */
const { execSync } = require('child_process');

function run(cmd) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
}

const dbUrl = process.env.DATABASE_URL || '';

run('npx prisma generate');

if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
  run('npx prisma db push --skip-generate');
  run('node prisma/seed.js');
} else {
  console.warn(
    '\n[vercel-build] DATABASE_URL missing or not PostgreSQL — skipping db push/seed.\n' +
      'Add DATABASE_URL in Vercel → Settings → Environment Variables, then redeploy.\n'
  );
}

run('npx next build');
