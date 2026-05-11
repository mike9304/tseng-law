import type { Metadata } from 'next';
import { normalizeLocale } from '@/lib/locales';
import AiGeneratorWizard from '@/components/builder/ai-generator/AiGeneratorWizard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AI Site Generator',
  robots: { index: false, follow: false },
};

export default function AiGeneratorPage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale);
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>AI Site Generator</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          업종 / 회사명 / 톤 / 컬러 입력 → 산업 템플릿 + LLM 생성 콘텐츠로
          홈페이지 드래프트 생성. 캔버스 임포트는 다음 라운드.
        </p>
      </header>
      <AiGeneratorWizard locale={locale} />
    </main>
  );
}
