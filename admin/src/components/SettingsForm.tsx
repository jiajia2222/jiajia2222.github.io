'use client';

import { FormEvent, useState } from 'react';
import { Check, Save } from 'lucide-react';

type Values = { siteName: string; siteDescription: string; announcement: string; commentReview: string };

export default function SettingsForm({ initial }: { initial: Values }) {
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (key: keyof Values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage('');
    const response = await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    const body = await response.json().catch(() => ({})); setSaving(false);
    setMessage(response.ok ? '设置已保存' : body.detail || '保存失败');
  }
  return <form onSubmit={submit} className="panel" id="basic">
    <section className="settings-section"><h3>基础信息</h3><p>这些字段会作为 Hexo 站点的内容来源，后续发布同步时可以映射到站点配置。</p><div className="form-grid"><div className="field"><label htmlFor="siteName">站点名称</label><input id="siteName" className="input" value={values.siteName} onChange={(event) => update('siteName', event.target.value)} /></div><div className="field"><label htmlFor="announcement">站点公告</label><input id="announcement" className="input" value={values.announcement} onChange={(event) => update('announcement', event.target.value)} /></div><div className="field span-2"><label htmlFor="siteDescription">站点描述</label><textarea id="siteDescription" className="textarea" style={{ minHeight: 90 }} value={values.siteDescription} onChange={(event) => update('siteDescription', event.target.value)} /></div></div></section>
    <section className="settings-section"><h3>评论与安全</h3><p>控制评论审核和后台会话安全策略。</p><div className="toggle-row"><span>新评论需要审核</span><button type="button" className={`toggle ${values.commentReview === 'true' ? 'on' : ''}`} onClick={() => update('commentReview', values.commentReview === 'true' ? 'false' : 'true')} aria-label="切换评论审核"><i /></button></div><div className="toggle-row"><span>登录失败速率限制</span><span className="status published"><Check size={12} /> 已开启</span></div><div className="toggle-row"><span>HttpOnly 会话 Cookie</span><span className="status published"><Check size={12} /> 已开启</span></div></section>
    <section className="settings-section settings-actions"><span className="subtitle">{message}</span><button className="button primary" disabled={saving}><Save size={15} />{saving ? '保存中…' : '保存设置'}</button></section>
  </form>;
}
