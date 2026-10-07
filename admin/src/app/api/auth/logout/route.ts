import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { SESSION_COOKIE } from '@/lib/auth';

export async function POST() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { token } });
  const response = NextResponse.json({ data: true });
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, expires: new Date(0), path: '/' });
  return response;
}
