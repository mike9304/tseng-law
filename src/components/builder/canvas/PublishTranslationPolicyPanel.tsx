import type { TranslationReleasePolicy } from '@/lib/builder/publish-gate/translation-release-policy';
import type { TranslationSiteWarningSummary } from '@/lib/builder/publish-gate/translation-site-summary';
import type { Locale } from '@/lib/locales';
import styles from './PublishModal.module.css';

interface PublishTranslationPolicyPanelProps {
  readonly policy: TranslationReleasePolicy | null;
  readonly summary: TranslationSiteWarningSummary | null;
  readonly locale: Locale;
}

function copyForLocale(locale: Locale): {
  readonly title: string;
  readonly blocked: (count: number) => string;
  readonly hint: string;
  readonly action: string;
} {
  if (locale === 'zh-hant') {
    return {
      title: '組織翻譯發佈政策',
      blocked: (count) => `目前政策要求先修正其他頁面的 ${count} 個翻譯警告。`,
      hint: '確認按鈕不會覆寫此政策；請先完成 Translation Manager 的全站翻譯修正。',
      action: '檢視全部翻譯',
    };
  }
  if (locale === 'en') {
    return {
      title: 'Organization translation release policy',
      blocked: (count) =>
        `Current policy requires resolving ${count} translation warning${count === 1 ? '' : 's'} on other pages first.`,
      hint: 'Acknowledgement cannot override this policy; finish the site-wide translation fixes in Translation Manager.',
      action: 'Review all translations',
    };
  }
  return {
    title: '조직 번역 릴리스 정책',
    blocked: (count) => `현재 정책은 다른 페이지 번역 경고 ${count}개를 먼저 해결해야 발행을 허용합니다.`,
    hint: '확인 버튼으로 이 정책을 우회할 수 없습니다. Translation Manager에서 사이트 전체 번역을 먼저 정리하세요.',
    action: '전체 번역 검토',
  };
}

export function PublishTranslationPolicyPanel({
  policy,
  summary,
  locale,
}: PublishTranslationPolicyPanelProps): JSX.Element | null {
  if (
    !policy
    || policy.mode !== 'block-other-page-warnings'
    || !summary
    || summary.otherPageCount <= 0
  ) {
    return null;
  }

  const copy = copyForLocale(locale);
  return (
    <div
      className={styles.publishDiffPanel}
      data-builder-publish-translation-release-policy={policy.mode}
      data-builder-publish-translation-release-policy-state="blocked"
      data-builder-publish-translation-release-policy-other={summary.otherPageCount}
      aria-live="polite"
    >
      <div className={styles.checklistLabel}>
        <span>{copy.title}</span>
        <span className={styles.checklistStatus}>
          {summary.otherPageCount}
        </span>
      </div>
      <div className={styles.checklistDetail}>
        {copy.blocked(summary.otherPageCount)}
      </div>
      <div className={styles.checklistDetail}>
        {copy.hint}
      </div>
      <div className={styles.publishDiffStatRow}>
        <a
          href={summary.reviewHref}
          className={styles.fixButton}
          data-builder-publish-translation-release-policy-action="true"
        >
          {copy.action}
        </a>
      </div>
    </div>
  );
}
