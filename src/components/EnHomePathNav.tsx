'use client';

import LocaleHomePathNav from '@/components/LocaleHomePathNav';

export default function EnHomePathNav({
  tone,
}: {
  tone: 'dark' | 'light';
}) {
  return <LocaleHomePathNav locale="en" tone={tone} />;
}
