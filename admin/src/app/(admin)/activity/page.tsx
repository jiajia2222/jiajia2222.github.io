import { Activity as ActivityIcon, Filter } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
  const items = await db.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return <div className="content"><div className="page-heading"><div><div className="eyebrow">Audit trail</div><h1>操作日志</h1><p className="subtitle">所有内容变更和审核动作都在这里留痕，便于排查与协作。</p></div><button className="button ghost"><Filter size={15} /> 全部事件</button></div><section className="panel"><div className="panel-head"><div><h2>最近活动</h2><p>保留最近 100 条后台操作</p></div><ActivityIcon size={17} color="var(--muted)" /></div><div className="panel-body"><div className="activity-list">{items.length ? items.map((item) => <div className="activity-item" key={item.id}><div className="activity-dot" /><div><strong>{item.action}</strong><p>{item.detail}</p><time>{formatDate(item.createdAt)} · {item.actorName}</time></div></div>) : <div className="empty">暂无活动</div>}</div></div></section></div>;
}
