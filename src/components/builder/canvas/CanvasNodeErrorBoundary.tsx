'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  nodeKind: string;
  nodeId: string;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Per-node error boundary so a broken widget doesn't blank the entire canvas.
 *
 * When a widget's Render function throws, we show a small inline error chip
 * in place of the widget so the user can still select the node and replace
 * or delete it.
 */
export default class CanvasNodeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown): void {
    console.warn(`[canvas] widget render failed for ${this.props.nodeKind}#${this.props.nodeId}`, error);
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.nodeId !== this.props.nodeId && this.state.hasError) {
      this.setState({ hasError: false, message: '' });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: 12,
            border: '1.5px dashed #f87171',
            background: 'rgba(254, 226, 226, 0.45)',
            color: '#b91c1c',
            fontSize: 12,
            borderRadius: 8,
            textAlign: 'center',
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        >
          <strong>위젯 렌더 오류 ({this.props.nodeKind})</strong>
          <span style={{ fontSize: 10, color: '#7f1d1d', wordBreak: 'break-word' }}>
            {this.state.message || 'unknown error'}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
