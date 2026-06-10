/** Detect placeholder / invalid DATABASE_URL before Prisma connects. */
export function analyzeDatabaseUrl() {
  const raw = (process.env.DATABASE_URL || '').trim();
  if (!raw) {
    return {
      ok: false,
      reason: 'missing',
      message: 'DATABASE_URL is not set. Add your Neon PostgreSQL URL in Vercel → Settings → Environment Variables.',
    };
  }

  if (!raw.startsWith('postgresql://') && !raw.startsWith('postgres://')) {
    return {
      ok: false,
      reason: 'invalid_scheme',
      message:
        'DATABASE_URL must start with postgresql:// (not SQLite file:). Copy the Neon pooled connection string.',
    };
  }

  const placeholderPatterns = [
    /USER:PASSWORD/i,
    /@HOST[:\/]/i,
    /host\.neon\.tech/i,
    /ep-xxxx/i,
    /YOUR_/i,
    /example\.com/i,
    /localhost(?!.*neon)/i,
  ];

  if (placeholderPatterns.some((p) => p.test(raw))) {
    return {
      ok: false,
      reason: 'placeholder',
      message:
        'DATABASE_URL looks like a template, not a real Neon URL. In neon.tech → your project → Connection details → copy the *Pooled* string (host like ep-xxxx-pooler.region.aws.neon.tech). Paste it in Vercel and redeploy.',
    };
  }

  return { ok: true, reason: 'looks_valid' };
}
