/** Detect Prisma / Postgres connectivity failures for clearer API responses. */
export function isDatabaseConnectionError(error) {
  const msg = String(error?.message || '');
  return (
    msg.includes("Can't reach database server") ||
    msg.includes('Connection terminated') ||
    msg.includes('connection refused') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('password authentication failed') ||
    msg.includes('Environment variable not found: DATABASE_URL') ||
    error?.code === 'P1001' ||
    error?.code === 'P1000' ||
    error?.code === 'P1017'
  );
}

export function databaseErrorResponse() {
  return {
    message:
      'Database is not connected. On Vercel, set a valid Neon PostgreSQL DATABASE_URL (pooled URL) and redeploy.',
    code: 'DATABASE_UNAVAILABLE',
  };
}
