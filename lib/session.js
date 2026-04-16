import { SignJWT, jwtVerify } from 'jose';

export function getJwtSecretKey() {
  const s = process.env.JWT_SECRET;
  if (s) return new TextEncoder().encode(s);
  if (process.env.NODE_ENV === 'development') {
    return new TextEncoder().encode('dev-only-gocart-jwt-secret-change-me');
  }
  throw new Error('JWT_SECRET is required in production');
}

export const SESSION_COOKIE = 'gocart_session';

export async function createSessionToken(user) {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getJwtSecretKey());
}

export async function verifySessionToken(token) {
  const { payload } = await jwtVerify(token, getJwtSecretKey());
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}
