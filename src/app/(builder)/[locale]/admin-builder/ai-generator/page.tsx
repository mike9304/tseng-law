import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import AiGeneratorWizard from '@/components/builder/ai-generator/AiGeneratorWizard';
import styles from '@/components/builder/ai-generator/AiGeneratorWizard.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AI Site Generator',
  robots: { index: false, follow: false },
};

export default function AiGeneratorPage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale);
  return (
    <main className={styles.pageShell}>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div>
            <h1>AI Site Generator</h1>
            <p>
              업종, 목표, 페이지, 브랜드 키워드, 제약 조건을 기반으로 사이트맵과
              편집 가능한 초기 페이지 드래프트를 생성합니다.
            </p>
          </div>
          <span className={styles.pageBadge}>F85/F86 first slice</span>
        </div>
      </header>
      <AiGeneratorWizard locale={locale} />
    </main>
  );
}
