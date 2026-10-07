import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { publishPost } from '@/lib/github';

export async function POST(_request: Request, context: { params: { id: string } }) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  try { const result = await publishPost(context.params.id, user.name); return NextResponse.json({ data: result }); }
  catch (error) { const detail = error instanceof Error ? error.message : '发布失败'; return NextResponse.json({ title: 'PUBLISH_ERROR', detail }, { status: 503 }); }
}
