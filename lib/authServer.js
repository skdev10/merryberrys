import { prisma } from '@/lib/prisma';

export function createSessionToken(userId) {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

export function getUserIdFromToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [userId] = decoded.split(':');
    return userId || null;
  } catch {
    return null;
  }
}

export function getBearerToken(request) {
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}

export async function getAuthUser(request) {
  const token = getBearerToken(request);
  const userId = getUserIdFromToken(token);
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
}
