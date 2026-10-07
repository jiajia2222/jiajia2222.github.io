import { MessageSquare, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/db';
import CommentQueue from '@/components/CommentQueue';

export const dynamic = 'force-dynamic';

export default async function CommentsPage() {
  const comments = await db.comment.findMany({ include: { post: { select: { title: true } } }, orderBy: { createdAt: 'desc' } });
  return <div className="content"><div className="page-heading"><div><div className="eyebrow">Community moderation</div><h1>评论审核</h1><p className="subtitle">把有价值的讨论留下，把噪音挡在文章之外。</p></div><div className="status approved"><ShieldCheck size={13} /> 自动防护已开启</div></div><div className="metric-grid" style={{ marginBottom: 14 }}><Metric icon={<MessageSquare size={17} />} label="评论总数" value={comments.length.toString()} /><Metric icon={<ShieldCheck size={17} />} label="已通过" value={comments.filter((comment) => comment.status === 'approved').length.toString()} /><Metric icon={<MessageSquare size={17} />} label="待处理" value={comments.filter((comment) => comment.status === 'pending').length.toString()} /><Metric icon={<ShieldCheck size={17} />} label="垃圾评论" value={comments.filter((comment) => comment.status === 'spam').length.toString()} /></div><CommentQueue comments={comments.map((comment) => ({ ...comment, createdAt: comment.createdAt.toISOString() }))} /></div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className="metric-value">{value}</div></div>; }
