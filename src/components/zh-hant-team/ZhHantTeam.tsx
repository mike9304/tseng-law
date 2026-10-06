import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import type { AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantTeam.module.css';

/** zh-hant (and since 2026-10-06 ko) team section: the shared AttorneyProfileSection inside the #team wrapper that carries the Apple styling. */
export default function ZhHantTeam({ showIntro = true, locale = 'zh-hant' }: { showIntro?: boolean; locale?: AppleDesignLocale }) {
  return (
    <div id="team" className={styles.team}>
      <AttorneyProfileSection locale={locale} showIntro={showIntro} />
    </div>
  );
}
