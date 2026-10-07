import { Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/db';
import MediaLibrary from '@/components/MediaLibrary';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const items = await db.media.findMany({ orderBy: { createdAt: 'desc' } });
  return <div className="content"><div className="page-heading"><div><div className="eyebrow">Asset library</div><h1>媒体库</h1><p className="subtitle">集中管理封面图、附件与文章内嵌资源，复制链接即可插入 Markdown。</p></div><div className="status published"><ImageIcon size={13} /> 本地存储正常</div></div><div className="metric-grid" style={{ marginBottom: 14 }}><Metric label="文件总数" value={items.length.toString()} /><Metric label="图片" value={items.filter((item) => item.type.startsWith('image/')).length.toString()} /><Metric label="视频" value={items.filter((item) => item.type.startsWith('video/')).length.toString()} /><Metric label="总占用" value={`${(items.reduce((total, item) => total + item.size, 0) / 1024 / 1024).toFixed(1)} MB`} /></div><MediaLibrary items={items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} /></div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="metric-card"><div className="metric-top"><span>{label}</span><ImageIcon size={17} className="metric-icon" /></div><div className="metric-value">{value}</div></div>; }
