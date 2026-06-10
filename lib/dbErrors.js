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

export function databaseErrorResponse(extraMessage) {
  return {
    message:
      extraMessage ||
      'Database is not connected. Set a real Neon pooled DATABASE_URL in Vercel (not the template host.neon.tech) and redeploy.',
    code: 'DATABASE_UNAVAILABLE',
    fixUrl: '/api/setup/status',
  };
}
