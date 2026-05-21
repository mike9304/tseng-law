import type { ReactNode } from 'react';
import BuilderAdminBackBar from '@/components/builder/BuilderAdminBackBar';
import AdminShell from '@/components/builder/AdminShell';

export default function AdminBuilderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BuilderAdminBackBar />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
