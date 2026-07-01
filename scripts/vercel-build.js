/**
 * Vercel production build: generate Prisma client, optionally sync DB, then Next build.
 * Build continues even if DATABASE_URL is missing or DB unreachable — fix env and redeploy for runtime.
 */
const { execSync } = require('child_process');
const { analyzeDatabaseUrl } = require('../lib/validateDatabaseUrl.cjs');

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', env: process.env, ...opts });
}

function runOptional(cmd) {
  try {
    run(cmd);
    return true;
  } catch (error) {
    console.warn(`\n[vercel-build] Optional step failed (build continues): ${cmd}\n`);
    return false;
  }
}

run('npx prisma generate');

const urlCheck = analyzeDatabaseUrl();

if (!urlCheck.ok) {
  console.warn(
    `\n[vercel-build] Skipping db push/seed — ${urlCheck.message}\n` +
      'Fix: Vercel → Settings → Environment Variables → DATABASE_URL\n' +
      'Use Neon *Pooled* connection string, then redeploy.\n'
  );
} else {
  const pushed = runOptional('npx prisma db push --skip-generate');
  if (pushed) {
    runOptional('node prisma/seed.js');
  } else {
    console.warn(
      '[vercel-build] Could not reach database during build. Site will build but login/API need a valid DATABASE_URL.\n'
    );
  }
}

run('npx next build');
