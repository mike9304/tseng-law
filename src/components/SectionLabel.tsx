import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type SectionLabelProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
};

export default function SectionLabel({
  children,
  className,
  ...props
}: SectionLabelProps) {
  return (
    <div className={className ? `section-label ${className}` : 'section-label'} {...props}>
      {children}
    </div>
  );
}
