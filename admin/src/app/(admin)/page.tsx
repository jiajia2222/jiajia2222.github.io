import Link from 'next/link';
import { ArrowUpRight, Clock3, Eye, FilePlus2, FileText, MessageSquare, MoreHorizontal, PenLine, Plus, Send, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [posts, comments, activity] = await Promise.all([
    db.post.findMany({ orderBy: { updatedAt: 'desc' }, take: 6 }),
    db.comment.findMany({ include: { post: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    db.activity.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
  ]);
  const published = posts.filter((post) => post.status === 'published').length;
  const views = posts.reduce((total, post) => total + post.views, 0);
  const pending = comments.filter((comment) => comment.status === 'pending').length;
  const chart = [38, 54, 47, 68, 61, 82, 73];
  return <div className="content"><div className="page-heading"><div><div className="eyebrow">Wednesday, October 7</div><h1>早上好，jiamou。</h1><p className="subtitle">这里是 Mou Blog 的内容控制台，今天适合整理一篇新文章。</p></div><Link href="/posts/new" className="button primary"><Plus size={16} />开始写作</Link></div>
    <div className="metric-grid"><Metric icon={<FileText size={17} />} label="文章总数" value={posts.length.toString()} foot="较上月 +3" tone="positive" /><Metric icon={<Eye size={17} />} label="累计阅读" value={views.toLocaleString()} foot="近 7 天 +18.4%" tone="positive" /><Metric icon={<MessageSquare size={17} />} label="待审核评论" value={pending.toString()} foot={pending ? '需要你的注意' : '全部处理完成'} tone={pending ? 'warning' : 'positive'} /><Metric icon={<Send size={17} />} label="已发布文章" value={published.toString()} foot="GitHub Pages 同步正常" tone="positive" /></div>
    <div className="dashboard-grid"><section className="panel"><div className="panel-head"><div><h2>访问趋势</h2><p>过去 7 天的文章阅读量</p></div><button className="button small ghost">最近 7 天 <ArrowUpRight size={14} /></button></div><div className="panel-body"><div className="chart">{chart.map((value, index) => <div className="chart-col" key={index}><div className="bar-track"><div className="bar" style={{ height: `${value}%` }} /></div><span>{['周四','周五','周六','周日','周一','周二','今天'][index]}</span></div>)}</div></div></section><section className="panel"><div className="panel-head"><div><h2>快速操作</h2><p>减少重复点击，直接进入工作流</p></div><MoreHorizontal size={17} color="var(--muted)" /></div><div className="panel-body"><div className="quick-grid"><Link href="/posts/new" className="quick-action"><PenLine size={17} /><span>写一篇文章</span></Link><Link href="/comments" className="quick-action"><MessageSquare size={17} /><span>审核评论</span></Link><Link href="/media" className="quick-action"><FilePlus2 size={17} /><span>上传媒体</span></Link><Link href="/settings" className="quick-action"><Users size={17} /><span>管理设置</span></Link></div></div></section></div>
    <div className="dashboard-grid"><section className="panel"><div className="panel-head"><div><h2>最近文章</h2><p>按最后编辑时间排列</p></div><Link href="/posts" className="button small ghost">查看全部 <ArrowUpRight size={14} /></Link></div><div className="table-wrap"><table><thead><tr><th>文章</th><th>状态</th><th>阅读</th><th>更新时间</th></tr></thead><tbody>{posts.length ? posts.map((post) => <tr key={post.id}><td><Link href={`/posts/${post.id}`} className="table-title">{post.title}</Link><span className="table-sub">{post.category}</span></td><td><span className={`status ${post.status}`}>{statusLabel(post.status)}</span></td><td>{post.views.toLocaleString()}</td><td>{formatDate(post.updatedAt)}</td></tr>) : <tr><td colSpan={4}><div className="empty">还没有文章</div></td></tr>}</tbody></table></div></section><section className="panel"><div className="panel-head"><div><h2>操作动态</h2><p>最近发生的后台事件</p></div><Clock3 size={17} color="var(--muted)" /></div><div className="panel-body"><div className="activity-list">{activity.length ? activity.map((item) => <div className="activity-item" key={item.id}><div className="activity-dot" /><div><strong>{item.action}</strong><p>{item.detail}</p><time>{formatDate(item.createdAt)} · {item.actorName}</time></div></div>) : <div className="empty">暂无操作记录</div>}</div></div></section></div>
    <section className="panel" style={{ marginTop: 14 }}><div className="panel-head"><div><h2>最新评论</h2><p>评论审核队列的最新变化</p></div><Link href="/comments" className="button small ghost">进入审核 <ArrowUpRight size={14} /></Link></div><div className="table-wrap"><table><thead><tr><th>访客</th><th>评论内容</th><th>文章</th><th>状态</th></tr></thead><tbody>{comments.length ? comments.map((comment) => <tr key={comment.id}><td><span className="table-title">{comment.name}</span><span className="table-sub">{comment.email}</span></td><td>{comment.content}</td><td>{comment.post.title}</td><td><span className={`status ${comment.status}`}>{commentStatusLabel(comment.status)}</span></td></tr>) : <tr><td colSpan={4}><div className="empty">暂无评论</div></td></tr>}</tbody></table></div></section>
  </div>;
}

function Metric({ icon, label, value, foot, tone }: { icon: React.ReactNode; label: string; value: string; foot: string; tone: string }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className="metric-value">{value}</div><div className={`metric-foot ${tone}`}>{foot}</div></div>;
}

function statusLabel(value: string) { return ({ published: '已发布', draft: '草稿', scheduled: '定时发布' } as Record<string, string>)[value] || value; }
function commentStatusLabel(value: string) { return ({ approved: '已通过', pending: '待审核', spam: '垃圾评论', trash: '回收站' } as Record<string, string>)[value] || value; }
