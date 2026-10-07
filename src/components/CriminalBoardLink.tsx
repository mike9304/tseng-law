import Link from 'next/link';
import { CRIMINAL_BOARD_PATH, criminalBoardCopy, isCriminalBoardLocale } from '@/lib/criminal-litigation-board';

export default function CriminalBoardLink({ locale, contained = true }: { locale: string; contained?: boolean }) {
  if (!isCriminalBoardLocale(locale)) return null;
  return (
    <p className={contained ? 'container' : undefined} style={{ paddingTop: contained ? '1rem' : 0, paddingBottom: '1rem' }}>
      <Link href={`/${locale}${CRIMINAL_BOARD_PATH}`} className="link-underline" data-criminal-board-link>
        {criminalBoardCopy[locale].title}
      </Link>
    </p>
  );
}
