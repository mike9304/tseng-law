import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderEventCalendarCanvasNode,
  BuilderEventListCanvasNode,
  BuilderEventRsvpCanvasNode,
  BuilderPortfolioListCanvasNode,
} from '@/lib/builder/canvas/types';
import eventCalendarComponent from '../eventCalendar';
import eventListComponent from '../eventList';
import eventRsvpComponent from '../eventRsvp';
import {
  EVENT_RSVP_LEGACY_DEFAULTS,
  getEventWidgetsCopy,
  localizedEventWidgetText,
} from '../event-widgets-copy';
import portfolioListComponent from '../portfolioList';
import { getPortfolioListCopy } from '../portfolioList/portfolio-list-copy';

describe('event and portfolio widget localization', () => {
  it('returns localized event widget copy in zh-hant', () => {
    const copy = getEventWidgetsCopy('zh-hant');
    expect(copy.loadingList).toBe('活動載入中...');
    expect(copy.loadingCalendar).toBe('行事曆載入中...');
    expect(copy.empty).toBe('目前沒有可顯示的活動。');
    expect(copy.free).toBe('免費');
    expect(copy.rsvp).toBe('報名');
    expect(copy.seats(3, 10)).toBe('3 / 10 個名額');
    expect(copy.calendarTime('12', '15:00')).toBe('12日 15:00');
    expect(copy.rsvpForm.name).toBe('姓名');
    expect(copy.rsvpForm.defaultTitle).toBe('活動報名');
    expect(copy.rsvpForm.defaultSuccessMessage).toBe('報名已送出。請留意確認郵件。');
    expect(copy.rsvpForm.freeTicket).toBe('免費報名');
    expect(copy.rsvpForm.seatsLeft(8)).toBe('剩餘 8 個名額');
    expect(copy.rsvpForm.submit).toBe('送出報名');
    expect(copy.mockEvents.list[0]).toMatchObject({
      title: '台灣公司設立說明會',
      location: '台北辦公室',
      locale: 'zh-hant',
    });
    expect(copy.mockEvents.calendar[0]).toMatchObject({
      title: '簽證實務工作坊',
      location: '台北辦公室',
      locale: 'zh-hant',
    });
    expect(copy.mockEvents.rsvp).toMatchObject({
      title: '台灣法律講座',
      location: '台北辦公室',
      locale: 'zh-hant',
    });
    expect(
      localizedEventWidgetText(
        EVENT_RSVP_LEGACY_DEFAULTS.successMessage,
        copy.rsvpForm.defaultSuccessMessage,
        EVENT_RSVP_LEGACY_DEFAULTS.successMessage,
      ),
    ).toBe('報名已送出。請留意確認郵件。');
    expect(localizedEventWidgetText('Custom success', copy.rsvpForm.defaultSuccessMessage, EVENT_RSVP_LEGACY_DEFAULTS.successMessage)).toBe('Custom success');
  });

  it('renders localized event list and calendar chrome in zh-hant', () => {
    const EventList = eventListComponent.Render as React.ComponentType<{
      node: BuilderEventListCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const EventCalendar = eventCalendarComponent.Render as React.ComponentType<{
      node: BuilderEventCalendarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const eventListNode = {
      kind: 'event-list',
      content: {
        layout: 'cards',
        limit: 2,
        timeFilter: 'upcoming',
        showDescription: true,
        showCapacity: true,
        showRsvp: true,
        columns: 2,
      },
    } as unknown as BuilderEventListCanvasNode;
    const eventCalendarNode = {
      kind: 'event-calendar',
      content: {
        months: 2,
        showPast: false,
        showCapacity: true,
      },
    } as unknown as BuilderEventCalendarCanvasNode;

    const listHtml = renderToStaticMarkup(<EventList node={eventListNode} locale="zh-hant" mode="edit" />);
    expect(listHtml).toContain('台灣公司設立說明會');
    expect(listHtml).toContain('台北辦公室');
    expect(listHtml).toContain('28 / 40 個名額');
    expect(listHtml).toContain('免費');
    expect(listHtml).toContain('報名');
    expect(listHtml).not.toContain('대만 회사설립 세미나');
    expect(listHtml).not.toContain('타이베이 오피스');

    const calendarHtml = renderToStaticMarkup(<EventCalendar node={eventCalendarNode} locale="zh-hant" mode="edit" />);
    expect(calendarHtml).toContain('簽證實務工作坊');
    expect(calendarHtml).toContain('台北辦公室');
    expect(calendarHtml).toContain('12日 15:00');
    expect(calendarHtml).toContain('16 / 25 個名額');
    expect(calendarHtml).not.toContain('비자 실무 워크샵');

    const emptyHtml = renderToStaticMarkup(<EventList node={eventListNode} locale="zh-hant" mode="published" />);
    expect(emptyHtml).toContain('目前沒有可顯示的活動。');
  });

  it('renders localized event RSVP chrome in zh-hant', () => {
    const EventRsvp = eventRsvpComponent.Render as React.ComponentType<{
      node: BuilderEventRsvpCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const node = {
      kind: 'event-rsvp',
      content: {
        title: EVENT_RSVP_LEGACY_DEFAULTS.title,
        eventId: '',
        showTicketInfo: true,
        successMessage: EVENT_RSVP_LEGACY_DEFAULTS.successMessage,
      },
    } as unknown as BuilderEventRsvpCanvasNode;

    const editHtml = renderToStaticMarkup(<EventRsvp node={node} locale="zh-hant" mode="edit" />);
    expect(editHtml).toContain('活動報名');
    expect(editHtml).toContain('台灣法律講座');
    expect(editHtml).toContain('台北辦公室');
    expect(editHtml).toContain('免費報名');
    expect(editHtml).toContain('剩餘 28 個名額');
    expect(editHtml).toContain('姓名');
    expect(editHtml).toContain('電子郵件');
    expect(editHtml).toContain('電話');
    expect(editHtml).toContain('報名人數');
    expect(editHtml).toContain('送出報名');
    expect(editHtml).not.toContain('이벤트 신청');
    expect(editHtml).not.toContain('대만 법률 세미나');

    const emptyHtml = renderToStaticMarkup(<EventRsvp node={node} locale="zh-hant" mode="published" />);
    expect(emptyHtml).toContain('目前沒有可報名的活動。');
  });

  it('returns and renders localized portfolio list chrome in zh-hant', () => {
    const copy = getPortfolioListCopy('zh-hant');
    expect(copy.loading).toBe('作品集載入中...');
    expect(copy.loadError).toBe('無法載入作品集。');
    expect(copy.categoryFilterLabel).toBe('作品集分類篩選');
    expect(copy.allCategories).toBe('全部');
    expect(copy.empty).toBe('目前沒有可顯示的作品集。');
    expect(copy.mockProjects[0]).toMatchObject({
      title: '韓國企業台灣公司設立支援',
      summary: '投資架構、公司登記與稅務登錄一次整理的公司設立案例。',
      locale: 'zh-hant',
    });

    const PortfolioList = portfolioListComponent.Render as React.ComponentType<{
      node: BuilderPortfolioListCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const node = {
      kind: 'portfolio-list',
      content: {
        layout: 'cards',
        limit: 2,
        category: '',
        featuredOnly: false,
        showSummary: true,
        showDate: true,
        showCategoryFilter: true,
        columns: 2,
        sortBy: 'order-asc',
      },
    } as unknown as BuilderPortfolioListCanvasNode;

    const editHtml = renderToStaticMarkup(<PortfolioList node={node} locale="zh-hant" mode="edit" />);
    expect(editHtml).toContain('aria-label="作品集分類篩選"');
    expect(editHtml).toContain('全部');
    expect(editHtml).toContain('韓國企業台灣公司設立支援');
    expect(editHtml).toContain('投資架構、公司登記與稅務登錄一次整理的公司設立案例。');
    expect(editHtml).toContain('台灣勞資爭議顧問');
    expect(editHtml).toContain('src="/images/001-taiwan-company-establishment-basics/featured-01.jpg"');
    expect(editHtml).toContain('loading="lazy"');
    expect(editHtml).toContain('decoding="async"');
    expect(editHtml).not.toContain('한국 기업 대만 법인 설립 지원');
    expect(editHtml).not.toContain('대만 노동 분쟁 자문');

    const emptyHtml = renderToStaticMarkup(<PortfolioList node={node} locale="zh-hant" mode="published" />);
    expect(emptyHtml).toContain('目前沒有可顯示的作品集。');
  });
});
