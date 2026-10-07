import { requireUser } from '@/lib/auth';
import AdminShell from '@/components/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  return <AdminShell user={{ name: user.name, email: user.email, role: user.role }}>{children}</AdminShell>;
}
