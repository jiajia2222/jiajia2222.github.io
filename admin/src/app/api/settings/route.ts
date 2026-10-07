import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() { const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 }); return NextResponse.json({ data: await db.setting.findMany() }); }

export async function PATCH(request: Request) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 }); const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ detail: '参数不正确' }, { status: 422 });
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) if (typeof value === 'string' && ['siteName', 'siteDescription', 'announcement', 'commentReview'].includes(key)) await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  await db.activity.create({ data: { action: '更新设置', detail: '修改了站点基础设置', actorName: user.name } });
  return NextResponse.json({ data: true });
}
