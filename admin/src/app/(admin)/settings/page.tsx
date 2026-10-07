import { db } from '@/lib/db';
import SettingsForm from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await db.setting.findMany(); const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  return <div className="content"><div className="page-heading"><div><div className="eyebrow">System configuration</div><h1>站点设置</h1><p className="subtitle">集中维护站点信息、评论策略和基础安全开关。</p></div><span className="status published">配置已同步</span></div><div className="settings-grid"><section className="panel settings-nav"><button className="active">基础信息</button><button>评论与安全</button><button>发布集成</button><button>通知偏好</button></section><SettingsForm initial={{ siteName: values.siteName || 'Mou Blog', siteDescription: values.siteDescription || '', announcement: values.announcement || '', commentReview: values.commentReview || 'true' }} /></div></div>;
}
