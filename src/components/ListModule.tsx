import type { ReactNode } from 'react';

export default function ListModule({
  children,
  className,
  role,
  id,
  labelledBy
}: {
  children: ReactNode;
  className?: string;
  role?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <div className={`list-module${className ? ` ${className}` : ''}`} role={role} id={id} aria-labelledby={labelledBy}>
      {children}
    </div>
  );
}
