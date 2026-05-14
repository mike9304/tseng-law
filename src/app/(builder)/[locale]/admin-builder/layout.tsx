import type { ReactNode } from 'react';
import BuilderAdminBackBar from '@/components/builder/BuilderAdminBackBar';

export default function AdminBuilderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BuilderAdminBackBar />
      {children}
    </>
  );
}
