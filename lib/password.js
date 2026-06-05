import * as bcrypt from 'bcryptjs';

export function hashPassword(plain) {
  return bcrypt.hashSync(String(plain), 10);
}

export function verifyPassword(plain, hash) {
  if (!plain || !hash) return false;
  try {
    return bcrypt.compareSync(String(plain), String(hash));
  } catch (error) {
    console.error('verifyPassword error:', error);
    return false;
  }
}
