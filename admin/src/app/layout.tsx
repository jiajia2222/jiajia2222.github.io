import './globals.css';

export const metadata = {
  title: 'Mou Control Room',
  description: 'Mou Blog 内容管理后台',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
