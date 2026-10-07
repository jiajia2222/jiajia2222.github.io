import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { commentStatusSchema } from '@/lib/validation';

export async function PATCH(request: Request, context: { params: { id: string } }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  const payload = commentStatusSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return NextResponse.json({ detail: '状态不正确' }, { status: 422 });
  const comment = await db.comment.update({ where: { id: context.params.id }, data: { status: payload.data.status }, include: { post: true } });
  await db.activity.create({ data: { action: '审核评论', detail: `将 ${comment.name} 的评论标记为 ${payload.data.status}`, actorName: user.name } });
  return NextResponse.json({ data: comment });
}
