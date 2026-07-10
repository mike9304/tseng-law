import { Suspense, type ReactNode } from 'react';
import BuilderAdminBackBar from '@/components/builder/BuilderAdminBackBar';
import AdminShell from '@/components/builder/AdminShell';

export default function AdminBuilderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BuilderAdminBackBar />
      {/* AdminShell/AdminNavRail call useSearchParams(); wrap in Suspense so the page
          content stays visible while the admin chrome hydrates and avoids a static CSR bailout. */}
      <Suspense fallback={<>{children}</>}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
    </>
  );
}
