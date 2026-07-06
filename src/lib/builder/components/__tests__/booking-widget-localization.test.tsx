import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderBookingWidgetCanvasNode } from '@/lib/builder/canvas/types';
import bookingWidgetComponent from '../bookingWidget';
import {
  BOOKING_WIDGET_LEGACY_DEFAULTS,
  getBookingWidgetCopy,
  localizedBookingWidgetText,
} from '../bookingWidget/booking-widget-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('booking widget localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getBookingWidgetCopy('zh-hant');

    expect(copy.defaults).toMatchObject({
      title: '預約諮詢',
      successMessage: '預約已完成。',
      caseSummaryLabel: '案件概述',
      attachmentLinksLabel: '附件連結',
    });
    expect(copy.inspector).toMatchObject({
      section: '區段',
      title: '標題',
      locale: '預約語言',
      filters: '預約篩選',
      successMessage: '成功訊息',
      showCaseSummary: '顯示案件概述欄位',
      customFields: '自訂欄位',
    });
    expect(copy.inspector.localeOptions.ko).toBe('韓文');
    expect(
      localizedBookingWidgetText('預約諮詢', getBookingWidgetCopy('ko').defaults.title, BOOKING_WIDGET_LEGACY_DEFAULTS.title),
    ).toBe('預約諮詢');
  });

  it('renders localized preview defaults and inspector chrome in zh-hant', () => {
    const Render = bookingWidgetComponent.Render as React.ComponentType<{
      node: BuilderBookingWidgetCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = bookingWidgetComponent.Inspector as React.ComponentType<{
      node: BuilderBookingWidgetCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      id: 'booking-1',
      kind: 'booking-widget',
      content: {
        eyebrow: 'Booking',
        title: 'Book a consultation',
        locale: 'zh-hant',
        serviceId: '',
        staffId: '',
        successMessage: '예약이 완료되었습니다',
        redirectAfterBooking: '',
        showCaseSummary: true,
        caseSummaryLabel: '사건 개요',
        showAttachmentLinks: true,
        attachmentLinksLabel: '첨부 링크',
        customFieldLabels: BOOKING_WIDGET_LEGACY_DEFAULTS.customFieldLabels[0],
      },
    } as unknown as BuilderBookingWidgetCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);
    expect(renderHtml).toContain('預約');
    expect(renderHtml).toContain('預約諮詢');
    expect(renderHtml).toContain('所有啟用服務');
    expect(renderHtml).toContain('任一可指派員工');
    expect(renderHtml).toContain('預約已完成。');
    expect(renderHtml).not.toContain('Book a consultation');
    expect(renderHtml).not.toContain('예약이 완료되었습니다');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('data-builder-booking-widget-inspector="true"');
    expect(inspectorHtml).toContain('區段');
    expect(inspectorHtml).toContain('預約語言');
    expect(inspectorHtml).toContain('繁體中文');
    expect(inspectorHtml).toContain('預約篩選');
    expect(inspectorHtml).toContain('成功訊息');
    expect(inspectorHtml).toContain('預約後重新導向');
    expect(inspectorHtml).toContain('顯示案件概述欄位');
    expect(inspectorHtml).toContain('附件標籤');
    expect(inspectorHtml).toContain('value="預約諮詢"');
    expect(inspectorHtml).toContain('案件概述');
    expect(inspectorHtml).toContain('偏好諮詢語言');
    expect(inspectorHtml).not.toContain('Booking Filters');
    expect(inspectorHtml).not.toContain('Case summary field');
    expect(inspectorHtml).not.toContain('첨부 링크');
  });

  it('keeps the booking widget inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'bookingWidget/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'bookingWidget/BookingWidgetInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './BookingWidgetInspector.module.css';");
    expect(source).toContain('data-builder-booking-widget-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.sectionLabel}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'sectionLabelStyle',
      'selectStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.sectionLabel');
    expect(css).toContain('.textarea');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.control:focus-visible');
  });

  it('falls back to the active builder locale when widget locale is unset', () => {
    const Render = bookingWidgetComponent.Render as React.ComponentType<{
      node: BuilderBookingWidgetCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = bookingWidgetComponent.Inspector as React.ComponentType<{
      node: BuilderBookingWidgetCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      id: 'booking-default-locale',
      kind: 'booking-widget',
      content: {
        eyebrow: '',
        title: BOOKING_WIDGET_LEGACY_DEFAULTS.title[0],
        serviceId: '',
        staffId: '',
        successMessage: BOOKING_WIDGET_LEGACY_DEFAULTS.successMessage[0],
        redirectAfterBooking: '',
        showCaseSummary: true,
        caseSummaryLabel: BOOKING_WIDGET_LEGACY_DEFAULTS.caseSummaryLabel[0],
        showAttachmentLinks: true,
        attachmentLinksLabel: BOOKING_WIDGET_LEGACY_DEFAULTS.attachmentLinksLabel[0],
        customFieldLabels: '',
      },
    } as unknown as BuilderBookingWidgetCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);
    expect(renderHtml).toContain('預約諮詢');
    expect(renderHtml).toContain('預約已完成。');
    expect(renderHtml).not.toContain('Book a consultation');
    expect(renderHtml).not.toContain('예약이 완료되었습니다');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('data-builder-booking-widget-inspector="true"');
    expect(inspectorHtml).toContain('value="zh-hant"');
    expect(inspectorHtml).toContain('繁體中文');
    expect(inspectorHtml).toContain('value="預約諮詢"');
    expect(inspectorHtml).not.toContain('value="Book a consultation"');
  });
});
