import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  const comments = await db.comment.findMany({ include: { post: { select: { title: true } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: comments });
}
