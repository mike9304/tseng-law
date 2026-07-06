// Browser file-download helper (Blob + transient anchor click) shared by the
// commerce export buttons. Mirrors the original local copy in
// PaymentAnalyticsExportClient. Client-only (uses `document`/`URL`).
export function downloadText(filename: string, text: string, mimeType = 'text/csv'): void {
  const link = document.createElement('a');
  const url = URL.createObjectURL(new Blob([text], { type: `${mimeType};charset=utf-8` }));
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
