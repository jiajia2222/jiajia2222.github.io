import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { postSchema } from '@/lib/validation';

export async function PATCH(request: Request, context: { params: { id: string } }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  const payload = postSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ title: 'VALIDATION_ERROR', detail: payload.error.issues[0]?.message || '参数不正确' }, { status: 422 });
  try {
    const post = await db.post.update({ where: { id: context.params.id }, data: { ...payload.data, scheduledAt: payload.data.scheduledAt ? new Date(payload.data.scheduledAt) : null, publishedAt: payload.data.status === 'published' ? new Date() : null } });
    await db.activity.create({ data: { action: '更新文章', detail: `更新了《${post.title}》`, actorName: user.name } });
    return NextResponse.json({ data: post });
  } catch { return NextResponse.json({ title: 'CONFLICT', detail: '保存失败，可能是 Slug 重复' }, { status: 409 }); }
}

export async function DELETE(_request: Request, context: { params: { id: string } }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  const post = await db.post.findUnique({ where: { id: context.params.id } });
  if (!post) return NextResponse.json({ detail: '文章不存在' }, { status: 404 });
  await db.post.delete({ where: { id: post.id } });
  await db.activity.create({ data: { action: '删除文章', detail: `删除了《${post.title}》`, actorName: user.name } });
  return NextResponse.json({ data: true });
}
