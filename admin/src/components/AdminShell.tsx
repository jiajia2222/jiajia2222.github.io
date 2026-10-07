'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Activity, BarChart3, FileText, Image, LayoutDashboard, LogOut, Menu, MessageSquare, PanelLeft, Settings, UploadCloud, X } from 'lucide-react';

const items = [
  { href: '/', label: '总览', icon: LayoutDashboard },
  { href: '/posts', label: '文章管理', icon: FileText },
  { href: '/comments', label: '评论审核', icon: MessageSquare },
  { href: '/media', label: '媒体库', icon: Image },
  { href: '/analytics', label: '访问分析', icon: BarChart3 },
] as const;

export default function AdminShell({ user, children }: { user: { name: string; email: string; role: string }; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); router.refresh(); };
  const current = items.find((item) => item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));

  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark">M</div><div className="brand-copy"><strong>Mou Control Room</strong><span>内容运营后台</span></div><button className="icon-button mobile-menu" onClick={() => setOpen(false)} aria-label="关闭导航"><X size={16} /></button></div>
      <div><div className="nav-label">Workspace</div><nav className="nav-list">{items.map((item) => { const Icon = item.icon; const active = current?.href === item.href; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`nav-item ${active ? 'active' : ''}`}><Icon size={16} strokeWidth={1.8} /><span>{item.label}</span></Link>; })}</nav></div>
      <div><div className="nav-label">System</div><nav className="nav-list"><Link href="/activity" onClick={() => setOpen(false)} className={`nav-item ${pathname.startsWith('/activity') ? 'active' : ''}`}><Activity size={16} strokeWidth={1.8} /><span>操作日志</span></Link><Link href="/settings" onClick={() => setOpen(false)} className={`nav-item ${pathname.startsWith('/settings') ? 'active' : ''}`}><Settings size={16} strokeWidth={1.8} /><span>站点设置</span></Link></nav></div>
      <div className="sidebar-foot"><a href="https://jiajia2222.github.io" target="_blank" rel="noreferrer" className="site-link"><span>查看线上博客</span><UploadCloud size={15} /></a><div className="site-link"><span>{user.email}</span><button className="icon-button" onClick={logout} aria-label="退出登录"><LogOut size={15} /></button></div></div>
    </aside>
    <main className="main-area"><header className="topbar"><div className="top-actions"><button className="icon-button mobile-menu" onClick={() => setOpen(true)} aria-label="打开导航"><Menu size={17} /></button><div className="breadcrumbs"><strong>{current?.label || (pathname === '/new' ? '新建文章' : '管理后台')}</strong> <span>/ Mou Blog</span></div></div><div className="top-actions"><Link href="/posts/new" className="button primary small"><FileText size={14} /> 新建文章</Link><button className="avatar-button" title={user.name}>{user.name.slice(0, 1).toUpperCase()}</button></div></header>{children}</main>
  </div>;
}
