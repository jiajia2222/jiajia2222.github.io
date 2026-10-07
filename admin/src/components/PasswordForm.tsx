'use client';

import { FormEvent, useState } from 'react';
import { KeyRound, Save } from 'lucide-react';

export default function PasswordForm() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage('');
    const response = await fetch('/api/auth/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    const body = await response.json().catch(() => ({})); setSaving(false);
    if (!response.ok) { setMessage(body.detail || '密码修改失败'); return; }
    setValues({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage('密码已修改成功，其他登录设备已退出');
  }
  return <form onSubmit={submit} className="settings-section" id="security">
    <h3><KeyRound size={16} style={{ verticalAlign: 'middle', marginRight: 7 }} />账号安全</h3>
    <p>修改后台登录密码。新密码至少 8 位，修改后其他设备上的登录会话会被注销。</p>
    <div className="form-grid">
      <div className="field"><label htmlFor="currentPassword">当前密码</label><input id="currentPassword" className="input" type="password" autoComplete="current-password" value={values.currentPassword} onChange={(event) => update('currentPassword', event.target.value)} /></div>
      <div className="field"><label htmlFor="newPassword">新密码</label><input id="newPassword" className="input" type="password" autoComplete="new-password" value={values.newPassword} onChange={(event) => update('newPassword', event.target.value)} /></div>
      <div className="field"><label htmlFor="confirmPassword">确认新密码</label><input id="confirmPassword" className="input" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} /></div>
    </div>
    <div className="settings-actions"><span className="subtitle">{message}</span><button className="button primary" disabled={saving}><Save size={15} />{saving ? '保存中…' : '更新密码'}</button></div>
  </form>;
}
