import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import AiGeneratorWizard from '@/components/builder/ai-generator/AiGeneratorWizard';
import styles from '@/components/builder/ai-generator/AiGeneratorWizard.module.css';
import { getAiGeneratorCopy } from '@/components/builder/ai-generator/ai-generator-copy';

export const dynamic = 'force-dynamic';

function firstQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AiGeneratorPage(
  props: {
    params: Promise<{ locale: string }>;
    searchParams?: Promise<{ siteId?: string | string[] }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const siteId = normalizeBuilderSiteId(firstQueryValue(searchParams?.siteId));
  const copy = getAiGeneratorCopy(locale);
  return (
    <main className={styles.pageShell}>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>
          <span className={styles.pageBadge} data-ai-generator-shell-badge>
            {copy.badge}
          </span>
        </div>
      </header>
      <AiGeneratorWizard locale={locale} siteId={siteId} />
    </main>
  );
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getAiGeneratorCopy(locale);
  return {
    title: copy.title,
    robots: { index: false, follow: false },
  };
}
