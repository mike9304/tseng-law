import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listDomains } from '@/lib/builder/domains/storage';
import { getVercelClient } from '@/lib/builder/domains/vercel-api';
import DomainsAdmin from '@/components/builder/domains/DomainsAdmin';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return {
    title: locale === 'ko' ? '사용자 지정 도메인' : locale === 'zh-hant' ? '自訂網域' : 'Custom Domains',
    description: locale === 'ko'
      ? '도메인을 연결하고 DNS 안내, 검증 상태, Vercel alias/SSL 발급 상태를 관리합니다.'
      : locale === 'zh-hant'
        ? '連結網域並管理 DNS 指引、驗證狀態與 Vercel alias / SSL 發佈狀態。'
        : 'Connect domains and manage DNS instructions, verification status, and Vercel alias/SSL provisioning.',
    robots: { index: false, follow: false },
  };
}

export default async function DomainsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const domains = await listDomains();
  const client = getVercelClient();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{locale === 'ko' ? '사용자 지정 도메인' : locale === 'zh-hant' ? '自訂網域' : 'Custom Domains'}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          {locale === 'ko'
            ? '도메인을 연결하면 TXT + CNAME 안내가 표시됩니다. DNS 적용 후 검증 버튼을 누르면 Vercel alias + SSL이 자동 발급됩니다.'
            : locale === 'zh-hant'
              ? '連結網域後會顯示 TXT + CNAME 指引。DNS 生效後按下驗證，即可自動發佈 Vercel alias 與 SSL。'
              : 'Connect a domain to see TXT + CNAME instructions. After DNS updates, verify to auto-provision the Vercel alias and SSL.'}
        </p>
        {!client.ok ? (
          <div style={{ marginTop: 8, padding: 8, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 6, fontSize: 12, color: '#92400e' }}>
            {locale === 'ko'
              ? <>Vercel API가 설정되지 않았습니다. 필요한 env: {client.missing.join(', ')}. 도메인 등록은 가능하지만 검증 단계에서 attach가 실패합니다.</>
              : locale === 'zh-hant'
                ? <>Vercel API 尚未設定。所需環境變數：{client.missing.join(', ')}。可以註冊網域，但在驗證步驟 attach 會失敗。</>
                : <>Vercel API is not configured. Required env: {client.missing.join(', ')}. Domain registration still works, but attach fails during verification.</>}
          </div>
        ) : null}
      </header>
      <DomainsAdmin locale={locale} initialDomains={domains} />
    </main>
  );
}
