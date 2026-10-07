import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { db } from '@/lib/db';
import PostList from '@/components/PostList';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const posts = await db.post.findMany({ orderBy: { updatedAt: 'desc' }, select: { id: true, title: true, slug: true, category: true, status: true, views: true, featured: true, updatedAt: true, createdAt: true } });
  return <div className="content"><div className="page-heading"><div><div className="eyebrow">Content library</div><h1>文章管理</h1><p className="subtitle">从草稿到发布，把每一个内容节点都留在可追踪的工作流里。</p></div><Link href="/posts/new" className="button primary"><Plus size={16} /> 新建文章</Link></div><div className="panel" style={{ marginBottom: 15 }}><div className="panel-body" style={{ display: 'flex', gap: 15, alignItems: 'center' }}><Sparkles size={18} color="var(--accent-soft)" /><div><strong>发布助手已就绪</strong><p className="table-sub">配置 GitHub Token 后，可从这里一键提交 Hexo Markdown 并触发 Pages 构建。</p></div></div></div><PostList posts={posts.map((post) => ({ ...post, updatedAt: post.updatedAt.toISOString(), createdAt: post.createdAt.toISOString() }))} /></div>;
}
