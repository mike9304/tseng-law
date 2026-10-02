'use client';

import ColumnDetailView, { type ColumnDetailViewProps } from './ColumnDetailView';

/** SSR remains enabled; no streamed React-element children cross this boundary. */
export default function TrafficColumnView(props: ColumnDetailViewProps) {
  return <ColumnDetailView {...props} />;
}
