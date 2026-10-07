import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { randomBytes } from 'node:crypto';
import { db } from './db';

const SESSION_DAYS = 7;
export const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'mou_admin_session';

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { token }, include: { user: true } });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export function newSessionToken() {
  return randomBytes(32).toString('hex');
}

export function sessionExpiry() {
  const date = new Date();
  date.setDate(date.getDate() + SESSION_DAYS);
  return date;
}
