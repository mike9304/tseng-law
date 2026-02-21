'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '@/lib/locales';

type Review = {
  id: string;
  nickname: string;
  rating: number;
  service: string;
  content: string;
  createdAt: string;
};

const labels: Record<Locale, {
  formTitle: string;
  nickname: string;
  nicknamePh: string;
  rating: string;
  service: string;
  servicePh: string;
  serviceOptions: { value: string; label: string }[];
  content: string;
  contentPh: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  reviewsTitle: string;
  noReviews: string;
  totalReviews: string;
  avgRating: string;
  loading: string;
}> = {
  ko: {
    formTitle: '후기 작성',
    nickname: '닉네임',
    nicknamePh: '이름 또는 닉네임',
    rating: '별점',
    service: '이용 서비스',
    servicePh: '선택해 주세요',
    serviceOptions: [
      { value: '', label: '선택해 주세요' },
      { value: 'consultation', label: '법률상담' },
      { value: 'civil', label: '민사소송' },
      { value: 'criminal', label: '형사소송' },
      { value: 'company', label: '법인설립' },
      { value: 'family', label: '가사소송' },
      { value: 'labor', label: '노동법' },
      { value: 'ip', label: '지적재산' },
      { value: 'retainer', label: '법률고문' },
      { value: 'other', label: '기타' },
    ],
    content: '후기 내용',
    contentPh: '서비스 이용 후기를 자유롭게 작성해 주세요.',
    submit: '후기 등록',
    submitting: '등록 중...',
    success: '후기가 등록되었습니다. 감사합니다!',
    error: '등록에 실패했습니다. 다시 시도해 주세요.',
    reviewsTitle: '고객 후기',
    noReviews: '아직 등록된 후기가 없습니다. 첫 번째 후기를 남겨 주세요!',
    totalReviews: '건의 후기',
    avgRating: '평균 별점',
    loading: '불러오는 중...',
  },
  'zh-hant': {
    formTitle: '撰寫評價',
    nickname: '暱稱',
    nicknamePh: '您的名字或暱稱',
    rating: '評分',
    service: '使用服務',
    servicePh: '請選擇',
    serviceOptions: [
      { value: '', label: '請選擇' },
      { value: 'consultation', label: '法律諮詢' },
      { value: 'civil', label: '民事訴訟' },
      { value: 'criminal', label: '刑事訴訟' },
      { value: 'company', label: '公司設立' },
      { value: 'family', label: '家事訴訟' },
      { value: 'labor', label: '勞動法' },
      { value: 'ip', label: '智慧財產' },
      { value: 'retainer', label: '法律顧問' },
      { value: 'other', label: '其他' },
    ],
    content: '評價內容',
    contentPh: '請自由撰寫您的服務體驗。',
    submit: '提交評價',
    submitting: '提交中...',
    success: '評價已提交，感謝您！',
    error: '提交失敗，請再試一次。',
    reviewsTitle: '客戶評價',
    noReviews: '目前尚無評價，歡迎成為第一位！',
    totalReviews: '則評價',
    avgRating: '平均評分',
    loading: '載入中...',
  },
  en: {
    formTitle: 'Write a Review',
    nickname: 'Nickname',
    nicknamePh: 'Your name or nickname',
    rating: 'Rating',
    service: 'Service Used',
    servicePh: 'Select a service',
    serviceOptions: [
      { value: '', label: 'Select a service' },
      { value: 'consultation', label: 'Legal Consultation' },
      { value: 'civil', label: 'Civil Litigation' },
      { value: 'criminal', label: 'Criminal Litigation' },
      { value: 'company', label: 'Company Setup' },
      { value: 'family', label: 'Family Law' },
      { value: 'labor', label: 'Labor Law' },
      { value: 'ip', label: 'Intellectual Property' },
      { value: 'retainer', label: 'Legal Retainer' },
      { value: 'other', label: 'Other' },
    ],
    content: 'Review',
    contentPh: 'Share your experience with our services.',
    submit: 'Submit Review',
    submitting: 'Submitting...',
    success: 'Thank you for your review!',
    error: 'Submission failed. Please try again.',
    reviewsTitle: 'Client Reviews',
    noReviews: 'No reviews yet. Be the first to share your experience!',
    totalReviews: 'reviews',
    avgRating: 'Average Rating',
    loading: 'Loading...',
  },
};

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}) {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 'sm' ? 'star-sm' : '';

  return (
    <span className={`star-rating ${sizeClass} ${readonly ? 'star-readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${star <= (hover || value) ? 'star-filled' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (locale === 'ko') {
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
  }
  if (locale === 'zh-hant') {
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getServiceLabel(value: string, locale: Locale): string {
  const opt = labels[locale].serviceOptions.find((o) => o.value === value);
  return opt?.label || value;
}

export default function ReviewBoard({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [rating, setRating] = useState(0);
  const [service, setService] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !rating || !content.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), rating, service, content: content.trim() }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: t.success });
        setNickname('');
        setRating(0);
        setService('');
        setContent('');
        await fetchReviews();
      } else {
        setMessage({ type: 'error', text: t.error });
      }
    } catch {
      setMessage({ type: 'error', text: t.error });
    } finally {
      setSubmitting(false);
    }
  };

  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <section className="section review-section">
      <div className="container">
        {/* ── Review Form ── */}
        <div className="review-form-wrap">
          <h2 className="review-form-title">{t.formTitle}</h2>
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-form-row">
              <label className="review-label" htmlFor="rv-nick">{t.nickname}</label>
              <input
                id="rv-nick"
                className="review-input"
                type="text"
                placeholder={t.nicknamePh}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={50}
                required
              />
            </div>

            <div className="review-form-row">
              <label className="review-label">{t.rating}</label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div className="review-form-row">
              <label className="review-label" htmlFor="rv-svc">{t.service}</label>
              <select
                id="rv-svc"
                className="review-input review-select"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {t.serviceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="review-form-row">
              <label className="review-label" htmlFor="rv-content">{t.content}</label>
              <textarea
                id="rv-content"
                className="review-input review-textarea"
                placeholder={t.contentPh}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                rows={5}
                required
              />
            </div>

            <button
              type="submit"
              className="button review-submit"
              disabled={submitting || !nickname.trim() || !rating || !content.trim()}
            >
              {submitting ? t.submitting : t.submit}
            </button>

            {message && (
              <p className={`review-message review-message--${message.type}`}>
                {message.text}
              </p>
            )}
          </form>
        </div>

        {/* ── Summary ── */}
        {reviews.length > 0 && (
          <div className="review-summary">
            <div className="review-summary-stat">
              <span className="review-summary-number">{avg}</span>
              <StarRating value={Math.round(Number(avg))} readonly size="sm" />
              <span className="review-summary-label">{t.avgRating}</span>
            </div>
            <div className="review-summary-stat">
              <span className="review-summary-number">{reviews.length}</span>
              <span className="review-summary-label">{t.totalReviews}</span>
            </div>
          </div>
        )}

        {/* ── Review List ── */}
        <h2 className="review-list-title">{t.reviewsTitle}</h2>

        {loading ? (
          <p className="review-empty">{t.loading}</p>
        ) : reviews.length === 0 ? (
          <p className="review-empty">{t.noReviews}</p>
        ) : (
          <div className="review-list">
            {reviews.map((r) => (
              <div key={r.id} className="card review-card">
                <div className="review-card-header">
                  <span className="review-card-nickname">{r.nickname}</span>
                  <StarRating value={r.rating} readonly size="sm" />
                  {r.service && (
                    <span className="review-card-service">{getServiceLabel(r.service, locale)}</span>
                  )}
                  <span className="review-card-date">{formatDate(r.createdAt, locale)}</span>
                </div>
                <p className="review-card-content">{r.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
