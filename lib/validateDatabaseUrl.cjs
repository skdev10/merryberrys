/** CJS — used by scripts/vercel-build.js */
function analyzeDatabaseUrl() {
  const raw = (process.env.DATABASE_URL || '').trim();
  if (!raw) {
    return {
      ok: false,
      reason: 'missing',
      message: 'DATABASE_URL is not set in Vercel Environment Variables.',
    };
  }

  if (!raw.startsWith('postgresql://') && !raw.startsWith('postgres://')) {
    return {
      ok: false,
      reason: 'invalid_scheme',
      message: 'DATABASE_URL must be a postgresql:// URL (Neon pooled connection).',
    };
  }

  const placeholderPatterns = [
    /USER:PASSWORD/i,
    /@HOST[:\/]/i,
    /host\.neon\.tech/i,
    /ep-xxxx/i,
    /YOUR_/i,
    /example\.com/i,
  ];

  if (placeholderPatterns.some((p) => p.test(raw))) {
    return {
      ok: false,
      reason: 'placeholder',
      message:
        'DATABASE_URL is still a template (host.neon.tech). Replace with real Neon pooled URL from console.neon.tech.',
    };
  }

  return { ok: true, reason: 'looks_valid' };
}

module.exports = { analyzeDatabaseUrl };
