'use client';

import { useEffect, useRef, useState } from 'react';
import { Bold, Code2, Eye, Github, Heading2, ImagePlus, Italic, Link2, List, Quote, Save, Settings2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MarkdownPreview from './MarkdownPreview';

type InputPost = { id?: string; title: string; slug: string; excerpt: string; content: string; status: string; category: string; tags: string; featured: boolean; scheduledAt: string };
type EditorMode = 'edit' | 'split' | 'preview';

export default function PostEditor({ initial }: { initial: InputPost }) {
  const router = useRouter();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState(initial);
  const [mode, setMode] = useState<EditorMode>('split');
  const [message, setMessage] = useState('草稿会保存到后台数据库');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void save('draft'); } };
    window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown);
  });
  const update = (key: keyof InputPost, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  function insertMarkdown(before: string, after = '', placeholder = '文字') {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.slice(start, end) || placeholder;
    const next = form.content.slice(0, start) + before + selected + after + form.content.slice(end);
    update('content', next);
    requestAnimationFrame(() => { textarea.focus(); const cursor = start + before.length + selected.length + after.length; textarea.setSelectionRange(cursor, cursor); });
  }

  async function save(status = form.status, publish = false) {
    setSaving(true); setMessage('正在保存…');
    const payload = { ...form, status, scheduledAt: form.scheduledAt || null };
    const response = await fetch(form.id ? `/api/posts/${form.id}` : '/api/posts', { method: form.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setSaving(false); setMessage(body.detail || '保存失败'); return null; }
    const id = form.id || body.data.id;
    if (!form.id) { setForm((current) => ({ ...current, id })); router.replace(`/posts/${id}`); }
    if (publish) {
      setMessage('正在提交到 GitHub…');
      const publishResponse = await fetch(`/api/posts/${id}/publish`, { method: 'POST' });
      const publishBody = await publishResponse.json().catch(() => ({}));
      if (!publishResponse.ok) { setSaving(false); setMessage(publishBody.detail || '发布失败，请检查 GitHub 配置'); return id; }
      setForm((current) => ({ ...current, status: 'published' })); setMessage('已提交 GitHub，Pages workflow 正在构建');
    } else setMessage(status === 'scheduled' ? '已加入定时发布队列' : '保存成功');
    setSaving(false); router.refresh(); return id;
  }

  return <div className="content">
    <div className="page-heading"><div><div className="eyebrow">Editorial workspace</div><h1>{form.id ? '编辑文章' : '新建文章'}</h1><p className="subtitle">用 Markdown 写作，实时预览排版效果，并一键发布到 GitHub Pages。</p></div><div className="top-actions"><button className="button ghost" onClick={() => router.push('/posts')}>取消</button><button className="button primary" disabled={saving} onClick={() => save('draft')}><Save size={15} />{saving ? '保存中…' : '保存草稿'}</button></div></div>
    <div className="save-bar" style={{ marginBottom: 14 }}><span>{message}</span><span>{form.content.length.toLocaleString()} 字符 · Markdown GFM</span></div>
    <div className="editor-layout"><div className="editor-main"><section className="panel"><div className="panel-body editor-form"><div className="field"><label htmlFor="title">标题</label><input id="title" className="input editor-title" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="给这篇文章一个清晰的标题" /></div><div className="field"><label htmlFor="slug">Slug</label><input id="slug" className="input" value={form.slug} onChange={(event) => update('slug', event.target.value)} placeholder="my-new-post" /></div><div className="field"><label htmlFor="excerpt">摘要 / SEO Description</label><textarea id="excerpt" className="textarea" style={{ minHeight: 78 }} value={form.excerpt} onChange={(event) => update('excerpt', event.target.value)} placeholder="用一句话告诉读者这篇文章值得读什么。" /></div><div className="field"><div className="editor-heading"><label htmlFor="content">正文</label><div className="editor-modes"><button type="button" className={`button small ${mode === 'edit' ? 'primary' : 'ghost'}`} onClick={() => setMode('edit')}>编辑</button><button type="button" className={`button small ${mode === 'split' ? 'primary' : 'ghost'}`} onClick={() => setMode('split')}>分栏</button><button type="button" className={`button small ${mode === 'preview' ? 'primary' : 'ghost'}`} onClick={() => setMode('preview')}><Eye size={13} />预览</button></div></div>{mode !== 'preview' && <><div className="markdown-toolbar"><button type="button" title="粗体" onClick={() => insertMarkdown('**', '**')}><Bold size={15} /></button><button type="button" title="斜体" onClick={() => insertMarkdown('*', '*')}><Italic size={15} /></button><button type="button" title="标题" onClick={() => insertMarkdown('## ', '', '小标题')}><Heading2 size={15} /></button><button type="button" title="链接" onClick={() => insertMarkdown('[', '](https://)', '链接文字')}><Link2 size={15} /></button><button type="button" title="代码" onClick={() => insertMarkdown('`', '`', 'code')}><Code2 size={15} /></button><button type="button" title="列表" onClick={() => insertMarkdown('- ', '', '列表项')}><List size={15} /></button><button type="button" title="引用" onClick={() => insertMarkdown('> ', '', '引用内容')}><Quote size={15} /></button></div><textarea ref={editorRef} id="content" className={`textarea markdown-input ${mode === 'split' ? 'split-input' : ''}`} value={form.content} onChange={(event) => update('content', event.target.value)} placeholder={'# 从这里开始\n\n支持标题、粗体、链接、列表、引用、表格和代码块。\n\n```js\nconsole.log("hello")\n```'} /></>}{mode !== 'edit' && <MarkdownPreview markdown={form.content} />}</div></div></section><div className="editor-footer"><span><Sparkles size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />快捷键：Ctrl/⌘ + S 保存，工具栏可快速插入 Markdown。</span><button className="button primary" disabled={saving} onClick={() => save('draft', true)}><Github size={15} />发布到 GitHub</button></div></div>
      <aside className="panel"><div className="panel-head"><div><h2>发布设置</h2><p>控制展示方式和内容归档</p></div><Settings2 size={16} color="var(--muted)" /></div><div className="panel-body"><div className="field"><label htmlFor="status">状态</label><select id="status" className="select" value={form.status} onChange={(event) => update('status', event.target.value)}><option value="draft">草稿</option><option value="published">已发布</option><option value="scheduled">定时发布</option></select></div><div className="field" style={{ marginTop: 14 }}><label htmlFor="category">分类</label><input id="category" className="input" value={form.category} onChange={(event) => update('category', event.target.value)} /></div><div className="field" style={{ marginTop: 14 }}><label htmlFor="tags">标签</label><input id="tags" className="input" value={form.tags} onChange={(event) => update('tags', event.target.value)} placeholder="用逗号分隔" /></div><div className="field" style={{ marginTop: 14 }}><label htmlFor="scheduledAt">定时发布时间</label><input id="scheduledAt" className="input" type="datetime-local" value={form.scheduledAt} onChange={(event) => update('scheduledAt', event.target.value)} /></div><div className="toggle-row"><span>设为精选文章</span><button type="button" className={`toggle ${form.featured ? 'on' : ''}`} onClick={() => update('featured', !form.featured)} aria-label="设为精选"><i /></button></div><div className="toggle-row"><span>允许评论</span><span className="status published">已开启</span></div></div><div className="panel-body" style={{ borderTop: '1px solid var(--line)' }}><button type="button" className="button ghost" style={{ width: '100%' }} onClick={() => setMessage('媒体库插入器将在下一版支持直接选择图片')}><ImagePlus size={15} />从媒体库插入</button></div></aside>
    </div>
  </div>;
}
