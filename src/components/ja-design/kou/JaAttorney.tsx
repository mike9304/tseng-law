import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import { JA_KOU_REUSED } from './ja-copy';
import c from './JaChapters.module.css';

/**
 * C6 「夜の一枚」: the attorney on a night tile matched to her portrait (CONCEPT-V2 §5 C6). The shared component keeps
 * its copy and builder surface keys; the ja display 「N1」, labelled with a fragment of paragraph 3, enters through its
 * optional slot (L4).
 */
export default function JaAttorney() {
  return (
    <div className={c.attorney}>
      <HomeAttorneySplit
        locale="ja"
        presentation="editorial"
        beforeSummary={
          <div className={c.n1}>
            <p className={c.n1Value}>
              <data value="N1">N1</data>
            </p>
            <span className={c.n1Rule} aria-hidden="true" />
            <p className={c.n1Label}>{JA_KOU_REUSED.n1Label.text}</p>
          </div>
        }
      />
    </div>
  );
}
