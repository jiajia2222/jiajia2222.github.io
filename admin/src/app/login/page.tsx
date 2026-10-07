'use client';

import { FormEvent, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@nadev.xyz');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const body = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) { setError(body.detail || '登录失败，请检查账号和密码'); return; }
    router.push('/'); router.refresh();
  }
  return <main className="login-page"><section className="login-card"><div className="brand"><div className="brand-mark">M</div><div className="brand-copy"><strong>Mou Control Room</strong><span>内容运营后台</span></div></div><div className="eyebrow">Private workspace</div><h1>欢迎回来</h1><p className="subtitle">管理文章、评论、媒体与发布流程，把 Hexo 的写作体验升级成完整内容工作台。</p><form className="login-form" onSubmit={submit}>{error && <div className="form-error">{error}</div>}<div className="field"><label htmlFor="email">管理员邮箱</label><input className="input" id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></div><div className="field"><label htmlFor="password">密码</label><input className="input" id="password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" /></div><button className="button primary" disabled={loading}><LockKeyhole size={16} />{loading ? '正在验证…' : '进入控制台'}</button></form><p className="login-note">首次本地演示账号由 seed 创建，部署前请立即修改密码。</p></section></main>;
}
