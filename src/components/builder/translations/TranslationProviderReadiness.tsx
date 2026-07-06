'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import TranslationProviderSmokeReport from './TranslationProviderSmokeReport';
import type { TranslationCopy } from './translation-copy';
import {
  payloadSchema,
  type ProviderId,
  type ProviderPayload,
  type ProviderReport,
  type ProviderSmoke,
} from './translation-provider-readiness-schemas';
import styles from './TranslationManager.module.css';

interface TranslationProviderReadinessProps {
  readonly copy: TranslationCopy;
  readonly routeLocale: Locale;
  readonly sourceLocale: Locale;
}

function targetForSmoke(sourceLocale: Locale): Locale {
  if (sourceLocale === 'en') return 'ko';
  return 'en';
}

function smokeMessage(copy: TranslationCopy, smoke: ProviderSmoke): string {
  if (smoke.status === 'pass') return copy.managerProviderSmokePassed(smoke.provider, smoke.durationMs);
  if (smoke.status === 'unconfigured') return copy.managerProviderSmokeUnconfigured(smoke.provider);
  return copy.managerProviderSmokeFailed(smoke.provider);
}

async function readProviderPayload(response: Response): Promise<ProviderPayload> {
  const raw: unknown = await response.json();
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) throw new Error('invalid provider readiness payload');
  return parsed.data;
}

export default function TranslationProviderReadiness({
  copy,
  routeLocale,
  sourceLocale,
}: TranslationProviderReadinessProps) {
  const [report, setReport] = useState<ProviderReport | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [runningProvider, setRunningProvider] = useState<ProviderId | null>(null);
  const smokeTargetLocale = useMemo(() => targetForSmoke(sourceLocale), [sourceLocale]);

  const loadReport = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/builder/translations/providers?locale=${routeLocale}`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal,
      });
      const payload = await readProviderPayload(response);
      if (!payload.report) throw new Error('missing provider readiness report');
      setReport(payload.report);
      setMessage(payload.error ?? '');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage(copy.managerProviderReadinessError);
    } finally {
      setIsLoading(false);
    }
  }, [copy.managerProviderReadinessError, routeLocale]);

  useEffect(() => {
    const controller = new AbortController();
    void loadReport(controller.signal);
    return () => controller.abort();
  }, [loadReport]);

  const runSmoke = async (provider: ProviderId) => {
    setRunningProvider(provider);
    setMessage('');
    try {
      const response = await fetch(`/api/builder/translations/providers?locale=${routeLocale}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          provider,
          sourceLocale,
          targetLocale: smokeTargetLocale,
          sourceText: '호정국제 번역 제공자 점검',
        }),
      });
      const payload = await readProviderPayload(response);
      if (payload.report) setReport(payload.report);
      if (payload.smoke) setMessage(smokeMessage(copy, payload.smoke));
      else setMessage(payload.error ?? copy.managerProviderReadinessError);
    } catch {
      setMessage(copy.managerProviderSmokeFailed(provider));
    } finally {
      setRunningProvider(null);
    }
  };

  const providers = report?.providers ?? [];
  const checks = report?.checks ?? [];
  const smokeHistory = report?.smokeHistory ?? [];
  const smokeSummary = report?.smokeSummary ?? null;

  return (
    <section
      className={styles.providerReadinessCard}
      data-translation-provider-readiness="true"
      aria-live="polite"
    >
      <div className={styles.providerReadinessHeader}>
        <div>
          <h3>{copy.managerProviderReadinessTitle}</h3>
          <p>{isLoading && !report ? copy.managerProviderReadinessLoading : copy.managerProviderReadinessDescription}</p>
        </div>
        <button
          className={styles.smallButton}
          type="button"
          disabled={isLoading || runningProvider !== null}
          onClick={() => void loadReport()}
        >
          {copy.managerProviderRefresh}
        </button>
      </div>

      {message ? <p className={styles.providerReadinessMessage}>{message}</p> : null}

      <div className={styles.providerReadinessGrid}>
        {providers.map((provider) => (
          <article className={styles.providerReadinessProvider} key={provider.id}>
            <div className={styles.providerReadinessProviderHeader}>
              <strong>{provider.id}</strong>
              <span data-state={provider.selected ? 'pass' : 'neutral'}>
                {provider.selected ? copy.managerProviderSelected : copy.managerProviderNotSelected}
              </span>
            </div>
            <div className={styles.providerReadinessMeta}>
              <span>{provider.secretName}</span>
              <span data-state={provider.configured ? 'pass' : 'warn'}>
                {provider.configured ? copy.managerProviderConfigured : copy.managerProviderMissingSecret}
              </span>
              {provider.model ? <span>{provider.model}</span> : null}
              {provider.endpoint ? <span>{provider.endpoint}</span> : null}
            </div>
            <button
              className={styles.smallButton}
              type="button"
              disabled={runningProvider !== null}
              onClick={() => void runSmoke(provider.id)}
            >
              {runningProvider === provider.id
                ? copy.managerProviderSmokeTesting(provider.id)
                : copy.managerProviderSmokeTest(provider.id)}
            </button>
          </article>
        ))}
      </div>

      {checks.length > 0 ? (
        <div className={styles.providerReadinessChecks}>
          {checks.map((check) => (
            <span
              className={styles.providerReadinessCheck}
              data-state={check.status}
              key={check.id}
              title={check.detail}
            >
              {check.provider}: {copy.managerProviderCheckStatus(check.status)}
            </span>
          ))}
        </div>
      ) : null}

      <TranslationProviderSmokeReport copy={copy} smokeHistory={smokeHistory} smokeSummary={smokeSummary} />
    </section>
  );
}
