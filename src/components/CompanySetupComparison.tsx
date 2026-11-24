import Link from 'next/link';
import { GUIDE_SLUG, guideContent } from '@/app/[locale]/guides/taiwan-company-setup/content';
import guideStyles from '@/app/[locale]/guides/taiwan-company-setup/guide.module.css';
import type { SiteLocale } from '@/lib/locales';

const COPY: Record<SiteLocale, { scrollHint: string; guideLink: string }> = {
  ko: { scrollHint: '표를 좌우로 스크롤하여 모든 항목을 확인하세요.', guideLink: '세금·절차·비용은 설립 가이드에서 보기' },
  'zh-hant': { scrollHint: '左右捲動表格，查看所有欄位。', guideLink: '稅負、流程與費用請見設立指南' },
  en: { scrollHint: 'Scroll horizontally to view all table columns.', guideLink: 'See taxes, steps and costs in the setup guide' },
  ja: { scrollHint: '表を左右にスクロールして、すべての項目をご確認ください。', guideLink: '税金・手続き・費用は設立ガイドで確認する' },
};

// Legal personality, joint ventures and listing. Tax rows stay in the guide because each rate has treaty,
// zero-rating or threshold conditions that a summary table would drop.
const STRUCTURE_ROWS: ReadonlySet<number> = new Set([0, 5, 6]);

/** Puts the guide's entity comparison at the top of the company-setup landing page. */
export default function CompanySetupComparison({ locale }: { locale: SiteLocale }) {
  const guide = guideContent[locale];
  const copy = COPY[locale];
  return (
    <section className="section section--light" aria-labelledby="company-setup-comparison-heading">
      <div className="container">
        <h2 className="section-title" id="company-setup-comparison-heading">{guide.comparisonHeading}</h2>
        <p>{guide.comparisonIntro}</p>
        <p className={guideStyles.tableHint} id="company-setup-comparison-hint">{copy.scrollHint}</p>
        <div
          className={guideStyles.tableWrap}
          role="region"
          tabIndex={0}
          aria-labelledby="company-setup-comparison-heading"
          aria-describedby="company-setup-comparison-hint"
        >
          <table className={guideStyles.table}>
            <thead>
              <tr>
                {guide.comparisonColumns.map((column) => <th key={column} scope="col">{column}</th>)}
              </tr>
            </thead>
            <tbody>
              {guide.comparisonRows.filter((_, index) => STRUCTURE_ROWS.has(index)).map((row) => (
                <tr key={row.form}>
                  <th scope="row">{row.form}</th>
                  {row.values.map((value, index) => <td key={index}>{value}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <Link href={`/${locale}/${GUIDE_SLUG}`} className="link-underline">{copy.guideLink}</Link>
        </p>
      </div>
    </section>
  );
}
