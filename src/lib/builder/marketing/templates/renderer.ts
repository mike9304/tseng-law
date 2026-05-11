import type { EmailBlock, EmailTemplate } from './types';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBlock(block: EmailBlock): string {
  switch (block.kind) {
    case 'heading': {
      const level = block.level ?? 2;
      const align = block.align ?? 'left';
      const size = level === 1 ? 28 : level === 2 ? 22 : 18;
      return `<tr><td style="padding:18px 24px 4px;text-align:${align};">
        <h${level} style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:${size}px;line-height:1.3;color:#0f172a;font-weight:700">${esc(block.text)}</h${level}>
      </td></tr>`;
    }
    case 'text': {
      const html = esc(block.text).replace(/\n/g, '<br />');
      return `<tr><td style="padding:8px 24px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1f2937">${html}</td></tr>`;
    }
    case 'button': {
      const bg = block.background ?? '#0f172a';
      const fg = block.textColor ?? '#ffffff';
      return `<tr><td style="padding:16px 24px" align="left">
        <a href="${esc(block.href)}" style="display:inline-block;background:${esc(bg)};color:${esc(fg)};text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;padding:10px 18px;border-radius:6px">${esc(block.label)}</a>
      </td></tr>`;
    }
    case 'image': {
      const widthAttr = block.width ? ` width="${block.width}"` : '';
      const style = block.width ? `width:${block.width}px;max-width:100%;` : 'max-width:100%;';
      return `<tr><td style="padding:8px 24px" align="left">
        <img src="${esc(block.src)}" alt="${esc(block.alt ?? '')}"${widthAttr} style="${style}display:block;border:0" />
      </td></tr>`;
    }
    case 'divider': {
      const color = block.color ?? '#e2e8f0';
      return `<tr><td style="padding:12px 24px"><hr style="border:0;border-top:1px solid ${esc(color)};margin:0" /></td></tr>`;
    }
    case 'spacer': {
      return `<tr><td style="height:${block.height}px;line-height:${block.height}px;font-size:1px">&nbsp;</td></tr>`;
    }
  }
}

/**
 * PR #9 — Render a template to email-safe HTML.
 *
 * Uses table-based layout (the only reliable approach for email clients),
 * 600px centered column on a configurable page background.
 */
export function renderTemplateToHtml(template: EmailTemplate): string {
  const rows = template.blocks.map(renderBlock).join('\n');
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(template.name)}</title>
</head>
<body style="margin:0;padding:0;background:${esc(template.pageBackground)};font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${esc(template.pageBackground)};padding:24px 0">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:${esc(template.contentBackground)};border-radius:10px;overflow:hidden">
        ${rows}
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function renderTemplateToText(template: EmailTemplate): string {
  const lines: string[] = [];
  for (const block of template.blocks) {
    switch (block.kind) {
      case 'heading':
        lines.push(block.text.toUpperCase());
        lines.push('');
        break;
      case 'text':
        lines.push(block.text);
        lines.push('');
        break;
      case 'button':
        lines.push(`${block.label}: ${block.href}`);
        lines.push('');
        break;
      case 'image':
        if (block.alt) lines.push(`[${block.alt}]`);
        break;
      case 'divider':
        lines.push('—'.repeat(20));
        break;
      case 'spacer':
        lines.push('');
        break;
    }
  }
  return lines.join('\n').trim();
}
