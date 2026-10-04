import OfficeMapTabs from '@/components/OfficeMapTabs';
import c from './JaChapters.module.css';

/**
 * C11 事務所所在地 with giant office tabs (CONCEPT-V2 §5 C11): the visible tab shows the city; 「事務所」 stays in the DOM
 * (visually hidden), so each tab's accessible name is the full existing label (L6).
 */
export default function JaOffices() {
  return (
    <div className={c.offices}>
      <OfficeMapTabs locale="ja" id="offices" sectionClassName="section" presentation="editorial" splitTabSuffix />
    </div>
  );
}
