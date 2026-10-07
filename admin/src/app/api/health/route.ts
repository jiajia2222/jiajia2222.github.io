import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try { await db.$queryRaw`SELECT 1`; return NextResponse.json({ status: 'ok', database: 'ok', service: 'mou-admin' }); }
  catch { return NextResponse.json({ status: 'degraded', database: 'error', service: 'mou-admin' }, { status: 503 }); }
}
