'use client';

import ColumnDetailView, { type ColumnDetailViewProps } from './ColumnDetailView';

/** SSR remains enabled; no streamed React-element children cross this boundary. */
export default function PublicColumnView(props: ColumnDetailViewProps) {
  return <ColumnDetailView {...props} />;
}
