import Link from 'next/link';
import { getPricingContent, type PricingItem } from '@/components/PricingCards';
import { JA_KOU_NEW, JA_KOU_REUSED } from './ja-copy';
import JaChevron from './JaChevron';
import { JaKeepUnits, JaPhrases } from './JaPhrases';
import k from './JaKou.module.css';
import f from './JaFees.module.css';

/** 「NT$ 3,000」: the currency mark at .36 em, the unit (「/ 1時間」) at .3 em. Never animated, never counted. */
function Price({ item, word }: { item: PricingItem; word?: boolean }) {
  if (word) return <p className={`${f.price} ${f.priceWord}`}>{item.price}</p>;
  const match = item.price.match(/^(NT\$)\s*(.+)$/);
  return (
    <p className={f.price}>
      {match ? (
        <>
          <span className={f.prefix}>{match[1]}</span>
          <span className={f.amount}>{match[2]}</span>
        </>
      ) : (
        <span className={f.amount}>{item.price}</span>
      )}
      {item.unit ? <span className={f.unit}>{item.unit}</span> : null}
    </p>
  );
}

const pick = (details: readonly string[], test: (detail: string) => boolean) => details.find(test);

/**
 * C8 「目安」: the published fees with every condition (CONCEPT-V2 §5 C8). Every amount, detail and note is the
 * existing ja pricing data, in the pricing page's order; the 一般法律相談 tile reads like a spec sheet. Reusable on
 * /ja/pricing (`splitCompanyDetails` adds 含まれるもの / 別途費用 there; the lead mounts it, this lane does not).
 */
export default function JaFees({ id = 'ja-fees', splitCompanyDetails = false }: { id?: string; splitCompanyDetails?: boolean }) {
  const data = getPricingContent('ja');
  const [consultation, litigation, company, retainer] = data.items;
  const timeDifference = JA_KOU_REUSED.officeTimeZone.text;
  const consultDetails = consultation?.details ?? [];
  const method = pick(consultDetails, (d) => d.includes('ビデオ通話'));
  const language = pick(consultDetails, (d) => d.includes('韓国語'));
  const booking = pick(consultDetails, (d) => d.includes('予約'));
  const scope = consultDetails.find((d) => d !== method && d !== language && d !== booking);
  const specRows: Array<{ label: string; value: string | undefined }> = [
    { label: JA_KOU_NEW.specMethod, value: method },
    { label: JA_KOU_NEW.specLanguage, value: language },
    { label: JA_KOU_NEW.specBooking, value: booking },
    { label: JA_KOU_NEW.specTimeDifference, value: timeDifference },
  ];
  const shownRows = specRows.flatMap((row) => (row.value ? [{ label: row.label, value: row.value }] : []));
  const title = JA_KOU_NEW.feesTitle;
  const cut = title.indexOf('。') + 1;

  return (
    <section id={id} className={`${k.wrap} ${f.section}`} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={`${k.h2} ${k.ph} ${f.title}`}>
        <span className={f.titleLine}>{title.slice(0, cut)}</span>
        <span className={f.titleLine}>
          <JaPhrases text={title.slice(cut)} />
        </span>
      </h2>
      <p className={f.tableLabel}>
        {JA_KOU_REUSED.feeTableCaption.text} · {data.currency}
      </p>
      <div className={f.grid}>
        {consultation ? (
          <article className={`${k.tile} ${f.tile} ${f.f1} ${k.fromLeft}`}>
            <div className={f.f1Left}>
              <h3 className={f.itemTitle}>{consultation.title}</h3>
              <Price item={consultation} />
              <span className={`${f.rule} ${k.draw}`} aria-hidden="true" />
            </div>
            <div className={f.f1Right}>
              {scope ? <p className={f.scope}>{scope}</p> : null}
              <dl className={f.spec}>
                {shownRows.map((row) => (
                  <div key={row.label} className={f.specRow}>
                    <dt className={f.specLabel}>{row.label}</dt>
                    <dd className={f.specValue}>
                      <JaKeepUnits text={row.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ) : null}
        {[litigation, company, retainer].map((item, index) =>
          item ? (
            <article key={item.title} className={`${k.tile} ${f.tile} ${f[`f${index + 2}`]} ${index === 1 ? k.fromRight : k.fromLeft}`}>
              <h3 className={f.itemTitle}>{item.title}</h3>
              <Price item={item} word={!item.price.startsWith('NT$')} />
              <span className={`${f.rule} ${k.draw}`} aria-hidden="true" />
              {splitCompanyDetails && item.icon === 'company' ? (
                <CompanyDetails details={item.details} />
              ) : (
                <ul className={f.details}>
                  {item.details.map((detail) => (
                    <li key={detail}>
                      <JaKeepUnits text={detail} />
                    </li>
                  ))}
                </ul>
              )}
              {item.note ? <p className={f.note}>{item.note}</p> : null}
            </article>
          ) : null,
        )}
        <div className={`${f.notes} ${k.fromRight}`}>
          <p>{data.disclaimer}</p>
          {data.currencyNote ? <p>{data.currencyNote}</p> : null}
          <Link className={k.textLink} href="/ja/pricing">
            {JA_KOU_REUSED.pricingNav.text}
            <JaChevron />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** /ja/pricing only: the company-setup details grouped under 含まれるもの and 別途費用, conditions first, all verbatim. */
function CompanyDetails({ details }: { details: readonly string[] }) {
  const included = details.filter((d) => d.endsWith('を含みます'));
  const extra = details.filter((d) => d.endsWith('別途費用'));
  const conditions = details.filter((d) => !included.includes(d) && !extra.includes(d));
  return (
    <div className={f.split}>
      <ul className={f.details}>
        {conditions.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
      <div className={f.subTiles}>
        <div className={f.subTile}>
          <p className={f.subTitle}>{JA_KOU_NEW.included}</p>
          <ul className={f.details}>
            {included.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
        <div className={f.subTile}>
          <p className={f.subTitle}>{JA_KOU_NEW.extraCost}</p>
          <ul className={f.details}>
            {extra.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
