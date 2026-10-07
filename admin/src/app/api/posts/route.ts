import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { postSchema } from '@/lib/validation';

export async function GET(request: Request) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  const url = new URL(request.url); const query = url.searchParams.get('q') || ''; const status = url.searchParams.get('status') || '';
  const posts = await db.post.findMany({ where: { ...(status ? { status } : {}), ...(query ? { OR: [{ title: { contains: query } }, { slug: { contains: query } }] } : {}) }, orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ data: posts });
}

export async function POST(request: Request) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  const payload = postSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ title: 'VALIDATION_ERROR', detail: payload.error.issues[0]?.message || '参数不正确' }, { status: 422 });
  try {
    const post = await db.post.create({ data: { ...payload.data, scheduledAt: payload.data.scheduledAt ? new Date(payload.data.scheduledAt) : null, authorId: user.id, publishedAt: payload.data.status === 'published' ? new Date() : null } });
    await db.activity.create({ data: { action: '新建文章', detail: `创建了《${post.title}》`, actorName: user.name } });
    return NextResponse.json({ data: post }, { status: 201 });
  } catch { return NextResponse.json({ title: 'CONFLICT', detail: 'Slug 已存在，请换一个' }, { status: 409 }); }
}
