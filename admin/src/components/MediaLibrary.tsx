'use client';

import { ChangeEvent, useState } from 'react';
import { Check, Copy, FileImage, Film, FolderOpen, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatBytes } from '@/lib/format';

type Media = { id: string; name: string; url: string; type: string; size: number; createdAt: string };

export default function MediaLibrary({ items }: { items: Media[] }) {
  const router = useRouter(); const [uploading, setUploading] = useState(false); const [message, setMessage] = useState('');
  async function upload(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; setUploading(true); const form = new FormData(); form.append('file', file); const response = await fetch('/api/media', { method: 'POST', body: form }); const body = await response.json().catch(() => ({})); setUploading(false); if (!response.ok) setMessage(body.detail || '上传失败'); else { setMessage('上传成功'); router.refresh(); } event.target.value = ''; }
  async function copy(url: string) { await navigator.clipboard?.writeText(url); setMessage('链接已复制'); }
  return <><div className="toolbar"><div className="toolbar-left"><div className="search"><input className="input" placeholder="搜索媒体文件" /></div></div><div className="toolbar-right"><label className="button primary"><UploadCloud size={15} />{uploading ? '上传中…' : '上传文件'}<input hidden type="file" accept="image/*,video/*,audio/*" onChange={upload} disabled={uploading} /></label></div></div>{message && <div className="save-bar" style={{ marginBottom: 12 }}><span>{message}</span><Check size={14} color="var(--success)" /></div>}<section className="panel"><div className="panel-head"><div><h2>媒体资源</h2><p>本地模式保存到 admin/public/uploads，生产环境建议接 S3 或 R2。</p></div><FolderOpen size={17} color="var(--muted)" /></div>{items.length ? <div className="media-grid">{items.map((item) => <article className="media-card" key={item.id}><div className="media-preview">{item.type.startsWith('image/') ? <img src={item.url} alt={item.name} /> : item.type.startsWith('video/') ? <Film size={30} /> : <FileImage size={30} />}</div><div className="media-info"><strong title={item.name}>{item.name}</strong><span>{formatBytes(item.size)} · {item.type || 'unknown'}</span></div><button className="button small ghost" onClick={() => copy(item.url)}><Copy size={13} /> 复制链接</button></article>)}</div> : <div className="empty"><UploadCloud size={24} style={{ marginBottom: 9 }} /><div>还没有媒体文件，上传第一张封面图吧。</div></div>}</section></>;
}
