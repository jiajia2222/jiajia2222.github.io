import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { getCurrentUser, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ detail: '请先登录' }, { status: 401 });
  const body = await request.json().catch(() => null) as { currentPassword?: unknown; newPassword?: unknown; confirmPassword?: unknown } | null;
  const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';
  const confirmPassword = typeof body?.confirmPassword === 'string' ? body.confirmPassword : '';
  if (!currentPassword || !newPassword || !confirmPassword) return NextResponse.json({ detail: '请完整填写三个密码字段' }, { status: 422 });
  if (newPassword.length < 8) return NextResponse.json({ detail: '新密码至少需要 8 位' }, { status: 422 });
  if (newPassword !== confirmPassword) return NextResponse.json({ detail: '两次输入的新密码不一致' }, { status: 422 });
  if (currentPassword === newPassword) return NextResponse.json({ detail: '新密码不能与当前密码相同' }, { status: 422 });
  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) return NextResponse.json({ detail: '当前密码不正确' }, { status: 422 });
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(newPassword, 12) } });
  const currentToken = cookies().get(SESSION_COOKIE)?.value;
  await db.session.deleteMany({ where: { userId: user.id, ...(currentToken ? { NOT: { token: currentToken } } : {}) } });
  await db.activity.create({ data: { action: '修改密码', detail: '更新了管理员登录密码，并注销了其他会话', actorName: user.name } });
  return NextResponse.json({ data: true });
}
