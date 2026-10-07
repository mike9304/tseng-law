import Link from 'next/link';
import { CRIMINAL_BOARD_PATH, criminalBoardCopy, isCriminalBoardLocale } from '@/lib/criminal-litigation-board';

export default function CriminalBoardLink({ locale }: { locale: string }) {
  if (!isCriminalBoardLocale(locale)) return null;
  return (
    <p className="container" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <Link href={`/${locale}${CRIMINAL_BOARD_PATH}`} className="link-underline" data-criminal-board-link>
        {criminalBoardCopy[locale].title}
      </Link>
    </p>
  );
}
