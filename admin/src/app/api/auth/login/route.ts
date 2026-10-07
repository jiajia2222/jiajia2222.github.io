import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { newSessionToken, sessionExpiry, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  const payload = loginSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ title: 'VALIDATION_ERROR', detail: payload.error.issues[0]?.message || '参数不正确' }, { status: 422 });
  const user = await db.user.findUnique({ where: { email: payload.data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(payload.data.password, user.passwordHash))) return NextResponse.json({ title: 'UNAUTHORIZED', detail: '邮箱或密码不正确' }, { status: 401 });
  const token = newSessionToken();
  await db.session.create({ data: { token, userId: user.id, expiresAt: sessionExpiry() } });
  const response = NextResponse.json({ data: { name: user.name, email: user.email, role: user.role } });
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return response;
}
