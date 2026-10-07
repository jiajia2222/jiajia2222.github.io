import { db } from '@/lib/db';
import PasswordForm from '@/components/PasswordForm';
import SettingsForm from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await db.setting.findMany();
  const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  return <div className="content">
    <div className="page-heading"><div><div className="eyebrow">System configuration</div><h1>站点设置</h1><p className="subtitle">集中维护站点信息、评论策略和基础安全开关。</p></div><span className="status published">配置已同步</span></div>
    <div className="settings-grid">
      <section className="panel settings-nav">
        <a className="active" href="#basic">基础信息</a>
        <a href="#security">账号安全</a>
        <a href="#integrations">发布集成</a>
        <a href="#notifications">通知偏好</a>
      </section>
      <div className="panel">
        <SettingsForm initial={{ siteName: values.siteName || 'Mou Blog', siteDescription: values.siteDescription || '', announcement: values.announcement || '', commentReview: values.commentReview || 'true' }} />
        <PasswordForm />
        <section className="settings-section" id="integrations"><h3>发布集成</h3><p>配置 GitHub Token 后，可以从文章管理页一键提交 Markdown 并触发 GitHub Pages 构建。</p><div className="status published">GitHub Pages workflow 已连接</div></section>
        <section className="settings-section" id="notifications"><h3>通知偏好</h3><p>当前使用后台操作日志记录文章、评论、媒体和账号安全事件。</p><div className="status published">操作日志已启用</div></section>
      </div>
    </div>
  </div>;
}
