import { getPricingContent } from '@/components/PricingCards';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { JA_KOU_REUSED } from './ja-copy';
import { KOU } from './ja-kou-media';
import { JA_HERO_CTA_LABEL } from './JaHero';
import JaStageMarkers from './JaStageMarkers';
import k from './JaKou.module.css';
import f from './JaFees.module.css';

/**
 * C9 「光の線」: ご依頼までの流れ (CONCEPT-V2 §5 C9, §8.7; amendment: the lit paper behind the stage drifts while the
 * beam draws). A vermilion beam crosses STEP 1–3 and stops at the email action, which is never faded. Pinned from
 * 1024 px; below, a vertical line drawn on view. Reusable unpinned on /ja/pricing (`pinned={false}`; the lead mounts it).
 */
export default function JaFlow({ id = 'ja-flow', pinned = true }: { id?: string; pinned?: boolean }) {
  const pricing = getPricingContent('ja');
  const litigationNote = pricing.items.find((item) => item.icon === 'litigation')?.note ?? '';
  const stepTwoLine = litigationNote.slice(0, litigationNote.indexOf('。') + 1);
  const steps = [
    { title: JA_KOU_REUSED.flowStep1.text, lines: [pricing.ctaNote], note: JA_KOU_REUSED.firstContactNote.text },
    { title: JA_KOU_REUSED.flowStep2.text, lines: stepTwoLine ? [stepTwoLine] : [] },
    { title: JA_KOU_REUSED.flowStep3.text, lines: [] },
  ];
  return (
    <section
      id={id}
      className={`${f.flow} ${pinned ? f.flowPinned : ''}`}
      aria-labelledby={`${id}-title`}
      data-ja-stage={pinned ? 'flow' : undefined}
    >
      <div className={f.flowStage}>
        {pinned ? (
          <picture className={f.flowLight}>
            <source srcSet={`${KOU.sukashi.c960} 960w, ${KOU.sukashi.c} 1920w`} sizes="100vw" type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-encoded webp still, served as is (T-C reused) */}
            <img className={f.flowLightImg} src={KOU.sukashi.c} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
          </picture>
        ) : null}
        <div className={`${k.wrap} ${f.flowInner}`}>
          <h2 id={`${id}-title`} className={`${k.h2} ${f.flowTitle}`}>
            {JA_KOU_REUSED.flowTitle.text}
          </h2>
          <div className={f.track}>
            <span className={f.trackRule} aria-hidden="true">
              <span className={f.beam} />
            </span>
            <ol className={f.stations}>
              {steps.map((step, index) => (
                <li key={step.title} className={`${f.station} ${f[`s${index + 1}`]}`}>
                  <span className={f.marker} aria-hidden="true">
                    <span className={f.lit} />
                  </span>
                  <p className={f.stepLabel}>
                    {JA_KOU_REUSED.stepLabel.text} {index + 1}
                  </p>
                  <h3 className={f.stepTitle}>{step.title}</h3>
                  {step.lines.map((line) => (
                    <p key={line} className={f.stepLine}>
                      {line}
                    </p>
                  ))}
                  {step.note ? <p className={f.stepNote}>{step.note}</p> : null}
                  {index === steps.length - 1 ? (
                    <a
                      className={`${k.pill} ${f.flowCta}`}
                      href={getConsultationPublicMailto('ja')}
                      aria-label={`${JA_HERO_CTA_LABEL} — ${getConsultationCtaLabel('ja')}`}
                    >
                      {JA_HERO_CTA_LABEL}
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      {pinned ? <JaStageMarkers bounds={[0.34, 0.67]} /> : null}
    </section>
  );
}
