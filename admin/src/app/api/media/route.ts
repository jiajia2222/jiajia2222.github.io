import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  return NextResponse.json({ data: await db.media.findMany({ orderBy: { createdAt: 'desc' } }) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser(); if (!user) return NextResponse.json({ detail: '未登录' }, { status: 401 });
  const data = await request.formData(); const file = data.get('file');
  if (!(file instanceof File)) return NextResponse.json({ detail: '没有找到文件' }, { status: 422 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ detail: '单个文件不能超过 10MB' }, { status: 413 });
  const extension = path.extname(file.name).toLowerCase().replace(/[^a-z0-9.]/g, ''); const safeName = `${randomUUID()}${extension || '.bin'}`; const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true }); await writeFile(path.join(uploadDir, safeName), Buffer.from(await file.arrayBuffer()));
  const media = await db.media.create({ data: { name: file.name, url: `/uploads/${safeName}`, type: file.type, size: file.size } });
  await db.activity.create({ data: { action: '上传媒体', detail: `上传了 ${file.name}`, actorName: user.name } });
  return NextResponse.json({ data: media }, { status: 201 });
}
