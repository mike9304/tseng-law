import { getConsultationGuideCopy } from '@/components/ConsultationGuideSection';
import {
  getConsultationCtaLabel,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import { EN_EMAIL_CONSULTATION_CTA } from './en-design-data';
import { EnChevron } from './EnChevron';
import styles from './EnStory.module.css';

/**
 * Focus layers (A3): one Grok still of the street after the rain (A2), pre-blurred on this Mac from far out
 * of focus to sharp. They crossfade in pairs as the steps advance, so the street comes into focus; nothing is
 * blurred in the browser. Desktop: five blurred layers plus the sharp still; phones and portrait tablets:
 * four plus the portrait still. All decorative.
 */
const LANDSCAPE_LAYERS = [
  { src: '/images/editorial/en-focus/d/f0.webp', width: 800, height: 450 },
  { src: '/images/editorial/en-focus/d/f1.webp', width: 800, height: 450 },
  { src: '/images/editorial/en-focus/d/f2.webp', width: 960, height: 540 },
  { src: '/images/editorial/en-focus/d/f3.webp', width: 1280, height: 720 },
  { src: '/images/editorial/en-focus/d/f4.webp', width: 1600, height: 900 },
  { src: '/images/editorial/en-after-rain.webp', width: 1920, height: 1080 },
] as const;

const PORTRAIT_LAYERS = [
  { src: '/images/editorial/en-focus/m/f0.webp', width: 360, height: 640 },
  { src: '/images/editorial/en-focus/m/f1.webp', width: 450, height: 800 },
  { src: '/images/editorial/en-focus/m/f2.webp', width: 540, height: 960 },
  { src: '/images/editorial/en-focus/m/f3.webp', width: 720, height: 1280 },
  { src: '/images/editorial/en-after-rain-portrait.webp', width: 900, height: 1600 },
] as const;

type Card = { title: string; items: readonly string[] };

function DetailList({ card, className }: { card: Card; className?: string }) {
  return (
    <div className={className}>
      <p className={styles.detailTitle}>{card.title}</p>
      <ul className={styles.detailItems}>
        {card.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

/**
 * S4 "Before You Contact Us" (CONCEPT-V2 7, S4): an intro on black, then a pinned stage where the three
 * steps of the consultation flow advance and the street behind them comes into focus. Every sentence is the
 * shared consultation-guide copy; the server HTML lists all three steps and both detail lists
 * (`data-steps="all"`), and a small client hook steps through them only when motion is allowed.
 */
export default function EnHowItWorks() {
  const guide = getConsultationGuideCopy('en');
  const flow = guide.cards.find((card) => card.title === 'Consultation flow');
  const prepare = guide.cards.find((card) => card.title === 'Useful materials to prepare');
  const channels = guide.cards.find((card) => card.title === 'Available channels');
  const details: Array<Card | undefined> = [undefined, prepare, channels];
  return (
    <section className={styles.process} id="process" aria-labelledby="en-process-title" data-en-process>
      <div className={`container ${styles.processIntro}`}>
        <p className={styles.eyebrow}>How it works</p>
        <h2 id="en-process-title" className={styles.processTitle}>{guide.title}</h2>
        <p className={styles.processLede}>{guide.description}</p>
        <a
          href={getConsultationPublicMailto('en')}
          className={styles.pill}
          aria-label={`${EN_EMAIL_CONSULTATION_CTA} — ${getConsultationCtaLabel('en')}`}
        >
          {EN_EMAIL_CONSULTATION_CTA}
          <EnChevron />
        </a>
      </div>
      <div className={styles.focusStage} data-en-focus-stage data-steps="all">
        <div className={styles.focusSticky}>
          <div className={styles.focusFrame} aria-hidden="true">
            <div className={styles.focusLayers} data-focus-set="landscape">
              {LANDSCAPE_LAYERS.map((layer, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={layer.src}
                  src={layer.src}
                  width={layer.width}
                  height={layer.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={styles.focusLayer}
                  data-focus-layer={index === LANDSCAPE_LAYERS.length - 1 ? 'sharp' : index}
                />
              ))}
            </div>
            <div className={styles.focusLayers} data-focus-set="portrait">
              {PORTRAIT_LAYERS.map((layer, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={layer.src}
                  src={layer.src}
                  width={layer.width}
                  height={layer.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={styles.focusLayer}
                  data-focus-layer={index === PORTRAIT_LAYERS.length - 1 ? 'sharp' : index}
                />
              ))}
            </div>
            <div className={styles.focusScrimLeft} />
            <div className={styles.focusScrimBottom} />
          </div>
          {flow ? (
            <div className={`container ${styles.stepBlock}`}>
              <p className={styles.stepLabel}>{flow.title}</p>
              <ol className={styles.steps}>
                {flow.items.map((item, index) => {
                  const detail = details[index];
                  return (
                    <li key={item} className={styles.step} data-step-item={index + 1}>
                      <span className={styles.stepNo} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <p className={styles.stepSentence}>{item}</p>
                      {detail ? <DetailList card={detail} className={styles.stepDetail} /> : null}
                    </li>
                  );
                })}
              </ol>
              <div className={styles.track} aria-hidden="true">
                <div className={styles.trackLine}>
                  <span className={styles.trackLight} />
                </div>
                <ol className={styles.trackTicks}>
                  {flow.items.map((item, index) => (
                    <li key={item} data-tick={index + 1}>{String(index + 1).padStart(2, '0')}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : null}
        </div>
        <span className={styles.stageMarker} data-stage-marker="0" aria-hidden="true" />
        <span className={styles.stageMarker} data-stage-marker="1" aria-hidden="true" />
        <span className={styles.stageMarker} data-stage-marker="2" aria-hidden="true" />
      </div>
      <div className={`container ${styles.processAfter}`}>
        {prepare ? <DetailList card={prepare} className={styles.afterDetail} /> : null}
        {channels ? <DetailList card={channels} className={styles.afterDetail} /> : null}
      </div>
    </section>
  );
}
